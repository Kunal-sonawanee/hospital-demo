import { useEffect, useState } from 'react';
import { Card, CardHeader, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { CallPanel } from '@/components/receptionist/CallPanel';
import { Transcript } from '@/components/receptionist/Transcript';
import { IntentPicker } from '@/components/receptionist/IntentPicker';
import { AutomationChain } from '@/components/receptionist/AutomationChain';
import { useDemoCall } from '@/hooks/useDemoCall';
import { formatCallTimer } from '@/hooks/useCallSimulation';
import type { IntentId, ScreenId } from '@/lib/types';
import { cn } from '@/lib/cn';

const CALLER = '+91 98XXXXXX42';

export function AIReceptionist({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const [intentId, setIntentId] = useState<IntentId>('book');
  const call = useDemoCall(intentId);
  const { reset } = call;
  const busy = call.phase === 'ringing' || call.phase === 'connected';
  const pending = call.turns.length < call.intent.turns.length;

  useEffect(() => {
    reset();
  }, [intentId, reset]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Live call simulation"
          title="AI Receptionist"
          description="A scripted, end-to-end simulation of an inbound patient call. Choose what the patient is calling about, then start the call — the transcript, the appointment book and the analytics all update together."
        />
        <Badge tone="neutral" dot>
          Simulated audio · no live telephony
        </Badge>
      </div>

      <Card padded={false} className="p-5 sm:p-6">
        <CardHeader
          title="What is the patient calling about?"
          subtitle="Each intent runs a different scripted conversation."
          action={
            busy ? (
              <span className="text-[12px] text-ink-400">Locked during the call</span>
            ) : undefined
          }
        />
        <div className="mt-5">
          <IntentPicker value={intentId} onChange={setIntentId} disabled={busy} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <CallPanel
            phase={call.phase}
            speaking={call.speaking}
            seconds={call.seconds}
            callerNumber={CALLER}
            onStart={call.start}
            onEnd={call.end}
            onReplay={call.start}
          />

          <AutomationChain steps={call.steps} />

          {call.phase === 'ended' && (
            <Card className="animate-fade-up">
              <CardHeader title="Call summary" subtitle="Written to the hospital call log." />
              <dl className="mt-4 space-y-2.5 text-[13px]">
                {[
                  ['Intent detected', call.intent.label],
                  ['Category', call.intent.category],
                  ['Duration', formatCallTimer(call.seconds)],
                  [
                    'Outcome',
                    call.intent.outcome === 'ai-handled'
                      ? 'Resolved by AI'
                      : 'Transferred to staff',
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="text-right font-medium text-ink-900">{v}</dd>
                  </div>
                ))}
              </dl>
              {call.intent.booking && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                  iconRight="arrow-right"
                  onClick={() => onNavigate('appointments')}
                >
                  Open the appointment
                </Button>
              )}
            </Card>
          )}
        </div>

        <Card padded={false} className="flex min-h-[520px] flex-col overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name="message" size={16} />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-ink-900">Live transcript</p>
                <p className="text-[11.5px] text-ink-400">
                  Speech-to-text · English &amp; Marathi-aware (demo)
                </p>
              </div>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium',
                call.phase === 'connected'
                  ? 'bg-brand-50 text-brand-700'
                  : 'bg-ink-100 text-ink-500',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  call.phase === 'connected' ? 'bg-brand-600 animate-pulse' : 'bg-ink-300',
                )}
              />
              {call.phase === 'connected'
                ? 'Transcribing'
                : call.phase === 'ended'
                  ? 'Complete'
                  : 'Idle'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto scroll-thin p-5">
            <Transcript
              turns={call.turns}
              typing={call.phase === 'connected' && call.speaking === null && pending}
              idle={call.phase === 'idle'}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line bg-ink-50/60 px-5 py-3 text-[11.5px] text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" size={13} className="text-brand-600" />
              No medical advice — clinical questions are handed to staff
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="lock" size={13} className="text-brand-600" />
              Mock transcript · nothing is stored
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
