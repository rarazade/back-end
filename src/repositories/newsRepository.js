import prisma from "../prisma/client.js";

export const getAllNews = async () => {
  return await prisma.news.findMany({
    orderBy: { date: "desc" },
  });
};

export const getNewsById = async (id) => {
  return await prisma.news.findUnique({
    where: { id: Number(id) },
  });
};

export const createNews = async (data) => {
  return await prisma.news.create({
    data,
  });
};

export const updateNews = async (id, data) => {
  return await prisma.news.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteNews = async (id) => {
  return await prisma.news.delete({
    where: { id: Number(id) },
  });
};
