import React from 'react';
import { Box, Typography, Avatar, Grid, Card, CardContent, IconButton, Button, Stack, Chip, Paper } from '@mui/material';
import { NotificationsNone, KeyboardArrowRight, SmartToy, CheckCircle, AccessTime, LocationOn } from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';
import CourseCard from '../components/ui/CourseCard';
import AttendanceWidget from '../components/ui/AttendanceWidget';
import { MOCK_ATTENDANCE, MOCK_COURSE_HISTORY } from '../constants/mockData';
import { WEEKLY_SCHEDULE } from '../constants/timetable';
import { motion } from 'framer-motion';

const StudentDashboard: React.FC = () => {
  const { user } = useAppStore();
  
  // Get today's schedule (Monday for demo if weekend)
  const currentDay = Math.max(0, Math.min(4, new Date().getDay() - 1));
  const section = 'Section 1'; // Default section
  const todaySchedule = WEEKLY_SCHEDULE[section][currentDay] || [];
  const nextClass = todaySchedule.find(e => e.type !== 'Break') || todaySchedule[0];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Hi {user?.name.split(' ')[0]} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
          </Typography>
        </Box>
        <IconButton sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          <NotificationsNone />
        </IconButton>
      </Box>

      {/* Next Class Hero */}
      {nextClass && (
        <Card sx={{ 
          mb: 4, 
          bgcolor: 'secondary.main', 
          color: 'white',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(30, 27, 75, 0.2)'
        }}>
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Chip label="NEXT UP" size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 800, fontSize: '0.6rem', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>{nextClass.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: 0.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{nextClass.startTime} - {nextClass.endTime}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOn sx={{ fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{nextClass.location}</Typography>
              </Box>
            </Box>
          </CardContent>
          <Box sx={{ 
            position: 'absolute', 
            right: -40, 
            bottom: -40, 
            width: 200, 
            height: 200, 
            bgcolor: 'primary.main', 
            borderRadius: '50%',
            opacity: 0.1,
            filter: 'blur(40px)'
          }} />
        </Card>
      )}

      {/* Attendance Snapshot */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Attendance Snapshot</Typography>
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 8, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
            {MOCK_ATTENDANCE.map((record) => (
              <AttendanceWidget 
                key={record.courseId}
                label={record.courseName.split(' ')[0]}
                percentage={record.percentage}
                color={record.color}
              />
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Today's Schedule */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Today's Schedule</Typography>
          <Button size="small" endIcon={<KeyboardArrowRight />}>View All</Button>
        </Box>
        <Stack spacing={2}>
          {todaySchedule.filter(e => e.type !== 'Break').map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <CourseCard course={{
                id: entry.id,
                name: entry.name,
                code: entry.id.startsWith('training') ? 'TRAIN' : (entry.name.length > 20 ? entry.name.split(' ').map(w => w[0]).join('').toUpperCase() : 'LECT'),
                type: entry.type as any,
                startTime: entry.startTime,
                endTime: entry.endTime,
                location: entry.location,
                instructor: entry.instructor,
                color: entry.color,
              }} />
            </motion.div>
          ))}
        </Stack>
      </Box>

      {/* Course History Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Course History</Typography>
          <Button size="small" endIcon={<KeyboardArrowRight />}>Show More</Button>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          overflowX: 'auto', 
          pb: 2, 
          px: 0.5, 
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {MOCK_COURSE_HISTORY.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card sx={{ 
                minWidth: 200, 
                flexShrink: 0, 
                borderRadius: 7, 
                border: '1px solid', 
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${course.color}15`, color: course.color, width: 36, height: 36 }}>
                      <CheckCircle sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Chip 
                      label={`Grade: ${course.grade}`} 
                      size="small" 
                      sx={{ 
                        fontWeight: 800, 
                        bgcolor: 'success.soft', 
                        color: 'success.main',
                        fontSize: '0.65rem'
                      }} 
                    />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.3, height: 40, overflow: 'hidden' }}>
                    {course.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Completed {course.completionDate}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
