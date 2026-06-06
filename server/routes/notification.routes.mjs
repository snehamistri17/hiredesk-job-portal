import express from 'express';
import Notification from '../schemas/Notification.mjs';
import { verifyToken } from '../middleware/auth.mjs';

const router = express.Router();
router.use(verifyToken);

// ── GET /api/notifications — Student: my notifications ───────────
router.get('/', async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifs);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── PUT /api/notifications/mark-all-read ─────────────────────────
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { unread: false });
    res.json({ message: 'All marked as read.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── PUT /api/notifications/:id/read ──────────────────────────────
router.put('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { unread: false });
    res.json({ message: 'Marked as read.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

export default router;
