import { api } from './client';
import { Room, RoomAvailability } from '../types';

export interface RoomInput {
  name: string;
  type: string;
  description?: string;
  capacity: number;
  pricePerNight: number;
  imageUrl?: string;
  isActive?: boolean;
}

export function listRooms() {
  return api.get<{ rooms: Room[] }>('/rooms').then((r) => r.data.rooms);
}

export function listAllRoomsForAdmin() {
  return api.get<{ rooms: Room[] }>('/rooms/admin/all').then((r) => r.data.rooms);
}

export interface SearchParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export function searchRooms(params: SearchParams) {
  return api
    .get<{ rooms: Room[]; filtered: boolean }>('/rooms/search', { params })
    .then((r) => r.data);
}

export function getRoom(id: string) {
  return api.get<{ room: Room }>(`/rooms/${id}`).then((r) => r.data.room);
}

export function getRoomAvailability(id: string, year: number, month: number) {
  return api
    .get<RoomAvailability>(`/rooms/${id}/availability`, { params: { year, month } })
    .then((r) => r.data);
}

export function createRoom(input: RoomInput) {
  return api.post<{ room: Room }>('/rooms', input).then((r) => r.data.room);
}

export function updateRoom(id: string, input: Partial<RoomInput>) {
  return api.put<{ room: Room }>(`/rooms/${id}`, input).then((r) => r.data.room);
}

export function deleteRoom(id: string) {
  return api.delete<{ room: Room }>(`/rooms/${id}`).then((r) => r.data.room);
}
