import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';

// Load environment variables
dotenv.config({ path: '.env' });

// Import routes
import usersRoutes from './routes/users';
import lecturesRoutes from './routes/lectures';
import labsRoutes from './routes/labs';
import announcementsRoutes from './routes/announcements';
import notificationsRoutes from './routes/notifications';
import attendanceRoutes from './routes/attendance';

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Global Middleware ────────────────────────────────────────────────────────

// CORS — allow the Vite dev server (port 3000) and production origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Clerk middleware — populates req.auth on every request
app.use(clerkMiddleware());

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/users',         usersRoutes);
app.use('/api/lectures',      lecturesRoutes);
app.use('/api/labs',          labsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/attendance',    attendanceRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      clerk: !!process.env.CLERK_SECRET_KEY,
      firebase: !!(process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_APPLICATION_CREDENTIALS),
    },
  });
});

// ─── API Docs (list all available endpoints) ──────────────────────────────────

app.get('/api', (_req, res) => {
  res.json({
    name: 'Classtifier API',
    version: '1.0.0',
    endpoints: {
      users: {
        'POST /api/users/sync':   'Sync Clerk user to Firestore',
        'GET /api/users/me':      'Get current user profile',
        'PATCH /api/users/me':    'Update current user profile',
      },
      lectures: {
        'GET /api/lectures':       'Fetch all lectures',
        'POST /api/lectures':      'Create a lecture (teacher/admin)',
        'PATCH /api/lectures/:id': 'Edit a lecture (owner/admin)',
        'DELETE /api/lectures/:id':'Delete a lecture (owner/admin)',
      },
      labs: {
        'GET /api/labs':       'Fetch all labs',
        'POST /api/labs':      'Create a lab (teacher/admin)',
        'PATCH /api/labs/:id': 'Edit a lab (owner/admin)',
        'DELETE /api/labs/:id':'Delete a lab (owner/admin)',
      },
      announcements: {
        'GET /api/announcements':       'Fetch all announcements',
        'POST /api/announcements':      'Publish announcement (teacher/admin)',
        'DELETE /api/announcements/:id': 'Delete announcement (author/admin)',
      },
      notifications: {
        'GET /api/notifications':             'Fetch user notifications',
        'GET /api/notifications/unread-count': 'Get unread badge count',
        'POST /api/notifications':            'Send notification (teacher/admin)',
        'POST /api/notifications/broadcast':  'Broadcast to all (teacher/admin)',
        'PATCH /api/notifications/:id/read':  'Mark one as read',
        'PATCH /api/notifications/read-all':  'Mark all as read',
      },
      attendance: {
        'GET /api/attendance':  'Fetch attendance records',
        'POST /api/attendance': 'Mark attendance (teacher/admin)',
      },
      health: {
        'GET /api/health': 'Server health check',
      },
    },
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found', hint: 'GET /api for available endpoints' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { details: err.message, stack: err.stack }),
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║        🎓 Classtifier API Server v1.0.0           ║
║────────────────────────────────────────────────────║
║  Port:     ${String(PORT).padEnd(38)}║
║  Env:      ${(process.env.NODE_ENV || 'development').padEnd(38)}║
║  Clerk:    ${(process.env.CLERK_SECRET_KEY ? '✅ Connected' : '❌ Missing key').padEnd(38)}║
║  Firebase: ${(process.env.FIREBASE_PROJECT_ID ? '✅ Connected' : '⚠️  Using ADC').padEnd(38)}║
║────────────────────────────────────────────────────║
║  API Docs: http://localhost:${PORT}/api${' '.repeat(Math.max(0, 18 - String(PORT).length))}║
║  Health:   http://localhost:${PORT}/api/health${' '.repeat(Math.max(0, 11 - String(PORT).length))}║
╚════════════════════════════════════════════════════╝
  `);
});

export default app;
