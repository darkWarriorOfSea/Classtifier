import React from 'react';
import { Box, Container } from '@mui/material';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/onboarding" />
    </Container>
  );
}
