import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', adminController.register);

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.SUPERADMIN_USERNAME ||
    password !== process.env.SUPERADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  return res.json({ success: true, message: "Login berhasil" });
});

router.get('/me', authenticate, (req, res) => {
  res.json({
    message: "Authorized ✅",
    admin: req.admin
  });
});

export default router;
