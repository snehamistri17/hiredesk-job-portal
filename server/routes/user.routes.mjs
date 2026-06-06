import express from 'express';
import multer from 'multer';
import User from '../schemas/User.mjs';
import Application from '../schemas/Application.mjs';
import Notification from '../schemas/Notification.mjs';
import { verifyToken, adminOnly } from '../middleware/auth.mjs';

const router = express.Router();

// ── Multer setup for PDF resume upload ──────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/resumes/'),
  filename:    (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// All user routes require token
router.use(verifyToken);

// ── GET /api/user/profile ────────────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── PUT /api/user/profile ────────────────────────────────────────
router.put('/profile', async (req, res) => {
  try {
    const allowed = [
      'name', 'phone', 'dob', 'gender', 'address', 'city', 'state', 'pincode',
      'bio', 'linkedin', 'github', 'portfolio'
    ];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    // ── Allow email update with duplicate check ──────────────────
    if (req.body.email !== undefined) {
      const newEmail = req.body.email.toLowerCase().trim();
      const existing = await User.findOne({ email: newEmail, _id: { $ne: req.user.id } });
      if (existing) return res.status(400).json({ message: 'This email is already in use by another account.' });
      updates.email = newEmail;
    }

    const user = await User.findById(req.user.id);
    Object.assign(user, updates);
    user.profileCompletion = calcCompletion(user);
    await user.save();

    res.json({ message: 'Profile updated.', user });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── GET /api/user/academic ───────────────────────────────────────
router.get('/academic', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'college university branch department rollNo admissionYear passoutYear currentSem cgpa backlogs tenth tenthBoard tenthYear twelfth twelfthBoard twelfthYear'
    );
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── PUT /api/user/academic ───────────────────────────────────────
router.put('/academic', async (req, res) => {
  try {
    const allowed = [
      'college', 'university', 'branch', 'department', 'rollNo', 'admissionYear',
      'passoutYear', 'currentSem', 'cgpa', 'backlogs',
      'tenth', 'tenthBoard', 'tenthYear',
      'twelfth', 'twelfthBoard', 'twelfthYear'
    ];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ message: 'Academic details saved.', user });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── GET /api/user/skills ─────────────────────────────────────────
router.get('/skills', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('technicalSkills softSkills');
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── PUT /api/user/skills ─────────────────────────────────────────
router.put('/skills', async (req, res) => {
  try {
    const { technicalSkills, softSkills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { technicalSkills, softSkills },
      { new: true }
    ).select('-password');
    res.json({ message: 'Skills saved.', user });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── POST /api/user/resume — Upload PDF ──────────────────────────
router.post('/resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl: req.file.path, resumeName: req.file.originalname, resumeUploadDate: new Date(), resumeViews: 0 },
      { new: true }
    ).select('-password');

    res.json({ message: 'Resume uploaded.', resumeUrl: req.file.path, resumeName: req.file.originalname, user });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed.' });
  }
});

// ── DELETE /api/user/resume — Remove resume ──────────────────────
router.delete('/resume', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { resumeUrl: null, resumeName: null, resumeUploadDate: null, resumeViews: 0 });
    res.json({ message: 'Resume removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Delete failed.' });
  }
});

// ── GET /api/user/resume/view/:userId — Increments view count ────
router.get('/resume/view/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $inc: { resumeViews: 1 } },
      { new: true }
    ).select('resumeUrl resumeName resumeViews');
    if (!user || !user.resumeUrl)
      return res.status(404).json({ message: 'Resume not found.' });
    res.json({ resumeUrl: user.resumeUrl, resumeName: user.resumeName, views: user.resumeViews });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error.' });
  }
});

// ── GET /api/user/dashboard-stats ───────────────────────────────
router.get('/dashboard-stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const user   = await User.findById(userId).select('-password');
    const apps   = await Application.find({ userId });
    const unread = await Notification.countDocuments({ userId, unread: true });

    res.json({
      profileCompletion:   user.profileCompletion || 0,
      cgpa:                user.cgpa || '—',
      placementStatus:     user.placementStatus,
      totalApplications:   apps.length,
      shortlisted:         apps.filter(a => a.status === 'Shortlisted').length,
      underReview:         apps.filter(a => a.status === 'Applied').length,
      selected:            apps.filter(a => a.status === 'Selected').length,
      unreadNotifications: unread,
    });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── Admin: GET /api/user/all — get all students ──────────────────
router.get('/all', adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Admin: GET /api/user/:id ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Admin: PUT /api/user/:id/status ─────────────────────────────
router.put('/:id/status', adminOnly, async (req, res) => {
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

// ── Admin: PUT /api/user/:id/password ───────────────────────────
import bcrypt from 'bcryptjs';
router.put('/:id/password', adminOnly, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashed });
    res.json({ message: 'Password changed successfully' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Admin: DELETE /api/user/:id ──────────────────────────────────
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Helper: profile completion calculation ───────────────────────
function calcCompletion(user) {
  let score = 20;
  if (user.phone)      score += 5;
  if (user.dob)        score += 5;
  if (user.address)    score += 5;
  if (user.bio)        score += 5;
  if (user.linkedin)   score += 5;
  if (user.github)     score += 5;
  if (user.cgpa)       score += 10;
  if (user.resumeUrl)  score += 15;
  if (user.technicalSkills?.length > 0) score += 10;
  if (user.college)    score += 10;
  if (user.tenth)      score += 5;
  return Math.min(score, 100);
}

export default router;
