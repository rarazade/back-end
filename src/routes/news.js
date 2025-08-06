import express from 'express';
import * as newsController from '../controllers/newsController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', authenticate, newsController.createNews);
router.put('/:id', authenticate, newsController.updateNews);
router.delete('/:id', authenticate, newsController.deleteNews);

export default router;
