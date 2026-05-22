import { api } from '@/services/api';
import type { AuthResponse, LoginPayload, SignupPayload, User } from '@/types';

const DEMO_USER_BY_ROLE: Record<LoginPayload['role'], User> = {
  PATIENT: {
    id: 'pt-001',
    name: 'Aarav Kapoor',
    email: 'patient@mediscan.ai',
    role: 'PATIENT',
    avatarInitials: 'AK',
    plan: 'PRO',
  },
  DOCTOR: {
    id: 'dr-001',
    name: 'Dr. Rahul Mehta',
    email: 'doctor@mediscan.ai',
    role: 'DOCTOR',
    avatarInitials: 'RM',
    specialty: 'Cardiologist',
  },
  ADMIN: {
    id: 'ad-001',
    name: 'Neha Verma',
    email: 'admin@mediscan.ai',
    role: 'ADMIN',
    avatarInitials: 'NV',
  },
};

const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false';

const buildDemoResponse = (role: LoginPayload['role'], email?: string): AuthResponse => ({
  user: {
    ...DEMO_USER_BY_ROLE[role],
    email: email ?? DEMO_USER_BY_ROLE[role].email,
  },
  tokens: {
    accessToken: `demo-${role.toLowerCase()}-token`,
    refreshToken: `demo-refresh-${role.toLowerCase()}`,
  },
});

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', payload);
      return data;
    } catch (error) {
      if (isDemoMode) return buildDemoResponse(payload.role, payload.email);
      throw error;
    }
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/signup', payload);
      return data;
    } catch (error) {
      if (isDemoMode) {
        const demo = buildDemoResponse(payload.role, payload.email);
        return {
          ...demo,
          user: {
            ...demo.user,
            name: payload.name,
            avatarInitials: payload.name
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')
              .toUpperCase(),
          },
        };
      }
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};

