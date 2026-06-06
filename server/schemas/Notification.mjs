import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  // ── Who gets this notification ───────────────────────────────
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // null = broadcast
  targetRole: { type: String, enum: ['admin', 'company', 'user', 'all'], default: 'all' },

  // ── Content ──────────────────────────────────────────────────
  icon:    { type: String, default: '🔔' },
  type:    { type: String, enum: ['job', 'interview', 'shortlist', 'alert', 'result', 'company', 'system'], default: 'alert' },
  title:   { type: String, required: true },
  message: { type: String },  // used for broadcast notifications
  desc:    { type: String },  // used for user-specific notifications
  time:    { type: String },
  bg:      { type: String, default: '#eef2ff' },
  tag:     { type: String },
  unread:  { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
