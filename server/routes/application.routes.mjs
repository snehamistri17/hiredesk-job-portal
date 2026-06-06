import express from 'express';
import Application from '../schemas/Application.mjs';
import Job from '../schemas/Job.mjs';
import Notification from '../schemas/Notification.mjs';
import User from '../schemas/User.mjs';
import { verifyToken, adminOnly, companyOnly } from '../middleware/auth.mjs';
import multer from 'multer';
const router = express.Router();
router.use(verifyToken);

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/resumes/'),
  filename:    (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});
// ── GET /api/applications — Student: my applications ─────────────
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'user')
      return res.status(403).json({ message: 'Students only.' });

    const apps = await Application.find({ userId: req.user.id }).sort({ appliedDate: -1 });
    res.json(apps);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── GET /api/applications/stats — Student: application counts ────
router.get('/stats', async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id });
    res.json({
      total:       apps.length,
      underReview: apps.filter(a => a.status === 'Applied').length,
      shortlisted: apps.filter(a => ['Shortlisted', 'Interview Scheduled'].includes(a.status)).length,
      selected:    apps.filter(a => a.status === 'Selected').length,
      rejected:    apps.filter(a => a.status === 'Rejected').length,
    });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── GET /api/applications/all — Admin: all applications ──────────
router.get('/all', adminOnly, async (req, res) => {
  try {
    const apps = await Application.find().sort({ appliedDate: -1 });
    res.json(apps);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/applications/company — Company: their job applications
router.get('/company', companyOnly, async (req, res) => {
  try {
    const apps = await Application.find({ companyId: req.user.companyId }).sort({ appliedDate: -1 });

    // Enrich with student's LIVE resumeUrl + resumeName
    const enriched = await Promise.all(apps.map(async (app) => {
      const obj = app.toObject();
      if (obj.userId) {
        const student = await User.findById(obj.userId).select('resumeUrl resumeName');
        if (student) {
          obj.resume     = student.resumeUrl  || obj.resume     || null;
          obj.resumeName = student.resumeName || obj.resumeName || null;
        }
      }
      return obj;
    }));

    res.json(enriched);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/applications/job/:jobId — Company: one job's applicants
router.get('/job/:jobId', companyOnly, async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId });
    res.json(apps);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/applications/:id — Student: single application detail
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, userId: req.user.id });
    if (!app) return res.status(404).json({ message: 'Not found.' });
    res.json(app);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// ── POST /api/applications — Student: apply for a job ────────────
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'user')
      return res.status(403).json({ message: 'Students only.' });

    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: 'jobId is required.' });

    const already = await Application.findOne({ userId: req.user.id, jobId });
    if (already) return res.status(400).json({ message: 'You have already applied for this job.' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    // Get student details to save with application
    const student = await User.findById(req.user.id).select('-password');

    // Increment job applicant count
    job.applicants += 1;
    await job.save();

    const app = new Application({
      userId:       req.user.id,
      studentName:  req.user.name,
      studentEmail: req.user.email,
      phone:        student?.phone,
      cgpa:         student?.cgpa,
      branch:       student?.branch,
      college:      student?.college,
      skills:       student?.technicalSkills?.map(s => s.name) || [],
      resume:       student?.resumeUrl,
      resumeName:   student?.resumeName,
      jobId:        job._id,
      jobTitle:     job.jobtitle,
      company:      job.company,
      companyId:    job.companyId,
      logo:         job.logo,
      color:        job.color,
      pkg:          job.salary,
      status:       'Applied',
      stage:        'Application Submitted',
      timeline: [
        { stage: 'Application Submitted', date: new Date().toLocaleDateString(), status: 'done',    desc: 'Application received successfully.' },
        { stage: 'Under Review',           date: '—',                             status: 'active',  desc: 'Your application is being reviewed.' },
        { stage: 'Technical Interview',    date: '—',                             status: 'pending', desc: 'Pending selection.' },
        { stage: 'HR Interview',           date: '—',                             status: 'pending', desc: 'Pending previous round.' },
        { stage: 'Offer Release',          date: '—',                             status: 'pending', desc: 'Pending completion of all rounds.' },
      ],
    });
    await app.save();

    // Notify the student
    await Notification.create({
      userId:  req.user.id,
      targetRole: 'user',
      icon:    '📨',
      type:    'job',
      title:   `Applied to ${job.company}`,
      desc:    `Your application for ${job.jobtitle} has been submitted.`,
      time:    'Just now',
      bg:      '#dcfce7',
    });

    res.status(201).json({ message: 'Application submitted!', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
});
// ── POST /api/applications/:id/resume — Upload resume for specific job
router.post('/:id/resume', uploadResume.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        resume:          req.file.path,
        resumeName:      req.file.originalname,
        resumeUploadDate: new Date()
      },
      { new: true }
    );

    if (!app) return res.status(404).json({ message: 'Application not found.' });

    res.json({
      message:    'Resume uploaded for this application.',
      resumeUrl:  req.file.path,
      resumeName: req.file.originalname,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed.' });
  }
});

// ── DELETE /api/applications/:id/resume — Remove resume from specific job
router.delete('/:id/resume', async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { resume: null, resumeName: null, resumeUploadDate: null },
      { new: true }
    );

    if (!app) return res.status(404).json({ message: 'Application not found.' });

    res.json({ message: 'Resume removed from this application.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Delete failed.' });
  }
});

// ── PUT /api/applications/:id/status — Company: update status ────
router.put('/:id/status', companyOnly, async (req, res) => {
  try {
    const { status, interviewDate, interviewTime, interviewMode, round, score } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status, interviewDate, interviewTime, interviewMode, round, score },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });

    // Notify the student about status change
    await Notification.create({
      userId:     app.userId,
      targetRole: 'user',
      icon:       status === 'Rejected' ? '❌' : status === 'Selected' ? '🎉' : '📋',
      type:       'shortlist',
      title:      `Application ${status}`,
      desc:       `Your application for ${app.jobTitle} at ${app.company} is now: ${status}`,
      time:       'Just now',
      bg:         status === 'Rejected' ? '#fee2e2' : status === 'Selected' ? '#dcfce7' : '#eef2ff',
    });

    res.json({ message: 'Status updated', app });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
