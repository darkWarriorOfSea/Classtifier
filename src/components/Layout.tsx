import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper, AppBar, Toolbar, Typography, Avatar, IconButton, Badge, Tooltip, Snackbar, Alert } from '@mui/material';
import { Home, CalendarToday, Notifications, BarChart, Person, SmartToy, DarkMode, LightMode, People } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, themeMode, toggleThemeMode, toast, hideToast } = useAppStore();
  
  const [value, setValue] = React.useState(location.pathname);

  React.useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', icon: <Home />, path: user?.role === 'student' ? '/student-dashboard' : '/teacher-dashboard' },
    { label: 'Schedule', icon: <CalendarToday />, path: '/schedule' },
    { label: 'Inbox', icon: <Notifications />, path: '/notifications' },
    ...(user?.role === 'teacher' ? [
      { label: 'Students', icon: <People />, path: '/manage-students' },
    ] : []),
    { label: 'Stats', icon: <BarChart />, path: '/stats' },
    { label: 'Profile', icon: <Person />, path: '/profile' },
  ];

  return (
    <Box sx={{ pb: 7, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid #E2E8F0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'primary.main', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <Box component="img" src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" sx={{ width: 20, height: 20, filter: 'invert(1)' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main', letterSpacing: '-0.02em' }}>
              Classtifier
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton onClick={toggleThemeMode} sx={{ color: 'text.secondary' }}>
                {themeMode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: { width: 36, height: 36 } } }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>

      <IconButton
        onClick={() => navigate('/chat')}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          width: 56,
          height: 56,
          bgcolor: 'primary.main',
          color: 'white',
          boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}40`,
          '&:hover': { bgcolor: 'primary.dark' },
          zIndex: 1000
        }}
      >
        <SmartToy />
      </IconButton>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
          sx={{ 
            height: 72, 
            bgcolor: 'background.paper',
            borderTop: '1px solid #E2E8F0',
            '& .MuiBottomNavigationAction-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }
            }
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              value={item.path}
              icon={item.icon}
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 90 } }}
      >
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%', fontWeight: 600 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
