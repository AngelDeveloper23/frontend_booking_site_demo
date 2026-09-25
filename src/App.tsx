import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { RoomDetails } from './pages/RoomDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { MyReservations } from './pages/MyReservations';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRooms } from './pages/admin/AdminRooms';
import { AdminReservations } from './pages/admin/AdminReservations';
import { AdminUsers } from './pages/admin/AdminUsers';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffRooms } from './pages/staff/StaffRooms';
import { StaffReservations } from './pages/staff/StaffReservations';
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute allow={['GUEST']}>
                <MyReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allow={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute allow={['ADMIN']}>
                <AdminRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute allow={['ADMIN']}>
                <AdminReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allow={['ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allow={['STAFF', 'ADMIN']}>
                <StaffDashboard />
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
          <Route
            path="/staff/reservations"
            element={
              <ProtectedRoute allow={['STAFF', 'ADMIN']}>
                <StaffReservations />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}
