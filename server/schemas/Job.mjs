import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  // ── Basic job info ───────────────────────────────────────────
  jobtitle:    { type: String, required: true, trim: true },
  company:     { type: String, required: true },
  companyId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  logo:        { type: String, default: '🏢' },
  color:       { type: String, default: '#e0f5ff' },
  department:  { type: String },
  location:    { type: String, required: true },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    default: 'Full-Time'
  },
  salary:      { type: String, required: true },
  positions:   { type: Number, default: 1 },
  deadline:    { type: String },
  description: { type: String },
  requirements: [{ type: String }],
  skills:      [{ type: String }],
  cgpaRequired: { type: String, default: '6.0+' },
  applicants:  { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Draft'],
    default: 'Active'
  },
  postedDate:  { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
