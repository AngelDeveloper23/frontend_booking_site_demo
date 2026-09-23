import { api } from './client';
import { Reservation } from '../types';

export interface CreateReservationInput {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function createReservation(input: CreateReservationInput) {
  return api.post<{ reservation: Reservation }>('/reservations', input).then((r) => r.data.reservation);
}

export function listMyReservations() {
  return api.get<{ reservations: Reservation[] }>('/reservations/mine').then((r) => r.data.reservations);
}

export function listAllReservations() {
  return api.get<{ reservations: Reservation[] }>('/reservations').then((r) => r.data.reservations);
}

export function cancelReservation(id: string) {
  return api.patch<{ reservation: Reservation }>(`/reservations/${id}/cancel`).then((r) => r.data.reservation);
}
