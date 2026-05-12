import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  sendNotification,
  broadcastNotification,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationsController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';

const router = Router();

// GET /api/notifications — Fetch current user's notifications
router.get('/', requireAuth, getNotifications);

// GET /api/notifications/unread-count — Badge count
router.get('/unread-count', requireAuth, getUnreadCount);

// POST /api/notifications — Send notification to a specific user (teacher/admin)
router.post(
  '/',
  requireAuth,
  requireRole('teacher', 'admin'),
  validate('userId', 'title', 'body'),
  sendNotification
);

// POST /api/notifications/broadcast — Broadcast to all users (teacher/admin)
router.post(
  '/broadcast',
  requireAuth,
  requireRole('teacher', 'admin'),
  validate('title', 'body'),
  broadcastNotification
);

// PATCH /api/notifications/read-all — Mark all as read (must be before /:id)
router.patch('/read-all', requireAuth, markAllAsRead);

// PATCH /api/notifications/:id/read — Mark single notification as read
router.patch('/:id/read', requireAuth, markAsRead);

export default router;
