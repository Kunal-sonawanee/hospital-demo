import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { DOCTORS, doctorById } from '@/data/hospital';
import { formatLong, isoDate } from '@/lib/date';
import { useDemo } from '@/store/demo';

const STEPS = [
  { label: 'Appointment added', detail: 'Visible to the front desk immediately' },
  { label: 'WhatsApp confirmation sent', detail: 'Delivered to the patient’s number' },
  { label: 'Reminder scheduled', detail: '2 hours before the appointment' },
];

export function BookingModal({
  open,
  onClose,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate: string;
}) {
  const { bookAppointment, pushToast } = useDemo();
  const [phase, setPhase] = useState<'form' | 'success'>('form');
  const [revealed, setRevealed] = useState(0);
  const [patient, setPatient] = useState('');
  const [mobile, setMobile] = useState('');
  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(DOCTORS[0].slots[3]);
  const [touched, setTouched] = useState(false);

  const doctor = doctorById(doctorId);
  const slots = doctor.slots;

  useEffect(() => {
    if (!slots.includes(time)) setTime(slots[0]);
  }, [slots, time]);

  useEffect(() => {
    if (open) {
      setPhase('form');
      setRevealed(0);
      setTouched(false);
      setPatient('');
      setMobile('');
      setDate(defaultDate);
    }
  }, [open, defaultDate]);

  useEffect(() => {
    if (phase !== 'success') return;
    const timers = STEPS.map((_, i) =>
      window.setTimeout(() => setRevealed(i + 1), 380 + i * 620),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [phase]);

  const errors = useMemo(() => {
    const digits = mobile.replace(/\D/g, '');
    return {
      patient: patient.trim().length < 2 ? 'Enter the patient’s name' : '',
      mobile: digits.length < 10 ? 'Enter a 10-digit mobile number' : '',
    };
  }, [patient, mobile]);

  const valid = !errors.patient && !errors.mobile;

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    bookAppointment({
      patient,
      mobile: mobile.startsWith('+') ? mobile : `+91 ${mobile.replace(/\D/g, '')}`,
      doctorId,
      date,
      time,
      source: 'Front Desk',
      reason: 'Booked from dashboard',
    });
    pushToast({
      tone: 'good',
      title: 'Appointment booked',
      detail: `${patient.trim()} · ${doctor.name} · ${time}`,
    });
    setPhase('success');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={phase === 'form' ? 'Book appointment' : 'Appointment booked'}
      subtitle={
        phase === 'form'
          ? 'Uma Hospital · slots shown are the doctor’s open OPD times'
          : undefined
      }
      footer={
        phase === 'form' ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button icon="check" onClick={submit}>
              Confirm booking
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Done</Button>
        )
      }
    >
      {phase === 'form' ? (
        <div className="space-y-4">
          <Field label="Patient name" error={touched ? errors.patient : ''}>
            <Input
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="e.g. Rahul Patil"
              autoComplete="off"
            />
          </Field>

          <Field label="Mobile number" hint="WhatsApp confirmation is sent here" error={touched ? errors.mobile : ''}>
            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="98XXXXXX42"
              inputMode="tel"
              autoComplete="off"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Doctor">
              <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                {DOCTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.speciality}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Date">
              <Select value={date} onChange={(e) => setDate(e.target.value)}>
                {[0, 1, 2, 3, 4].map((offset) => {
                  const iso = isoDate(offset);
                  return (
                    <option key={iso} value={iso}>
                      {offset === 0 ? 'Today · ' : offset === 1 ? 'Tomorrow · ' : ''}
                      {formatLong(iso)}
                    </option>
                  );
                })}
              </Select>
            </Field>
          </div>

          <Field label="Time" hint={`${doctor.room} · ${doctor.speciality}`}>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={
                    'rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors ' +
                    (slot === time
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                      : 'border-line bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50')
                  }
                >
                  {slot}
                </button>
              ))}
            </div>
          </Field>

          <p className="flex items-start gap-2 rounded-lg bg-ink-50 px-3 py-2.5 text-[12px] leading-relaxed text-ink-500">
            <Icon name="info" size={14} className="mt-[1px] shrink-0 text-ink-400" />
            Demo Mode — this booking is stored in the browser only. No message is sent to a real
            number and no record leaves this page.
          </p>
        </div>
      ) : (
        <div className="py-2">
          <div className="flex flex-col items-center text-center">
            <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/60 animate-pop">
              <Icon name="check" size={26} strokeWidth={2.4} />
            </span>
            <p className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-ink-900">
              Appointment booked
            </p>
            <p className="mt-1.5 text-[13.5px] text-ink-500">
              {patient.trim()} · {doctor.name} · {formatLong(date)}, {time}
            </p>
          </div>

          <ul className="mt-6 space-y-2.5">
            {STEPS.map((step, i) => (
              <li
                key={step.label}
                className={
                  'flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-all duration-500 ' +
                  (i < revealed
                    ? 'border-brand-200 bg-brand-50/60 opacity-100 translate-y-0'
                    : 'border-line bg-white opacity-35 translate-y-1')
                }
              >
                <span
                  className={
                    'mt-[1px] grid size-[19px] shrink-0 place-items-center rounded-full transition-colors ' +
                    (i < revealed ? 'bg-brand-600 text-white' : 'bg-ink-200 text-white')
                  }
                >
                  <Icon name="check" size={11} strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-ink-900">{step.label}</span>
                  <span className="block text-[12px] text-ink-500">{step.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
