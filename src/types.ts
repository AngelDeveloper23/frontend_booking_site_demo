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
