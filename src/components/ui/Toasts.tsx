import { useDemo } from '@/store/demo';
import { Icon } from './Icon';
import { cn } from '@/lib/cn';

export function Toasts() {
  const { toasts, dismissToast } = useDemo();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-raised',
            'animate-[fade-up_0.3s_cubic-bezier(0.22,1,0.36,1)_both]',
          )}
        >
          <span
            className={cn(
              'mt-0.5 grid size-7 shrink-0 place-items-center rounded-full',
              t.tone === 'good'
                ? 'bg-[#0ca30c]/12 text-[#0a7a0a]'
                : 'bg-brand-50 text-brand-600',
            )}
          >
            <Icon name={t.tone === 'good' ? 'check' : 'sparkles'} size={15} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium text-ink-900">{t.title}</p>
            {t.detail && <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">{t.detail}</p>}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
