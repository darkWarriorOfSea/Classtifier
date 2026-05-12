import { Response } from 'express';
import { FieldValue } from '../mockFieldValue';
import { usersCol } from '../firebase';
import { AuthenticatedRequest, SyncUserBody, UpdateProfileBody, FirestoreUser } from '../types';
import { sanitize } from '../middleware/validate';

/**
 * POST /api/users/sync
 * Create or update a user profile in Firestore, synced from Clerk.
 * Called on first login or when user data changes.
 */
export async function syncUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const clerkId = req.auth!.userId;
    const { email, name, role, college, course, year, avatar } = req.body as SyncUserBody;

    if (!email || !name || !role) {
      res.status(400).json({ error: 'email, name, and role are required' });
      return;
    }

    // Check if user already exists
    const existing = await usersCol.where('clerkId', '==', clerkId).limit(1).get();

    if (!existing.empty) {
      // Update existing profile
      const docRef = existing.docs[0].ref;
      await docRef.update({
        email,
        name: sanitize(name),
        role,
        ...(college && { college: sanitize(college) }),
        ...(course && { course: sanitize(course) }),
        ...(year && { year }),
        ...(avatar && { avatar }),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updated = await docRef.get();
      res.json({ id: docRef.id, ...updated.data() });
      return;
    }

    // Create new user document
    const userData: FirestoreUser = {
      clerkId,
      email,
      name: sanitize(name),
      role,
      ...(college && { college: sanitize(college) }),
      ...(course && { course: sanitize(course) }),
      ...(year && { year }),
      ...(avatar && { avatar }),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await usersCol.add(userData);
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (err: any) {
    console.error('[syncUser]', err);
    res.status(500).json({ error: 'Failed to sync user', details: err.message });
  }
}

/**
 * GET /api/users/me
 * Get the current authenticated user's profile.
 */
export async function getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const clerkId = req.auth!.userId;
    const snap = await usersCol.where('clerkId', '==', clerkId).limit(1).get();

    if (snap.empty) {
      res.status(404).json({ error: 'User profile not found. Call POST /api/users/sync first.' });
      return;
    }

    const doc = snap.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (err: any) {
    console.error('[getCurrentUser]', err);
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
}

/**
 * PATCH /api/users/me
 * Update the current user's profile.
 */
export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const clerkId = req.auth!.userId;
    const { name, college, course, year, avatar, role } = req.body as UpdateProfileBody;

    const snap = await usersCol.where('clerkId', '==', clerkId).limit(1).get();
    if (snap.empty) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    const docRef = snap.docs[0].ref;
    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (name) updates.name = sanitize(name);
    if (college) updates.college = sanitize(college);
    if (course) updates.course = sanitize(course);
    if (year) updates.year = year;
    if (avatar) updates.avatar = avatar;
    if (role) updates.role = role;

    await docRef.update(updates);

    const updated = await docRef.get();
    res.json({ id: docRef.id, ...updated.data() });
  } catch (err: any) {
    console.error('[updateProfile]', err);
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
}
