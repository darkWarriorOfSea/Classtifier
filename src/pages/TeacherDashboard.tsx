import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Chip, IconButton, LinearProgress, Avatar, AvatarGroup, Paper } from '@mui/material';
import { Notifications, KeyboardArrowRight, Add, EventNote, People, BarChart } from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';
import CourseCard from '../components/ui/CourseCard';
import { WEEKLY_SCHEDULE } from '../constants/timetable';
import { motion } from 'framer-motion';

const TeacherDashboard: React.FC = () => {
  const { user, showToast, addNotification } = useAppStore();
  
  const currentDay = Math.max(0, Math.min(4, new Date().getDay() - 1));
  const section = 'Section 1'; // Default section
  const todaySchedule = (WEEKLY_SCHEDULE[section][currentDay] || []).filter(e => e.type !== 'Break');

  const teacherStats = [
    { label: 'Classes', value: todaySchedule.length.toString(), icon: <EventNote sx={{ color: 'primary.main' }} />, color: 'primary.main' },
    { label: 'Students', value: '142', icon: <People sx={{ color: 'success.main' }} />, color: 'success.main' },
    { label: 'Alerts', value: '2', icon: <Notifications sx={{ color: 'warning.main' }} />, color: 'warning.main' }
  ];

  const quickActions = [
    { label: 'Cancel Class', icon: '❌', color: '#EF4444', type: 'alert' as const, msg: 'Class has been cancelled.', toast: 'Class cancelled successfully.' },
    { label: 'Reschedule', icon: '🕒', color: '#F59E0B', type: 'event' as const, msg: 'Class rescheduled. Please check your timetable.', toast: 'Class rescheduled.' },
    { label: 'Attendance', icon: '📝', color: '#10B981', type: 'alert' as const, msg: 'Attendance is low for some students.', toast: 'Attendance alert sent.' },
    { label: 'Send Alert', icon: '🔔', color: '#6366F1', type: 'alert' as const, msg: 'Important alert from your teacher.', toast: 'Alert sent successfully.' }
  ];

  const handleAction = (action: typeof quickActions[0]) => {
    showToast(action.toast, 'success');
    addNotification({
      title: action.label,
      description: action.msg,
      type: action.type
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Teacher Portal</Typography>
          <Typography variant="body2" color="text.secondary">Welcome back, {user?.name}</Typography>
        </Box>
        <Avatar src={user?.avatar} sx={{ width: 44, height: 44, border: '2px solid', borderColor: 'divider' }} />
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {teacherStats.map((stat, idx) => (
          <Grid key={idx} size={4}>
            <Card elevation={0} sx={{ bgcolor: 'background.paper', textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 6 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ mb: 1.5 }}>{stat.icon}</Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Quick Actions</Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, idx) => (
            <Grid key={idx} size={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  onClick={() => handleAction(action)}
                  sx={{ 
                    bgcolor: 'background.paper', 
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer'
                  }}>
                  <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ fontSize: '1.5rem' }}>{action.icon}</Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{action.label}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Today's Classes */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Today's Classes</Typography>
          <Button size="small">View All</Button>
        </Box>
        <Stack spacing={2}>
          {todaySchedule.map((entry) => (
            <CourseCard key={entry.id} course={{
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
          ))}
        </Stack>
      </Box>

      {/* Pending Tasks */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Pending Tasks</Typography>
        <Stack spacing={1.5}>
          {[
            { title: 'Grade Midterm Papers', count: '45 pending', color: '#EF4444' },
            { title: 'Upload Lab Syllabus', count: 'Due today', color: '#F59E0B' }
          ].map((item, i) => (
            <Paper key={i} elevation={0} sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 6, border: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main' }}>{item.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{item.count}</Typography>
              </Box>
              <IconButton size="small" sx={{ bgcolor: 'background.default' }}><KeyboardArrowRight /></IconButton>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Student Overview Widget */}
      <Card sx={{ mt: 4, mb: 2, bgcolor: 'secondary.main', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Class Attendance</Typography>
            <BarChart />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Average: 88%</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>120 Students</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={88} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': { bgcolor: 'white' }
              }} 
            />
          </Box>
          <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar key={i} sx={{ width: 24, height: 24, fontSize: '0.6rem' }} src={`https://i.pravatar.cc/100?img=${i}`} />
            ))}
          </AvatarGroup>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeacherDashboard;
