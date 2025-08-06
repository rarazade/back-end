import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  // Expect format "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Invalid authorization header format' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Malformed token scheme' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded; // bisa dipakai downstream
    next();
  } catch (err) {
    // detail ringan untuk debugging, jangan bocorkan ke client lebih dari perlu
    console.warn("JWT verification failed:", err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
