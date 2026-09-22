import { FormEvent, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { Room } from '../../types';
import { createRoom, deleteRoom, listAllRoomsForAdmin, RoomInput, updateRoom } from '../../api/rooms';
import { extractErrorMessage } from '../../api/client';

const emptyForm: RoomInput = {
  name: '',
  type: '',
  description: '',
  capacity: 1,
  pricePerNight: 0,
  imageUrl: '',
};

export function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RoomInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    listAllRoomsForAdmin()
      .then(setRooms)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function startEdit(room: Room) {
    setEditingId(room.id);
    setForm({
      name: room.name,
      type: room.type,
      description: room.description ?? '',
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      imageUrl: room.imageUrl ?? '',
      isActive: room.isActive,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingId) {
        await updateRoom(editingId, form);
      } else {
        await createRoom(form);
      }
      cancelEdit();
      refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function onToggleActive(room: Room) {
    setError(null);
    try {
      if (room.isActive) {
        await deleteRoom(room.id);
      } else {
        await updateRoom(room.id, { isActive: true });
      }
      refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800}>
        Manage Rooms
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Admin-only. Create, edit, and deactivate rooms.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          mt: 4,
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' },
          alignItems: 'start',
        }}
      >
        <Paper variant="outlined" component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            {editingId ? 'Edit room' : 'New room'}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Name"
              required
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Type"
              required
              fullWidth
              size="small"
              placeholder="Single, Double, Suite…"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Capacity"
                type="number"
                required
                fullWidth
                size="small"
                inputProps={{ min: 1 }}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              />
              <TextField
                label="Price / night"
                type="number"
                required
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: Number(e.target.value) })}
              />
            </Stack>
            <TextField
              label="Image URL"
              fullWidth
              size="small"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />

            <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
              <Button type="submit" variant="contained" color="secondary" fullWidth disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create room'}
              </Button>
              {editingId && (
                <Button type="button" variant="outlined" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} color="secondary" />
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{room.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{room.type}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{room.capacity}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>${room.pricePerNight.toFixed(0)}</TableCell>
                    <TableCell>
                      <Chip
                        label={room.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={room.isActive ? 'success' : 'default'}
                        variant={room.isActive ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" color="secondary" onClick={() => startEdit(room)}>
                        Edit
                      </Button>
                      <Button size="small" color="inherit" onClick={() => onToggleActive(room)}>
                        {room.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
