import { FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 8 }}>
      <Typography variant="h5" fontWeight={800}>
        Create your account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
        Register as a guest to search and book rooms.
      </Typography>

      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <TextField label="Full name" required fullWidth value={name} onChange={(e) => setName(e.target.value)} />
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
            helperText="At least 8 characters."
            inputProps={{ minLength: 8 }}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" color="secondary" size="large" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" color="secondary">
          Log in
        </Link>
      </Typography>
    </Box>
  );
}
