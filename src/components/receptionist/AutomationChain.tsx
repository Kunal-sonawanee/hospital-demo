import type { AutomationStep } from '@/hooks/useDemoCall';
import { Icon } from '@/components/ui/Icon';

export function AutomationChain({
  steps,
  title = 'What happened automatically',
}: {
  steps: AutomationStep[];
  title?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 animate-fade-up">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">
        {title}
      </p>
      <ul className="space-y-2.5">
        {steps.map((step, i) => (
          <li
            key={step.label}
            className="flex items-start gap-2.5 animate-fade-up"
            style={{ animationDelay: `${i * 320}ms` }}
          >
            <span className="mt-[1px] grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-600 text-white">
              <Icon name="check" size={11} strokeWidth={3} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-brand-900">{step.label}</span>
              <span className="block text-[12px] leading-snug text-brand-800/70">{step.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
