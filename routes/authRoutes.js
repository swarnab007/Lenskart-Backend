import express from 'express';
import { login, logout, register } from '../controllers/authController.js';

const router = express.Router();

// POST : Register
router.post('/register', register);
// POST : Login
router.post('/login', login);
// POST : Logout
router.post('/logout', logout);
// GET : Profile

export default router;