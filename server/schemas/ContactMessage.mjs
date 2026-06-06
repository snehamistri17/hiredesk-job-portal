import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true },
  subject:   { type: String, trim: true, default: 'No Subject' },
  message:   { type: String, required: true, trim: true },
  status:    { type: String, enum: ['Unread', 'Read', 'Replied'], default: 'Unread' },
  ipAddress: { type: String },
}, { timestamps: true });

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);