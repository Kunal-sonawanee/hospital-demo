import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type {
  ActivityItem,
  Analytics,
  Appointment,
  AppointmentSource,
  CallCategory,
  DemoIntent,
  Kpis,
  Toast,
  WhatsAppMessage,
} from '@/lib/types';
import {
  SEED_ACTIVITY,
  SEED_ANALYTICS,
  SEED_APPOINTMENTS,
  SEED_KPIS,
  SEED_WHATSAPP,
} from '@/data/seed';
import { doctorById, currentHourBucket } from '@/data/hospital';
import { formatLong, formatShort, isoDate, nowClock, relativeLabel } from '@/lib/date';

export interface WhatsAppLogEntry {
  id: string;
  type: 'Confirmation' | 'Reminder' | 'Location';
  to: string;
  patient: string;
  body: string;
  status: 'Delivered' | 'Scheduled';
  time: string;
}

interface DemoState {
  kpis: Kpis;
  analytics: Analytics;
  appointments: Appointment[];
  activity: ActivityItem[];
  thread: WhatsAppMessage[];
  log: WhatsAppLogEntry[];
  toasts: Toast[];
  highlightId: string | null;
  callsSimulated: number;
}

const SEED_LOG: WhatsAppLogEntry[] = [
  {
    id: 'log-1',
    type: 'Reminder',
    to: '+91 99XXXXXX17',
    patient: 'Sneha Wagh',
    body: 'Reminder: appointment with Dr. Joshi today at 5:15 PM at Uma Hospital.',
    status: 'Delivered',
    time: '3:30 PM',
  },
  {
    id: 'log-2',
    type: 'Confirmation',
    to: '+91 82XXXXXX40',
    patient: 'Aditya Rane',
    body: 'Confirmed: Dr. Deshmukh, today 6:15 PM, Uma Hospital.',
    status: 'Delivered',
    time: '2:04 PM',
  },
  {
    id: 'log-3',
    type: 'Location',
    to: '+91 90XXXXXX21',
    patient: 'Enquiry',
    body: 'Uma Hospital, Trimurti Chowk, Nashik — map link shared.',
    status: 'Delivered',
    time: '1:12 PM',
  },
];

function initialState(): DemoState {
  return {
    kpis: { ...SEED_KPIS },
    analytics: {
      ...SEED_ANALYTICS,
      categories: { ...SEED_ANALYTICS.categories },
      hourly: [...SEED_ANALYTICS.hourly],
    },
    appointments: [...SEED_APPOINTMENTS],
    activity: [...SEED_ACTIVITY],
    thread: [...SEED_WHATSAPP],
    log: [...SEED_LOG],
    toasts: [],
    highlightId: null,
    callsSimulated: 0,
  };
}

export interface BookingInput {
  patient: string;
  mobile: string;
  doctorId: string;
  date: string;
  time: string;
  source: AppointmentSource;
  reason?: string;
}

type Action =
  | { type: 'book'; input: BookingInput; id: string }
  | { type: 'log-call'; intent: DemoIntent }
  | { type: 'thread-append'; message: WhatsAppMessage }
  | { type: 'thread-select'; messageId: string; option: string }
  | { type: 'thread-reset' }
  | { type: 'toast'; toast: Toast }
  | { type: 'toast-dismiss'; id: string }
  | { type: 'clear-highlight' }
  | { type: 'reset' };

const MINUTES_SAVED_PER_CALL = 4.5;

function bookingActivity(a: Appointment): ActivityItem {
  const when = relativeLabel(a.date) ?? formatShort(a.date);
  return {
    id: `act-${a.id}`,
    icon: 'calendar',
    title: `Appointment confirmed — ${a.patient}`,
    detail: `${a.doctorName} · ${when}, ${a.time}`,
    time: 'just now',
    tone: 'brand',
  };
}

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'book': {
      const { input, id } = action;
      const doctor = doctorById(input.doctorId);
      const appointment: Appointment = {
        id,
        patient: input.patient.trim(),
        mobile: input.mobile.trim(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: input.date,
        time: input.time,
        status: 'Confirmed',
        source: input.source,
        reason: input.reason,
        createdAt: Date.now(),
        isNew: true,
      };

      const confirmation: WhatsAppLogEntry = {
        id: `log-${id}-c`,
        type: 'Confirmation',
        to: appointment.mobile,
        patient: appointment.patient,
        body: `Confirmed: ${doctor.name}, ${formatLong(appointment.date)} at ${appointment.time}, Uma Hospital.`,
        status: 'Delivered',
        time: nowClock(),
      };
      const reminder: WhatsAppLogEntry = {
        id: `log-${id}-r`,
        type: 'Reminder',
        to: appointment.mobile,
        patient: appointment.patient,
        body: `Reminder scheduled — 2 hours before ${appointment.time} on ${formatShort(appointment.date)}.`,
        status: 'Scheduled',
        time: nowClock(),
      };

      return {
        ...state,
        appointments: [
          appointment,
          ...state.appointments.map((a) => (a.isNew ? { ...a, isNew: false } : a)),
        ],
        kpis: {
          ...state.kpis,
          appointmentsBooked: state.kpis.appointmentsBooked + 1,
        },
        log: [confirmation, reminder, ...state.log],
        activity: [bookingActivity(appointment), ...state.activity].slice(0, 12),
        highlightId: id,
      };
    }

    case 'log-call': {
      const { intent } = action;
      const handled = intent.outcome === 'ai-handled';
      const bucket = currentHourBucket();
      const hourly = [...state.analytics.hourly];
      hourly[bucket] = (hourly[bucket] ?? 0) + 1;
      const category: CallCategory = intent.category;

      return {
        ...state,
        callsSimulated: state.callsSimulated + 1,
        kpis: {
          ...state.kpis,
          callsHandled: state.kpis.callsHandled + (handled ? 1 : 0),
          minutesSaved: state.kpis.minutesSaved + (handled ? MINUTES_SAVED_PER_CALL : 1.5),
        },
        analytics: {
          ...state.analytics,
          totalCalls: state.analytics.totalCalls + 1,
          handledByAI: state.analytics.handledByAI + (handled ? 1 : 0),
          transferred: state.analytics.transferred + (handled ? 0 : 1),
          categories: {
            ...state.analytics.categories,
            [category]: (state.analytics.categories[category] ?? 0) + 1,
          },
          hourly,
        },
        activity: [
          {
            id: `act-call-${state.callsSimulated + 1}`,
            icon: handled ? ('call' as const) : ('user' as const),
            title: handled
              ? `Call handled — ${intent.label.toLowerCase()}`
              : 'Transferred to front desk',
            detail: handled
              ? 'AI Receptionist · simulated demo call'
              : 'Human hand-off · simulated demo call',
            time: 'just now',
            tone: handled ? ('brand' as const) : ('neutral' as const),
          },
          ...state.activity,
        ].slice(0, 12),
      };
    }

    case 'thread-append':
      return { ...state, thread: [...state.thread, action.message] };

    case 'thread-select':
      return {
        ...state,
        thread: state.thread.map((m) =>
          m.id === action.messageId ? { ...m, selected: action.option } : m,
        ),
      };

    case 'thread-reset':
      return { ...state, thread: [...SEED_WHATSAPP] };

    case 'toast':
      return { ...state, toasts: [...state.toasts, action.toast] };

    case 'toast-dismiss':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case 'clear-highlight':
      return { ...state, highlightId: null };

    case 'reset':
      return initialState();

    default:
      return state;
  }
}

interface DemoContextValue extends DemoState {
  bookAppointment: (input: BookingInput) => void;
  logCall: (intent: DemoIntent) => void;
  appendThreadMessage: (message: WhatsAppMessage) => void;
  selectThreadOption: (messageId: string, option: string) => void;
  resetThread: () => void;
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  clearHighlight: () => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const counter = useRef(0);

  const nextId = useCallback((prefix: string) => {
    counter.current += 1;
    return `${prefix}-${Date.now().toString(36)}-${counter.current}`;
  }, []);

  const bookAppointment = useCallback(
    (input: BookingInput) => {
      dispatch({ type: 'book', input, id: nextId('apt') });
    },
    [nextId],
  );

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = nextId('toast');
      dispatch({ type: 'toast', toast: { ...toast, id } });
      window.setTimeout(() => dispatch({ type: 'toast-dismiss', id }), 5200);
    },
    [nextId],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      bookAppointment,
      logCall: (intent) => dispatch({ type: 'log-call', intent }),
      appendThreadMessage: (message) => dispatch({ type: 'thread-append', message }),
      selectThreadOption: (messageId, option) =>
        dispatch({ type: 'thread-select', messageId, option }),
      resetThread: () => dispatch({ type: 'thread-reset' }),
      pushToast,
      dismissToast: (id) => dispatch({ type: 'toast-dismiss', id }),
      clearHighlight: () => dispatch({ type: 'clear-highlight' }),
      resetDemo: () => dispatch({ type: 'reset' }),
    }),
    [state, bookAppointment, pushToast],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>');
  return ctx;
}

export const DEMO_DATES = {
  today: isoDate(0),
  tomorrow: isoDate(1),
};
