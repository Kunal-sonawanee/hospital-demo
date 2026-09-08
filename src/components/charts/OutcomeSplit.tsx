import { cn } from '@/lib/cn';

/**
 * How today's calls resolved. Three identities → the first three validated
 * categorical slots, each with a legend swatch AND a direct label, so identity
 * is never carried by colour alone. 2px surface gaps between segments.
 */
const SERIES = [
  { key: 'ai', label: 'Handled by AI', color: 'var(--color-series-1)' },
  { key: 'transferred', label: 'Transferred to staff', color: 'var(--color-series-2)' },
  { key: 'missed', label: 'Missed → recovered', color: 'var(--color-series-3)' },
] as const;

export function OutcomeSplit({
  values,
  className,
}: {
  values: { ai: number; transferred: number; missed: number };
  className?: string;
}) {
  const total = values.ai + values.transferred + values.missed || 1;

  return (
    <div className={className}>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-ink-100">
        {SERIES.map((s) => (
          <div
            key={s.key}
            className="h-full transition-[width] duration-700 first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(values[s.key] / total) * 100}%`, background: s.color }}
            aria-hidden="true"
          />
        ))}
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {SERIES.map((s) => {
          const value = values[s.key];
          return (
            <li key={s.key} className="flex items-start gap-2.5">
              <span
                className="mt-[5px] size-2.5 shrink-0 rounded-[3px]"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className={cn('text-[19px] font-semibold leading-none tracking-[-0.02em] text-ink-900')}>
                  {value}
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-ink-500">{s.label}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
