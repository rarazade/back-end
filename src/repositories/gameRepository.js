import prisma from '../prisma/client.js';
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads");
const isUrl = (s) => typeof s === "string" && /^https?:\/\//i.test(s);

const safeUnlink = async (filepath) => {
  try {
    await fs.unlink(filepath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Error deleting file:", err);
    }
    // ENOENT diabaikan (file memang tidak ada), biarkan lanjut
  }
};

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
          hasSome: [platform, 'PC & Mobile'],
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
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { img: true },
  });
  if (!game?.img || isUrl(game.img)) return;         // URL? skip
  const fp = path.join(uploadDir, game.img);
  await safeUnlink(fp);
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

export const deleteSelectedScreenshots = async (gameId, deletedIds) => {
  if (!deletedIds || deletedIds.length === 0) return;

  const screenshots = await prisma.screenshot.findMany({
    where: { id: { in: deletedIds }, gameId },
  });

  screenshots.forEach((s) => {
    const filePath = path.join(uploadDir, s.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  return prisma.screenshot.deleteMany({
    where: { id: { in: deletedIds }, gameId },
  });
};

export const getScreenshoot = async (id) => {
  return await prisma.screenshot.findMany({where: { gameId: Number(id) }})
}

export const addGameVideos = async (gameId, videos) => {
  if (!Array.isArray(videos)) {
    console.warn("videos is not an array:", videos);
    return;
  }

  for (let rawUrl of videos) {
    const url = rawUrl.trim();
    if (!url) continue;

    await prisma.videoSlider.create({
      data: {
        url,
        gameId,
      },
    });
  }
};

export const deleteGameVideos = async (gameId, deletedIds) => {
  if (!deletedIds || deletedIds.length === 0) return;

  return prisma.videoSlider.deleteMany({
    where: {
      id: { in: deletedIds },
      gameId,
    },
  });
};



