export const STORAGE_KEYS = {
  token: 'mediscan_auth_token',
  refreshToken: 'mediscan_refresh_token',
  user: 'mediscan_user',
  theme: 'mediscan_theme',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const APP_NAME = 'MediScan AI';

