import express from 'express';
import User from '../schemas/User.mjs';
import Company from '../schemas/Company.mjs';
import Job from '../schemas/Job.mjs';
import Application from '../schemas/Application.mjs';
import Result from '../schemas/Result.mjs';
import { verifyToken, adminOnly } from '../middleware/auth.mjs';

const router = express.Router();
router.use(verifyToken, adminOnly);

// ── GET /api/admin/stats — Dashboard numbers ─────────────────────
router.get('/stats', async (req, res) => {
  try {
    const totalStudents     = await User.countDocuments({ role: 'user' });
    const totalCompanies    = await Company.countDocuments({ status: 'Approved' });
    const pendingApprovals  = await Company.countDocuments({ status: 'Pending' });
    const totalJobs         = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();
    const placedStudents    = await User.countDocuments({ placementStatus: 'Placed' });
    const placementRate     = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    res.json({ totalStudents, totalCompanies, pendingApprovals, totalJobs, totalApplications, placedStudents, placementRate });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/admin/students — All students ───────────────────────
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'user' }).select('-password');
    res.json(students);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/admin/students/:id — Update any student field ───────
router.put('/students/:id', async (req, res) => {
  try {
    const { password, role, _id, __v, ...updateData } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    ).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated', student });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── DELETE /api/admin/students/:id — Delete student ──────────────
router.delete('/students/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
