import { Response } from 'express';
import { FieldValue } from '../mockFieldValue';
import { announcementsCol } from '../firebase';
import { AuthenticatedRequest, CreateAnnouncementBody, FirestoreAnnouncement } from '../types';
import { sanitize } from '../middleware/validate';

/**
 * GET /api/announcements
 * Fetch all announcements, ordered by newest first.
 * Optionally filter by targetRole: ?targetRole=student
 */
export async function getAnnouncements(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let query: any = announcementsCol.orderBy('createdAt', 'desc');

    if (req.query.targetRole) {
      query = query.where('targetRole', 'in', [req.query.targetRole, 'all']);
    }

    const snap = await query.limit(100).get();
    const announcements = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ announcements, count: announcements.length });
  } catch (err: any) {
    console.error('[getAnnouncements]', err);
    res.status(500).json({ error: 'Failed to fetch announcements', details: err.message });
  }
}

/**
 * POST /api/announcements
 * Publish a new announcement (teacher/admin only).
 */
export async function createAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, body, targetRole } = req.body as CreateAnnouncementBody;

    const announcementData: FirestoreAnnouncement = {
      title: sanitize(title),
      body: sanitize(body),
      authorId: req.auth!.userId,
      authorName: req.appUser?.name || 'Unknown',
      targetRole: targetRole || 'all',
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await announcementsCol.add(announcementData);
    res.status(201).json({ id: docRef.id, ...announcementData });
  } catch (err: any) {
    console.error('[createAnnouncement]', err);
    res.status(500).json({ error: 'Failed to create announcement', details: err.message });
  }
}

/**
 * DELETE /api/announcements/:id
 * Delete an announcement (teacher/admin only, must be author or admin).
 */
export async function deleteAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const docRef = announcementsCol.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }

    const data = doc.data() as FirestoreAnnouncement;
    if (data.authorId !== req.auth!.userId && req.appUser?.role !== 'admin') {
      res.status(403).json({ error: 'You can only delete your own announcements' });
      return;
    }

    await docRef.delete();
    res.json({ message: 'Announcement deleted successfully', id });
  } catch (err: any) {
    console.error('[deleteAnnouncement]', err);
    res.status(500).json({ error: 'Failed to delete announcement', details: err.message });
  }
}
