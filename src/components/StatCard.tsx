import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SvgIconComponent } from '@mui/icons-material';

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: SvgIconComponent;
  label: string;
  value: string | number;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={800} lineHeight={1.1}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}
