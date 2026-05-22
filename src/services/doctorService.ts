import { api } from '@/services/api';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  hospital: string;
  nextAvailable: string;
  experience: number;
  fee: number;
  languages: string[];
  about: string;
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiologist',
    rating: 4.8,
    reviews: 312,
    location: 'Lucknow',
    hospital: 'Apollo Med Center',
    nextAvailable: 'Today 4:30 PM',
    experience: 12,
    fee: 500,
    languages: ['EN', 'HI'],
    about: 'Cardiology specialist focused on preventive heart care and lipid profile management.',
  },
  {
    id: 'doc-2',
    name: 'Dr. Raghav Iyer',
    specialty: 'Endocrinologist',
    rating: 4.5,
    reviews: 205,
    location: 'Lucknow',
    hospital: 'CityCare Hospital',
    nextAvailable: 'Tomorrow 11:00 AM',
    experience: 10,
    fee: 600,
    languages: ['EN', 'HI'],
    about: 'Diabetes and hormone disorders specialist with decade-long clinical expertise.',
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Khanna',
    specialty: 'Hematologist',
    rating: 4.9,
    reviews: 174,
    location: 'Lucknow',
    hospital: 'HealthFirst Specialty',
    nextAvailable: 'Today 6:00 PM',
    experience: 14,
    fee: 700,
    languages: ['EN', 'HI'],
    about: 'Experienced in anemia, blood disorders, and AI-assisted pathology interpretation.',
  },
];

export const doctorService = {
  async searchDoctors(query: Record<string, string | boolean>) {
    try {
      const { data } = await api.get<Doctor[]>('/doctors/search', { params: query });
      return data;
    } catch {
      return MOCK_DOCTORS;
    }
  },
};

