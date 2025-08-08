import prisma from '../prisma/client.js';

export const getAllGames = async () => {
  return prisma.game.findMany()
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
    },
  });
};

export const deleteGameCategories = async (gameId) => {
  return prisma.gameCategory.deleteMany({ where: { gameId } });
};
