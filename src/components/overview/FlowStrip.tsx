import { Icon, type IconName } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

const STEPS: { icon: IconName; label: string }[] = [
  { icon: 'phone-incoming', label: 'Patient calls' },
  { icon: 'headset', label: 'AI answers' },
  { icon: 'calendar', label: 'Appointment booked' },
  { icon: 'message', label: 'WhatsApp confirmation' },
  { icon: 'bell', label: 'Reminder sent' },
];

export function FlowStrip({ className }: { className?: string }) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-x-1.5 gap-y-3', className)}>
      {STEPS.map((step, i) => (
        <li key={step.label} className="flex items-center gap-1.5">
          {i > 0 && <Icon name="chevron-right" size={13} className="text-ink-300" />}
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 shadow-[0_1px_1px_rgba(11,22,34,0.03)]">
            <Icon name={step.icon} size={14} className="text-brand-600" />
            <span className="text-[12px] font-medium text-ink-700">{step.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
