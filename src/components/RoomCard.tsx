import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import PeopleAltIcon from '@mui/icons-material/PeopleAltOutlined';
import { Room } from '../types';

export function RoomCard({ room, linkSearch }: { room: Room; linkSearch?: string }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={RouterLink}
        to={{ pathname: `/rooms/${room.id}`, search: linkSearch }}
        sx={{ flexGrow: 1, alignItems: 'stretch' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {room.imageUrl ? (
            <CardMedia component="img" image={room.imageUrl} alt={room.name} sx={{ aspectRatio: '4 / 3' }} />
          ) : (
            <Box
              sx={{
                aspectRatio: '4 / 3',
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.disabled',
              }}
            >
              No image
            </Box>
          )}

          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {room.name}
              </Typography>
              <Chip label={room.type} size="small" variant="outlined" color="secondary" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
              <PeopleAltIcon fontSize="inherit" />
              <Typography variant="body2">Sleeps up to {room.capacity}</Typography>
            </Box>

            <Typography variant="h6" sx={{ mt: 1.5 }}>
              ${room.pricePerNight.toFixed(0)}{' '}
              <Typography component="span" variant="body2" color="text.secondary">
                / night
              </Typography>
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}
