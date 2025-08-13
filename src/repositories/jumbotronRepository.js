import prisma from "../prisma/client.js";

export const getAllJumbotrons = async () => {
  return prisma.jumbotron.findMany({
    include: {
      game: {
        include: {
          categories: { include: { category: true } },
          screenshots: true,
          videos: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const addJumbotron = async (gameId) => {
  const count = await prisma.jumbotron.count();
  if (count >= 5) throw new Error("Maksimal 5 game di jumbotron");

  const exists = await prisma.jumbotron.findUnique({ where: { gameId } });
  if (exists) throw new Error("Game ini sudah ada di jumbotron");

  return prisma.jumbotron.create({ data: { gameId } });
};

export const deleteJumbotron = async (id) => {
  return prisma.jumbotron.delete({ where: { id } });
};

export const deleteById = async (id) => {
  return await prisma.jumbotron.delete({
    where: { id },
  });
};