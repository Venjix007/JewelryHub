import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', protect, authorize('admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim(),
], createCategory);

router.put('/:id', protect, authorize('admin'), [
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim(),
], updateCategory);

router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;