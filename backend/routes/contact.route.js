// routes/contact.route.js
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { submitMessage, getMessages, deleteMessage } from '../controllers/contact.controller.js';

const router = express.Router();

// POST /contact - Submit message (public)
router.post('/contact', submitMessage);

// GET /contact-messages - Fetch all messages (admin only)
router.get('/contact-messages', protectRoute, getMessages);

// DELETE /contact-messages/:id - Delete message (admin only)
router.delete('/contact-messages/:id', protectRoute, deleteMessage);

export default router;