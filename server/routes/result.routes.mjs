import express from 'express';
import Result from '../schemas/Result.mjs';
import { verifyToken, adminOnly } from '../middleware/auth.mjs';

const router = express.Router();

// ── GET /api/results/published — Public: published results ────────
router.get('/published', async (req, res) => {
  try {
    const results = await Result.find({ published: true }).sort({ offerDate: -1 });
    res.json(results);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/results — Admin: all results ────────────────────────
router.get('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── POST /api/results — Admin: add a result ──────────────────────
router.post('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json({ message: 'Result added', result });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/results/:id — Admin: update a result ────────────────
router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ message: 'Result updated', result });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/results/:id/publish — Admin: publish one result ─────
router.put('/:id/publish', verifyToken, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      { published: true, offerDate: today },
      { new: true }
    );
    res.json({ message: 'Result published', result });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/results/publish-all/go — Admin: publish all ─────────
router.put('/publish-all/go', verifyToken, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await Result.updateMany({ published: false }, { published: true, offerDate: today });
    res.json({ message: 'All results published' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── DELETE /api/results/:id — Admin: delete a result ─────────────
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: 'Result deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
