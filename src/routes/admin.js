import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', adminController.register);
router.post('/login', adminController.login);

router.get('/me', authenticate, (req, res) => {
  res.json({
    message: "Authorized ✅",
    admin: req.admin
  });
});

export default router;
