import {
  getAllGames,
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  deleteGameCategories,
  deleteGameRequirements,
  addGameRequirements,
  deleteImage
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
  const { categoryIds, requirements, ...rest } = data;

  // Create game + categories
  const game = await createGame({
    ...rest,
    categories: {
      create: categoryIds.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    },
  });

  // Jika ada requirements, tambahkan
  if (requirements && requirements.length > 0) {
    await addGameRequirements(game.id, requirements);
  }

  // Return game terbaru (dengan requirements)
  return getGameById(game.id);
};

export const updateGameService = async (id, data, filename) => {
  const {
    title,
    description,
    releaseDate,
    platform,
    categories,
    requirements // ✅ tambahan
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

  if (filename) {
    await deleteImage(id)
  }
  // Hapus categories lama
  await deleteGameCategories(id);

  // Hapus requirements lama
  await deleteGameRequirements(id);

  // Update game + categories baru
  const game = await updateGame(id, {
    ...updatedData,
    categories: {
      create: parsedCategories.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    },
  });

  // Tambahkan requirements baru jika ada
  if (requirements && requirements.length > 0) {
    await addGameRequirements(id, requirements);
  }

  return getGameById(id);
};

export const deleteGameService = async (id) => {
  await deleteGameCategories(id);
  await deleteImage(id)
  await deleteGameRequirements(id); // ✅ Pastikan requirements ikut terhapus
  return deleteGame(id);
};
