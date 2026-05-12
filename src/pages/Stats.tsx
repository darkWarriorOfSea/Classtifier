import React from 'react';
import { Box, Typography, Card, CardContent, Stack, LinearProgress, Grid } from '@mui/material';
import AttendanceWidget from '../components/ui/AttendanceWidget';
import { MOCK_ATTENDANCE } from '../constants/mockData';
import { motion } from 'framer-motion';

const Stats: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Attendance Tracker</Typography>

      <Card elevation={0} sx={{ 
        mb: 4, 
        bgcolor: 'background.paper', 
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        borderRadius: 8
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 2, letterSpacing: '0.05em' }}>OVERALL ATTENDANCE</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <AttendanceWidget percentage={74} label="TOTAL" color="#6366F1" size={160} />
          </Box>
          <Grid container spacing={2}>
            <Box component="div" sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: '#F8FAFC', borderRadius: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>42</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>CLASSES</Typography>
            </Box>
            <Box component="div" sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: '#F8FAFC', borderRadius: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>31</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PRESENT</Typography>
            </Box>
            <Box component="div" sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: '#F8FAFC', borderRadius: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'error.main' }}>11</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ABSENT</Typography>
            </Box>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ p: 2.5, bgcolor: '#FEF3C7', borderRadius: 6, border: '1px solid #FDE68A', mb: 4 }}>
        <Typography variant="subtitle2" sx={{ color: '#D97706', fontWeight: 800, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          ⚠️ Attendance Alert
        </Typography>
        <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 500 }}>
          You need 4 more classes to reach the 80% requirement.
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Subject Breakdown</Typography>
      <Stack spacing={2}>
        {MOCK_ATTENDANCE.map((record) => (
          <Card key={record.courseId} sx={{ bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{record.courseName}</Typography>
                <Typography variant="subtitle2" sx={{ color: record.color, fontWeight: 800 }}>{record.percentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={record.percentage} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                  bgcolor: '#F1F5F9',
                  '& .MuiLinearProgress-bar': { bgcolor: record.color, borderRadius: 3 }
                }} 
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
                {record.attended} / {record.total} attended
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default Stats;
