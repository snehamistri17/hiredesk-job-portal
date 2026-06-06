import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  // ── Student info ─────────────────────────────────────────────
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName:  { type: String, required: true },
  studentEmail: { type: String },
  avatar:       { type: String },
  phone:        { type: String },
  cgpa:         { type: String },
  branch:       { type: String },
  college:      { type: String },
  skills:       [{ type: String }],
  resume:       { type: String },
  resumeName:   { type: String },

  // ── Job info ─────────────────────────────────────────────────
  jobId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle:     { type: String, required: true },
  company:      { type: String, required: true },
  companyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  logo:         { type: String },
  color:        { type: String },
  pkg:          { type: String },

  // ── Application status ───────────────────────────────────────
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Hired'],
    default: 'Applied'
  },
  stage:        { type: String, default: 'Application Submitted' },

  // ── Interview details (set by company) ───────────────────────
  interviewDate: { type: String },
  interviewTime: { type: String },
  interviewMode: { type: String, enum: ['Online', 'In-Person'] },
  round:         { type: String },
  score:         { type: Number },

  // ── Timeline steps ───────────────────────────────────────────
  timeline: [{
    stage:  String,
    date:   String,
    status: { type: String, enum: ['done', 'active', 'pending'], default: 'pending' },
    desc:   String
  }],

  appliedDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
