import { FormEvent, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('guest@hotel.demo');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string })?.from ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 8 }}>
      <Typography variant="h5" fontWeight={800}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
        Log in to search and manage reservations.
      </Typography>

      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" color="secondary" size="large" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>
        </Stack>
      </Box>

      <Paper variant="outlined" sx={{ mt: 4, p: 2, bgcolor: 'action.hover' }}>
        <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
          Demo accounts (password: Password123!)
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Guest — guest@hotel.demo
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Staff — staff@hotel.demo
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Admin — admin@hotel.demo
        </Typography>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        No account?{' '}
        <Link component={RouterLink} to="/register" color="secondary">
          Register
        </Link>
      </Typography>
    </Box>
  );
}
