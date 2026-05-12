import { Router } from 'express';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementsController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';

const router = Router();

// GET /api/announcements — Fetch announcements (any authenticated user)
router.get('/', requireAuth, getAnnouncements);

// POST /api/announcements — Publish announcement (teacher/admin only)
router.post(
  '/',
  requireAuth,
  requireRole('teacher', 'admin'),
  validate('title', 'body'),
  createAnnouncement
);

// DELETE /api/announcements/:id — Delete announcement (author or admin)
router.delete('/:id', requireAuth, requireRole('teacher', 'admin'), deleteAnnouncement);

export default router;
