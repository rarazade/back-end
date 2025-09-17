import { error } from "console";
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
  deleteGameVideos,
  getScreenshoot,
  deleteSelectedScreenshots,
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

  return getGameById(game.id);
};

export const updateGameService = async (id, data, filename) => {
  const {
    title,
    description,
    releaseDate,
    platforms,
    categories,
    screenshots,
    newVideos,
    deletedVideos,
  } = data;

  const parsedCategories = Array.isArray(categories) ? categories : [];

  const updatedData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(releaseDate && { releaseDate: new Date(releaseDate) }),
    ...(platforms && { platforms: JSON.parse(platforms) }),
    ...(filename && { img: filename }),
  };

  if (filename) {
    await deleteImage(id);
  }

  if (deletedVideos?.length > 0) {
    await deleteGameVideos(id, deletedVideos);
  }

  if (newVideos?.length > 0) {
    await addGameVideos(id, newVideos);
  }

  await deleteGameCategories(id);

  const game = await updateGame(id, {
    ...updatedData,
    categories: {
      create: parsedCategories.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    },
  });

  if (screenshots?.length > 0) {
    const existing = await getScreenshoot(id);
    if (existing.length + screenshots.length <= 12) {
      await addGameScreenshots(id, screenshots);
    }
  }

  return getGameById(id);
};

export const deleteGameService = async (id) => {
  await deleteGameCategories(id);
  await deleteGameScreenshots(id);
  await deleteImage(id);
  return deleteGame(id);
};

export const deleteScreenshotsService = async (gameId, deletedIds) => {
  return deleteSelectedScreenshots(gameId, deletedIds);
};
