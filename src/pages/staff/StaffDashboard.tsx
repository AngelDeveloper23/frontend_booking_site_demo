import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { isSameDay, isWithinInterval } from 'date-fns';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import HotelIcon from '@mui/icons-material/HotelOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import TodayIcon from '@mui/icons-material/TodayOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { StatCard } from '../../components/StatCard';
import { listAllRoomsForAdmin } from '../../api/rooms';
import { listAllReservations } from '../../api/reservations';
import { extractErrorMessage } from '../../api/client';
import { Reservation, Room } from '../../types';

export function StaffDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listAllRoomsForAdmin(), listAllReservations()])
      .then(([r, res]) => {
        setRooms(r);
        setReservations(res);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);

  const confirmed = reservations.filter((r) => r.status === 'CONFIRMED');
  const checkingInToday = confirmed.filter((r) => isSameDay(new Date(r.checkIn), today));
  const upcomingWeek = confirmed.filter((r) => isWithinInterval(new Date(r.checkIn), { start: today, end: in7Days }));

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800}>
        Staff Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        A quick overview of rooms and upcoming reservations.
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
        <>
          <Box
            sx={{
              mt: 4,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            }}
          >
            <StatCard icon={HotelIcon} label="Active rooms" value={rooms.filter((r) => r.isActive).length} />
            <StatCard icon={TodayIcon} label="Check-ins today" value={checkingInToday.length} />
            <StatCard icon={EventIcon} label="Check-ins next 7 days" value={upcomingWeek.length} />
          </Box>

          <Box sx={{ mt: 4, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <Card variant="outlined">
              <CardActionArea component={RouterLink} to="/staff/rooms" sx={{ p: 2.5 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Rooms Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Browse rooms and check availability
                    </Typography>
                  </Box>
                  <ArrowForwardIcon color="action" />
                </CardContent>
              </CardActionArea>
            </Card>
            <Card variant="outlined">
              <CardActionArea component={RouterLink} to="/staff/reservations" sx={{ p: 2.5 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Reservations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and manage guest bookings
                    </Typography>
                  </Box>
                  <ArrowForwardIcon color="action" />
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </>
      )}
    </Container>
  );
}
