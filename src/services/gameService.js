import {
  getAllGames,
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  deleteGameCategories,
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
  const { categoryIds, ...rest } = data;

  return createGame({
    ...rest,
    categories: {
      create: categoryIds.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    },
  });
};

export const updateGameService = async (id, data, filename) => {
  const {
    title,
    description,
    releaseDate,
    platform,
    categories,
  } = data;

  const parsedPlatforms = platform ? platform.split(",") : [];

  const parsedCategories = Array.isArray(categories)
  ? categories.map(Number).filter((id) => !isNaN(id))
  : typeof categories === "string"
    ? [parseInt(categories)].filter((id) => !isNaN(id))
    : [];


  const updatedData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(releaseDate && { releaseDate: new Date(releaseDate) }),
    ...(parsedPlatforms.length > 0 && { platforms: parsedPlatforms }),
    ...(filename && { img: filename }),
  };

  // Hapus relasi lama
  await deleteGameCategories(id);

  // Update game + relasi baru
  return updateGame(id, {
    ...updatedData,
    categories: {
      create: parsedCategories.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    },
  });
};

export const deleteGameService = async (id) => {
  await deleteGameCategories(id);
  return deleteGame(id);
};
