import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export function NotFound() {
  return (
    <Box sx={{ maxWidth: 440, mx: 'auto', px: 3, py: 12, textAlign: 'center' }}>
      <Typography variant="h3" fontWeight={800}>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        This page does not exist.
      </Typography>
      <Link component={RouterLink} to="/" color="secondary">
        Back to search
      </Link>
    </Box>
  );
}
