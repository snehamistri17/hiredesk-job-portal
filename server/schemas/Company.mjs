import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  // ── Login fields ─────────────────────────────────────────────
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },

  // ── Profile fields ───────────────────────────────────────────
  industry:     { type: String, required: true },
  phone:        { type: String },
  website:      { type: String },
  headquarters: { type: String },
  description:  { type: String },
  size:         { type: String },
  founded:      { type: String },
  logo:         { type: String, default: '' },
  avatar:       { type: String },  // 2-letter initials avatar
  linkedin:     { type: String },
  twitter:      { type: String },
  hr:           { type: String },
  package:      { type: String },

  // ── Admin approval status ────────────────────────────────────
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
