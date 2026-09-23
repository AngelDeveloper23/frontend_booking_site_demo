import { format } from 'date-fns';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Reservation } from '../types';

export function ReservationsTable({
  reservations,
  showGuestColumn,
  onCancel,
}: {
  reservations: Reservation[];
  showGuestColumn?: boolean;
  onCancel?: (reservation: Reservation) => void;
}) {
  if (reservations.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        No reservations to show.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {showGuestColumn && <TableCell>Guest</TableCell>}
            <TableCell>Room</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Guests</TableCell>
            <TableCell>Status</TableCell>
            {onCancel && <TableCell align="right" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((r) => (
            <TableRow key={r.id} hover>
              {showGuestColumn && (
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {r.user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {r.user?.email}
                  </Typography>
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 600 }}>{r.room.name}</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{format(new Date(r.checkIn), 'MMM d, yyyy')}</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{format(new Date(r.checkOut), 'MMM d, yyyy')}</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{r.guests}</TableCell>
              <TableCell>
                <Chip
                  label={r.status}
                  size="small"
                  color={r.status === 'CONFIRMED' ? 'success' : 'default'}
                  variant={r.status === 'CONFIRMED' ? 'filled' : 'outlined'}
                />
              </TableCell>
              {onCancel && (
                <TableCell align="right">
                  {r.status === 'CONFIRMED' && (
                    <Button size="small" color="inherit" onClick={() => onCancel(r)}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
