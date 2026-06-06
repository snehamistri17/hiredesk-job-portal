import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes         from './routes/auth.routes.mjs';
import userRoutes         from './routes/user.routes.mjs';
import jobRoutes          from './routes/job.routes.mjs';
import companyRoutes      from './routes/company.routes.mjs';
import applicationRoutes  from './routes/application.routes.mjs';
import adminRoutes        from './routes/admin.routes.mjs';
import resultRoutes       from './routes/result.routes.mjs';
import notificationRoutes from './routes/notification.routes.mjs';
import extrasRoutes       from './routes/extras.routes.mjs';
// import section ma add karo:
import contactRoutes from './routes/contact.routes.mjs'; 
const app = express();
  // ✅ NEW

// routes section ma add karo (extrasRoutes ni niche):

// ── Middleware ───────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes as static files
app.use('/uploads', express.static('uploads'));

// ── MongoDB ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ── Routes ───────────────────────────────────────────────────────
// ✅ CORRECT ORDER — specific routes first, generic /api catch-all last
app.use('/api/auth',          authRoutes);
app.use('/api/user',          userRoutes);
app.use('/api/jobs',          jobRoutes);
app.use('/api/company',       companyRoutes);
app.use('/api/applications',  applicationRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/results',       resultRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact',       contactRoutes);     // ✅ MOVE THIS UP (before extrasRoutes)
app.use('/api',               extrasRoutes);      // ⬇️ Keep this LAST

// ── Health check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'HireDesk API running!', status: 'OK' });
});

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
