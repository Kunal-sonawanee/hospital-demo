import type { CallCategory } from '@/lib/types';
import { cn } from '@/lib/cn';

const ORDER: CallCategory[] = [
  'Appointment',
  'Doctor availability',
  'Hospital timings',
  'Location',
  'Other',
];

/**
 * What patients actually call about. Magnitude, not identity → one hue,
 * every bar directly labelled with its value.
 */
export function CategoryBars({
  categories,
  total,
}: {
  categories: Record<CallCategory, number>;
  total: number;
}) {
  const max = Math.max(...ORDER.map((c) => categories[c] ?? 0), 1);

  return (
    <ul className="space-y-3.5">
      {ORDER.map((category) => {
        const value = categories[category] ?? 0;
        const share = total > 0 ? Math.round((value / total) * 100) : 0;
        return (
          <li key={category}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-ink-700">{category}</span>
              <span className="text-[12.5px] tabular text-ink-500">
                <span className="font-semibold text-ink-900">{value}</span>
                <span className="ml-1.5 text-ink-400">{share}%</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className={cn('h-full rounded-full bg-brand-600 transition-[width] duration-700')}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
