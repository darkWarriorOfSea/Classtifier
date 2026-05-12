import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Paper, CircularProgress } from '@mui/material';
import { School, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import api from '../services/api';

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkExistingProfile() {
      if (!isLoaded || !user) return;
      
      try {
        // We ensure window.__clerk is available for api.ts token fetching, 
        // but let's make sure by getting the token here if needed.
        const profile = await api.users.getMe();
        if (profile && profile.role) {
          navigate(profile.role === 'student' ? '/student-dashboard' : '/teacher-dashboard', { replace: true });
        } else {
          setLoading(false);
        }
      } catch (err) {
        // Likely 404, user needs to be synced
        setLoading(false);
      }
    }
    
    checkExistingProfile();
  }, [isLoaded, user, navigate]);

  const selectRole = async (role: 'student' | 'teacher') => {
    if (!user) return;
    setLoading(true);
    try {
      await api.users.sync({
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || user.username || 'Unknown',
        role,
        avatar: user.imageUrl,
      });
      navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard', { replace: true });
    } catch (error) {
      console.error('Failed to sync user:', error);
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <Container sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: 'secondary.main' }}>
          Welcome to Classtifier
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          To get started, please tell us how you'll be using the platform.
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Paper 
            elevation={2}
            sx={{ p: 4, borderRadius: 4, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }, flex: 1 }}
            onClick={() => selectRole('student')}
          >
            <Person sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>I am a Student</Typography>
            <Typography variant="body2" color="text.secondary">Join classes and view schedules.</Typography>
          </Paper>

          <Paper 
            elevation={2}
            sx={{ p: 4, borderRadius: 4, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }, flex: 1 }}
            onClick={() => selectRole('teacher')}
          >
            <School sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>I am a Teacher</Typography>
            <Typography variant="body2" color="text.secondary">Manage classes and students.</Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
