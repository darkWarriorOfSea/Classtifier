import React from 'react';
import { Box, Typography, Stack, Tab, Tabs, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import CourseCard from '../components/ui/CourseCard';
import { WEEKLY_SCHEDULE } from '../constants/timetable';
import { motion, AnimatePresence } from 'framer-motion';

const Schedule: React.FC = () => {
  const [day, setDay] = React.useState(0);
  const [section, setSection] = React.useState('Section 1');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const scheduleForDay = WEEKLY_SCHEDULE[section][day] || [];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>My Timetable</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Parul University - CSE</Typography>
        </Box>
        <ToggleButtonGroup
          value={section}
          exclusive
          onChange={(_, v) => v && setSection(v)}
          size="small"
          sx={{ 
            bgcolor: 'background.paper',
            '& .MuiToggleButton-root': {
              px: 2,
              fontWeight: 700,
              borderRadius: 3,
              border: 'none',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }
            }
          }}
        >
          <ToggleButton value="Section 1">CSE 1</ToggleButton>
          <ToggleButton value="Section 2">CSE 2</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Tabs 
        value={day} 
        onChange={(_, v) => setDay(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ 
          mb: 4, 
          bgcolor: 'background.paper',
          p: 0.5,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiTabs-flexContainer': {
            justifyContent: { xs: 'flex-start', sm: 'center' }
          },
          '& .MuiTabs-indicator': { 
            height: '100%', 
            borderRadius: 3.5, 
            zIndex: 0,
            bgcolor: 'primary.main',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
          },
          '& .MuiTab-root': { 
            minHeight: 44,
            minWidth: { xs: 80, sm: 100 },
            fontWeight: 800,
            zIndex: 1,
            transition: 'color 0.3s ease',
            color: 'text.secondary',
            '&.Mui-selected': { color: 'white !important' }
          }
        }}
      >
        {days.map((d, i) => (
          <Tab key={d} label={d} value={i} />
        ))}
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={day}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Stack spacing={3}>
            {scheduleForDay.map((entry) => (
              <Box key={entry.id}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, mb: 1, display: 'block' }}>
                  {entry.startTime} – {entry.endTime}
                </Typography>
                {entry.type === 'Break' ? (
                  <Box sx={{ 
                    py: 2.5, 
                    border: '2px dashed', 
                    borderColor: 'divider',
                    borderRadius: 6, 
                    textAlign: 'center',
                    bgcolor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      ☕ {entry.name}
                    </Typography>
                  </Box>
                ) : (
                  <CourseCard course={{
                    id: entry.id,
                    name: entry.name,
                    code: entry.id.startsWith('training') ? 'TRAIN' : entry.name.split(' ').map(w => w[0]).join('').toUpperCase(),
                    type: entry.type as any,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    location: entry.location,
                    instructor: entry.instructor,
                    color: entry.color,
                  }} />
                )}
              </Box>
            ))}
          </Stack>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default Schedule;
