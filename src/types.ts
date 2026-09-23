export type Role = 'GUEST' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  description: string | null;
  capacity: number;
  pricePerNight: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomAvailability {
  roomId: string;
  year: number;
  month: number;
  unavailableDates: string[];
}

export type ReservationStatus = 'CONFIRMED' | 'CANCELLED';

export interface RoomSummary {
  id: string;
  name: string;
  type: string;
  imageUrl: string | null;
  pricePerNight: number;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: ReservationStatus;
  createdAt: string;
  room: RoomSummary;
  user?: UserSummary;
}
