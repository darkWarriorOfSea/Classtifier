import React from 'react';
import { Box, Typography, Container, Button, Stack, Chip, Card, CardContent, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, ListItemButton } from '@mui/material';
import { Settings, ExitToApp, KeyboardArrowRight, Security, Info, Help, DarkMode, Notifications } from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const Profile: React.FC = () => {
  const { user, setUser, themeMode, toggleThemeMode } = useAppStore();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setUser(null);
    await signOut();
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar 
            src={user?.avatar} 
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto', 
              mb: 2,
              border: '4px solid',
              borderColor: 'primary.light',
              opacity: 0.9,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }} 
          />
          <Chip 
            label={user?.role?.toUpperCase()} 
            size="small" 
            sx={{ 
              position: 'absolute', 
              bottom: 12, 
              right: -10, 
              bgcolor: 'primary.main', 
              color: 'white',
              fontWeight: 800,
              fontSize: '0.65rem'
            }} 
          />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary">{user?.college}</Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}>
          {user?.course} • {user?.year}
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ mb: 4 }}>
        <Card>
          <List disablePadding>
            <ListItem secondaryAction={<IconButton><KeyboardArrowRight /></IconButton>}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white', opacity: 0.1, position: 'absolute' }} />
                <Avatar sx={{ bgcolor: 'transparent', color: 'primary.main' }}>
                  <Notifications />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                disableTypography
                primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">Push, Email, SMS</Typography>}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem secondaryAction={<IconButton><KeyboardArrowRight /></IconButton>}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'transparent', color: 'success.main' }}>
                  <Security />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                disableTypography
                primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Security</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">Password, 2FA</Typography>}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem 
              disablePadding
              secondaryAction={<IconButton onClick={toggleThemeMode}><KeyboardArrowRight /></IconButton>}
            >
              <ListItemButton onClick={toggleThemeMode} sx={{ borderRadius: 4 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent', color: 'warning.main' }}>
                    <DarkMode />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  disableTypography
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Appearance</Typography>}
                  secondary={<Typography variant="body2" color="text.secondary">{`${themeMode === 'light' ? 'Light' : 'Dark'} Mode On`}</Typography>}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Card>

        <Card>
          <List disablePadding>
            <ListItem secondaryAction={<IconButton><KeyboardArrowRight /></IconButton>}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'transparent', color: 'text.secondary' }}>
                  <Help />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                disableTypography
                primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Help Center</Typography>}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem secondaryAction={<IconButton><KeyboardArrowRight /></IconButton>}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'transparent', color: 'text.secondary' }}>
                  <Info />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                disableTypography
                primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>About Classtifier</Typography>}
              />
            </ListItem>
          </List>
        </Card>
      </Stack>

      <Button 
        fullWidth 
        variant="outlined" 
        color="error" 
        startIcon={<ExitToApp />}
        onClick={handleLogout}
        sx={{ py: 1.5, mb: 4 }}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Profile;
