import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAppStore, UserRole } from '../store/useAppStore';
import api from '../services/api';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, setUser } = useAppStore();
  const location = useLocation();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !user && !isSyncing) {
      setIsSyncing(true);
      api.users.getMe()
        .then(profile => {
          setUser(profile);
          setIsSyncing(false);
        })
        .catch(err => {
          console.error("Failed to fetch user profile, redirecting to onboarding", err);
          setIsSyncing(false);
        });
    }
  }, [isLoaded, isSignedIn, user, isSyncing, setUser]);

  if (!isLoaded || isSyncing) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!user && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user && allowedRole && user.role !== allowedRole) {
    const redirectPath = user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
