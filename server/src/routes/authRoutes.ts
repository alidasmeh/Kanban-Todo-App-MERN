import express from 'express';
import { authUser, registerUser, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile);

export default router;
