import { FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { resetPassword } from '../api/auth';
import { extractErrorMessage } from '../api/client';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isTokenError, setIsTokenError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsTokenError(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(extractErrorMessage(err));
      setIsTokenError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 8 }}>
        <Alert severity="error">This reset link is missing its token.</Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/forgot-password" color="secondary">
            Request a new reset link
          </Link>
        </Typography>
      </Box>
    );
  }

  if (done) {
    return (
      <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 8 }}>
        <Typography variant="h5" fontWeight={800}>
          Password updated
        </Typography>
        <Alert severity="success" sx={{ mt: 3 }}>
          Your password has been reset. You can now log in with your new password.
        </Alert>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate('/login')}
        >
          Go to log in
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 8 }}>
      <Typography variant="h5" fontWeight={800}>
        Set a new password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
        Choose a new password for your account.
      </Typography>

      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="New password"
            type="password"
            required
            fullWidth
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="At least 8 characters."
            inputProps={{ minLength: 8 }}
          />
          <TextField
            label="Confirm new password"
            type="password"
            required
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <Alert severity="error">
              {error}
              {isTokenError && (
                <>
                  {' '}
                  <Link component={RouterLink} to="/forgot-password" color="inherit" sx={{ fontWeight: 700 }}>
                    Request a new link
                  </Link>
                </>
              )}
            </Alert>
          )}

          <Button type="submit" variant="contained" color="secondary" size="large" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update password'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
