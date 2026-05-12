import { Router } from 'express';
import { getLabs, createLab, editLab, deleteLab } from '../controllers/labsController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';

const router = Router();

// GET /api/labs — Fetch labs (any authenticated user)
router.get('/', requireAuth, getLabs);

// POST /api/labs — Create lab (teacher/admin only)
router.post(
  '/',
  requireAuth,
  requireRole('teacher', 'admin'),
  validate('title', 'subject', 'section', 'startTime', 'endTime', 'location', 'date'),
  createLab
);

// PATCH /api/labs/:id — Edit lab (teacher/admin, owner only)
router.patch('/:id', requireAuth, requireRole('teacher', 'admin'), editLab);

// DELETE /api/labs/:id — Delete lab (teacher/admin, owner only)
router.delete('/:id', requireAuth, requireRole('teacher', 'admin'), deleteLab);

export default router;
