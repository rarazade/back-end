import prisma from "../prisma/client.js";

export const getAllGamesService = async () => {
  return await prisma.game.findMany()
}
export const createGameService = async ({ title, description, releaseDate, platforms, img, categoryIds }) => {
  if (
    !title ||
    !img ||
    !Array.isArray(platforms) || platforms.length === 0 ||
    !Array.isArray(categoryIds) || categoryIds.length === 0
  ) {
    throw new Error("Missing or invalid data: title, img, platforms, and at least one category required");
  }

  const check = new Date(releaseDate)

  // 🟡 Debug releaseDate
  console.log("🎯 releaseDate typeof:", typeof check, check);
  console.log("🎯 new Date:", new Date(releaseDate));

  return await prisma.game.create({
    data: {
      title,
      description,
      platforms,
      img,
      releaseDate: check, // ✅ Perlu valid Date
      categories: {
        create: categoryIds.map((catId) => ({
          category: { connect: { id: catId } },
        })),
      },
    },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });
};
