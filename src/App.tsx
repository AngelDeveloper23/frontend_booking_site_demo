import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { RoomDetails } from './pages/RoomDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminRooms } from './pages/admin/AdminRooms';
import { StaffRooms } from './pages/staff/StaffRooms';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute allow={['ADMIN']}>
                <AdminRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/rooms"
            element={
              <ProtectedRoute allow={['STAFF', 'ADMIN']}>
                <StaffRooms />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}
