import * as categoryRepo from '../repositories/categoryRepository.js';

export const getCategories = async () => {
  return await categoryRepo.getAllCategories();
};

export const addCategory = async (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid category name');
  }

  return await categoryRepo.createCategory(name);
};

export const deleteCategory = async (id) => {
  return await categoryRepo.deleteCategory(id);
};
