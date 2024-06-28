// src/routes/authRoutes.js
import express from 'express';
import { signup, login, getProfile } from '../controllers/authcontroller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Protected route example
router.get('/profile', verifyToken, getProfile);

export default router;