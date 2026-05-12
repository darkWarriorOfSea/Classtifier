import { Response } from 'express';
import { FieldValue } from '../mockFieldValue';
import { notificationsCol } from '../firebase';
import { AuthenticatedRequest, SendNotificationBody, FirestoreNotification } from '../types';
import { sanitize } from '../middleware/validate';

/**
 * GET /api/notifications
 * Fetch notifications for the authenticated user, newest first.
 * Query params: ?limit=20&unreadOnly=true
 */
export async function getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const clerkId = req.auth!.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const unreadOnly = req.query.unreadOnly === 'true';

    let query: any = notificationsCol
      .where('userId', '==', clerkId)
      .orderBy('createdAt', 'desc');

    if (unreadOnly) {
      query = query.where('read', '==', false);
    }

    const snap = await query.limit(limit).get();
    const notifications = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ notifications, count: notifications.length });
  } catch (err: any) {
    console.error('[getNotifications]', err);
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
}

/**
 * GET /api/notifications/unread-count
 * Return the count of unread notifications for the current user.
 */
export async function getUnreadCount(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const clerkId = req.auth!.userId;

    const snap = await notificationsCol
      .where('userId', '==', clerkId)
      .where('read', '==', false)
      .count()
      .get();

    res.json({ unreadCount: snap.data().count });
  } catch (err: any) {
    console.error('[getUnreadCount]', err);
    res.status(500).json({ error: 'Failed to get unread count', details: err.message });
  }
}

/**
 * POST /api/notifications
 * Send a notification to a specific user (teacher/admin only).
 */
export async function sendNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { userId, title, body, type, relatedId } = req.body as SendNotificationBody;

    const notifData: FirestoreNotification = {
      userId,
      title: sanitize(title),
      body: sanitize(body),
      type: type || 'alert',
      read: false,
      ...(relatedId && { relatedId }),
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await notificationsCol.add(notifData);
    res.status(201).json({ id: docRef.id, ...notifData });
  } catch (err: any) {
    console.error('[sendNotification]', err);
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
}

/**
 * POST /api/notifications/broadcast
 * Send a notification to ALL users (teacher/admin only).
 * Useful for announcements that also push notifications.
 */
export async function broadcastNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, body, type, relatedId, targetRole } = req.body;

    if (!title || !body) {
      res.status(400).json({ error: 'title and body are required' });
      return;
    }

    // Import usersCol here to avoid circular deps at top level
    const { usersCol } = await import('../firebase');

    let usersQuery: any = usersCol;
    if (targetRole && targetRole !== 'all') {
      usersQuery = usersQuery.where('role', '==', targetRole);
    }

    const usersSnap = await usersQuery.get();
    const batch = notificationsCol.firestore.batch();
    let count = 0;

    for (const userDoc of usersSnap.docs) {
      const userData = userDoc.data();
      const notifRef = notificationsCol.doc();
      batch.set(notifRef, {
        userId: userData.clerkId,
        title: sanitize(title),
        body: sanitize(body),
        type: type || 'announcement',
        read: false,
        ...(relatedId && { relatedId }),
        createdAt: FieldValue.serverTimestamp(),
      });
      count++;
    }

    await batch.commit();
    res.status(201).json({ message: `Notification broadcast to ${count} users` });
  } catch (err: any) {
    console.error('[broadcastNotification]', err);
    res.status(500).json({ error: 'Failed to broadcast notification', details: err.message });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
export async function markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const docRef = notificationsCol.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    // Ensure the notification belongs to the current user
    const data = doc.data() as FirestoreNotification;
    if (data.userId !== req.auth!.userId) {
      res.status(403).json({ error: 'You can only mark your own notifications as read' });
      return;
    }

    await docRef.update({ read: true });
    res.json({ message: 'Notification marked as read', id });
  } catch (err: any) {
    console.error('[markAsRead]', err);
    res.status(500).json({ error: 'Failed to mark notification as read', details: err.message });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Mark ALL notifications for the current user as read.
 */
export async function markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const clerkId = req.auth!.userId;

    const snap = await notificationsCol
      .where('userId', '==', clerkId)
      .where('read', '==', false)
      .get();

    if (snap.empty) {
      res.json({ message: 'No unread notifications', updated: 0 });
      return;
    }

    const batch = notificationsCol.firestore.batch();
    snap.docs.forEach(doc => batch.update(doc.ref, { read: true }));
    await batch.commit();

    res.json({ message: 'All notifications marked as read', updated: snap.size });
  } catch (err: any) {
    console.error('[markAllAsRead]', err);
    res.status(500).json({ error: 'Failed to mark all as read', details: err.message });
  }
}
