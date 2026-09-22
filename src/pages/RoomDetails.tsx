import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Room } from '../types';
import { getRoom } from '../api/rooms';
import { AvailabilityCalendar } from '../components/AvailabilityCalendar';
import { extractErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getRoom(id)
      .then(setRoom)
      .catch((err) => setError(extractErrorMessage(err)));
  }, [id]);

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Link component={RouterLink} to="/" color="secondary">
          Back to search
        </Link>
      </Container>
    );
  }

  if (!room) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Link
        component={RouterLink}
        to="/"
        color="text.secondary"
        underline="hover"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 14 }}
      >
        <ArrowBackIcon fontSize="inherit" /> Back to search
      </Link>

      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gap: 5,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <Box>
          <Box
            component="img"
            src={room.imageUrl ?? undefined}
            alt={room.name}
            sx={{
              width: '100%',
              aspectRatio: '4 / 3',
              objectFit: 'cover',
              borderRadius: 2,
              bgcolor: 'grey.100',
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {room.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip label={room.type} size="small" color="secondary" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  Sleeps up to {room.capacity}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={800} color="secondary.dark">
              ${room.pricePerNight.toFixed(0)}
              <Typography component="span" variant="body2" color="text.secondary">
                {' '}
                / night
              </Typography>
            </Typography>
          </Box>

          {room.description && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {room.description}
            </Typography>
          )}

          <Paper variant="outlined" sx={{ mt: 3, p: 2, bgcolor: 'grey.50' }}>
            {user ? (
              <Typography variant="body2" color="text.secondary">
                Booking is coming in Milestone 2. Use the calendar to check availability before the
                reservation flow ships.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                <Link component={RouterLink} to="/login" color="secondary">
                  Log in
                </Link>{' '}
                to reserve this room once booking is enabled.
              </Typography>
            )}
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Availability
          </Typography>
          <AvailabilityCalendar roomId={room.id} />
        </Box>
      </Box>
    </Container>
  );
}
