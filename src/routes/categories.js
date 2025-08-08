import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin Routes (with authentication)
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
