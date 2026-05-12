import React from 'react';
import { Box, Typography, Button, TextField, InputAdornment, IconButton, Tab, Tabs, Container, Paper } from '@mui/material';
import { Google, Email, Lock, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore, UserRole } from '../store/useAppStore';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [role, setRole] = React.useState<UserRole>('student');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ id: '1', name: 'Demo User', email: email || 'demo@classtifier.edu', role });
    navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', p: 0 }}>
      <Box sx={{ width: '100%', p: 3 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>
        
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'primary.main', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 12px 32px rgba(37, 99, 235, 0.25)'
          }}>
            <Box component="img" src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" sx={{ width: 40, height: 40, filter: 'invert(1)' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'secondary.main', letterSpacing: '-0.02em' }}>
            Welcome back 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            Sign in to your {role} portal
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 0.75, mb: 4, bgcolor: '#F1F5F9', borderRadius: 4, border: '1px solid #E2E8F0' }}>
          <Tabs 
            value={role} 
            onChange={(_, v) => setRole(v)} 
            variant="fullWidth"
            sx={{ 
              minHeight: 40,
              '& .MuiTabs-indicator': { height: '100%', borderRadius: 3, zIndex: 0, bgcolor: 'primary.main', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }
            }}
          >
            <Tab value="student" label="Student" sx={{ fontWeight: 800, zIndex: 1, color: role === 'student' ? 'white !important' : 'text.secondary' }} />
            <Tab value="teacher" label="Teacher" sx={{ fontWeight: 800, zIndex: 1, color: role === 'teacher' ? 'white !important' : 'text.secondary' }} />
          </Tabs>
        </Paper>

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ py: 1.5, borderColor: 'rgba(255,255,255,0.1)', color: 'text.primary' }}
          >
            Continue with Google
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.08)' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>OR</Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.08)' }} />
          </Box>

          <TextField
            fullWidth
            placeholder={role === 'student' ? 'College Email' : 'Staff ID / Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              } as any,
            }}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              } as any,
            }}
          />

          <Typography variant="body2" color="primary" sx={{ textAlign: 'right', fontWeight: 600, cursor: 'pointer' }}>
            Forgot password?
          </Typography>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{ py: 1.8, mt: 1 }}
          >
            Sign In
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
            New here? <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}>Register</Box>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
