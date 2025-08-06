import express from "express";
import { createGame, getAllGame } from "../controllers/gameController.js";
import { uploadGameFiles } from "../middlewares/uploadMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/games', getAllGame)

router.post(
  "/games",
  authenticate,
  uploadGameFiles,
  createGame     
);



export default router;
