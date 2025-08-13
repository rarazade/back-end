import prisma from '../prisma/client.js';
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllGames = async () => {
  return prisma.game.findMany({
    include: {
      categories: { include: { category: true } },
      screenshots: true,
      videos: true
    }
  })
}

export const getGames = async ({ platform, category, search }) => {
  const categoryIds = category
    ? category.split(",").map((id) => parseInt(id))
    : undefined;

  return prisma.game.findMany({
    where: {
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
      ...(platform && {
        platforms: {
          has: platform,
        },
      }),
      ...(categoryIds && {
        categories: {
          some: {
            category: {
              id: { in: categoryIds },
            },
          },
        },
      }),
    },
    include: {
      categories: {
        include: { category: true },
      },
      screenshots: true,
      videos: true
    },
  });
};

export const getGameById = async (id) => {
  return prisma.game.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
      },
      screenshots: true,
      videos: true
    },
  });
};

export const deleteGame = async (id) => {
  return prisma.game.delete({ where: { id } });
};

export const updateGame = async (id, data) => {
  return prisma.game.update({
    where: { id },
    data,
    include: {
      categories: {
        include: { category: true },
      },
      screenshots: true,
      videos: true
    },
  });
};

export const createGame = async (data) => {
  return prisma.game.create({
    data,
    include: {
      categories: {
        include: { category: true },
      },
      screenshots: true,
      videos: true
    },
  });
};

export const deleteGameCategories = async (gameId) => {
  return prisma.gameCategory.deleteMany({ where: { gameId } });
};

export const deleteImage = async (gameId) => {
  const data = await prisma.game.findUnique({ where: { id : gameId } });
  fs.unlink(`${path.join(__dirname, '../../uploads')}/${data.img}`, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      // Handle the error (e.g., send an error response)
    } else {
      console.log('File deleted successfully.');
      // Send a success response
      }
  });
};

export const addGameScreenshots = async (gameId, screenshots) => {
  return prisma.screenshot.createMany({
    data: screenshots.map((filename) => ({
      gameId,
      image: filename
    }))
  });
};

export const deleteGameScreenshots = async (gameId) => {
  const data = await prisma.screenshot.findMany({where : {gameId}})
  data.map((e) => {
    // console.log(e.image)
    fs.unlink(`${path.join(__dirname, '../../uploads')}/${e.image}`, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        // Handle the error (e.g., send an error response)
      } else {
        console.log('File deleted successfully.');
        // Send a success response
        }
    });
  })
  return prisma.screenshot.deleteMany({ where: { gameId} });
};

export const addGameVideos = async (gameId, videos) => {
  return prisma.videoSlider.createMany({
    data: videos.map((filename) => ({
      gameId,
      url: filename
    }))
  });
};

export const deleteGameVideos = async (gameId) => {
  const data = await prisma.videoSlider.findMany({where: { gameId }})
  data.map((e) => {
    fs.unlink(`${path.join(__dirname, '../../uploads')}/${e.url}`, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        // Handle the error (e.g., send an error response)
      } else {
        console.log('File deleted successfully.');
        // Send a success response
        }
    });
  })  
  return prisma.videoSlider.deleteMany({ where: { gameId } });
};