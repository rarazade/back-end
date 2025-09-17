import * as service from "../services/jumbotronService.js";

export const getAllJumbotrons = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addJumbotron = async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) return res.status(400).json({ message: "gameId wajib diisi" });

    const result = await service.add(gameId);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteJumbotron = async (req, res) => {
  try {
    const id = req.params.id;
    await service.deleteJumbotron(id);
    res.status(200).json({ message: "Jumbotron deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
