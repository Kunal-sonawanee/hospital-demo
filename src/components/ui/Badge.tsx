import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'neutral' | 'good' | 'warning' | 'info' | 'whatsapp' | 'dark';

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  neutral: 'bg-ink-100 text-ink-600 ring-ink-200',
  good: 'bg-[#0ca30c]/10 text-[#0a7a0a] ring-[#0ca30c]/25',
  warning: 'bg-[#fab219]/15 text-[#8a5d00] ring-[#fab219]/40',
  info: 'bg-[#2a78d6]/10 text-[#1c5cab] ring-[#2a78d6]/25',
  whatsapp: 'bg-[#25d366]/12 text-[#0d6b4f] ring-[#25d366]/30',
  dark: 'bg-white/10 text-white/80 ring-white/15',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
  dot,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium ring-1 ring-inset leading-none',
        TONES[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}
