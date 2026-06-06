import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // ── Basic login fields ──────────────────────────────────────
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'company','admin'], // ✅ ONLY TWO ROLES
    required: true
  },
  isActive: { type: Boolean, default: true },

  // ── Required at registration ────────────────────────────────
  phone: { type: String, required: true },
  rollNo: { type: String, required: true },
  branch: { type: String, required: true },
  department: { type: String, required: true },

  // ── Personal profile fields ─────────────────────────────────
  dob: { type: String },
  gender: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  bio: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },

  // ── Academic details ────────────────────────────────────────
  college: { type: String },
  university: { type: String },
  admissionYear: { type: String },
  passoutYear: { type: String },
  currentSem: { type: String },
  cgpa: { type: String },
  backlogs: { type: String, default: '0' },
  tenth: { type: String },
  tenthBoard: { type: String },
  tenthYear: { type: String },
  twelfth: { type: String },
  twelfthBoard: { type: String },
  twelfthYear: { type: String },

  // ── Skills ──────────────────────────────────────────────────
  technicalSkills: [{ name: String, level: String, pct: Number }],
  softSkills: [{ name: String, level: String, pct: Number }],

  // ── Resume ──────────────────────────────────────────────────
  resumeUrl: { type: String },
  resumeName: { type: String },
  resumeUploadDate: { type: Date },
  resumeViews: { type: Number, default: 0 },

  // ── Placement ───────────────────────────────────────────────
  profileCompletion: { type: Number, default: 20 },
  placementStatus: { type: String, enum: ['Eligible', 'Applied', 'Placed', 'Not Eligible'], default: 'Eligible' },
  placedAt: { type: String },

}, { timestamps: true });

// Fix: use mongoose.models to prevent OverwriteModelError
export default mongoose.models.User || mongoose.model('User', UserSchema);
