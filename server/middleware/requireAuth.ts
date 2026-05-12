import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { usersCol } from '../firebase';

/**
 * Clerk authentication middleware.
 * Verifies the session token from the Authorization header and
 * attaches the Firestore user profile to `req.appUser`.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // The @clerk/express middleware (clerkMiddleware) populates req.auth
    const authUserId = req.auth?.userId;

    if (!authUserId) {
      res.status(401).json({ error: 'Unauthorized — no valid session' });
      return;
    }

    // Fetch the app-level user profile from Firestore
    const userSnap = await usersCol.where('clerkId', '==', authUserId).limit(1).get();

    if (!userSnap.empty) {
      req.appUser = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() } as any;
    }

    next();
  } catch (err: any) {
    console.error('[requireAuth] Error:', err.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
