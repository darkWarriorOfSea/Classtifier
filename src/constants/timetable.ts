export interface ScheduleEntry {
  id: string;
  name: string;
  type: 'Lecture' | 'Lab' | 'Training' | 'Break';
  startTime: string;
  endTime: string;
  location: string;
  instructor?: string;
  color: string;
}

export const SUBJECTS = {
  CF: { name: 'Cloud Foundations', instructor: 'Namrita Singh', color: '#6366F1' },
  SP: { name: 'Semiconductor Physics', instructor: 'K. Vasudevan', color: '#10B981' },
  ACS: { name: 'Awareness on Cybersecurity', instructor: 'Namrita Singh', color: '#F59E0B' },
  OOPS: { name: 'Object Oriented Programming', instructor: 'Harsha Desai', color: '#EC4899' },
  BE: { name: 'Basic English', instructor: 'Radhika Sharma', color: '#8B5CF6' },
  STATS: { name: 'Statistics', instructor: 'Ashok Tejwani', color: '#06B6D4' },
  TRAINING: { name: 'DSA Training', instructor: 'Training Team', color: '#F97316' },
  ICT: { name: 'ICT', instructor: 'K. Vasudevan', color: '#14B8A6' },
  EVS: { name: 'Environmental Studies', instructor: "MC Ma'am", color: '#F59E0B' },
};

export const WEEKLY_SCHEDULE: Record<string, Record<number, ScheduleEntry[]>> = {
  'Section 1': {
    0: [ // Monday
      { id: 'm1', name: SUBJECTS.CF.name, type: 'Lecture', startTime: '09:30 AM', endTime: '10:30 AM', location: 'Room 102', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.CF.color },
      { id: 'm2', name: SUBJECTS.STATS.name, type: 'Lecture', startTime: '10:30 AM', endTime: '11:30 AM', location: 'Room 102', instructor: SUBJECTS.STATS.instructor, color: SUBJECTS.STATS.color },
      { id: 'm3', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'm4', name: 'SP Lab B1 / OOPS Lab B2', type: 'Lab', startTime: '11:45 AM', endTime: '01:45 PM', location: 'Lab 126/103', instructor: 'K. Vasudevan / Harsha Desai', color: '#10B981' },
      { id: 'm5', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'm6', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '02:30 PM', endTime: '04:30 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
    ],
    1: [ // Tuesday
      { id: 't1', name: 'Basic English Lab', type: 'Lab', startTime: '09:30 AM', endTime: '11:30 AM', location: 'Room 102', instructor: SUBJECTS.BE.instructor, color: SUBJECTS.BE.color },
      { id: 't2', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 't3', name: SUBJECTS.BE.name, type: 'Lecture', startTime: '11:45 AM', endTime: '12:45 PM', location: 'Room 102', instructor: SUBJECTS.BE.instructor, color: SUBJECTS.BE.color },
      { id: 't4', name: SUBJECTS.EVS.name, type: 'Lecture', startTime: '12:45 PM', endTime: '01:45 PM', location: 'Room 102', instructor: SUBJECTS.EVS.instructor, color: SUBJECTS.EVS.color },
      { id: 't5', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 't6', name: SUBJECTS.OOPS.name, type: 'Lecture', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Room 102', instructor: SUBJECTS.OOPS.instructor, color: SUBJECTS.OOPS.color },
      { id: 't7', name: SUBJECTS.SP.name, type: 'Lecture', startTime: '03:30 PM', endTime: '04:30 PM', location: 'Room 102', instructor: SUBJECTS.SP.instructor, color: SUBJECTS.SP.color },
    ],
    2: [ // Wednesday
      { id: 'w1', name: 'ICT B1 / CF Lab B2', type: 'Lab', startTime: '09:30 AM', endTime: '11:30 AM', location: 'Lab 113/103', instructor: 'K. Vasudevan / Namrita Singh', color: SUBJECTS.ICT.color },
      { id: 'w2', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'w3', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '11:45 AM', endTime: '01:45 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
      { id: 'w4', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'w5', name: SUBJECTS.SP.name, type: 'Lecture', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Room 102', instructor: SUBJECTS.SP.instructor, color: SUBJECTS.SP.color },
      { id: 'w6', name: SUBJECTS.CF.name, type: 'Lecture', startTime: '03:30 PM', endTime: '04:30 PM', location: 'Room 102', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.CF.color },
    ],
    3: [ // Thursday
      { id: 'r1', name: SUBJECTS.ACS.name, type: 'Lecture', startTime: '09:30 AM', endTime: '10:30 AM', location: 'Room 102', instructor: SUBJECTS.ACS.instructor, color: SUBJECTS.ACS.color },
      { id: 'r2', name: SUBJECTS.STATS.name, type: 'Lecture', startTime: '10:30 AM', endTime: '11:30 AM', location: 'Room 102', instructor: SUBJECTS.STATS.instructor, color: SUBJECTS.STATS.color },
      { id: 'r3', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'r4', name: 'SP Lab Batch-2 / OOPS Lab Batch-1', type: 'Lab', startTime: '11:45 AM', endTime: '01:45 PM', location: 'Lab 126/103', instructor: 'K. Vasudevan / Harsha Desai', color: '#10B981' },
      { id: 'r5', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'r6', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '02:30 PM', endTime: '04:30 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
    ],
    4: [ // Friday
      { id: 'f1', name: SUBJECTS.ACS.name, type: 'Lecture', startTime: '09:30 AM', endTime: '10:30 AM', location: 'Room 102', instructor: SUBJECTS.ACS.instructor, color: SUBJECTS.ACS.color },
      { id: 'f2', name: SUBJECTS.CF.name, type: 'Lecture', startTime: '10:30 AM', endTime: '11:30 AM', location: 'Room 102', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.CF.color },
      { id: 'f3', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'f4', name: SUBJECTS.STATS.name, type: 'Lecture', startTime: '11:45 AM', endTime: '12:45 PM', location: 'Room 102', instructor: SUBJECTS.STATS.instructor, color: SUBJECTS.STATS.color },
      { id: 'f5', name: SUBJECTS.OOPS.name, type: 'Lecture', startTime: '12:45 PM', endTime: '01:45 PM', location: 'Room 102', instructor: SUBJECTS.OOPS.instructor, color: SUBJECTS.OOPS.color },
      { id: 'f6', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 'f7', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '02:30 PM', endTime: '04:30 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
    ],
  },
  'Section 2': {
    0: [ // Monday
      { id: 's2m1', name: 'Basic English Lab', type: 'Lab', startTime: '09:30 AM', endTime: '11:30 AM', location: 'Room 104', instructor: SUBJECTS.BE.instructor, color: SUBJECTS.BE.color },
      { id: 's2m2', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2m3', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '11:45 AM', endTime: '01:45 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
      { id: 's2m4', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2m5', name: SUBJECTS.STATS.name, type: 'Lecture', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Room 104', instructor: SUBJECTS.STATS.instructor, color: SUBJECTS.STATS.color },
      { id: 's2m6', name: SUBJECTS.CF.name, type: 'Lecture', startTime: '03:30 PM', endTime: '04:30 PM', location: 'Room 104', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.CF.color },
    ],
    1: [ // Tuesday
      { id: 's2t1', name: 'ICT Lab', type: 'Lab', startTime: '09:30 AM', endTime: '10:30 AM', location: 'Lab 113', instructor: SUBJECTS.ICT.instructor, color: SUBJECTS.ICT.color },
      { id: 's2t2', name: 'CF Lab', type: 'Lab', startTime: '10:30 AM', endTime: '11:30 AM', location: 'Room 104', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.CF.color },
      { id: 's2t3', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2t4', name: 'OOPS Lab', type: 'Lab', startTime: '11:45 AM', endTime: '01:45 PM', location: 'Lab 103', instructor: SUBJECTS.OOPS.instructor, color: SUBJECTS.OOPS.color },
      { id: 's2t5', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2t6', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '02:30 PM', endTime: '04:30 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
    ],
    2: [ // Wednesday
      { id: 's2w1', name: SUBJECTS.EVS.name, type: 'Lecture', startTime: '09:30 AM', endTime: '10:30 AM', location: 'Room 104', instructor: SUBJECTS.EVS.instructor, color: SUBJECTS.EVS.color },
      { id: 's2w2', name: SUBJECTS.STATS.name, type: 'Lecture', startTime: '10:30 AM', endTime: '11:30 AM', location: 'Room 104', instructor: SUBJECTS.STATS.instructor, color: SUBJECTS.STATS.color },
      { id: 's2w3', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2w4', name: SUBJECTS.BE.name, type: 'Lecture', startTime: '11:45 AM', endTime: '12:45 PM', location: 'Room 102', instructor: SUBJECTS.BE.instructor, color: SUBJECTS.BE.color },
      { id: 's2w5', name: SUBJECTS.SP.name, type: 'Lecture', startTime: '12:45 PM', endTime: '01:45 PM', location: 'Room 104', instructor: SUBJECTS.SP.instructor, color: SUBJECTS.SP.color },
      { id: 's2w6', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2w7', name: 'Awareness on Cybersecurity', type: 'Lecture', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Room 104', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.ACS.color },
      { id: 's2w8', name: SUBJECTS.OOPS.name, type: 'Lecture', startTime: '03:30 PM', endTime: '04:30 PM', location: 'Room 104', instructor: SUBJECTS.OOPS.instructor, color: SUBJECTS.OOPS.color },
    ],
    3: [ // Thursday
      { id: 's2r1', name: SUBJECTS.STATS.name, type: 'Lecture', startTime: '09:30 AM', endTime: '10:30 AM', location: 'Room 104', instructor: SUBJECTS.STATS.instructor, color: SUBJECTS.STATS.color },
      { id: 's2r2', name: SUBJECTS.CF.name, type: 'Lecture', startTime: '10:30 AM', endTime: '11:30 AM', location: 'Room 104', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.CF.color },
      { id: 's2r3', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2r4', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '11:45 AM', endTime: '01:45 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
      { id: 's2r5', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2r6', name: 'SP Lab', type: 'Lab', startTime: '02:30 PM', endTime: '04:30 PM', location: 'Lab 126', instructor: SUBJECTS.SP.instructor, color: SUBJECTS.SP.color },
    ],
    4: [ // Friday
      { id: 's2f1', name: SUBJECTS.CF.name, type: 'Lecture', startTime: '09:30 AM', endTime: '10:30 AM', location: 'Room 104', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.CF.color },
      { id: 's2f2', name: SUBJECTS.OOPS.name, type: 'Lecture', startTime: '10:30 AM', endTime: '11:30 AM', location: 'Room 104', instructor: SUBJECTS.OOPS.instructor, color: SUBJECTS.OOPS.color },
      { id: 's2f3', name: 'Recess', type: 'Break', startTime: '11:30 AM', endTime: '11:45 AM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2f4', name: SUBJECTS.TRAINING.name, type: 'Training', startTime: '11:45 AM', endTime: '01:45 PM', location: 'Auditorium', instructor: SUBJECTS.TRAINING.instructor, color: SUBJECTS.TRAINING.color },
      { id: 's2f5', name: 'Lunch Break', type: 'Break', startTime: '01:45 PM', endTime: '02:30 PM', location: 'Cafeteria', color: '#CBD5E1' },
      { id: 's2f6', name: 'Awareness on Cybersecurity', type: 'Lecture', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Room 104', instructor: SUBJECTS.CF.instructor, color: SUBJECTS.ACS.color },
      { id: 's2f7', name: SUBJECTS.SP.name, type: 'Lecture', startTime: '03:30 PM', endTime: '04:30 PM', location: 'Room 104', instructor: SUBJECTS.SP.instructor, color: SUBJECTS.SP.color },
    ],
  }
};

