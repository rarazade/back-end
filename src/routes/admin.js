import express from "express";
import jwt from "jsonwebtoken";
import * as adminController from "../controllers/adminController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

router.post("/register", adminController.register);

router.post("/login", adminController.login);

router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "Authorized ✅",
    admin: req.admin,
  });
});

export default router;
