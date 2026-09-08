import type { Doctor } from '@/lib/types';

export const HOSPITAL = {
  name: 'Uma Hospital',
  locality: 'Trimurti Chowk',
  city: 'Nashik',
  address: 'Trimurti Chowk, Nashik, Maharashtra',
  phone: '+91 253 XXX XX20',
  opdHours: '9:00 AM – 1:00 PM  ·  4:00 PM – 8:00 PM',
  emergency: '24 × 7',
} as const;

export const BRAND = {
  company: 'Kantex Technologies',
  product: 'AI Receptionist & Appointment Automation',
} as const;

export const DOCTORS: Doctor[] = [
  {
    id: 'deshmukh',
    name: 'Dr. Deshmukh',
    speciality: 'General Physician',
    room: 'OPD 2',
    slots: ['10:00 AM', '10:45 AM', '11:30 AM', '5:30 PM', '6:15 PM', '7:00 PM'],
  },
  {
    id: 'kulkarni',
    name: 'Dr. Kulkarni',
    speciality: 'Orthopaedics',
    room: 'OPD 4',
    slots: ['9:30 AM', '10:15 AM', '11:00 AM', '6:15 PM', '7:00 PM', '7:45 PM'],
  },
  {
    id: 'joshi',
    name: 'Dr. Joshi',
    speciality: 'Paediatrics',
    room: 'OPD 1',
    slots: ['9:00 AM', '9:45 AM', '10:30 AM', '4:30 PM', '5:15 PM', '6:00 PM'],
  },
  {
    id: 'shaikh',
    name: 'Dr. Shaikh',
    speciality: 'Cardiology',
    room: 'OPD 6',
    slots: ['11:00 AM', '11:45 AM', '12:30 PM', '5:00 PM', '5:45 PM'],
  },
];

export function doctorById(id: string): Doctor {
  return DOCTORS.find((d) => d.id === id) ?? DOCTORS[0];
}

export const HOUR_BUCKETS = [
  '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p',
];

/** Index into HOUR_BUCKETS for the current local hour (clamped to the OPD day). */
export function currentHourBucket(): number {
  const h = new Date().getHours();
  return Math.min(Math.max(h - 8, 0), HOUR_BUCKETS.length - 1);
}
