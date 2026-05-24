export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
  avatarUrl?: string;
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

export interface PatientSignupProfile {
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  emergencyContact: string;
}

export interface DoctorSignupProfile {
  licenseNumber: string;
  specialization: string;
  hospitalName: string;
  yearsOfExperience: number;
  consultationMode: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  verificationUploadName: string;
  linkedinProfile?: string;
  availableTimings?: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  patientProfile?: PatientSignupProfile;
  doctorProfile?: DoctorSignupProfile;
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

