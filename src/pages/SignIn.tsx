import React from 'react';
import { Box, Container } from '@mui/material';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/onboarding" />
    </Container>
  );
}
