import * as categoryRepo from "../repositories/categoryRepository.js";

export const getCategories = async () => {
  return categoryRepo.getAllCategories();
};

export const getCategoryById = async (id) => {
  const category = await categoryRepo.getCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

export const addCategory = async (name) => {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid category name");
  }

  const existing = await categoryRepo.getCategoryByName(name);
  if (existing) {
    throw new Error("Category name already exists");
  }

  return categoryRepo.createCategory(name);
};

export const updateCategory = async (id, name) => {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid category name");
  }

  const existing = await categoryRepo.getCategoryByName(name);
  if (existing && existing.id !== id) {
    throw new Error("Category name already exists");
  }

  return categoryRepo.updateCategory(id, name);
};

export const deleteCategory = async (id) => {
  const category = await categoryRepo.getCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  return categoryRepo.deleteCategory(id);
};
