import express from 'express';
import Job from '../schemas/Job.mjs';
import { verifyToken, adminOnly, companyOnly } from '../middleware/auth.mjs';

const router = express.Router();

// ── GET /api/jobs — Public: all active jobs (guest + student) ────
// Supports ?search=&type=
router.get('/', async (req, res) => {
  try {
    const { search, type, q, location } = req.query;
    const filter = { status: 'Active' };

    if (type && type !== 'All') filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };

    let jobs = await Job.find(filter).sort({ postedDate: -1 });

    // client-side keyword search
    const keyword = search || q;
    if (keyword) {
      const kw = keyword.toLowerCase();
      jobs = jobs.filter(j =>
        j.jobtitle.toLowerCase().includes(kw) ||
        j.company.toLowerCase().includes(kw) ||
        (j.department || '').toLowerCase().includes(kw)
      );
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/jobs/all — Admin/Company: all jobs including drafts ──
router.get('/all', verifyToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'company') query.companyId = req.user.companyId;
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/jobs/:id — Public: single job ───────────────────────
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json(job);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── POST /api/jobs — Admin or Company: post a new job ────────────
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'company')
      return res.status(403).json({ message: 'Not authorized.' });

    const jobData = { ...req.body };
    if (req.user.role === 'company') {
      jobData.companyId = req.user.companyId;
    }

    const job = new Job(jobData);
    await job.save();
    res.status(201).json({ message: 'Job posted!', job });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/jobs/:id — Admin or Company: update job ─────────────
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'company')
      return res.status(403).json({ message: 'Not authorized.' });

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job updated', job: updated });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── DELETE /api/jobs/:id — Admin or Company: delete job ──────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'company')
      return res.status(403).json({ message: 'Not authorized.' });

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
