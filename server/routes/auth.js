import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, checkAuthStatus } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['customer', 'seller']).withMessage('Role must be customer or seller'),
], register);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

// Get user profile
router.get('/profile', protect, getProfile);

// Check authentication status
router.get('/check', protect, checkAuthStatus);

// Update user profile
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().trim(),
], updateProfile);

export default router;