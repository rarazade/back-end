import prisma from '../prisma/client.js';

export const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const createCategory = async (name) => {
  return await prisma.category.create({
    data: { name },
  });
};

export const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id },
  });
};
