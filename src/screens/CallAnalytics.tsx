import { Card, CardHeader, SectionTitle } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { CallVolumeChart } from '@/components/charts/CallVolumeChart';
import { CategoryBars } from '@/components/charts/CategoryBars';
import { OutcomeSplit } from '@/components/charts/OutcomeSplit';
import { useDemo } from '@/store/demo';
import { HOUR_BUCKETS } from '@/data/hospital';
import { formatDuration } from '@/lib/date';

export function CallAnalytics() {
  const { analytics, kpis } = useDemo();
  const aiShare = Math.round((analytics.handledByAI / Math.max(analytics.totalCalls, 1)) * 100);
  const peakIndex = analytics.hourly.indexOf(Math.max(...analytics.hourly));
  const morning = analytics.hourly.slice(0, 5).reduce((a, b) => a + b, 0);
  const evening = analytics.hourly.slice(8).reduce((a, b) => a + b, 0);
  const repetitive =
    analytics.categories['Doctor availability'] +
    analytics.categories['Hospital timings'] +
    analytics.categories.Location;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Today · 8:00 AM – 8:00 PM"
          title="Call Analytics"
          description="Where the phone time actually goes, and how much of it the AI Receptionist absorbs before it reaches your staff."
        />
        <Badge tone="neutral" dot>
          Updates after every simulated call
        </Badge>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total calls" value={analytics.totalCalls} icon="phone" deltaLabel="inbound today" />
        <Stat
          label="Handled by AI"
          value={analytics.handledByAI}
          icon="headset"
          delta={`${aiShare}%`}
          deltaLabel="of all calls"
        />
        <Stat
          label="Transferred to staff"
          value={analytics.transferred}
          icon="users"
          deltaLabel="reached a human"
        />
        <Stat
          label="Missed / recovered"
          value={analytics.missedRecovered}
          icon="phone-incoming"
          deltaLabel="called back automatically"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Call volume through the day"
            subtitle="Inbound calls per hour. The OPD rush at 11 AM and 5 PM is exactly when the front desk is busiest."
            action={
              <span className="hidden items-center gap-1.5 text-[11.5px] text-ink-400 sm:inline-flex">
                <span className="size-2.5 rounded-[3px] bg-brand-600" />
                Inbound calls
              </span>
            }
          />
          <div className="mt-6">
            <CallVolumeChart data={analytics.hourly} />
          </div>

          <dl className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
            {[
              ['Peak hour', `${HOUR_BUCKETS[peakIndex]} · ${analytics.hourly[peakIndex]} calls`],
              ['Morning OPD', `${morning} calls`],
              ['Evening OPD', `${evening} calls`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-ink-50 px-3.5 py-3">
                <dt className="text-[11.5px] text-ink-500">{label}</dt>
                <dd className="mt-1 text-[14px] font-semibold tabular text-ink-900">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <CardHeader
            title="What patients call about"
            subtitle="Ranked by share of today’s calls."
          />
          <div className="mt-5">
            <CategoryBars categories={analytics.categories} total={analytics.totalCalls} />
          </div>
          <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-brand-50 px-3.5 py-3">
            <Icon name="zap" size={15} className="mt-0.5 shrink-0 text-brand-600" />
            <p className="text-[12.5px] leading-relaxed text-brand-900">
              <span className="font-semibold">{repetitive} calls</span> today were availability,
              timings or directions — answerable without a single staff interruption.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="How today’s calls resolved"
            subtitle="Identity is shown by both the swatch and the label, so the split reads without relying on colour."
          />
          <OutcomeSplit
            className="mt-6"
            values={{
              ai: analytics.handledByAI,
              transferred: analytics.transferred,
              missed: analytics.missedRecovered,
            }}
          />
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-line">
                  {['Outcome', 'Calls', 'Share'].map((h) => (
                    <th
                      key={h}
                      className="py-2.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Handled by AI', analytics.handledByAI],
                  ['Transferred to staff', analytics.transferred],
                  ['Missed → recovered', analytics.missedRecovered],
                ].map(([label, value]) => (
                  <tr key={label as string} className="border-b border-line last:border-0">
                    <td className="py-2.5 text-ink-700">{label}</td>
                    <td className="py-2.5 tabular font-medium text-ink-900">{value}</td>
                    <td className="py-2.5 tabular text-ink-500">
                      {Math.round((Number(value) / Math.max(analytics.totalCalls, 1)) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 border-t border-line pt-5 text-[12.5px] leading-relaxed text-ink-500">
            A transferred call is not a failure — it is the AI recognising that a human should take
            over, and handing across the caller’s number and reason so your staff do not start from
            scratch.
          </p>
        </Card>

        <Card className="flex flex-col">
          <CardHeader
            title="What it adds up to"
            subtitle="Based on an average 4½ minutes of front-desk time per routine call."
          />
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-[40px] font-semibold leading-none tracking-[-0.03em] text-ink-900">
                {formatDuration(kpis.minutesSaved)}
              </p>
              <p className="mt-2 text-[13px] text-ink-500">
                of front-desk time returned to patients standing at the counter — today alone.
              </p>
            </div>
            <ul className="space-y-2.5 border-t border-line pt-5">
              {[
                [`${aiShare}%`, 'of calls never interrupted your staff'],
                [`${kpis.missedRecovered}`, 'missed calls recovered instead of lost'],
                [`${analytics.categories.Appointment}`, 'appointment conversations handled'],
              ].map(([value, label]) => (
                <li key={label} className="flex items-baseline gap-3">
                  <span className="w-14 shrink-0 text-[17px] font-semibold tabular text-brand-700">
                    {value}
                  </span>
                  <span className="text-[13px] leading-snug text-ink-600">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-auto pt-6 text-[11.5px] leading-relaxed text-ink-400">
            Demo figures generated from mock call records for illustration. Real deployments are
            measured against the hospital’s own call logs.
          </p>
        </Card>
      </section>
    </div>
  );
}
