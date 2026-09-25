import { api } from './client';
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export function login(email: string, password: string) {
  return api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data);
}

export function register(name: string, email: string, password: string) {
  return api.post<AuthResponse>('/auth/register', { name, email, password }).then((r) => r.data);
}

export function fetchMe() {
  return api.get<{ user: User }>('/auth/me').then((r) => r.data.user);
}

export function forgotPassword(email: string) {
  return api.post<{ message: string }>('/auth/forgot-password', { email }).then((r) => r.data.message);
}

export function resetPassword(token: string, password: string) {
  return api.post<{ message: string }>('/auth/reset-password', { token, password }).then((r) => r.data.message);
}
