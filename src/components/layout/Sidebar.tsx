import { NAV } from '@/lib/nav';
import type { ScreenId } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { Logo } from './Logo';
import { LiveIndicator } from './LiveIndicator';
import { BRAND, HOSPITAL } from '@/data/hospital';

export function SidebarContent({
  screen,
  onNavigate,
}: {
  screen: ScreenId;
  onNavigate: (s: ScreenId) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
        <Logo />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-tight tracking-[-0.01em] text-ink-900">
            Kantex
          </p>
          <p className="truncate text-[11px] leading-tight text-ink-400">{BRAND.company.split(' ')[1]}</p>
        </div>
      </div>

      <div className="mx-3 mb-4 rounded-xl border border-line bg-ink-50/70 p-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-white text-brand-600 ring-1 ring-line">
            <Icon name="hospital" size={15} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-ink-800">{HOSPITAL.name}</p>
            <p className="truncate text-[11px] text-ink-400">
              {HOSPITAL.locality}, {HOSPITAL.city}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3" aria-label="Main">
        {NAV.map((item) => {
          const active = item.id === screen;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-150',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-900',
              )}
            >
              {active && (
                <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-brand-600" />
              )}
              <Icon
                name={item.icon}
                size={17}
                className={cn(active ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600')}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium">{item.label}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 p-4">
        <div className="rounded-xl border border-line bg-white p-3.5">
          <LiveIndicator />
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-500">
            Interactive prototype with mock data. No real patient records, no live telephony.
          </p>
        </div>
        <p className="px-1 text-[10.5px] leading-relaxed text-ink-400">
          © {new Date().getFullYear()} {BRAND.company}
        </p>
      </div>
    </div>
  );
}

export function Sidebar({
  screen,
  onNavigate,
}: {
  screen: ScreenId;
  onNavigate: (s: ScreenId) => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-line bg-white lg:block">
      <SidebarContent screen={screen} onNavigate={onNavigate} />
    </aside>
  );
}
