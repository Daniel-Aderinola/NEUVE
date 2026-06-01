import { Router } from 'express';
import { register, login, logout, getProfile, updateProfile, getUsers, deleteUser } from '../controllers/authController';
import { protect, admin } from '../middleware/auth';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();

// Rate limit auth endpoints
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', protect, logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
