import { useCallback, useState } from 'react';
import { intentById } from '@/data/conversations';
import type { DemoIntent, IntentId } from '@/lib/types';
import { useDemo } from '@/store/demo';
import { isoDate } from '@/lib/date';
import { useCallSimulation } from './useCallSimulation';

export interface AutomationStep {
  label: string;
  detail: string;
}

/**
 * Wires the scripted call simulation to the shared demo state: a finished call
 * updates analytics, and a booking intent also writes the appointment, the
 * WhatsApp confirmation and the scheduled reminder.
 */
export function useDemoCall(intentId: IntentId) {
  const intent = intentById(intentId);
  const { logCall, bookAppointment, pushToast } = useDemo();
  const [steps, setSteps] = useState<AutomationStep[]>([]);

  const onComplete = useCallback(
    (finished: DemoIntent) => {
      logCall(finished);

      if (finished.booking) {
        const date = isoDate(finished.booking.dayOffset);
        bookAppointment({
          patient: finished.booking.patient,
          mobile: finished.booking.mobile,
          doctorId: finished.booking.doctorId,
          date,
          time: finished.booking.time,
          source: 'AI Receptionist',
          reason: finished.booking.reason,
        });
        setSteps([
          { label: 'Appointment added', detail: 'Written to the hospital appointment book' },
          { label: 'WhatsApp confirmation sent', detail: `${finished.booking.mobile} · delivered` },
          { label: 'Reminder scheduled', detail: '2 hours before the appointment' },
        ]);
        pushToast({
          tone: 'good',
          title: 'Appointment booked by the AI Receptionist',
          detail: `${finished.booking.patient} · ${finished.booking.time}`,
        });
      } else if (finished.outcome === 'transferred') {
        setSteps([
          { label: 'Call transferred', detail: 'Handed to the front desk ring group' },
          { label: 'Context passed to staff', detail: 'Caller number and reason attached' },
          { label: 'Logged in analytics', detail: 'Counted as a staff-handled call' },
        ]);
        pushToast({
          tone: 'brand',
          title: 'Call transferred to hospital staff',
          detail: 'The AI never blocks a caller who needs a human.',
        });
      } else {
        setSteps([
          { label: 'Enquiry answered', detail: 'No staff time used' },
          { label: 'Details sent on WhatsApp', detail: 'Follow-up message queued' },
          { label: 'Logged in analytics', detail: `Category: ${finished.category}` },
        ]);
        pushToast({
          tone: 'brand',
          title: 'Call handled by the AI Receptionist',
          detail: `${finished.category} enquiry · no staff involvement`,
        });
      }
    },
    [bookAppointment, logCall, pushToast],
  );

  const sim = useCallSimulation({ intent, onComplete });
  const { start: simStart, reset: simReset } = sim;

  const start = useCallback(() => {
    setSteps([]);
    simStart();
  }, [simStart]);

  const reset = useCallback(() => {
    setSteps([]);
    simReset();
  }, [simReset]);

  return { ...sim, intent, steps, start, reset };
}
