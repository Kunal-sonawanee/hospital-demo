import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './Icon';

/**
 * Stat tile — label · value · delta · sparkline.
 * Values use proportional figures (large standalone numbers), not tabular.
 */
export function Stat({
  label,
  value,
  formatted,
  delta,
  deltaLabel,
  icon,
  trend,
  highlight,
}: {
  label: string;
  value: number;
  /** renders the animated value; receives the eased number */
  formatted?: (n: number) => string;
  delta?: string;
  deltaLabel?: string;
  icon: IconName;
  trend?: number[];
  highlight?: boolean;
}) {
  const animated = useAnimatedNumber(value);
  const text = formatted ? formatted(animated) : Math.round(animated).toLocaleString('en-IN');

  return (
    <div
      className={cn(
        'card group relative overflow-hidden p-5 transition-shadow duration-300',
        highlight ? 'ring-1 ring-brand-300' : 'hover:shadow-raised',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-medium text-ink-500">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <Icon name={icon} size={16} />
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-ink-900">
            {text}
          </p>
          {(delta || deltaLabel) && (
            <p className="mt-2 flex items-center gap-1.5 text-[12px] text-ink-500">
              {delta && (
                <span className="font-medium text-[#0a7a0a]">{delta}</span>
              )}
              {deltaLabel}
            </p>
          )}
        </div>
        {trend && <Sparkline points={trend} />}
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 74;
  const h = 30;
  const max = Math.max(...points, 1);
  const min = Math.min(...points);
  const span = Math.max(max - min, 1);
  const step = w / Math.max(points.length - 1, 1);
  const coords = points.map((p, i) => [i * step, h - ((p - min) / span) * (h - 5) - 2.5]);
  const d = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const last = coords[coords.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="shrink-0">
      <path d={d} fill="none" stroke="var(--color-brand-200)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="var(--color-brand-600)" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}
