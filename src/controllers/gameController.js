import {
  createGameService,
  getAllGamesService,
  getGamesService,
  getGameByIdService,
  updateGameService,
  deleteGameService,
} from "../services/gameService.js";


export const getGames = async (req, res) => {
  try {
    const { platform, category, search } = req.query;
    const data = await getGamesService({ platform, category, search });
    res.status(200).json(data);
  } catch (err) {
    console.error("Get games with filter error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllGame = async (req, res) => {
  try {
    const data = await getAllGamesService();
    res.status(200).json(data);
  } catch (err) {
    console.error("Get all games error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid game ID" });
    }

    const game = await getGameByIdService(Number(id));

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({
      ...game,
      imageUrl: `${process.env.BACKEND_ORIGIN}/uploads/${game.img}`,
    });
  } catch (err) {
    console.error("Get game by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

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

export const updateGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const filename = req.file?.filename;

    const updatedGame = await updateGameService(gameId, req.body, filename);

    res.json({ message: "Game updated successfully", game: updatedGame });
  } catch (error) {
    console.error("🔥 Error in updateGame:", error);
    res.status(500).json({ message: "Failed to update game", error: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteGameService(Number(id));
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    console.error("Delete game error:", err);
    res.status(500).json({ message: err.message });
  }
};
