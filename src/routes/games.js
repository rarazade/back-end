import express from "express";
import {
  createGame,
  getGames,
  getAllGame,
  getGameById,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";
import { uploadGameAssets } from "../middlewares/uploadMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import prisma from '../prisma/client.js';

const router = express.Router();

// Public Routes
router.get("/meta", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    const platforms = ["PC", "Mobile", "Console"]; // hardcoded
    res.json({ categories, platforms });
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil meta" });
  }
});
router.get('/games', getGames);
router.get('/games/all', getAllGame);
router.get('/games/:id', getGameById);


// Admin Routes (with file upload + auth)
router.post('/games', authenticate, uploadGameAssets, createGame);
router.put('/games/:id', authenticate, uploadGameAssets, updateGame);
router.delete('/games/:id', authenticate, deleteGame);
export default router;
