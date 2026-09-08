import { useEffect, useRef } from 'react';
import type { TranscriptTurn } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

export function Transcript({
  turns,
  typing,
  idle,
}: {
  turns: TranscriptTurn[];
  typing: boolean;
  idle: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns.length, typing]);

  if (idle && turns.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-8 text-center">
        <span className="grid size-11 place-items-center rounded-xl bg-ink-100 text-ink-400">
          <Icon name="message" size={20} />
        </span>
        <p className="mt-4 text-[14px] font-medium text-ink-700">Transcript will appear here</p>
        <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-ink-500">
          Pick what the patient is calling about, then start the call. Every line is transcribed in
          real time and written to the hospital record.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {turns.map((turn, i) => {
        if (turn.speaker === 'system') {
          return (
            <div key={i} className="my-1 flex items-center gap-2.5 animate-fade-in">
              <span className="h-px flex-1 bg-line" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-500">
                <Icon name="zap" size={11} />
                {turn.text}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
          );
        }
        const ai = turn.speaker === 'ai';
        return (
          <div
            key={i}
            className={cn(
              'flex max-w-[86%] flex-col gap-1 animate-fade-up',
              ai ? 'self-start items-start' : 'self-end items-end',
            )}
          >
            <span className="px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-400">
              {ai ? 'AI Receptionist' : 'Patient'}
            </span>
            <div
              className={cn(
                'rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed',
                ai
                  ? 'rounded-tl-md bg-brand-50 text-brand-900 ring-1 ring-brand-100'
                  : 'rounded-tr-md bg-ink-100 text-ink-800',
              )}
            >
              {turn.text}
            </div>
          </div>
        );
      })}

      {typing && (
        <div className="flex max-w-[86%] flex-col gap-1 self-start animate-fade-in">
          <span className="px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-400">
            AI Receptionist
          </span>
          <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-brand-50 px-4 py-3.5 ring-1 ring-brand-100">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-brand-500"
                style={{ animation: `dot-typing 1.1s ease-in-out ${i * 0.16}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
