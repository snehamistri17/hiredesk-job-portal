import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  student:    { type: String, required: true },
  avatar:     { type: String },
  branch:     { type: String },
  company:    { type: String, required: true },
  companyId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  package:    { type: String, required: true },
  role:       { type: String, required: true },
  offerDate:  { type: String },
  published:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
