import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ 
          width: 100, 
          height: 100, 
          bgcolor: 'primary.main', 
          borderRadius: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mx: 'auto',
          mb: 4,
          boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)'
        }}>
           <Box component="img" src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" sx={{ width: 50, height: 50, filter: 'invert(1)' }} />
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.05em', color: 'secondary.main' }}>
          Classtifier
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 8, fontWeight: 600 }}>
          The smart way to manage your academic journey.
        </Typography>

        <Stack spacing={2} sx={{ width: '100%' }}>
          <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/sign-in')}
            sx={{ py: 2, fontSize: '1rem' }}
          >
            Get Started
          </Button>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2 }}>
            v1.0 Production Edition
          </Typography>
        </Stack>
      </motion.div>
    </Container>
  );
};

export default Splash;
