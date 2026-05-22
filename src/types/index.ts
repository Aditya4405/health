export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
  specialty?: string;
  plan?: 'FREE' | 'PRO' | 'TEAM';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}

export interface SignupPayload extends LoginPayload {
  name: string;
}

export interface ReportMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface ApiError {
  message: string;
  status?: number;
}

