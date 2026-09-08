import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Card, CardHeader } from '@/components/ui/Card';
import { FlowStrip } from '@/components/overview/FlowStrip';
import { TryReceptionist } from '@/components/overview/TryReceptionist';
import { useDemo } from '@/store/demo';
import { HOSPITAL } from '@/data/hospital';
import { formatDuration } from '@/lib/date';
import type { ScreenId } from '@/lib/types';
import { cn } from '@/lib/cn';

const ACTIVITY_ICON: Record<string, IconName> = {
  call: 'phone',
  calendar: 'calendar',
  whatsapp: 'message',
  bell: 'bell',
  user: 'users',
};

export function Overview({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { kpis, activity, analytics } = useDemo();

  return (
    <div className="space-y-6">
      <section className="card relative overflow-hidden">
        <div className="grid-dots pointer-events-none absolute inset-0 opacity-45" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, #fff 55%), radial-gradient(70% 90% at 88% 0%, rgba(15,118,110,0.10) 0%, transparent 70%)',
          }}
        />
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_1fr] lg:p-10">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand" dot>
                {HOSPITAL.name} · {HOSPITAL.locality}, {HOSPITAL.city}
              </Badge>
              <Badge tone="neutral">Demo Mode</Badge>
            </div>

            <h1 className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink-900 sm:text-[44px]">
              Your hospital’s
              <br className="hidden sm:block" /> AI receptionist.
            </h1>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-ink-500">
              Answer routine calls, manage appointments and keep patients updated — 24/7.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button size="lg" icon="phone" onClick={() => onNavigate('receptionist')}>
                Try the AI Receptionist
              </Button>
              <Button
                size="lg"
                variant="secondary"
                iconRight="arrow-right"
                onClick={() => onNavigate('how-it-works')}
              >
                How it works
              </Button>
            </div>

            <FlowStrip className="mt-8" />
          </div>

          <div className="relative flex items-center">
            <div className="w-full space-y-3">
              <div className="rounded-2xl border border-line bg-white/90 p-5 shadow-raised backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-brand-600">
                    <span className="relative grid size-2 place-items-center">
                      <span className="absolute inset-0 rounded-full bg-brand-500 animate-pulse-ring" />
                      <span className="size-2 rounded-full bg-brand-600" />
                    </span>
                    Right now
                  </span>
                  <span className="text-[11.5px] text-ink-400">{HOSPITAL.phone}</span>
                </div>

                <p className="mt-4 text-[15px] font-medium leading-snug text-ink-900">
                  {analytics.handledByAI} of {analytics.totalCalls} calls today were answered
                  without the front desk picking up.
                </p>

                <div className="mt-4 space-y-2.5">
                  {[
                    { icon: 'phone' as IconName, label: 'Appointment enquiry', meta: 'AI · 48s' },
                    { icon: 'calendar' as IconName, label: 'Slot booked with Dr. Deshmukh', meta: 'Auto' },
                    { icon: 'message' as IconName, label: 'WhatsApp confirmation delivered', meta: 'Sent' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2.5 rounded-lg bg-ink-50 px-3 py-2.5">
                      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white text-brand-600 ring-1 ring-line">
                        <Icon name={row.icon} size={13} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-700">
                        {row.label}
                      </span>
                      <span className="shrink-0 text-[11px] font-medium text-ink-400">{row.meta}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="px-1 text-[11.5px] leading-relaxed text-ink-400">
                Illustrative figures from the demo dataset — not live hospital data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Calls handled today"
          value={kpis.callsHandled}
          icon="phone"
          delta="+18%"
          deltaLabel="vs. last week"
          trend={[9, 12, 10, 14, 13, 17, 16, 19, 18, 21, 22, 24]}
        />
        <Stat
          label="Appointments booked"
          value={kpis.appointmentsBooked}
          icon="calendar"
          delta="+4"
          deltaLabel="since 9 AM"
          trend={[3, 4, 4, 6, 5, 7, 8, 8, 9, 10, 10, 11]}
        />
        <Stat
          label="Missed calls recovered"
          value={kpis.missedRecovered}
          icon="phone-incoming"
          deltaLabel="after-hours & busy line"
          trend={[1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7, 7]}
        />
        <Stat
          label="Staff time saved"
          value={kpis.minutesSaved}
          formatted={(n) => formatDuration(n)}
          icon="clock"
          deltaLabel="front-desk minutes, today"
          trend={[40, 68, 95, 120, 140, 158, 170, 186, 198, 206, 214, 222]}
        />
      </section>

      <TryReceptionist onNavigate={onNavigate} />

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Recent activity"
            subtitle="Every AI action is written to the hospital record."
            action={
              <Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => onNavigate('analytics')}>
                Analytics
              </Button>
            }
          />
          <ul className="mt-5 space-y-1">
            {activity.slice(0, 6).map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-ink-50"
              >
                <span
                  className={cn(
                    'mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ring-1',
                    item.tone === 'brand'
                      ? 'bg-brand-50 text-brand-600 ring-brand-100'
                      : item.tone === 'good'
                        ? 'bg-[#25d366]/10 text-[#0d6b4f] ring-[#25d366]/20'
                        : 'bg-ink-100 text-ink-500 ring-ink-200',
                  )}
                >
                  <Icon name={ACTIVITY_ICON[item.icon] ?? 'phone'} size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink-800">
                    {item.title}
                  </span>
                  <span className="block truncate text-[12.5px] text-ink-500">{item.detail}</span>
                </span>
                <span className="shrink-0 pt-0.5 text-[11.5px] text-ink-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <CardHeader
            title="Keep your existing hospital number"
            subtitle="Nothing on your printed boards, prescriptions or Google listing has to change."
          />
          <ul className="mt-5 space-y-3">
            {[
              'Your current number stays the primary patient contact.',
              'Selected calls are forwarded to the AI Receptionist.',
              'Important calls keep reaching your staff as they do today.',
              'The AI absorbs repetitive enquiries and appointment requests.',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span className="mt-[3px] grid size-[17px] shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name="check" size={10} strokeWidth={3} />
                </span>
                <span className="text-[13px] leading-relaxed text-ink-600">{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-5">
            <Button
              variant="secondary"
              size="sm"
              iconRight="arrow-right"
              className="w-full"
              onClick={() => onNavigate('how-it-works')}
            >
              See the routing model
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
