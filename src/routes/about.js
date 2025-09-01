import express from "express";
import {
  createAboutController,
  getAboutsController,
  getAboutController,
  updateAboutController,
  deleteAboutController,
  deleteAboutImageController,
  addAboutImagesController,
} from "../controllers/aboutController.js";
import { uploadAbout } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAboutsController);
router.get("/:id", getAboutController);
router.post("/", uploadAbout, createAboutController);
router.put("/:id", uploadAbout, updateAboutController); // bisa update teks + tambah gambar sekaligus
router.delete("/:id", deleteAboutController);
router.delete("/image/:id", deleteAboutImageController);
router.post("/:id/images", uploadAbout, addAboutImagesController);

export default router;
