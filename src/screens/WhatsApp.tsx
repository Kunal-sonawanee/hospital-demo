import { useCallback, useRef, useState } from 'react';
import { Card, CardHeader, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PhoneFrame } from '@/components/whatsapp/PhoneFrame';
import { Bubble } from '@/components/whatsapp/Bubble';
import { useDemo } from '@/store/demo';
import { WHATSAPP_CONFIRMATION, WHATSAPP_REMINDER } from '@/data/seed';
import { HOSPITAL } from '@/data/hospital';
import { cn } from '@/lib/cn';

export function WhatsApp() {
  const { thread, log, appendThreadMessage, selectThreadOption, resetThread, pushToast } = useDemo();
  const [typing, setTyping] = useState(false);
  const timers = useRef<number[]>([]);

  const schedule = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const hasConfirmation = thread.some((m) => m.kind === 'confirmation-card');
  const hasReminder = thread.some((m) => m.kind === 'reminder');
  const optionsMessage = thread.find((m) => m.kind === 'options');
  const answered = Boolean(optionsMessage?.selected);

  const chooseSlot = (option: string) => {
    if (!optionsMessage || optionsMessage.selected) return;
    selectThreadOption(optionsMessage.id, option);
    appendThreadMessage({
      id: `wa-pick-${Date.now()}`,
      from: 'patient',
      kind: 'text',
      text: option,
      time: '4:59 PM',
    });
    setTyping(true);
    schedule(1500, () => {
      setTyping(false);
      appendThreadMessage({ ...WHATSAPP_CONFIRMATION, id: `wa-card-${Date.now()}` });
      pushToast({
        tone: 'good',
        title: 'WhatsApp confirmation sent',
        detail: 'Reference UMA-4821 · Dr. Deshmukh, 5:30 PM',
      });
    });
  };

  const sendReminder = () => {
    setTyping(true);
    schedule(1100, () => {
      setTyping(false);
      appendThreadMessage({ ...WHATSAPP_REMINDER, id: `wa-rem-${Date.now()}` });
      pushToast({
        tone: 'brand',
        title: 'Reminder delivered',
        detail: 'Sent automatically before the appointment.',
      });
    });
  };

  const restart = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setTyping(false);
    resetThread();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Patient messaging"
          title="WhatsApp"
          description="Confirmations and reminders reach patients where they already read messages. Patients can also book directly in the chat — the same appointment book, a different front door."
        />
        <Badge tone="warning">Mock integration · illustrative UI</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div>
          <PhoneFrame
            footer={
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-full bg-white px-3 py-2 text-[12.5px] text-ink-400">
                  {answered ? 'Type a message' : 'Tap a time above to reply'}
                </div>
                <span className="grid size-8 place-items-center rounded-full bg-[#25d366] text-white">
                  <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                </span>
              </div>
            }
          >
            <p className="mx-auto mb-3 w-fit rounded-md bg-white/70 px-2 py-1 text-[10px] font-medium text-[#54656f]">
              Today
            </p>

            {thread.map((message) => {
              if (message.kind === 'options') {
                return (
                  <Bubble key={message.id} from="hospital" time={message.time}>
                    <p>{message.text}</p>
                    <div className="mt-2 space-y-1.5">
                      {message.options?.map((option) => {
                        const chosen = message.selected === option;
                        const locked = Boolean(message.selected);
                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={locked}
                            onClick={() => chooseSlot(option)}
                            className={cn(
                              'flex w-full items-center justify-center gap-1.5 rounded-md border py-1.5 text-[12.5px] font-medium transition-colors',
                              chosen
                                ? 'border-[#128c7e] bg-[#128c7e] text-white'
                                : locked
                                  ? 'border-[#c9d3cd] text-[#8696a0]'
                                  : 'border-[#c9d3cd] bg-white text-[#128c7e] hover:bg-[#f0fbf4]',
                            )}
                          >
                            {chosen && <Icon name="check" size={12} strokeWidth={3} />}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </Bubble>
                );
              }

              if (message.kind === 'confirmation-card' && message.card) {
                return (
                  <Bubble key={message.id} from="hospital" time={message.time} className="!px-1.5 !py-1.5">
                    <div className="w-[248px] overflow-hidden rounded-md bg-white ring-1 ring-black/5">
                      <div className="flex items-center gap-2 bg-[#128c7e] px-3 py-2 text-white">
                        <Icon name="check-circle" size={15} />
                        <span className="text-[12px] font-semibold">Appointment confirmed</span>
                      </div>
                      <dl className="space-y-1.5 px-3 py-2.5 text-[12px]">
                        {[
                          ['Hospital', message.card.hospital],
                          ['Doctor', message.card.doctor],
                          ['Date', message.card.date],
                          ['Time', message.card.time],
                          ['Patient', message.card.patient ?? '—'],
                          ['Reference', message.card.reference],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-baseline justify-between gap-3">
                            <dt className="text-[#667781]">{k}</dt>
                            <dd className="text-right font-medium text-[#111b21]">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="border-t border-black/5 px-3 py-2 text-[10.5px] leading-snug text-[#667781]">
                        {HOSPITAL.address} · Please arrive 10 minutes early.
                      </p>
                    </div>
                    <p className="mt-1.5 px-1.5 text-[12.5px]">{message.text}</p>
                  </Bubble>
                );
              }

              if (message.kind === 'reminder') {
                return (
                  <Bubble key={message.id} from="hospital" time={message.time}>
                    <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#128c7e]">
                      <Icon name="bell" size={11} />
                      Reminder
                    </p>
                    <p>{message.text}</p>
                  </Bubble>
                );
              }

              return (
                <Bubble key={message.id} from={message.from} time={message.time}>
                  <p>{message.text}</p>
                </Bubble>
              );
            })}

            {typing && (
              <div className="mb-2 flex justify-end animate-fade-in">
                <div className="flex items-center gap-1 rounded-lg rounded-tr-[3px] bg-[#D9FDD3] px-3 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 rounded-full bg-[#8696a0]"
                      style={{ animation: `dot-typing 1.1s ease-in-out ${i * 0.16}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </PhoneFrame>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button
              size="sm"
              icon="bell"
              variant="secondary"
              disabled={!hasConfirmation || hasReminder}
              onClick={sendReminder}
            >
              Send day-of reminder
            </Button>
            <Button size="sm" variant="ghost" icon="refresh" onClick={restart}>
              Restart conversation
            </Button>
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader
              title="How the conversation flows"
              subtitle="Three automated messages cover the whole appointment lifecycle."
            />
            <ol className="mt-5 space-y-3.5">
              {[
                {
                  title: 'Patient asks for an appointment',
                  detail: 'Free text in Marathi, Hindi or English — no keywords to memorise.',
                  done: true,
                },
                {
                  title: 'AI offers real open slots',
                  detail: 'Availability comes from the same appointment book the front desk uses.',
                  done: answered,
                },
                {
                  title: 'Confirmation card is delivered',
                  detail: 'Doctor, date, time and a reference the staff can search.',
                  done: hasConfirmation,
                },
                {
                  title: 'Reminder goes out before the visit',
                  detail: 'Fewer no-shows, fewer “what time was it?” phone calls.',
                  done: hasReminder,
                },
              ].map((step, i) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-[1px] grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors',
                      step.done
                        ? 'bg-brand-600 text-white'
                        : 'bg-ink-100 text-ink-400 ring-1 ring-line',
                    )}
                  >
                    {step.done ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium text-ink-900">{step.title}</span>
                    <span className="block text-[12.5px] leading-relaxed text-ink-500">
                      {step.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>

          <Card padded={false}>
            <div className="p-5 sm:p-6">
              <CardHeader
                title="Automated message log"
                subtitle="Every confirmation and reminder the system produced today."
                action={<Badge tone="whatsapp">{log.length} messages</Badge>}
              />
            </div>
            <ul className="max-h-[290px] divide-y divide-line overflow-y-auto scroll-thin border-t border-line">
              {log.slice(0, 12).map((entry) => (
                <li key={entry.id} className="flex items-start gap-3 px-5 py-3.5">
                  <span
                    className={cn(
                      'mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ring-1',
                      entry.status === 'Delivered'
                        ? 'bg-[#25d366]/10 text-[#0d6b4f] ring-[#25d366]/20'
                        : 'bg-ink-100 text-ink-500 ring-ink-200',
                    )}
                  >
                    <Icon name={entry.type === 'Reminder' ? 'bell' : 'message'} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-[13px] font-medium text-ink-900">
                        {entry.type} · {entry.patient}
                      </p>
                      <span className="shrink-0 text-[11px] text-ink-400">{entry.time}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink-500">
                      {entry.body}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge tone={entry.status === 'Delivered' ? 'good' : 'neutral'}>
                        {entry.status}
                      </Badge>
                      <span className="tabular text-[11px] text-ink-400">{entry.to}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500">
              <Icon name="info" size={15} />
            </span>
            <p className="text-[12.5px] leading-relaxed text-ink-500">
              <span className="font-medium text-ink-700">Demo note.</span> This screen is a visual
              mock of a WhatsApp Business conversation. No messages are sent, and WhatsApp Business
              API access, message templates and opt-in are provisioned separately with Meta and the
              hospital’s chosen business solution provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
