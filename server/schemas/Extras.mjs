import mongoose from 'mongoose';

const PlacementRuleSchema = new mongoose.Schema({
  section: { type: String, required: true },
  title:   { type: String, required: true },
  rules: [{
    num:   Number,
    title: String,
    desc:  String
  }],
  badges: [{
    label: String,
    color: String
  }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const PlacementRule = mongoose.models.PlacementRule || mongoose.model('PlacementRule', PlacementRuleSchema);

// ── FAQ ──────────────────────────────────────────────────────────
const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  category: { type: String, default: 'general' },
  order:    { type: Number, default: 0 }
}, { timestamps: true });

export const Faq = mongoose.models.Faq || mongoose.model('Faq', FaqSchema);
