import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import HotelIcon from '@mui/icons-material/HotelOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import PaidIcon from '@mui/icons-material/PaidOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { StatCard } from '../../components/StatCard';
import { listAllRoomsForAdmin } from '../../api/rooms';
import { listAllReservations } from '../../api/reservations';
import { listUsers } from '../../api/users';
import { extractErrorMessage } from '../../api/client';
import { Reservation, Room, User } from '../../types';

export function AdminDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listAllRoomsForAdmin(), listAllReservations(), listUsers()])
      .then(([r, res, u]) => {
        setRooms(r);
        setReservations(res);
        setUsers(u);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const confirmed = reservations.filter((r) => r.status === 'CONFIRMED');
  const revenue = confirmed.reduce((sum, r) => {
    const nights = differenceInCalendarDays(new Date(r.checkOut), new Date(r.checkIn));
    return sum + nights * r.room.pricePerNight;
  }, 0);

  const links = [
    { to: '/admin/rooms', title: 'Manage Rooms', subtitle: 'Create, edit, and deactivate rooms' },
    { to: '/admin/reservations', title: 'Reservations', subtitle: 'View and cancel any booking' },
    { to: '/admin/users', title: 'Users', subtitle: 'Manage roles and access' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800}>
        Admin Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Full overview of rooms, reservations, and users.
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
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            }}
          >
            <StatCard icon={HotelIcon} label="Active rooms" value={rooms.filter((r) => r.isActive).length} />
            <StatCard icon={EventIcon} label="Confirmed reservations" value={confirmed.length} />
            <StatCard icon={GroupIcon} label="Total users" value={users.length} />
            <StatCard icon={PaidIcon} label="Booked revenue" value={`$${revenue.toFixed(0)}`} />
          </Box>

          <Box
            sx={{
              mt: 4,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            }}
          >
            {links.map((link) => (
              <Card variant="outlined" key={link.to}>
                <CardActionArea component={RouterLink} to={link.to} sx={{ p: 2.5 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {link.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.subtitle}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon color="action" />
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Container>
  );
}
