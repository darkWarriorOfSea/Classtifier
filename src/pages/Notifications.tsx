import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, IconButton, Paper, Tab, Tabs } from '@mui/material';
import { Grade, Assignment, NotificationImportant, Event, MoreVert } from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

const NotificationsPage: React.FC = () => {
  const [tab, setTab] = React.useState('all');
  const { notifications, markAllRead } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'grade': return <Grade sx={{ color: '#10B981' }} />;
      case 'assignment': return <Assignment sx={{ color: '#EF4444' }} />;
      case 'alert': return <NotificationImportant sx={{ color: '#F59E0B' }} />;
      default: return <Event sx={{ color: '#6366F1' }} />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (tab === 'unread') return !n.read;
    if (tab === 'alerts') return n.type === 'alert' || n.type === 'assignment';
    if (tab === 'grades') return n.type === 'grade';
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Notifications</Typography>
        <Typography onClick={markAllRead} variant="body2" color="primary" sx={{ fontWeight: 700, cursor: 'pointer' }}>Mark all read</Typography>
      </Box>

      <Tabs 
        value={tab} 
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 700, minWidth: 80 } }}
      >
        <Tab value="all" label="All" />
        <Tab value="unread" label={`Unread (${notifications.filter(n => !n.read).length})`} />
        <Tab value="alerts" label="Alerts" />
        <Tab value="grades" label="Grades" />
      </Tabs>

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filteredNotifications.map((n, idx) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Paper sx={{ 
              bgcolor: n.read ? 'background.paper' : 'rgba(99, 102, 241, 0.05)',
              border: n.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <ListItem 
                alignItems="flex-start"
                secondaryAction={<IconButton edge="end"><MoreVert /></IconButton>}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.default', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {getIcon(n.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{n.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{n.time}</Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                        {n.description}
                      </Typography>
                      {!n.read && (
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 800, mt: 1, display: 'inline-block' }}>
                          VIEW DETAILS
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          </motion.div>
        ))}
      </List>
    </Box>
  );
};

export default NotificationsPage;
