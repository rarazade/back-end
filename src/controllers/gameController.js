import { createGameService, getAllGamesService } from "../services/gameService.js";

export const createGame = async (req, res) => {
  try {
    const { title, description, releaseDate, platforms, categoryIds } = req.body;
    const img = req.file?.filename;

    if (!title || !description || !releaseDate || !platforms || !categoryIds || !img) {
      throw new Error("Semua field wajib diisi");
    }

    const parsedPlatforms = Array.isArray(platforms) ? platforms : JSON.parse(platforms);
    const parsedCategoryIds = Array.isArray(categoryIds) ? categoryIds : JSON.parse(categoryIds);
    const parsedReleaseDate = new Date(releaseDate);

    if (isNaN(parsedReleaseDate)) {
      throw new Error("Format releaseDate tidak valid");
    }

    const newGame = await createGameService({
      title,
      description,
      releaseDate: parsedReleaseDate,
      platforms: parsedPlatforms,
      img,
      categoryIds: parsedCategoryIds,
    });

    res.status(201).json(newGame);
  } catch (err) {
    console.error("Create game error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const getAllGame = async (req, res) => {
  try {
    const getData = await getAllGamesService()

    res.status(200).json(getData)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message : error.message})
  }
}