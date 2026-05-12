import { Request } from 'express';

// Use `any` for timestamp fields — works with both mock and real Firestore
type FieldValueType = any;
type TimestampType = any;

export type UserRole = 'student' | 'teacher' | 'admin';

export interface ClerkUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
  };
  appUser?: FirestoreUser;
}

// ─── Firestore Document Types ─────────────────────────────────────────────────

export interface FirestoreUser {
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  college?: string;
  course?: string;
  year?: string;
  avatar?: string;
  createdAt: TimestampType | FieldValueType;
  updatedAt: TimestampType | FieldValueType;
}

export interface FirestoreLecture {
  title: string;
  subject: string;
  teacherId: string;
  section: string;
  startTime: string;
  endTime: string;
  location: string;
  date: string;           // ISO date string YYYY-MM-DD
  type: 'Lecture' | 'Lab' | 'Tutorial';
  createdAt: TimestampType | FieldValueType;
  updatedAt: TimestampType | FieldValueType;
}

export interface FirestoreLab {
  title: string;
  subject: string;
  teacherId: string;
  section: string;
  startTime: string;
  endTime: string;
  location: string;
  date: string;
  type: 'Lab' | 'Practical';
  createdAt: TimestampType | FieldValueType;
  updatedAt: TimestampType | FieldValueType;
}

export interface FirestoreAnnouncement {
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  targetRole: UserRole | 'all';
  createdAt: TimestampType | FieldValueType;
}

export interface FirestoreNotification {
  userId: string;           // recipient
  title: string;
  body: string;
  type: 'grade' | 'assignment' | 'alert' | 'announcement' | 'attendance';
  read: boolean;
  relatedId?: string;       // lecture/lab/announcement doc id
  createdAt: TimestampType | FieldValueType;
}

export interface FirestoreAttendance {
  lectureId?: string;
  labId?: string;
  studentId: string;
  teacherId: string;
  status: 'present' | 'absent' | 'late';
  markedAt: TimestampType | FieldValueType;
}

// ─── Request Body Types ───────────────────────────────────────────────────────

export interface CreateLectureBody {
  title: string;
  subject: string;
  section: string;
  startTime: string;
  endTime: string;
  location: string;
  date: string;
  type?: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface CreateLabBody {
  title: string;
  subject: string;
  section: string;
  startTime: string;
  endTime: string;
  location: string;
  date: string;
  type?: 'Lab' | 'Practical';
}

export interface CreateAnnouncementBody {
  title: string;
  body: string;
  targetRole?: UserRole | 'all';
}

export interface SendNotificationBody {
  userId: string;           // recipient Clerk ID
  title: string;
  body: string;
  type: 'grade' | 'assignment' | 'alert' | 'announcement' | 'attendance';
  relatedId?: string;
}

export interface MarkAttendanceBody {
  studentId: string;
  lectureId?: string;
  labId?: string;
  status: 'present' | 'absent' | 'late';
}

export interface SyncUserBody {
  email: string;
  name: string;
  role: UserRole;
  college?: string;
  course?: string;
  year?: string;
  avatar?: string;
}

export interface UpdateProfileBody {
  name?: string;
  college?: string;
  course?: string;
  year?: string;
  avatar?: string;
  role?: UserRole;
}
