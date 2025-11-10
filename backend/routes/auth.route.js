// routes/auth.route.js (updated with profile update route)
import express from 'express';
import { signup, login, logout, refreshToken, getProfile, updateProfile } from '../controllers/authController.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/logout', protectRoute, logout);
router.post('/refresh', refreshToken);
router.get('/profile', protectRoute, getProfile);
router.put('/profile', protectRoute, updateProfile); // Added for profile update

export default router;