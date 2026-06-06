import jwt from 'jsonwebtoken';

// Verify JWT token from Authorization header
export const verifyToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token. Please login.' });

  const token = header.split(' ')[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, name, email } OR { companyId, role, email }
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired.' });
  }
};

// Only admin
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required.' });
  next();
};

// Only company
export const companyOnly = (req, res, next) => {
  if (req.user?.role !== 'company')
    return res.status(403).json({ message: 'Company access required.' });
  next();
};

// Only student (role = 'user')
export const studentOnly = (req, res, next) => {
  if (req.user?.role !== 'user')
    return res.status(403).json({ message: 'Student access required.' });
  next();
};
