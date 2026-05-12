import { Router } from 'express';
import { getLectures, createLecture, editLecture, deleteLecture } from '../controllers/lecturesController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';

const router = Router();

// GET /api/lectures — Fetch lectures (any authenticated user)
router.get('/', requireAuth, getLectures);

// POST /api/lectures — Create lecture (teacher/admin only)
router.post(
  '/',
  requireAuth,
  requireRole('teacher', 'admin'),
  validate('title', 'subject', 'section', 'startTime', 'endTime', 'location', 'date'),
  createLecture
);

// PATCH /api/lectures/:id — Edit lecture (teacher/admin, owner only)
router.patch('/:id', requireAuth, requireRole('teacher', 'admin'), editLecture);

// DELETE /api/lectures/:id — Delete lecture (teacher/admin, owner only)
router.delete('/:id', requireAuth, requireRole('teacher', 'admin'), deleteLecture);

export default router;
