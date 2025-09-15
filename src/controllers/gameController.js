import {
  createGameService,
  getAllGamesService,
  getGamesService,
  getGameByIdService,
  updateGameService,
  deleteGameService,
  deleteScreenshotsService,
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

    if (!id) {
      return res.status(400).json({ message: "Invalid game ID" });
    }

    const game = await getGameByIdService(id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({
      ...game,
      imageUrl: game.img
        ? `${process.env.BACKEND_ORIGIN}/uploads/${game.img}`
        : null,
      screenshots:
        game.screenshots?.map((file) => ({
          id: file.id,
          url: `${process.env.BACKEND_ORIGIN}/uploads/${file.image}`,
        })) || [],
      videos:
        game.videos?.map((v) => ({
          id: v.id,
          url: v.url,
        })) || [],
    });
  } catch (err) {
    console.error("Get game by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createGame = async (req, res) => {
  try {
    const {
      title,
      description,
      releaseDate,
      platforms,
      categoryIds,
      newVideos,
      requirements,
    } = req.body;
    const img = req.files?.img?.[0]?.filename;
    const screenshots =
      req.files?.screenshots?.map((file) => file.filename) || [];

    if (
      !title ||
      !description ||
      !releaseDate ||
      !platforms ||
      !categoryIds ||
      !img
    ) {
      throw new Error("Semua field wajib diisi");
    }

    const parsedPlatforms = Array.isArray(platforms)
      ? platforms
      : JSON.parse(platforms);
    const parsedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds
      : JSON.parse(categoryIds);
    const parsedVideos = newVideos
      ? Array.isArray(newVideos)
        ? videos
        : JSON.parse(newVideos)
      : [];
    const parsedRequirements = requirements
      ? typeof requirements === "string"
        ? JSON.parse(requirements)
        : requirements
      : {};

    const parsedReleaseDate = new Date(releaseDate);
    if (isNaN(parsedReleaseDate))
      throw new Error("Format releaseDate tidak valid");

    const newGame = await createGameService({
      title,
      description,
      releaseDate: parsedReleaseDate,
      platforms: parsedPlatforms,
      img,
      categoryIds: parsedCategoryIds,
      screenshots,
      videos: parsedVideos,
      requirements: parsedRequirements, // ✅ wajib dikirim
    });

    res.status(201).json(newGame);
  } catch (err) {
    console.error("Create game error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const updateGame = async (req, res) => {
  try {
    const gameId = req.params.id;

    const deletedScreenshots = req.body.deletedScreenshots
      ? JSON.parse(req.body.deletedScreenshots)
      : [];

    const deletedVideos = Array.isArray(req.body.deletedVideos)
      ? req.body.deletedVideos
      : req.body.deletedVideos
      ? JSON.parse(req.body.deletedVideos)
      : [];

    const newVideos = Array.isArray(req.body.newVideos)
      ? req.body.newVideos
      : req.body.newVideos
      ? JSON.parse(req.body.newVideos)
      : [];

    // 🟢 ambil file dari multer
    const filename = req.files?.img?.[0]?.filename || null;
    const newScreenshots = req.files?.screenshots?.map((f) => f.filename) || [];

    // DEBUG
    console.log("🎬 updateGame INPUT:");
    console.log("  gameId:", gameId);
    console.log("  filename:", filename);
    console.log("  newScreenshots:", newScreenshots);
    console.log("  deletedScreenshots:", deletedScreenshots);
    console.log("  deletedVideos:", deletedVideos);
    console.log("  newVideos:", newVideos);

    // hapus screenshot tertentu
    if (deletedScreenshots.length > 0) {
      await deleteScreenshotsService(gameId, deletedScreenshots);
    }

    const updatedGame = await updateGameService(
      gameId,
      {
        ...req.body,
        screenshots: newScreenshots,
        deletedVideos,
        newVideos,
      },
      filename
    );

    res.json({ message: "Game updated successfully", game: updatedGame });
  } catch (err) {
    console.error("🔥 Error in updateGame:", err);
    res.status(500).json({
      message: "Failed to update game",
      error: err.message,
    });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteGameService(id);
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    console.error("Delete game error:", err);
    res.status(500).json({ message: err.message });
  }
};
