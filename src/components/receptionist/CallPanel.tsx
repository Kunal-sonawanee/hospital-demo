import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Waveform } from './Waveform';
import { formatCallTimer, type CallPhase } from '@/hooks/useCallSimulation';
import type { Speaker } from '@/lib/types';
import { HOSPITAL } from '@/data/hospital';

const STATUS: Record<CallPhase, { label: string; tone: string }> = {
  idle: { label: 'Waiting for an incoming call', tone: 'text-ink-400' },
  ringing: { label: 'Incoming call — connecting to AI Receptionist', tone: 'text-brand-200' },
  connected: { label: 'AI Receptionist is answering…', tone: 'text-brand-200' },
  ended: { label: 'Call ended · transcript saved', tone: 'text-ink-400' },
};

export function CallPanel({
  phase,
  speaking,
  seconds,
  callerNumber,
  onStart,
  onEnd,
  onReplay,
}: {
  phase: CallPhase;
  speaking: Speaker | null;
  seconds: number;
  callerNumber: string;
  onStart: () => void;
  onEnd: () => void;
  onReplay: () => void;
}) {
  const active = phase === 'connected' || phase === 'ringing';

  return (
    <div className="overflow-hidden rounded-2xl bg-ink-900 text-white shadow-raised">
      <div className="relative px-6 pb-6 pt-7 sm:px-7">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.18]"
          style={{
            background:
              'radial-gradient(60% 100% at 50% 0%, var(--color-brand-400) 0%, transparent 70%)',
          }}
        />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/10">
            <Icon name="phone-incoming" size={12} />
            Inbound · {HOSPITAL.name}
          </span>
          <span className="tabular text-[12.5px] font-medium text-white/55">
            {formatCallTimer(seconds)}
          </span>
        </div>

        <div className="relative mt-7 flex flex-col items-center text-center">
          <span className="relative grid size-[74px] place-items-center">
            {active && (
              <span className="absolute inset-0 rounded-full bg-brand-400/35 animate-pulse-ring" />
            )}
            <span className="relative grid size-[74px] place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15">
              <Icon name="user" size={30} strokeWidth={1.5} />
            </span>
          </span>

          <p className="mt-4 text-[17px] font-semibold tracking-[-0.01em]">Patient</p>
          <p className="mt-1 tabular text-[13.5px] text-white/55">{callerNumber}</p>

          <p
            className={cn(
              'mt-4 flex items-center gap-2 text-[12.5px] font-medium transition-colors',
              STATUS[phase].tone,
            )}
          >
            {phase === 'connected' && (
              <span className="size-1.5 rounded-full bg-brand-300 animate-pulse" />
            )}
            {STATUS[phase].label}
          </p>
        </div>

        <div className="relative mt-6 rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/8">
          <Waveform speaking={speaking} active={phase === 'connected'} />
          <p className="pb-1 text-center text-[10.5px] uppercase tracking-[0.14em] text-white/35">
            {speaking === 'ai'
              ? 'AI speaking'
              : speaking === 'patient'
                ? 'Patient speaking'
                : phase === 'connected'
                  ? 'Listening'
                  : 'Voice activity'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-white/8 bg-white/[0.03] px-6 py-4 sm:px-7">
        {phase === 'idle' || phase === 'ended' ? (
          <Button
            onClick={onStart}
            icon="phone"
            className="flex-1 bg-brand-500 hover:bg-brand-400 active:bg-brand-500 sm:flex-none"
          >
            Start Call
          </Button>
        ) : (
          <Button
            onClick={onEnd}
            icon="phone-off"
            variant="danger"
            className="flex-1 sm:flex-none"
          >
            End Call
          </Button>
        )}

        <Button
          onClick={onReplay}
          variant="ghost"
          icon="refresh"
          className="text-white/60 hover:bg-white/8 hover:text-white"
        >
          Replay Demo
        </Button>
      </div>
    </div>
  );
}
