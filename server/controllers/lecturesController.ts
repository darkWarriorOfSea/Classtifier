import { Response } from 'express';
import { FieldValue } from '../mockFieldValue';
import { lecturesCol } from '../firebase';
import { AuthenticatedRequest, CreateLectureBody, FirestoreLecture } from '../types';
import { sanitize, isValidDate, isValidTime } from '../middleware/validate';

/**
 * GET /api/lectures
 * Fetch all lectures, optionally filtered by section or date.
 * Query params: ?section=Section+1&date=2026-05-12
 */
export async function getLectures(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let query: any = lecturesCol.orderBy('date', 'desc');

    if (req.query.section) {
      query = query.where('section', '==', req.query.section);
    }
    if (req.query.date) {
      query = query.where('date', '==', req.query.date);
    }
    if (req.query.teacherId) {
      query = query.where('teacherId', '==', req.query.teacherId);
    }

    const snap = await query.limit(100).get();
    const lectures = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ lectures, count: lectures.length });
  } catch (err: any) {
    console.error('[getLectures]', err);
    res.status(500).json({ error: 'Failed to fetch lectures', details: err.message });
  }
}

/**
 * POST /api/lectures
 * Create a new lecture (teacher/admin only).
 */
export async function createLecture(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, subject, section, startTime, endTime, location, date, type } = req.body as CreateLectureBody;

    // Extra validation
    if (!isValidDate(date)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      return;
    }
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      res.status(400).json({ error: 'Invalid time format. Use HH:MM or HH:MM AM/PM.' });
      return;
    }

    const lectureData: FirestoreLecture = {
      title: sanitize(title),
      subject: sanitize(subject),
      teacherId: req.auth!.userId,
      section: sanitize(section),
      startTime,
      endTime,
      location: sanitize(location),
      date,
      type: type || 'Lecture',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await lecturesCol.add(lectureData);
    res.status(201).json({ id: docRef.id, ...lectureData });
  } catch (err: any) {
    console.error('[createLecture]', err);
    res.status(500).json({ error: 'Failed to create lecture', details: err.message });
  }
}

/**
 * PATCH /api/lectures/:id
 * Edit an existing lecture (teacher/admin only, must be owner).
 */
export async function editLecture(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const docRef = lecturesCol.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Lecture not found' });
      return;
    }

    // Ownership check — only the creator or admin can edit
    const data = doc.data() as FirestoreLecture;
    if (data.teacherId !== req.auth!.userId && req.appUser?.role !== 'admin') {
      res.status(403).json({ error: 'You can only edit your own lectures' });
      return;
    }

    const updates: Record<string, any> = { updatedAt: FieldValue.serverTimestamp() };
    const { title, subject, section, startTime, endTime, location, date, type } = req.body;

    if (title) updates.title = sanitize(title);
    if (subject) updates.subject = sanitize(subject);
    if (section) updates.section = sanitize(section);
    if (startTime) updates.startTime = startTime;
    if (endTime) updates.endTime = endTime;
    if (location) updates.location = sanitize(location);
    if (date) {
      if (!isValidDate(date)) {
        res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        return;
      }
      updates.date = date;
    }
    if (type) updates.type = type;

    await docRef.update(updates);
    const updated = await docRef.get();
    res.json({ id: docRef.id, ...updated.data() });
  } catch (err: any) {
    console.error('[editLecture]', err);
    res.status(500).json({ error: 'Failed to edit lecture', details: err.message });
  }
}

/**
 * DELETE /api/lectures/:id
 * Delete a lecture (teacher/admin only, must be owner).
 */
export async function deleteLecture(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const docRef = lecturesCol.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Lecture not found' });
      return;
    }

    const data = doc.data() as FirestoreLecture;
    if (data.teacherId !== req.auth!.userId && req.appUser?.role !== 'admin') {
      res.status(403).json({ error: 'You can only delete your own lectures' });
      return;
    }

    await docRef.delete();
    res.json({ message: 'Lecture deleted successfully', id });
  } catch (err: any) {
    console.error('[deleteLecture]', err);
    res.status(500).json({ error: 'Failed to delete lecture', details: err.message });
  }
}
