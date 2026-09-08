import { useState } from 'react';
import { HOUR_BUCKETS } from '@/data/hospital';
import { cn } from '@/lib/cn';

/**
 * Call volume across the OPD day. Single series → one hue, no legend;
 * the title names the series. Hover reveals the exact value.
 */
export function CallVolumeChart({ data }: { data: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data, 1);
  const ceiling = Math.max(4, Math.ceil(max / 2) * 2);
  const ticks = [ceiling, ceiling / 2, 0];
  const peak = data.indexOf(max);

  return (
    <div>
      <div className="flex gap-3">
        {/* y axis */}
        <div className="relative w-6 shrink-0" style={{ height: 168 }}>
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 -translate-y-1/2 text-[10.5px] tabular text-ink-400"
              style={{ top: `${(1 - t / ceiling) * 100}%` }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* recessive gridlines */}
          <div className="pointer-events-none absolute inset-0" style={{ height: 168 }}>
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute inset-x-0 border-t border-dashed border-ink-100"
                style={{ top: `${(1 - t / ceiling) * 100}%` }}
              />
            ))}
          </div>

          <div className="relative flex items-end gap-[2px]" style={{ height: 168 }}>
            {data.map((value, i) => {
              const pct = (value / ceiling) * 100;
              const active = hover === i;
              return (
                <button
                  key={HOUR_BUCKETS[i]}
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${HOUR_BUCKETS[i]}: ${value} calls`}
                  className="group relative flex h-full flex-1 cursor-default items-end rounded-t-sm"
                >
                  <span
                    className={cn(
                      'block w-full rounded-t-[4px] transition-[height,background-color] duration-500',
                      active ? 'bg-brand-700' : 'bg-brand-600',
                    )}
                    style={{ height: `${Math.max(pct, value > 0 ? 2 : 0)}%` }}
                  />
                  {i === peak && hover === null && (
                    <span
                      className="pointer-events-none absolute inset-x-0 text-center text-[10.5px] font-semibold tabular text-ink-600"
                      style={{ bottom: `calc(${pct}% + 4px)` }}
                    >
                      {value}
                    </span>
                  )}
                  {active && (
                    <span
                      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-900 px-2 py-1 text-[11px] font-medium text-white shadow-raised"
                      style={{ bottom: `calc(${pct}% + 8px)` }}
                    >
                      {value} calls · {HOUR_BUCKETS[i]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex gap-[2px] border-t border-line pt-2">
            {HOUR_BUCKETS.map((label, i) => (
              <span
                key={label}
                className={cn(
                  'flex-1 text-center text-[10.5px] tabular transition-colors',
                  hover === i ? 'font-semibold text-ink-800' : 'text-ink-400',
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
