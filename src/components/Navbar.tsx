import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import HotelIcon from '@mui/icons-material/Hotel';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', gap: 2 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}
        >
          <HotelIcon sx={{ color: 'secondary.main' }} />
          <Typography variant="h6" component="span" sx={{ letterSpacing: 1, fontWeight: 800 }}>
            AURELIA
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={RouterLink} to="/" color="inherit" size="small">
            Search
          </Button>
          {user?.role === 'GUEST' && (
            <Button component={RouterLink} to="/my-reservations" color="inherit" size="small">
              My Reservations
            </Button>
          )}
          {user?.role === 'ADMIN' && (
            <Button component={RouterLink} to="/admin" color="inherit" size="small">
              Dashboard
            </Button>
          )}
          {user?.role === 'STAFF' && (
            <Button component={RouterLink} to="/staff" color="inherit" size="small">
              Dashboard
            </Button>
          )}

          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={toggleMode} color="inherit" size="small" aria-label="Toggle color mode">
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {user ? (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 1 }}>
              <Chip
                label={user.role}
                size="small"
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              />
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.name}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
              <Button component={RouterLink} to="/login" variant="outlined" color="inherit" size="small">
                Log in
              </Button>
              <Button component={RouterLink} to="/register" variant="contained" color="secondary" size="small">
                Register
              </Button>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
