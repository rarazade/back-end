import {
  createTeamService,
  getTeamsService,
  updateTeamService,
  deleteTeamService,
} from "../services/teamService.js";

export const createTeamController = async (req, res) => {
  try {
    const { name, role, linkedin, github } = req.body;
    const team = await createTeamService(
      req.params.aboutId,
      { name, role, linkedin, github },
      req.file
    );
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamsController = async (req, res) => {
  const teams = await getTeamsService(req.params.aboutId);
  res.json(teams);
};

export const updateTeamController = async (req, res) => {
  try {
    const { name, role, linkedin, github } = req.body;
    const team = await updateTeamService(
      req.params.id,
      { name, role, linkedin, github },
      req.file
    );
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTeamController = async (req, res) => {
  try {
    const team = await deleteTeamService(req.params.id);
    res.json({ message: "Deleted", team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
