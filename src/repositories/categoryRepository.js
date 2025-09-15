import prisma from '../prisma/client.js';

export const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id: String(id) },
  });
};

export const getCategoryByName = async (name) => {
  return await prisma.category.findUnique({
    where: { name },
  });
};

export const createCategory = async (name) => {
  return await prisma.category.create({
    data: { name },
  });
};

export const updateCategory = async (id, name) => {
  return await prisma.category.update({
    where: { id: String(id) },
    data: { name },
  });
};

export const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id: String(id) },
  });
};
