import { useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getRoomAvailability } from '../api/rooms';

function toDateKey(year: number, month: number, day: number) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function AvailabilityCalendar({ roomId }: { roomId: string }) {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRoomAvailability(roomId, cursor.year, cursor.month)
      .then((res) => setUnavailable(new Set(res.unavailableDates)))
      .finally(() => setLoading(false));
  }, [roomId, cursor]);

  const monthLabel = useMemo(
    () =>
      new Date(cursor.year, cursor.month - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    [cursor]
  );

  const daysInMonth = new Date(cursor.year, cursor.month, 0).getDate();
  const firstWeekday = new Date(cursor.year, cursor.month - 1, 1).getDay();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  function shiftMonth(delta: number) {
    setCursor((prev) => {
      let month = prev.month + delta;
      let year = prev.year;
      if (month > 12) {
        month = 1;
        year += 1;
      } else if (month < 1) {
        month = 12;
        year -= 1;
      }
      return { year, month };
    });
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <IconButton size="small" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={700}>
          {monthLabel}
        </Typography>
        <IconButton size="small" onClick={() => shiftMonth(1)} aria-label="Next month">
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 0.5 }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <Typography key={d} variant="caption" align="center" color="text.secondary">
            {d}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, opacity: loading ? 0.5 : 1 }}>
        {cells.map((day, idx) => {
          if (day === null) return <Box key={`empty-${idx}`} />;
          const key = toDateKey(cursor.year, cursor.month, day);
          const isBooked = unavailable.has(key);
          const isPast = key < todayKey;
          return (
            <Box
              key={key}
              title={isBooked ? 'Booked' : 'Available'}
              sx={{
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                fontSize: 14,
                color: isPast ? 'text.disabled' : isBooked ? 'error.dark' : 'success.dark',
                bgcolor: isPast ? 'transparent' : isBooked ? 'error.light' : 'success.light',
              }}
            >
              {day}
            </Box>
          );
        })}
      </Box>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: 'success.light' }} />
          <Typography variant="caption" color="text.secondary">
            Available
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: 'error.light' }} />
          <Typography variant="caption" color="text.secondary">
            Booked
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
