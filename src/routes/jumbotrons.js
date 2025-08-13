import express from "express";
import { getAllJumbotrons, addJumbotron, deleteJumbotron } from "../controllers/jumbotronController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllJumbotrons);
router.post("/", authenticate, addJumbotron);
router.delete("/:id", authenticate, deleteJumbotron);

export default router;
