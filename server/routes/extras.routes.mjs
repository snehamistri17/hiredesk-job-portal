import express from 'express';
import { PlacementRule, Faq } from '../schemas/Extras.mjs';
import { verifyToken, adminOnly } from '../middleware/auth.mjs';

const router = express.Router();

// ── GET /api/placement-rules — Public ────────────────────────────
router.get('/placement-rules', async (req, res) => {
  try {
    const rules = await PlacementRule.find().sort({ order: 1 });
    res.json({ success: true, rules });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── POST /api/placement-rules — Admin ────────────────────────────
router.post('/placement-rules', verifyToken, adminOnly, async (req, res) => {
  try {
    const rule = await PlacementRule.create(req.body);
    res.status(201).json({ success: true, rule });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── PUT /api/placement-rules/:id — Admin ─────────────────────────
router.put('/placement-rules/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const rule = await PlacementRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, rule });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── DELETE /api/placement-rules/:id — Admin ───────────────────────
router.delete('/placement-rules/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await PlacementRule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── GET /api/faqs — Public ───────────────────────────────────────
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1 });
    res.json({ success: true, faqs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── POST /api/faqs — Admin ───────────────────────────────────────
router.post('/faqs', verifyToken, adminOnly, async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── PUT /api/faqs/:id — Admin ────────────────────────────────────
router.put('/faqs/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── DELETE /api/faqs/:id — Admin ─────────────────────────────────
router.delete('/faqs/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
