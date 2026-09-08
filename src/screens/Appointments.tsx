import { useEffect, useMemo, useState } from 'react';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Field';
import { BookingModal } from '@/components/appointments/BookingModal';
import { useDemo } from '@/store/demo';
import {
  dayOfMonth,
  formatDayLong,
  formatShort,
  isoDate,
  relativeLabel,
  timeToMinutes,
  weekdayShort,
} from '@/lib/date';
import type { Appointment, AppointmentSource, AppointmentStatus } from '@/lib/types';
import { cn } from '@/lib/cn';

const DAY_OFFSETS = [0, 1, 2, 3, 4, 5, 6];

const STATUS_TONE: Record<AppointmentStatus, 'good' | 'warning' | 'info' | 'neutral'> = {
  Confirmed: 'good',
  Pending: 'warning',
  Rescheduled: 'info',
  Completed: 'neutral',
};

const SOURCE_META: Record<AppointmentSource, { tone: 'brand' | 'whatsapp' | 'neutral'; icon: 'headset' | 'message' | 'users' }> = {
  'AI Receptionist': { tone: 'brand', icon: 'headset' },
  WhatsApp: { tone: 'whatsapp', icon: 'message' },
  'Front Desk': { tone: 'neutral', icon: 'users' },
};

export function Appointments() {
  const { appointments, highlightId, clearHighlight } = useDemo();
  const [selectedDate, setSelectedDate] = useState(() => isoDate(1));
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Jump to the date of a freshly created booking so the new row is visible.
  useEffect(() => {
    if (!highlightId) return;
    const created = appointments.find((a) => a.id === highlightId);
    if (created) setSelectedDate(created.date);
    const t = window.setTimeout(clearHighlight, 4200);
    return () => window.clearTimeout(t);
  }, [highlightId, appointments, clearHighlight]);

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    appointments.forEach((a) => map.set(a.date, (map.get(a.date) ?? 0) + 1));
    return map;
  }, [appointments]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments
      .filter((a) => a.date === selectedDate)
      .filter(
        (a) =>
          q === '' ||
          a.patient.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.mobile.toLowerCase().includes(q),
      )
      .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }, [appointments, selectedDate, query]);

  const aiShare = useMemo(() => {
    const forDate = appointments.filter((a) => a.date === selectedDate);
    if (forDate.length === 0) return 0;
    const automated = forDate.filter((a) => a.source !== 'Front Desk').length;
    return Math.round((automated / forDate.length) * 100);
  }, [appointments, selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Appointment book"
          title="Appointments"
          description="Everything the AI Receptionist and WhatsApp book lands here, alongside walk-in and front-desk entries."
        />
        <Button icon="plus" onClick={() => setModalOpen(true)}>
          Book Appointment
        </Button>
      </div>

      <Card padded={false}>
        <div className="flex items-center gap-2 overflow-x-auto scroll-thin p-4">
          {DAY_OFFSETS.map((offset) => {
            const iso = isoDate(offset);
            const active = iso === selectedDate;
            const count = countsByDate.get(iso) ?? 0;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelectedDate(iso)}
                aria-pressed={active}
                className={cn(
                  'group flex min-w-[76px] shrink-0 flex-col items-center gap-1 rounded-xl border px-3 py-2.5 transition-all duration-150',
                  active
                    ? 'border-brand-500 bg-brand-600 text-white shadow-[0_1px_2px_rgba(11,22,34,0.14)]'
                    : 'border-line bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
                )}
              >
                <span
                  className={cn(
                    'text-[10.5px] font-semibold uppercase tracking-[0.1em]',
                    active ? 'text-white/70' : 'text-ink-400',
                  )}
                >
                  {relativeLabel(iso) ?? weekdayShort(iso)}
                </span>
                <span className="text-[19px] font-semibold leading-none tracking-[-0.02em]">
                  {dayOfMonth(iso)}
                </span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10.5px] font-medium tabular',
                    active ? 'bg-white/15 text-white' : 'bg-ink-100 text-ink-500',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">
            <div className="relative">
              <Icon
                name="search"
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patient or doctor"
                className="w-[230px] pl-9"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line bg-ink-50/50 px-5 py-3">
          <p className="text-[13px] font-medium text-ink-700">
            {formatDayLong(selectedDate)}
            <span className="ml-2 font-normal text-ink-400">
              {rows.length} appointment{rows.length === 1 ? '' : 's'}
            </span>
          </p>
          <p className="text-[12px] text-ink-500">
            <span className="font-semibold text-brand-700">{aiShare}%</span> booked without staff
            involvement
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="grid size-11 place-items-center rounded-xl bg-ink-100 text-ink-400">
              <Icon name="calendar" size={20} />
            </span>
            <p className="mt-4 text-[14px] font-medium text-ink-700">No appointments</p>
            <p className="mt-1.5 max-w-xs text-[13px] text-ink-500">
              Nothing booked for this day yet. Run a call on the AI Receptionist screen or add one
              manually.
            </p>
          </div>
        ) : (
          <>
            {/* desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    {['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Source'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <Row key={row.id} row={row} highlighted={row.id === highlightId} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <ul className="divide-y divide-line md:hidden">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className={cn(
                    'p-4 transition-colors',
                    row.id === highlightId && 'bg-brand-50/70',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-ink-900">{row.patient}</p>
                      <p className="mt-0.5 truncate text-[12.5px] text-ink-500">
                        {row.doctorName} · {row.time}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <SourceTag source={row.source} />
                    <span className="tabular text-[11.5px] text-ink-400">{row.mobile}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultDate={selectedDate}
      />
    </div>
  );
}

function Row({ row, highlighted }: { row: Appointment; highlighted: boolean }) {
  return (
    <tr
      className={cn(
        'border-b border-line transition-colors duration-500 last:border-0',
        highlighted ? 'bg-brand-50/70' : 'hover:bg-ink-50/70',
      )}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink-100 text-[12px] font-semibold text-ink-600">
            {row.patient
              .split(' ')
              .slice(0, 2)
              .map((p) => p[0])
              .join('')}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-ink-900">
              {row.patient}
              {highlighted && (
                <span className="ml-2 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  New
                </span>
              )}
            </p>
            <p className="truncate tabular text-[11.5px] text-ink-400">{row.mobile}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <p className="text-[13.5px] text-ink-800">{row.doctorName}</p>
        {row.reason && <p className="text-[11.5px] text-ink-400">{row.reason}</p>}
      </td>
      <td className="px-5 py-3.5 text-[13.5px] tabular text-ink-700">
        {formatShort(row.date)}
        {relativeLabel(row.date) && (
          <span className="ml-1.5 text-[11.5px] text-ink-400">{relativeLabel(row.date)}</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-[13.5px] tabular font-medium text-ink-900">{row.time}</td>
      <td className="px-5 py-3.5">
        <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>
      </td>
      <td className="px-5 py-3.5">
        <SourceTag source={row.source} />
      </td>
    </tr>
  );
}

function SourceTag({ source }: { source: AppointmentSource }) {
  const meta = SOURCE_META[source];
  return (
    <Badge tone={meta.tone}>
      <Icon name={meta.icon} size={11} />
      {source}
    </Badge>
  );
}
