import { FormEvent, useEffect, useState } from 'react';
import { format, startOfDay } from 'date-fns';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Room } from '../types';
import { listRooms, searchRooms } from '../api/rooms';
import { RoomCard } from '../components/RoomCard';
import { extractErrorMessage } from '../api/client';

function toIsoStartOfDay(date: Date) {
  return new Date(`${format(date, 'yyyy-MM-dd')}T00:00:00.000Z`).toISOString();
}

export function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);

  const today = startOfDay(new Date());

  const roomLinkSearch =
    hasSearched && checkIn && checkOut
      ? `?checkIn=${format(checkIn, 'yyyy-MM-dd')}&checkOut=${format(checkOut, 'yyyy-MM-dd')}&guests=${guests}`
      : undefined;

  useEffect(() => {
    listRooms()
      .then(setRooms)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (checkIn && checkOut && checkIn >= checkOut) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setLoading(true);
    try {
      const { rooms: results } = await searchRooms({
        checkIn: checkIn ? toIsoStartOfDay(checkIn) : undefined,
        checkOut: checkOut ? toIsoStartOfDay(checkOut) : undefined,
        guests,
      });
      setRooms(results);
      setHasSearched(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 6, md: 9 },
          px: 3,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: 'secondary.light', letterSpacing: 3 }}>
            A whole new stay
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
            AURELIA HOTEL
          </Typography>
          <Typography sx={{ mt: 2, opacity: 0.8 }}>
            Find your room, check real-time availability, and reserve in seconds.
          </Typography>
        </Container>

        <Paper
          component="form"
          onSubmit={onSearch}
          sx={{
            maxWidth: 760,
            mx: 'auto',
            mt: 5,
            p: 2.5,
            borderRadius: 2,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 0.7fr 1.2fr' },
            alignItems: 'start',
          }}
        >
          <DatePicker
            label="Check-in"
            value={checkIn}
            onChange={(value) => setCheckIn(value)}
            minDate={today}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
          <DatePicker
            label="Check-out"
            value={checkOut}
            onChange={(value) => setCheckOut(value)}
            minDate={checkIn ?? today}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
          <TextField
            label="Guests"
            type="number"
            fullWidth
            size="small"
            inputProps={{ min: 1 }}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<SearchIcon />}
            sx={{ height: 40 }}
          >
            Search rooms
          </Button>
        </Paper>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            {hasSearched ? 'Available rooms for your dates' : 'All rooms'}
          </Typography>
          {!loading && (
            <Typography variant="body2" color="text.secondary">
              {rooms.length} found
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : rooms.length === 0 ? (
          <Typography color="text.secondary">
            No rooms match your search. Try different dates or guest count.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} linkSearch={roomLinkSearch} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
