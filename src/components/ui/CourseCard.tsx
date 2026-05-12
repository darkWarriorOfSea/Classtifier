import React from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { AccessTime, LocationOn, Person } from '@mui/icons-material';
import { Course } from '../../types';
import { motion } from 'framer-motion';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        onClick={onClick}
        elevation={0}
        sx={{ 
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 6,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 8px 16px rgba(0,0,0,0.04)'
          }
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ borderLeft: `4px solid ${course.color}`, pl: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, mb: 0.5, color: course.color, letterSpacing: '0.05em' }}>
                  {course.code}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 800, color: 'secondary.main', lineHeight: 1.2 }}>
                  {course.name}
                </Typography>
              </Box>
              <Chip 
                label={course.type} 
                size="small" 
                sx={{ 
                  height: 20,
                  bgcolor: '#F1F5F9', 
                  color: 'slate.500',
                  fontWeight: 800,
                  fontSize: '0.6rem'
                }} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {course.startTime} – {course.endTime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                   {course.location}
                </Typography>
              </Box>
              {course.instructor && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Person sx={{ fontSize: '0.8rem', color: 'primary.main' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {course.instructor}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
