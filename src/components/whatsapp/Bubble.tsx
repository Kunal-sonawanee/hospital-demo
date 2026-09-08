import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

export function Bubble({
  from,
  time,
  children,
  className,
  read = true,
}: {
  from: 'patient' | 'hospital';
  time: string;
  children: ReactNode;
  className?: string;
  read?: boolean;
}) {
  const outbound = from === 'hospital';
  return (
    <div
      className={cn(
        'mb-2 flex animate-fade-up',
        outbound ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'relative max-w-[84%] rounded-lg px-2.5 py-1.5 text-[13px] leading-[1.45] text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]',
          outbound ? 'rounded-tr-[3px] bg-[#D9FDD3]' : 'rounded-tl-[3px] bg-white',
          className,
        )}
      >
        {children}
        <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781]">
          {time}
          {outbound && (
            <Icon
              name="check"
              size={11}
              strokeWidth={2.6}
              className={read ? 'text-[#53bdeb]' : 'text-[#667781]'}
            />
          )}
        </span>
      </div>
    </div>
  );
}
