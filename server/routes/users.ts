import { Router } from 'express';
import { syncUser, getCurrentUser, updateProfile } from '../controllers/usersController';
import { requireAuth } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';

const router = Router();

// POST /api/users/sync — Create or update user profile from Clerk
router.post('/sync', requireAuth, validate('email', 'name', 'role'), syncUser);

// GET /api/users/me — Get current user's profile
router.get('/me', requireAuth, getCurrentUser);

// PATCH /api/users/me — Update current user's profile
router.patch('/me', requireAuth, updateProfile);

export default router;
