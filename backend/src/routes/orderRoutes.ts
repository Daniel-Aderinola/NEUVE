import { Router } from 'express';
import {
  createOrder,
  createCheckoutSession,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  stripeWebhook,
} from '../controllers/orderController';
import { protect, admin } from '../middleware/auth';

const router = Router();

router.post('/webhook', stripeWebhook);

router.use(protect);

router.post('/', createOrder);
router.post('/checkout-session', createCheckoutSession);
router.get('/my-orders', getMyOrders);
router.get('/stats', admin, getDashboardStats);
router.get('/:id', getOrderById);

// Admin routes
router.get('/', admin, getAllOrders);
router.put('/:id/status', admin, updateOrderStatus);

export default router;
