import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong while connecting to the server.';

    window.dispatchEvent(
      new CustomEvent('api:error', {
        detail: {
          message,
          status: error?.response?.status,
        },
      }),
    );

    if (error?.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.user);
    }

    return Promise.reject(error);
  },
);

