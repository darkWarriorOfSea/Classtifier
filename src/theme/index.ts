import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark'): Theme => {
  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563EB', // Blue 600
        light: '#3B82F6',
        dark: '#1D4ED8',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: mode === 'light' ? '#1E1B4B' : '#818CF8', // Indigo 950 : Indigo 400
        light: '#312E81',
        dark: '#0F172A',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#0F172A',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1B4B',
      },
      text: {
        primary: mode === 'light' ? '#0F172A' : '#F8FAFC',
        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
      },
      divider: mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
    },
    typography: {
      fontFamily: '"DM Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: mode === 'light' ? '#1E1B4B' : '#F8FAFC' },
      h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em', color: mode === 'light' ? '#1E1B4B' : '#F8FAFC' },
      h3: { fontSize: '1.5rem', fontWeight: 700, color: mode === 'light' ? '#1E1B4B' : '#F8FAFC' },
      h4: { fontSize: '1.25rem', fontWeight: 700, color: mode === 'light' ? '#1E1B4B' : '#F8FAFC' },
      h5: { fontSize: '1.125rem', fontWeight: 700, color: mode === 'light' ? '#1E1B4B' : '#F8FAFC' },
      h6: { fontSize: '1rem', fontWeight: 700, color: mode === 'light' ? '#1E1B4B' : '#F8FAFC' },
      subtitle1: { fontSize: '1rem', fontWeight: 600 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: {
      borderRadius: 32,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            padding: '12px 28px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light' ? '0 10px 20px rgba(37, 99, 235, 0.15)' : '0 10px 20px rgba(0, 0, 0, 0.3)',
            },
          },
          contained: {
            background: '#2563EB',
            '&:hover': {
              background: '#1D4ED8',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 32,
            backgroundImage: 'none',
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1B4B',
            border: mode === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: mode === 'light' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
              : '0 4px 20px rgba(0, 0, 0, 0.4)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 16,
              backgroundColor: mode === 'light' ? '#FFFFFF' : '#0F172A',
              '& fieldset': {
                borderColor: mode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: mode === 'light' ? '#CBD5E1' : 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2563EB',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#F8FAFC' : '#0F172A',
            borderBottom: mode === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.05)',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1B4B',
            borderTop: mode === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
  });

  return responsiveFontSizes(baseTheme);
};
