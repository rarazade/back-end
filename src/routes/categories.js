import express from 'express';
import {
  getAllCategories,
  createCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', authenticate, createCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
