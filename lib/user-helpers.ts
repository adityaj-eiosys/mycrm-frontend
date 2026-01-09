'use client';

import { User } from '@/types/user';
import { ROLES } from './constants';

export function isAdmin(user: User | null): boolean {
  return user?.role?.name === ROLES.ADMIN;
}

export function getUserRole(user: User | null): string {
  return user?.role?.name || 'USER';
}
