import express from 'express';
import { getProfile, login, logout, register } from '../controllers/authController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST : Register
router.post('/register', register);
// POST : Login
router.post('/login', login);
// POST : Logout
router.post('/logout', logout);
// GET : Profile
router.get('/profile', protectedRoute, getProfile);

export default router;