import prisma from '../prisma/client.js';

export const getAllNews = () => {
  return prisma.news.findMany({ orderBy: { date: 'desc' } });
};

export const getNewsById = (id) => {
  return prisma.news.findUnique({ where: { id } });
};

export const createNews = (data) => {
  return prisma.news.create({ data });
};

export const updateNews = (id, data) => {
  return prisma.news.update({ where: { id }, data });
};

export const deleteNews = (id) => {
  return prisma.news.delete({ where: { id } });
};
