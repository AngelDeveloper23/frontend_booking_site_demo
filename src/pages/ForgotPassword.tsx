import { FormEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { forgotPassword } from '../api/auth';
import { extractErrorMessage } from '../api/client';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 8 }}>
        <Typography variant="h5" fontWeight={800}>
          Check your email
        </Typography>
        <Alert severity="success" sx={{ mt: 3 }}>
          If an account exists for {email}, a password reset link has been sent.
        </Alert>
        <Alert severity="info" sx={{ mt: 2 }}>
          This demo environment doesn't send real emails — the backend logs the reset link to its
          console instead. Check the server's terminal output for a line starting with
          "[password reset]".
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/login" color="secondary">
            Back to log in
          </Link>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 8 }}>
      <Typography variant="h5" fontWeight={800}>
        Forgot your password?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
        Enter your account email and we'll send you a link to reset it.
      </Typography>

      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" color="secondary" size="large" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        <Link component={RouterLink} to="/login" color="secondary">
          Back to log in
        </Link>
      </Typography>
    </Box>
  );
}
