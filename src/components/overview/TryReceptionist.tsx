import { useDemoCall } from '@/hooks/useDemoCall';
import { formatCallTimer } from '@/hooks/useCallSimulation';
import { Waveform } from '@/components/receptionist/Waveform';
import { Transcript } from '@/components/receptionist/Transcript';
import { AutomationChain } from '@/components/receptionist/AutomationChain';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { ScreenId } from '@/lib/types';
import { cn } from '@/lib/cn';

export function TryReceptionist({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const call = useDemoCall('book');
  const running = call.phase === 'ringing' || call.phase === 'connected';
  const pending = call.turns.length < call.intent.turns.length;

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink-900">
              Try the AI Receptionist
            </h2>
            <Badge tone="brand" dot>
              30-second demo
            </Badge>
          </div>
          <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-ink-500">
            Press call. A patient asks for Dr. Deshmukh, the AI checks availability, books the slot
            and sends the WhatsApp confirmation — the dashboard updates as it happens.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconRight="arrow-right"
          onClick={() => onNavigate('receptionist')}
        >
          Full simulation
        </Button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
        <div className="border-b border-line bg-ink-900 p-5 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/55">
              <Icon name="phone-incoming" size={12} />
              Incoming
            </span>
            <span className="tabular text-[12px] text-white/50">
              {formatCallTimer(call.seconds)}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="relative grid size-11 place-items-center">
              {running && (
                <span className="absolute inset-0 rounded-full bg-brand-400/35 animate-pulse-ring" />
              )}
              <span className="relative grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                <Icon name="user" size={19} strokeWidth={1.6} />
              </span>
            </span>
            <div>
              <p className="text-[14px] font-semibold">Patient</p>
              <p className="tabular text-[12px] text-white/50">+91 98XXXXXX42</p>
            </div>
          </div>

          <p
            className={cn(
              'mt-4 text-[12px] font-medium',
              call.phase === 'connected' ? 'text-brand-200' : 'text-white/45',
            )}
          >
            {call.phase === 'idle' && 'Ready to receive a call'}
            {call.phase === 'ringing' && 'Connecting…'}
            {call.phase === 'connected' && 'AI Receptionist is answering…'}
            {call.phase === 'ended' && 'Call ended · 100% handled by AI'}
          </p>

          <div className="mt-3 rounded-lg bg-white/[0.04] px-2 ring-1 ring-white/8">
            <Waveform speaking={call.speaking} active={call.phase === 'connected'} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {call.phase === 'connected' || call.phase === 'ringing' ? (
              <Button size="sm" variant="danger" icon="phone-off" onClick={call.end}>
                End Call
              </Button>
            ) : (
              <Button
                size="sm"
                icon={call.phase === 'ended' ? 'refresh' : 'phone'}
                className="bg-brand-500 hover:bg-brand-400"
                onClick={call.start}
              >
                {call.phase === 'ended' ? 'Replay Demo' : 'Start Call'}
              </Button>
            )}
            {call.phase === 'ended' && (
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:bg-white/8 hover:text-white"
                onClick={() => onNavigate('appointments')}
              >
                View booking
              </Button>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="h-[300px] overflow-y-auto scroll-thin p-5">
            <Transcript
              turns={call.turns}
              typing={call.phase === 'connected' && call.speaking === null && pending}
              idle={call.phase === 'idle'}
            />
          </div>
          {call.steps.length > 0 && (
            <div className="border-t border-line p-5">
              <AutomationChain steps={call.steps} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
