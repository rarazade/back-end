import * as categoryService from '../services/categoryService.js';

export const getAllCategories = async (req, res) => {
  try {
    console.log("GET /categories masuk");
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    console.error("Gagal ambil kategori:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Nama kategori tidak boleh kosong" });
    }

    const newCategory = await categoryService.addCategory(name);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Gagal tambah kategori:", err);
    res.status(400).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await categoryService.deleteCategory(Number(id));
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
