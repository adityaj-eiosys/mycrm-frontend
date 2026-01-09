export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const ROLES = {
  ADMIN: 'ADMIN',
  SALES: 'SALES',
  USER: 'USER',
} as const;

export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  WON: 'WON',
  LOST: 'LOST',
} as const;
