import { Router } from 'express';
import { markAttendance, getAttendance } from '../controllers/attendanceController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// GET /api/attendance — Fetch attendance (students=own, teachers=all)
router.get('/', requireAuth, getAttendance);

// POST /api/attendance — Mark attendance (teacher/admin only)
router.post('/', requireAuth, requireRole('teacher', 'admin'), markAttendance);

export default router;
