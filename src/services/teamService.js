import fs from "fs";
import path from "path";
import { createTeam, getTeams, updateTeam, deleteTeam } from "../repositories/teamRepository.js";

const uploadDir = path.join(process.cwd(), "uploads");

export const createTeamService = (aboutId, data, photo) => createTeam(aboutId, data, photo);

export const getTeamsService = (aboutId) => getTeams(aboutId);

export const updateTeamService = async (id, data, photo) => {
  const updated = await updateTeam(id, data, photo);
  return updated;
};

export const deleteTeamService = async (id) => {
  const team = await deleteTeam(id);
  if (team.photo) {
    const filePath = path.join(uploadDir, team.photo);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  return team;
};
