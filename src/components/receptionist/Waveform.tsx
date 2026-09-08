import { cn } from '@/lib/cn';
import type { Speaker } from '@/lib/types';

const BARS = 34;
const HEIGHTS = Array.from({ length: BARS }, (_, i) => {
  const wave = Math.sin((i / BARS) * Math.PI * 3) * 0.5 + 0.5;
  const jitter = ((i * 37) % 11) / 22;
  return 0.28 + wave * 0.5 + jitter * 0.3;
});

export function Waveform({
  speaking,
  active,
}: {
  speaking: Speaker | null;
  active: boolean;
}) {
  const isAi = speaking === 'ai';
  const isPatient = speaking === 'patient';
  const live = active && (isAi || isPatient);

  return (
    <div className="flex h-14 items-center justify-center gap-[3px]" aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={cn(
            'w-[3px] rounded-full transition-colors duration-300',
            isAi ? 'bg-brand-500' : isPatient ? 'bg-ink-400' : 'bg-ink-500/50',
          )}
          style={{
            height: `${(live ? h : 0.1) * 100}%`,
            transformOrigin: 'center',
            animation: live
              ? `bar-talk ${(700 + ((i * 53) % 420)).toFixed(0)}ms ease-in-out ${(i * 42) % 360}ms infinite`
              : undefined,
            transition: 'height 320ms cubic-bezier(0.22,1,0.36,1), background-color 300ms',
          }}
        />
      ))}
    </div>
  );
}
