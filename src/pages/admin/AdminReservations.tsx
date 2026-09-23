import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Reservation } from '../../types';
import { cancelReservation, listAllReservations } from '../../api/reservations';
import { ReservationsTable } from '../../components/ReservationsTable';
import { extractErrorMessage } from '../../api/client';

export function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    listAllReservations()
      .then(setReservations)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function onCancel(reservation: Reservation) {
    setError(null);
    try {
      await cancelReservation(reservation.id);
      refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800}>
        Reservations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Admin-only. Every booking across all guests.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <ReservationsTable reservations={reservations} showGuestColumn onCancel={onCancel} />
        </Box>
      )}
    </Container>
  );
}
