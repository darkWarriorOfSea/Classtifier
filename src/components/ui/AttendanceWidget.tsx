import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface AttendanceWidgetProps {
  percentage: number;
  label: string;
  color: string;
  size?: number;
}

const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({ percentage, label, color, size = 80 }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={6}
          sx={{ color: '#F1F5F9' }}
        />
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={size}
          thickness={6}
          sx={{
            color: color,
            position: 'absolute',
            left: 0,
            strokeLinecap: 'round',
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" component="div" sx={{ fontWeight: 800, fontSize: size * 0.25, color: 'secondary.main' }}>
            {`${Math.round(percentage)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
    </Box>
  );
};

export default AttendanceWidget;
