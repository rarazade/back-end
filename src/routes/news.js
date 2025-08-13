import express from "express";
import * as newsController from "../controllers/newsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { uploadNewsFiles } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);

// ✅ Only admin
router.post("/news", authenticate, uploadNewsFiles, newsController.createNews);
router.put("/news:id", authenticate, uploadNewsFiles, newsController.updateNews);
router.delete("news/:id", authenticate, newsController.deleteNews);

export default router;
