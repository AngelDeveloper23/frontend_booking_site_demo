import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { differenceInCalendarDays, format, startOfDay } from 'date-fns';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Room, Reservation } from '../types';
import { createReservation } from '../api/reservations';
import { extractErrorMessage } from '../api/client';

function toIsoStartOfDay(date: Date) {
  return new Date(`${format(date, 'yyyy-MM-dd')}T00:00:00.000Z`).toISOString();
}

export function BookingWidget({
  room,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  onBooked,
}: {
  room: Room;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  initialGuests?: number;
  onBooked?: () => void;
}) {
  const today = startOfDay(new Date());
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn ?? null);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut ?? null);
  const [guests, setGuests] = useState(initialGuests ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);

  const nights = checkIn && checkOut ? Math.max(0, differenceInCalendarDays(checkOut, checkIn)) : 0;
  const total = nights * room.pricePerNight;

  async function onSubmit() {
    setError(null);

    if (!checkIn || !checkOut) {
      setError('Choose a check-in and check-out date.');
      return;
    }
    if (checkIn >= checkOut) {
      setError('Check-out date must be after check-in date.');
      return;
    }
    if (guests > room.capacity) {
      setError(`This room sleeps up to ${room.capacity} guests.`);
      return;
    }

    setSubmitting(true);
    try {
      const reservation = await createReservation({
        roomId: room.id,
        checkIn: toIsoStartOfDay(checkIn),
        checkOut: toIsoStartOfDay(checkOut),
        guests,
      });
      setConfirmed(reservation);
      onBooked?.();
    } catch (err) {
      setError(extractErrorMessage(err));
      onBooked?.();
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: 'success.main', bgcolor: 'action.hover' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EventAvailableIcon color="success" />
          <Typography variant="subtitle1" fontWeight={700}>
            Reservation confirmed
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {room.name} · {format(new Date(confirmed.checkIn), 'MMM d, yyyy')} –{' '}
          {format(new Date(confirmed.checkOut), 'MMM d, yyyy')} · {confirmed.guests} guest
          {confirmed.guests > 1 ? 's' : ''}
        </Typography>
        <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
          Total: ${((differenceInCalendarDays(new Date(confirmed.checkOut), new Date(confirmed.checkIn)) || 0) * room.pricePerNight).toFixed(0)}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Link component={RouterLink} to="/my-reservations" color="secondary" underline="hover">
            View my reservations
          </Link>
          <Link
            component="button"
            color="secondary"
            underline="hover"
            onClick={() => {
              setConfirmed(null);
              setCheckIn(null);
              setCheckOut(null);
            }}
          >
            Book another stay
          </Link>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Reserve this room
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
        <DatePicker
          label="Check-in"
          value={checkIn}
          onChange={setCheckIn}
          minDate={today}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <DatePicker
          label="Check-out"
          value={checkOut}
          onChange={setCheckOut}
          minDate={checkIn ?? today}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
      </Box>

      <TextField
        label="Guests"
        type="number"
        size="small"
        fullWidth
        sx={{ mt: 2 }}
        inputProps={{ min: 1, max: room.capacity }}
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
      />

      {nights > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {nights} night{nights > 1 ? 's' : ''} × ${room.pricePerNight.toFixed(0)}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              ${total.toFixed(0)}
            </Typography>
          </Box>
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        color="secondary"
        size="large"
        sx={{ mt: 2 }}
        disabled={submitting}
        onClick={onSubmit}
      >
        {submitting ? 'Reserving…' : 'Reserve now'}
      </Button>
    </Paper>
  );
}
