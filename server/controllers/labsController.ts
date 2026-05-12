import { Response } from 'express';
import { FieldValue } from '../mockFieldValue';
import { labsCol } from '../firebase';
import { AuthenticatedRequest, CreateLabBody, FirestoreLab } from '../types';
import { sanitize, isValidDate, isValidTime } from '../middleware/validate';

/**
 * GET /api/labs
 * Fetch all labs, optionally filtered by section or date.
 */
export async function getLabs(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let query: any = labsCol.orderBy('date', 'desc');

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
    const labs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ labs, count: labs.length });
  } catch (err: any) {
    console.error('[getLabs]', err);
    res.status(500).json({ error: 'Failed to fetch labs', details: err.message });
  }
}

/**
 * POST /api/labs
 * Create a new lab session (teacher/admin only).
 */
export async function createLab(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, subject, section, startTime, endTime, location, date, type } = req.body as CreateLabBody;

    if (!isValidDate(date)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      return;
    }
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      res.status(400).json({ error: 'Invalid time format. Use HH:MM or HH:MM AM/PM.' });
      return;
    }

    const labData: FirestoreLab = {
      title: sanitize(title),
      subject: sanitize(subject),
      teacherId: req.auth!.userId,
      section: sanitize(section),
      startTime,
      endTime,
      location: sanitize(location),
      date,
      type: type || 'Lab',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await labsCol.add(labData);
    res.status(201).json({ id: docRef.id, ...labData });
  } catch (err: any) {
    console.error('[createLab]', err);
    res.status(500).json({ error: 'Failed to create lab', details: err.message });
  }
}

/**
 * PATCH /api/labs/:id
 * Edit an existing lab (teacher/admin only, must be owner).
 */
export async function editLab(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const docRef = labsCol.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Lab not found' });
      return;
    }

    const data = doc.data() as FirestoreLab;
    if (data.teacherId !== req.auth!.userId && req.appUser?.role !== 'admin') {
      res.status(403).json({ error: 'You can only edit your own labs' });
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
    console.error('[editLab]', err);
    res.status(500).json({ error: 'Failed to edit lab', details: err.message });
  }
}

/**
 * DELETE /api/labs/:id
 * Delete a lab (teacher/admin only, must be owner).
 */
export async function deleteLab(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const docRef = labsCol.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Lab not found' });
      return;
    }

    const data = doc.data() as FirestoreLab;
    if (data.teacherId !== req.auth!.userId && req.appUser?.role !== 'admin') {
      res.status(403).json({ error: 'You can only delete your own labs' });
      return;
    }

    await docRef.delete();
    res.json({ message: 'Lab deleted successfully', id });
  } catch (err: any) {
    console.error('[deleteLab]', err);
    res.status(500).json({ error: 'Failed to delete lab', details: err.message });
  }
}
