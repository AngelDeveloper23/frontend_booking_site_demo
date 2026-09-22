import { createTheme } from '@mui/material/styles';

// Hospitality-leaning palette: deep navy for structure/trust, warm amber as
// the single accent (booking CTAs, active states) — kept to two colors plus
// Material's semantic reds/greens so the calendar's available/booked signal
// stays legible on top of it.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#122340',
      light: '#2c4266',
      dark: '#0a1526',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c98a2c',
      light: '#e0ac5c',
      dark: '#9c6a1c',
      contrastText: '#122340',
    },
    background: {
      default: '#f6f5f2',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#122340',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(18,35,64,0.08), 0 1px 2px rgba(18,35,64,0.06)',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
