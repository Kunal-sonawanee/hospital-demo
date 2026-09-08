import { Card, CardHeader, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { HOSPITAL } from '@/data/hospital';
import type { ScreenId } from '@/lib/types';
import { cn } from '@/lib/cn';

const STEPS: { n: string; title: string; detail: string; icon: IconName }[] = [
  {
    n: '01',
    title: 'Patient calls existing hospital number',
    detail:
      'The number on your board, prescriptions and Google listing stays exactly as it is. Patients dial what they already know.',
    icon: 'phone-incoming',
  },
  {
    n: '02',
    title: 'Selected calls are routed to AI Receptionist',
    detail:
      'You decide which calls go where — busy line, after hours, overflow, or a dedicated appointment line. Your staff keep answering the rest.',
    icon: 'route',
  },
  {
    n: '03',
    title: 'AI handles routine requests and appointments',
    detail:
      'Timings, doctor availability, directions, bookings and reschedules — answered in seconds, in the patient’s language, without a hold queue.',
    icon: 'headset',
  },
  {
    n: '04',
    title: 'Patient receives WhatsApp confirmation and reminder',
    detail:
      'A confirmation card straight after the call, and a reminder before the visit. Both appear in your dashboard.',
    icon: 'message',
  },
];

const CHAIN: { label: string; sub: string; icon: IconName; tone: 'neutral' | 'brand' }[] = [
  { label: 'Existing Number', sub: `${HOSPITAL.phone} — unchanged`, icon: 'phone', tone: 'neutral' },
  { label: 'Call Routing', sub: 'Configured with your telecom provider', icon: 'route', tone: 'neutral' },
  { label: 'AI Receptionist', sub: 'Answers, understands, books', icon: 'headset', tone: 'brand' },
  {
    label: 'Hospital Staff / Appointment System',
    sub: 'Dashboard, transfers and the appointment book',
    icon: 'hospital',
    tone: 'neutral',
  },
];

export function HowItWorks({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Rollout model"
        title="How it works"
        description="The AI Receptionist sits alongside your front desk, not in front of it. Nothing about how patients reach you has to change."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, i) => (
          <div
            key={step.n}
            className="card relative flex flex-col p-5 transition-shadow duration-300 hover:shadow-raised"
          >
            <div className="flex items-center justify-between">
              <span className="text-[26px] font-semibold leading-none tracking-[-0.04em] text-brand-600/25">
                {step.n}
              </span>
              <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name={step.icon} size={17} />
              </span>
            </div>
            <h3 className="mt-4 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink-900">
              {step.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{step.detail}</p>
            {i < STEPS.length - 1 && (
              <Icon
                name="chevron-right"
                size={16}
                className="absolute -right-[13px] top-1/2 hidden -translate-y-1/2 text-ink-300 xl:block"
              />
            )}
          </div>
        ))}
      </section>

      <Card className="border-brand-200 bg-brand-50/50">
        <div className="flex items-start gap-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-200">
            <Icon name="info" size={17} />
          </span>
          <div>
            <h3 className="text-[14.5px] font-semibold text-ink-900">
              About your phone number and call routing
            </h3>
            <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-ink-600">
              Your existing hospital number can remain the primary patient contact number. Telephony
              routing and forwarding is configured separately with the hospital’s telecom provider.
            </p>
            <p className="mt-2.5 max-w-3xl text-[12.5px] leading-relaxed text-ink-500">
              Which calls can be forwarded — and on what conditions, such as busy, unanswered or
              after-hours — depends on the connection and the operator. Filtering by unknown or
              unsaved numbers is not something every carrier supports, so the routing rules are
              agreed with your provider during setup rather than assumed here.
            </p>
          </div>
        </div>
      </Card>

      <section className="grid items-start gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader
            title="Designed to work around your current workflow"
            subtitle="One path, four hops — and your staff stay on the line wherever they should be."
          />
          <ol className="mt-6">
            {CHAIN.map((node, i) => (
              <li key={node.label}>
                <div
                  className={cn(
                    'flex items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-colors',
                    node.tone === 'brand'
                      ? 'border-brand-300 bg-brand-50 ring-1 ring-brand-100'
                      : 'border-line bg-white',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-lg',
                      node.tone === 'brand'
                        ? 'bg-brand-600 text-white'
                        : 'bg-ink-100 text-ink-500',
                    )}
                  >
                    <Icon name={node.icon} size={16} />
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-[14px] font-semibold tracking-[-0.01em]',
                        node.tone === 'brand' ? 'text-brand-800' : 'text-ink-900',
                      )}
                    >
                      {node.label}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-ink-500">{node.sub}</p>
                  </div>
                </div>
                {i < CHAIN.length - 1 && (
                  <div className="flex justify-center py-1.5" aria-hidden="true">
                    <Icon name="arrow-down" size={16} className="text-ink-300" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </Card>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader
              title="Keep your existing hospital number"
              subtitle="The four commitments behind the routing model."
            />
            <ul className="mt-5 space-y-3.5">
              {[
                ['Keep your existing hospital number', 'No reprinting, no re-listing, no patient confusion.'],
                ['Forward selected calls to the AI Receptionist', 'You choose the conditions — overflow, after hours, or a second line.'],
                ['Continue receiving important calls normally', 'Referrals, admissions, emergencies and known contacts still ring your desk.'],
                ['AI handles repetitive enquiries and appointment requests', 'The calls that interrupt your staff twenty times a day.'],
              ].map(([title, detail]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-[2px] grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name="check" size={11} strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium text-ink-900">{title}</span>
                    <span className="block text-[12.5px] leading-relaxed text-ink-500">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="What a rollout looks like"
              subtitle="Typical pilot for a single-location hospital."
            />
            <ol className="mt-5 space-y-4">
              {[
                ['Week 1', 'Doctor list, OPD timings, FAQs and escalation rules captured from your front desk.'],
                ['Week 2', 'AI Receptionist tuned on your scripts; WhatsApp templates submitted for approval.'],
                ['Week 3', 'Routing configured with your telecom provider; parallel run with staff supervision.'],
                ['Week 4', 'Go live on selected call conditions, with weekly call-quality review.'],
              ].map(([label, detail]) => (
                <li key={label} className="flex gap-4">
                  <span className="w-[52px] shrink-0 pt-0.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-brand-600">
                    {label}
                  </span>
                  <span className="text-[13px] leading-relaxed text-ink-600">{detail}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-5 border-ink-200 bg-ink-900 text-white">
        <div className="max-w-xl">
          <Badge tone="dark">Next step</Badge>
          <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.02em]">
            See the whole loop in under a minute.
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/60">
            Run a call, watch the appointment appear, and follow the confirmation into WhatsApp —
            the same path a patient of {HOSPITAL.name} would take.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            className="bg-brand-500 hover:bg-brand-400"
            icon="phone"
            onClick={() => onNavigate('receptionist')}
          >
            Run the call demo
          </Button>
          <Button
            variant="ghost"
            className="text-white/70 hover:bg-white/10 hover:text-white"
            iconRight="arrow-right"
            onClick={() => onNavigate('appointments')}
          >
            Open appointments
          </Button>
        </div>
      </Card>
    </div>
  );
}
