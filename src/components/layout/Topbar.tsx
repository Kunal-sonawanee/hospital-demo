import { useEffect, useState } from 'react';
import { NAV } from '@/lib/nav';
import type { ScreenId } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { SidebarContent } from './Sidebar';
import { LiveIndicator } from './LiveIndicator';
import { Logo } from './Logo';
import { useDemo } from '@/store/demo';
import { HOSPITAL } from '@/data/hospital';
import { formatDayLong, isoDate } from '@/lib/date';

export function Topbar({
  screen,
  onNavigate,
}: {
  screen: ScreenId;
  onNavigate: (s: ScreenId) => void;
}) {
  const [drawer, setDrawer] = useState(false);
  const { resetDemo, pushToast } = useDemo();
  const current = NAV.find((n) => n.id === screen);

  useEffect(() => {
    setDrawer(false);
  }, [screen]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-md">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open navigation"
            className="-ml-1.5 rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
          >
            <Icon name="menu" size={19} />
          </button>

          <div className="flex items-center gap-2.5 lg:hidden">
            <Logo size={26} />
            <span className="text-[14px] font-semibold text-ink-900">Kantex</span>
          </div>

          <div className="hidden min-w-0 lg:block">
            <h1 className="truncate text-[14.5px] font-semibold tracking-[-0.01em] text-ink-900">
              {current?.label}
            </h1>
            <p className="truncate text-[11.5px] text-ink-400">
              {current?.description} · {formatDayLong(isoDate(0))}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-ink-50 px-3 py-1.5 text-[11.5px] font-medium text-ink-500 md:inline-flex">
              <Icon name="lock" size={13} />
              Demo Mode · mock data
            </span>
            <LiveIndicator />
            <Button
              variant="secondary"
              size="sm"
              icon="refresh"
              className="hidden sm:inline-flex"
              onClick={() => {
                resetDemo();
                pushToast({
                  tone: 'brand',
                  title: 'Demo data reset',
                  detail: 'All counters and bookings are back to their starting values.',
                });
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/40 animate-[fade-in_0.2s_ease_both]"
            onClick={() => setDrawer(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[264px] bg-white shadow-modal animate-[fade-in_0.22s_ease_both]">
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close navigation"
                className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            <SidebarContent screen={screen} onNavigate={onNavigate} />
          </div>
        </div>
      )}
    </>
  );
}

export function DemoModeRibbon() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-4 py-4 text-[11.5px] text-ink-400 sm:px-6 lg:px-8">
      <p>
        Demo Mode · All names, numbers, appointments and call records on this site are fictional
        mock data. No medical advice is given. {HOSPITAL.name} content is used for demonstration.
      </p>
      <p className="font-medium text-ink-500">Kantex Technologies · Prototype v1.0</p>
    </div>
  );
}
