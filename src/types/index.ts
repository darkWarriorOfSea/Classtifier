export interface Course {
  id: string;
  name: string;
  code: string;
  type: 'Lecture' | 'Lab' | 'Seminar' | 'Office Hours' | 'Training' | 'Break';
  startTime: string;
  endTime: string;
  location: string;
  instructor?: string;
  color: string;
  status?: 'Completed' | 'Upcoming' | 'Active';
}

export interface AttendanceRecord {
  courseId: string;
  courseName: string;
  percentage: number;
  attended: number;
  total: number;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'grade' | 'assignment' | 'alert' | 'event';
  read: boolean;
}
