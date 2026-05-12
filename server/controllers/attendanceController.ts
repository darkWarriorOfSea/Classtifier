import { Response } from 'express';
import { FieldValue } from '../mockFieldValue';
import { attendanceCol } from '../firebase';
import { AuthenticatedRequest, MarkAttendanceBody, FirestoreAttendance } from '../types';

/**
 * POST /api/attendance
 * Mark attendance for a student (teacher/admin only).
 * Supports bulk marking by accepting an array of records.
 */
export async function markAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const records: MarkAttendanceBody[] = Array.isArray(req.body) ? req.body : [req.body];

    // Validate all records
    for (const record of records) {
      if (!record.studentId || !record.status) {
        res.status(400).json({ error: 'Each record must have studentId and status' });
        return;
      }
      if (!record.lectureId && !record.labId) {
        res.status(400).json({ error: 'Each record must have either lectureId or labId' });
        return;
      }
      if (!['present', 'absent', 'late'].includes(record.status)) {
        res.status(400).json({ error: 'status must be one of: present, absent, late' });
        return;
      }
    }

    const batch = attendanceCol.firestore.batch();
    const createdIds: string[] = [];

    for (const record of records) {
      // Check for existing attendance to prevent duplicates
      const existingQuery = attendanceCol
        .where('studentId', '==', record.studentId)
        .where(record.lectureId ? 'lectureId' : 'labId', '==', record.lectureId || record.labId)
        .limit(1);

      const existingSnap = await existingQuery.get();

      if (!existingSnap.empty) {
        // Update existing record
        const existingDoc = existingSnap.docs[0];
        batch.update(existingDoc.ref, {
          status: record.status,
          teacherId: req.auth!.userId,
          markedAt: FieldValue.serverTimestamp(),
        });
        createdIds.push(existingDoc.id);
      } else {
        // Create new record
        const attData: FirestoreAttendance = {
          studentId: record.studentId,
          teacherId: req.auth!.userId,
          status: record.status,
          ...(record.lectureId && { lectureId: record.lectureId }),
          ...(record.labId && { labId: record.labId }),
          markedAt: FieldValue.serverTimestamp(),
        };

        const newRef = attendanceCol.doc();
        batch.set(newRef, attData);
        createdIds.push(newRef.id);
      }
    }

    await batch.commit();
    res.status(201).json({
      message: `Attendance marked for ${records.length} student(s)`,
      ids: createdIds,
    });
  } catch (err: any) {
    console.error('[markAttendance]', err);
    res.status(500).json({ error: 'Failed to mark attendance', details: err.message });
  }
}

/**
 * GET /api/attendance
 * Fetch attendance records.
 * - Teachers see all records (optionally filtered by lectureId/labId)
 * - Students see only their own records
 *
 * Query params: ?lectureId=xxx&labId=xxx&studentId=xxx&date=2026-05-12
 */
export async function getAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userRole = req.appUser?.role;
    const clerkId = req.auth!.userId;

    let query: any = attendanceCol;

    // Students can only see their own records
    if (userRole === 'student') {
      query = query.where('studentId', '==', clerkId);
    } else {
      // Teachers/admins can filter by studentId
      if (req.query.studentId) {
        query = query.where('studentId', '==', req.query.studentId);
      }
    }

    // Filter by lecture or lab
    if (req.query.lectureId) {
      query = query.where('lectureId', '==', req.query.lectureId);
    }
    if (req.query.labId) {
      query = query.where('labId', '==', req.query.labId);
    }

    const snap = await query.limit(200).get();
    const records = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Compute summary statistics
    const total = records.length;
    const present = records.filter((r: any) => r.status === 'present').length;
    const absent = records.filter((r: any) => r.status === 'absent').length;
    const late = records.filter((r: any) => r.status === 'late').length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    res.json({
      records,
      count: total,
      summary: { present, absent, late, percentage },
    });
  } catch (err: any) {
    console.error('[getAttendance]', err);
    res.status(500).json({ error: 'Failed to fetch attendance', details: err.message });
  }
}
