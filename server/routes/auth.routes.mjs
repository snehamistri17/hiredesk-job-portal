import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../schemas/User.mjs';
import Company from '../schemas/Company.mjs';
import { verifyToken } from '../middleware/auth.mjs';

const router = express.Router();

// ── POST /api/auth/register — Student Registration ───────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, rollNo, branch, department, password } = req.body;

    // Validate all required fields
    if (!name || !email || !phone || !rollNo || !branch || !department || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(400).json({ message: 'This email is already registered. Please login.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name:       name.trim(),
      email:      email.toLowerCase().trim(),
      phone:      phone.trim(),
      rollNo:     rollNo.trim(),
      branch:     branch.trim(),
      department: department.trim(),
      password:   hashedPassword,
      role:       'user'
    });

    await user.save();

    res.status(201).json({ message: 'Account created successfully! Please login.' });

  } catch (err) {
    console.error('❌ Register error:', err.message, err.code);

    // MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(400).json({ message: `This ${field} is already registered.` });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: messages });
    }

    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

// ── POST /api/auth/login — Student / Admin Login ────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Incorrect email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect email or password.' });

    if (!user.isActive)
      return res.status(403).json({ message: 'Your account has been deactivated.' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id:                user._id,
        name:              user.name,
        email:             user.email,
        phone:             user.phone,
        rollNo:            user.rollNo,
        branch:            user.branch,
        department:        user.department,
        role:              user.role,
        cgpa:              user.cgpa,
        placementStatus:   user.placementStatus,
        profileCompletion: user.profileCompletion,
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ── POST /api/auth/company-login — Company Login ────────────────
router.post('/company-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const company = await Company.findOne({ email: email.toLowerCase().trim() });
    if (!company) return res.status(400).json({ message: 'Invalid credentials.' });

    if (company.status !== 'Approved')
      return res.status(403).json({ message: 'Your account is pending admin approval. Please wait.' });

    const match = await bcrypt.compare(password, company.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { companyId: company._id, role: 'company', email: company.email, name: company.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      company: { id: company._id, name: company.name, email: company.email, avatar: company.avatar }
    });

  } catch (err) {
    console.error('❌ Company login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ── POST /api/auth/change-password ──────────────────────────────
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'All fields are required.' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully.' });

  } catch (err) {
    console.error('❌ Change password error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/auth/company-change-password ───────────────────────
router.post('/company-change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'All fields are required.' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });

    const company = await Company.findById(req.user.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found.' });

    const isMatch = await bcrypt.compare(currentPassword, company.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

    company.password = await bcrypt.hash(newPassword, 10);
    await company.save();

    res.json({ message: 'Password changed successfully.' });

  } catch (err) {
    console.error('❌ Company change password error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
