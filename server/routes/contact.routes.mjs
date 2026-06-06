import express from 'express';
import ContactMessage from '../schemas/ContactMessage.mjs';
import { verifyToken, adminOnly } from '../middleware/auth.mjs';

const router = express.Router();

// ── POST /api/contact — Public (Guest submits form) ──────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });

    await ContactMessage.create({
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      subject:   subject?.trim() || 'No Subject',
      message:   message.trim(),
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Your message has been sent! We will get back to you within 24 hours.' });

  } catch (err) {
    console.error('❌ Contact submit error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ── GET /api/contact — Admin: list all messages ──────────────────
router.get('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await ContactMessage.countDocuments(filter);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, messages, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/contact/stats — Admin ──────────────────────────────
router.get('/stats', verifyToken, adminOnly, async (req, res) => {
  try {
    const total   = await ContactMessage.countDocuments();
    const unread  = await ContactMessage.countDocuments({ status: 'Unread' });
    const read    = await ContactMessage.countDocuments({ status: 'Read' });
    const replied = await ContactMessage.countDocuments({ status: 'Replied' });
    res.json({ success: true, total, unread, read, replied });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/contact/:id/status — Admin: mark read/replied ───────
router.put('/:id/status', verifyToken, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Unread', 'Read', 'Replied'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status.' });

    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/contact/:id — Admin ─────────────────────────────
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;