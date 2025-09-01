import express from "express";
import {
  createTeamController,
  getTeamsController,
  updateTeamController,
  deleteTeamController,
} from "../controllers/teamController.js";
import { uploadTeam } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/:aboutId", uploadTeam, createTeamController);
router.get("/:aboutId", getTeamsController);
router.put("/:id", uploadTeam, updateTeamController);
router.delete("/:id", deleteTeamController);

export default router;
