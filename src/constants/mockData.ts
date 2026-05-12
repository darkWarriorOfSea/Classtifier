import { Course, AttendanceRecord, Notification } from '../types';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    name: 'Advanced Algorithms',
    code: 'CS401',
    type: 'Lecture',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    location: 'Room 302, Sci-Tech Building',
    instructor: 'Dr. Alan Smith',
    color: '#6366F1',
    status: 'Upcoming'
  },
  {
    id: '2',
    name: 'Physics Practical',
    code: 'PH202',
    type: 'Lab',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    location: 'Lab 4B, Quantum Wing',
    instructor: 'Prof. Sarah Jones',
    color: '#10B981',
    status: 'Upcoming'
  },
  {
    id: '3',
    name: 'Modern Ethics',
    code: 'HU303',
    type: 'Seminar',
    startTime: '02:30 PM',
    endTime: '04:00 PM',
    location: 'Hall B, Humanities',
    instructor: 'Dr. Emily Watson',
    color: '#F59E0B',
    status: 'Upcoming'
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { courseId: 'cf', courseName: 'Cloud Foundations', percentage: 88, attended: 22, total: 25, color: '#6366F1' },
  { courseId: 'sp', courseName: 'Semiconductor Physics', percentage: 76, attended: 19, total: 25, color: '#10B981' },
  { courseId: 'oops', courseName: 'OOPs with Java', percentage: 92, attended: 23, total: 25, color: '#EC4899' },
  { courseId: 'stats', courseName: 'Statistics', percentage: 80, attended: 20, total: 25, color: '#06B6D4' }
];

export interface CompletedCourse {
  id: string;
  name: string;
  grade: string;
  completionDate: string;
  color: string;
}

export const MOCK_COURSE_HISTORY: CompletedCourse[] = [
  { id: 'ch1', name: 'Introduction to Programming', grade: 'A', completionDate: 'Dec 2025', color: '#6366F1' },
  { id: 'ch2', name: 'Discrete Mathematics', grade: 'B+', completionDate: 'Dec 2025', color: '#10B981' },
  { id: 'ch3', name: 'Digital Logic Design', grade: 'A-', completionDate: 'Dec 2025', color: '#F59E0B' },
  { id: 'ch4', name: 'Communication Skills', grade: 'A', completionDate: 'Oct 2025', color: '#EC4899' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Grade Posted', description: 'Your final grade for CS301 has been published.', time: '2m', type: 'grade', read: false },
  { id: '2', title: 'Assignment Overdue', description: 'Project Milestone 2 was due 1 hour ago.', time: '1h', type: 'assignment', read: true },
  { id: '3', title: 'Schedule Updated', description: 'Tuesday lab session moved to Room 402.', time: '4h', type: 'alert', read: true }
];
