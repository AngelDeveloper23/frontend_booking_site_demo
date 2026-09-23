import { api } from './client';
import { Role, User } from '../types';

export function listUsers() {
  return api.get<{ users: User[] }>('/users').then((r) => r.data.users);
}

export function updateUserRole(id: string, role: Role) {
  return api.patch<{ user: User }>(`/users/${id}/role`, { role }).then((r) => r.data.user);
}
