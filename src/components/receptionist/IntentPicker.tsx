import { INTENTS } from '@/data/conversations';
import type { IntentId } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

export function IntentPicker({
  value,
  onChange,
  disabled,
}: {
  value: IntentId;
  onChange: (id: IntentId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {INTENTS.map((intent) => {
        const active = intent.id === value;
        return (
          <button
            key={intent.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(intent.id)}
            aria-pressed={active}
            className={cn(
              'group flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-all duration-150',
              'disabled:cursor-not-allowed disabled:opacity-50',
              active
                ? 'border-brand-300 bg-brand-50 ring-1 ring-brand-200'
                : 'border-line bg-white hover:border-ink-300 hover:bg-ink-50/60',
            )}
          >
            <span
              className={cn(
                'mt-[3px] grid size-4 shrink-0 place-items-center rounded-full border transition-colors',
                active ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300 text-transparent',
              )}
            >
              <Icon name="check" size={10} strokeWidth={3} />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  'block text-[13px] font-medium',
                  active ? 'text-brand-800' : 'text-ink-800',
                )}
              >
                {intent.label}
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-500">
                {intent.hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
