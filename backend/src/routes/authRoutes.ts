import { Router } from 'express';
import { register, login, logout, getProfile, updateProfile, getUsers, deleteUser } from '../controllers/authController';
import { protect, admin } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
