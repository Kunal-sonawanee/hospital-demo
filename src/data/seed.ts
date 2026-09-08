import type {
  ActivityItem,
  Analytics,
  Appointment,
  Kpis,
  WhatsAppMessage,
} from '@/lib/types';
import { isoDate, formatLong } from '@/lib/date';
import { doctorById } from './hospital';

const TODAY = isoDate(0);
const TOMORROW = isoDate(1);

let seq = 0;
const mk = (
  patient: string,
  mobile: string,
  doctorId: string,
  date: string,
  time: string,
  status: Appointment['status'],
  source: Appointment['source'],
  reason: string,
): Appointment => ({
  id: `seed-${++seq}`,
  patient,
  mobile,
  doctorId,
  doctorName: doctorById(doctorId).name,
  date,
  time,
  status,
  source,
  reason,
  createdAt: seq,
});

/**
 * Mock appointment book. No real patients — names, numbers and reasons are
 * fictional and the mobile numbers are deliberately masked.
 */
export const SEED_APPOINTMENTS: Appointment[] = [
  mk('Priya Shah', '+91 98XXXXXX07', 'kulkarni', TOMORROW, '6:15 PM', 'Confirmed', 'WhatsApp', 'Knee pain follow-up'),
  mk('Anjali Bhosale', '+91 97XXXXXX31', 'joshi', TOMORROW, '4:30 PM', 'Confirmed', 'AI Receptionist', 'Child vaccination'),
  mk('Imran Shaikh', '+91 90XXXXXX88', 'shaikh', TOMORROW, '5:00 PM', 'Confirmed', 'AI Receptionist', 'BP review'),
  mk('Vikram Jadhav', '+91 88XXXXXX54', 'deshmukh', TOMORROW, '7:00 PM', 'Pending', 'WhatsApp', 'Fever, 2 days'),
  mk('Meera Kulkarni', '+91 99XXXXXX12', 'deshmukh', TODAY, '9:00 AM', 'Completed', 'Front Desk', 'Routine check-up'),
  mk('Sachin Pawar', '+91 96XXXXXX76', 'kulkarni', TODAY, '9:30 AM', 'Completed', 'AI Receptionist', 'Back pain'),
  mk('Rohini Deshpande', '+91 70XXXXXX23', 'joshi', TODAY, '10:30 AM', 'Completed', 'AI Receptionist', 'Paediatric review'),
  mk('Nitin Gaikwad', '+91 93XXXXXX65', 'shaikh', TODAY, '11:45 AM', 'Completed', 'WhatsApp', 'ECG report reading'),
  mk('Sneha Wagh', '+91 99XXXXXX17', 'joshi', TODAY, '5:15 PM', 'Confirmed', 'AI Receptionist', 'Cold and cough'),
  mk('Aditya Rane', '+91 82XXXXXX40', 'deshmukh', TODAY, '6:15 PM', 'Confirmed', 'AI Receptionist', 'Diabetes follow-up'),
  mk('Farhan Qureshi', '+91 84XXXXXX19', 'kulkarni', TODAY, '7:45 PM', 'Rescheduled', 'Front Desk', 'Physiotherapy referral'),
];

export const SEED_KPIS: Kpis = {
  callsHandled: 24,
  appointmentsBooked: 11,
  missedRecovered: 7,
  minutesSaved: 222,
};

export const SEED_ANALYTICS: Analytics = {
  totalCalls: 32,
  handledByAI: 24,
  transferred: 5,
  missedRecovered: 3,
  categories: {
    Appointment: 18,
    'Doctor availability': 5,
    'Hospital timings': 4,
    Location: 3,
    Other: 2,
  },
  //        8a 9a 10a 11a 12p 1p 2p 3p 4p 5p 6p 7p 8p
  hourly: [1, 3, 4, 5, 3, 2, 1, 2, 3, 4, 2, 1, 1],
};

export const SEED_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    icon: 'calendar',
    title: 'Appointment confirmed — Aditya Rane',
    detail: 'Dr. Deshmukh · Today, 6:15 PM',
    time: '12 min ago',
    tone: 'brand',
  },
  {
    id: 'act-2',
    icon: 'call',
    title: 'Call handled — hospital timings',
    detail: '+91 90XXXXXX21 · 41s · no staff involvement',
    time: '18 min ago',
  },
  {
    id: 'act-3',
    icon: 'whatsapp',
    title: 'WhatsApp reminder delivered',
    detail: 'Sneha Wagh · Dr. Joshi, 5:15 PM',
    time: '34 min ago',
    tone: 'good',
  },
  {
    id: 'act-4',
    icon: 'user',
    title: 'Transferred to front desk',
    detail: 'Billing query · answered in 22s',
    time: '48 min ago',
  },
  {
    id: 'act-5',
    icon: 'call',
    title: 'Missed call recovered',
    detail: 'Line was busy · AI called back in 3 min',
    time: '1 hr ago',
  },
];

/** The scripted WhatsApp thread shown on the WhatsApp screen. */
export const SEED_WHATSAPP: WhatsAppMessage[] = [
  {
    id: 'wa-1',
    from: 'patient',
    kind: 'text',
    text: 'Hi, I want an appointment with Dr. Deshmukh tomorrow.',
    time: '4:58 PM',
  },
  {
    id: 'wa-2',
    from: 'hospital',
    kind: 'options',
    text: 'Certainly. Dr. Deshmukh is available at:',
    options: ['5:30 PM', '6:15 PM'],
    time: '4:58 PM',
  },
];

export const WHATSAPP_CONFIRMATION: WhatsAppMessage = {
  id: 'wa-confirm-card',
  from: 'hospital',
  kind: 'confirmation-card',
  text: 'Your appointment is confirmed.',
  time: '4:59 PM',
  card: {
    hospital: 'Uma Hospital',
    doctor: 'Dr. Deshmukh',
    date: formatLong(TOMORROW),
    time: '5:30 PM',
    patient: 'Rahul Patil',
    reference: 'UMA-4821',
  },
};

export const WHATSAPP_REMINDER: WhatsAppMessage = {
  id: 'wa-reminder',
  from: 'hospital',
  kind: 'reminder',
  text:
    'Reminder: You have an appointment with Dr. Deshmukh today at 5:30 PM at Uma Hospital.',
  time: '3:30 PM',
};
