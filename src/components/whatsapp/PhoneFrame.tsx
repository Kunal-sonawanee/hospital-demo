import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { HOSPITAL } from '@/data/hospital';

const CHAT_BG =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='6' cy='6' r='1' fill='%23000' opacity='0.045'/%3E%3Ccircle cx='26' cy='18' r='1' fill='%23000' opacity='0.045'/%3E%3Ccircle cx='14' cy='32' r='1' fill='%23000' opacity='0.045'/%3E%3C/svg%3E";

export function PhoneFrame({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="overflow-hidden rounded-[28px] border-[7px] border-ink-900 bg-ink-900 shadow-raised">
        {/* status bar */}
        <div className="flex items-center justify-between bg-[#075E54] px-4 pb-1 pt-2 text-[10.5px] font-medium text-white/70">
          <span className="tabular">9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-3.5 rounded-[2px] border border-white/60" />
            <span className="tabular">Demo</span>
          </span>
        </div>

        {/* chat header */}
        <div className="flex items-center gap-3 bg-[#075E54] px-3 pb-2.5 pt-1 text-white">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
            <Icon name="hospital" size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold leading-tight">{HOSPITAL.name}</p>
            <p className="truncate text-[10.5px] text-white/65">
              Business account · replies instantly
            </p>
          </div>
          <Icon name="phone" size={16} className="text-white/70" />
        </div>

        {/* chat body */}
        <div
          className="h-[440px] overflow-y-auto scroll-thin px-3 py-4"
          style={{ backgroundColor: '#ECE5DD', backgroundImage: `url("${CHAT_BG}")` }}
        >
          {children}
        </div>

        {footer && <div className="bg-[#F0F0F0] px-3 py-2.5">{footer}</div>}
      </div>
    </div>
  );
}
