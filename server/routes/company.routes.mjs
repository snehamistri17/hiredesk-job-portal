import express from 'express';
import bcrypt from 'bcryptjs';
import Company from '../schemas/Company.mjs';
import { verifyToken, adminOnly, companyOnly } from '../middleware/auth.mjs';

const router = express.Router();

// ── POST /api/company/register — Company self-registration ───────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, industry, phone, headquarters } = req.body;

    if (!name || !email || !password || !industry)
      return res.status(400).json({ message: 'Name, email, password and industry are required.' });

    const exists = await Company.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Company already registered.' });

    // Auto-generate 2-letter avatar from company name
    const words = name.trim().split(' ');
    const avatar = words.map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const hashed = await bcrypt.hash(password, 10);
    const company = new Company({ name, email, password: hashed, industry, phone, headquarters, avatar });
    await company.save();

    res.status(201).json({ message: 'Company registered. Waiting for admin approval.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/company/all — Admin: all companies ──────────────────
// IMPORTANT: Static routes must come BEFORE /:id routes
router.get('/all', verifyToken, adminOnly, async (req, res) => {
  try {
    const companies = await Company.find().select('-password');
    res.json(companies);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/company/pending — Admin: pending companies ──────────
router.get('/pending', verifyToken, adminOnly, async (req, res) => {
  try {
    const companies = await Company.find({ status: 'Pending' }).select('-password');
    res.json(companies);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/company/public — Guest: approved companies only ─────
router.get('/public', async (req, res) => {
  try {
    const companies = await Company.find({ status: 'Approved' })
      .select('-password -email -phone -hr')
      .sort({ createdAt: -1 });
    res.json(companies);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/company/profile — Company: own profile ──────────────
router.get('/profile', verifyToken, companyOnly, async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId).select('-password');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/company/profile — Company: update own profile ───────
router.put('/profile', verifyToken, companyOnly, async (req, res) => {
  try {
    const { password, status, _id, __v, ...updateData } = req.body;
    const updated = await Company.findByIdAndUpdate(
      req.user.companyId,
      { $set: updateData },
      { new: true, runValidators: false }
    ).select('-password');
    if (!updated) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Profile updated', company: updated });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/company/:id/approve — Admin: approve company ────────
router.put('/:id/approve', verifyToken, adminOnly, async (req, res) => {
  try {
    await Company.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ message: 'Company approved' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT /api/company/:id/reject — Admin: reject company ──────────
router.put('/:id/reject', verifyToken, adminOnly, async (req, res) => {
  try {
    await Company.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
    res.json({ message: 'Company rejected' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── DELETE /api/company/:id — Admin: delete company ──────────────
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
