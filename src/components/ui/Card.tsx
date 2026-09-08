import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return <div className={cn('card', padded && 'p-5 sm:p-6', className)}>{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink-900">{title}</h3>
        {subtitle && <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow && (
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
          {eyebrow}
        </div>
      )}
      <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink-900 sm:text-[30px]">
        {title}
      </h2>
      {description && (
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">{description}</p>
      )}
    </div>
  );
}
