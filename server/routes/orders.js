import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
  getSellerOrders,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('customer'), [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('paymentMethod').isIn(['card', 'paypal', 'bank_transfer']).withMessage('Valid payment method is required'),
], createOrder);

router.get('/my-orders', protect, authorize('customer'), getUserOrders);

// Seller routes
router.get('/seller/orders', protect, authorize('seller'), getSellerOrders);

// Admin routes
router.get('/', protect, authorize('admin'), getOrders);

// Common routes
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

export default router;