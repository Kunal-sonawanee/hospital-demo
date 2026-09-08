export type ScreenId =
  | 'overview'
  | 'receptionist'
  | 'appointments'
  | 'whatsapp'
  | 'analytics'
  | 'how-it-works';

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Rescheduled' | 'Completed';
export type AppointmentSource = 'AI Receptionist' | 'WhatsApp' | 'Front Desk';

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  room: string;
  slots: string[];
}

export interface Appointment {
  id: string;
  patient: string;
  mobile: string;
  doctorId: string;
  doctorName: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  /** Display time, e.g. "5:30 PM" */
  time: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  reason?: string;
  createdAt: number;
  isNew?: boolean;
}

export type Speaker = 'ai' | 'patient' | 'system';

export interface TranscriptTurn {
  speaker: Speaker;
  text: string;
  /** ms to "speak" this line before the next one begins */
  duration?: number;
}

export type IntentId =
  | 'book'
  | 'availability'
  | 'timings'
  | 'location'
  | 'reschedule'
  | 'staff'
  | 'medical';

export interface DemoIntent {
  id: IntentId;
  label: string;
  hint: string;
  category: CallCategory;
  /** does this scripted call end up transferred to a human? */
  outcome: 'ai-handled' | 'transferred';
  booking?: {
    patient: string;
    mobile: string;
    doctorId: string;
    time: string;
    /** 0 = today, 1 = tomorrow */
    dayOffset: number;
    reason: string;
  };
  turns: TranscriptTurn[];
}

export type CallCategory =
  | 'Appointment'
  | 'Doctor availability'
  | 'Hospital timings'
  | 'Location'
  | 'Other';

export type WhatsAppKind =
  | 'text'
  | 'options'
  | 'confirmation-card'
  | 'reminder'
  | 'system';

export interface WhatsAppMessage {
  id: string;
  from: 'patient' | 'hospital';
  kind: WhatsAppKind;
  text?: string;
  time: string;
  options?: string[];
  selected?: string;
  card?: {
    hospital: string;
    doctor: string;
    date: string;
    time: string;
    patient?: string;
    reference: string;
  };
}

export interface ActivityItem {
  id: string;
  icon: 'call' | 'calendar' | 'whatsapp' | 'bell' | 'user';
  title: string;
  detail: string;
  time: string;
  tone?: 'brand' | 'neutral' | 'good';
}

export interface Kpis {
  callsHandled: number;
  appointmentsBooked: number;
  missedRecovered: number;
  minutesSaved: number;
}

export interface Analytics {
  totalCalls: number;
  handledByAI: number;
  transferred: number;
  missedRecovered: number;
  categories: Record<CallCategory, number>;
  /** calls per hour bucket, index aligned with HOUR_BUCKETS */
  hourly: number[];
}

export interface Toast {
  id: string;
  title: string;
  detail?: string;
  tone: 'good' | 'brand';
}
