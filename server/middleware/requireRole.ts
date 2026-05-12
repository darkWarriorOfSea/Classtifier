import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';

/**
 * Role-based access control middleware.
 * Must be used AFTER requireAuth so that `req.appUser` is populated.
 *
 * Usage:
 *   router.post('/lectures', requireAuth, requireRole('teacher', 'admin'), createLecture);
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRole = req.appUser?.role;

    if (!userRole) {
      res.status(403).json({
        error: 'Forbidden — user profile not found. Please sync your profile first.',
      });
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: `Forbidden — requires one of: [${allowedRoles.join(', ')}]. Your role: ${userRole}`,
      });
      return;
    }

    next();
  };
}
