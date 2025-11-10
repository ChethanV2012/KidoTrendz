import express from 'express';
import { getAllOrders } from '../controllers/adminController.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';  // <-- Exact!

const router = express.Router();

router.get('/orders', protectRoute, adminRoute, getAllOrders);

export default router;