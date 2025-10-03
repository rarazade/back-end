import express from 'express';
import jwt from 'jsonwebtoken';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', adminController.register);

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.SUPERADMIN_USERNAME ||
    password !== process.env.SUPERADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // ✅ Generate JWT token
  const token = jwt.sign(
    { username, role: "superadmin" },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    message: "Login berhasil",
    token
  });
});

router.get('/me', authenticate, (req, res) => {
  res.json({
    message: "Authorized ✅",
    admin: req.admin
  });
});

export default router;
