import React from 'react';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Chip, TextField, InputAdornment, Button, Grid } from '@mui/material';
import { Search, MoreVert, FilterList, Add, Mail, Phone, Assessment } from '@mui/icons-material';

const MOCK_STUDENTS = [
  { id: 1, name: 'Marcus Chen', email: 'marcus@uni.tech', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', attendance: 88, gpa: 3.8, status: 'On Track' },
  { id: 2, name: 'Elena Rodriguez', email: 'elena@uni.tech', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', attendance: 94, gpa: 3.9, status: 'On Track' },
  { id: 3, name: 'James Wilson', email: 'james@uni.tech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', attendance: 72, gpa: 2.5, status: 'Needs Attention' },
  { id: 4, name: 'Sophia Lee', email: 'sophia@uni.tech', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', attendance: 85, gpa: 3.6, status: 'On Track' },
];

export default function ManageStudents() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage Students</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ borderRadius: 3 }}
        >
          Add Student
        </Button>
      </Box>

      {/* Search & Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField 
          fullWidth 
          placeholder="Search by name, ID, or email..."
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }
          }}
          sx={{ 
            bgcolor: 'background.paper',
            '& .MuiOutlinedInput-root': { borderRadius: 3 }
          }}
        />
        <IconButton sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <FilterList />
        </IconButton>
      </Box>

      {/* Student List */}
      <Stack spacing={2}>
        {MOCK_STUDENTS.map((student) => (
          <Paper 
            key={student.id} 
            elevation={0}
            sx={{ 
              p: 2, 
              borderRadius: 6, 
              border: '1px solid', 
              borderColor: 'divider',
              bgcolor: 'background.paper',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={student.avatar} sx={{ width: 48, height: 48, borderRadius: 3 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main' }}>{student.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                </Box>
              </Box>
              <IconButton size="small"><MoreVert /></IconButton>
            </Box>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={4}>
                <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>ATTENDANCE</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: student.attendance < 75 ? 'error.main' : 'success.main' }}>
                    {student.attendance}%
                  </Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>GPA</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>{student.gpa}</Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>STATUS</Typography>
                  <Chip 
                    label={student.status} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.625rem', 
                      fontWeight: 800,
                      bgcolor: student.status === 'On Track' ? 'success.main' : 'error.main',
                      color: 'white',
                      borderRadius: 1
                    }} 
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button size="small" variant="outlined" startIcon={<Assessment />} sx={{ borderRadius: 2, fontSize: '0.7rem' }}>Report</Button>
              <Button size="small" variant="outlined" startIcon={<Mail />} sx={{ borderRadius: 2, fontSize: '0.7rem' }}>Notify</Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
