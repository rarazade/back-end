import {
  getAllGames,
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  deleteGameCategories,
  deleteImage,
  addGameScreenshots,
  deleteGameScreenshots,
  addGameVideos,
  deleteGameVideos
} from "../repositories/gameRepository.js";


export const getAllGamesService = async () => {
  return getAllGames();
};

export const getGamesService = async ({ platform, category, search }) => {
  return getGames({ platform, category, search });
};

export const getGameByIdService = async (id) => {
  return getGameById(id);
};

export const createGameService = async (data) => {
  const { categoryIds, screenshots, videos, ...rest } = data;

  // Create game + categories
  const game = await createGame({
    ...rest,
    categories: {
      create: categoryIds.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    },
  });

  if (screenshots?.length > 0) {
    await addGameScreenshots(game.id, screenshots);
  }

  if (videos?.length > 0) {
    await addGameVideos(game.id, videos);
  }

  // Return game terbaru (dengan requirements)
  return getGameById(game.id);
};

export const updateGameService = async (id, data, filename) => {
  const {
    title,
    description,
    releaseDate,
    platforms,
    categories,
    requirements,
    screenshots,
    videos
  } = data;

  const parsedPlatforms = platforms ? platforms.split(",") : [];

  const parsedCategories = Array.isArray(categories)
    ? categories.map(Number).filter((id) => !isNaN(id))
    : typeof categories === "string"
      ? [parseInt(categories)].filter((id) => !isNaN(id))
      : [];

  const updatedData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(releaseDate && { releaseDate: new Date(releaseDate) }),
    ...(JSON.parse(requirements) && { requirements: JSON.parse(requirements) }), // memasukkan request body requirements ke variable dan merubah ke tipe json
    ...(parsedPlatforms.length > 0 && { platforms: parsedPlatforms }),
    ...(filename && { img: filename }),
  };

  if (filename) {
    await deleteImage(id)
  }

  if (screenshots) {
    await deleteGameScreenshots(id, screenshots);
  }

  if (videos) {
    await deleteGameVideos(id, videos);
  }

  // Hapus data lama
  await deleteGameCategories(id);


  // Update game + categories baru
  const game = await updateGame(id, {
    ...updatedData,
    categories: {
      create: parsedCategories.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    },
  });

  if (screenshots?.length > 0) {
    await addGameScreenshots(id, screenshots);
  }
  if (videos?.length > 0) {
    await addGameVideos(id, videos);
  }

  return getGameById(id);
};

export const deleteGameService = async (id) => {
  await deleteGameCategories(id);
  await deleteImage(id)
  await deleteGameScreenshots(id);
  await deleteGameVideos(id);
  return deleteGame(id);
};
