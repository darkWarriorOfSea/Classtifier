import { Request, Response, NextFunction } from 'express';

/**
 * Generic input validation middleware factory.
 * Accepts a list of required field names and validates that they exist
 * and are non-empty in `req.body`.
 *
 * Usage:
 *   router.post('/lectures', validate('title', 'subject', 'date'), createLecture);
 */
export function validate(...requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing: string[] = [];

    for (const field of requiredFields) {
      const value = req.body[field];
      if (value === undefined || value === null || value === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      res.status(400).json({
        error: 'Validation failed — missing required fields',
        missing,
      });
      return;
    }

    next();
  };
}

/**
 * Sanitize a string value — trim whitespace and collapse multiple spaces.
 */
export function sanitize(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Validate that a date string is in YYYY-MM-DD format.
 */
export function isValidDate(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

/**
 * Validate a time string is in HH:MM format.
 */
export function isValidTime(timeStr: string): boolean {
  return /^\d{1,2}:\d{2}(\s?(AM|PM|am|pm))?$/.test(timeStr);
}
