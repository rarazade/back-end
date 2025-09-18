import * as categoryService from '../services/categoryService.js';

export const getAllCategories = async (req, res) => {
  try {
    console.log("GET /categories");
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    console.error("Failed to take category:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categoryService.getCategoryById(String(id));
    res.json(category);
  } catch (err) {
    console.error("Failed to take category:", err);
    res.status(404).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "The category name cannot be empty" });
    }

    const newCategory = await categoryService.addCategory(name);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Failed to add category:", err);
    res.status(400).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "The category name cannot be empty" });
    }

    const updated = await categoryService.updateCategory(String(id), name);
    res.json(updated);
  } catch (err) {
    console.error("Category update failed:", err);
    res.status(400).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await categoryService.deleteCategory(String(id));
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: error.message });
  }
};
