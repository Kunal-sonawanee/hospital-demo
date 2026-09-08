import { useCallback, useEffect, useRef, useState } from 'react';
import type { DemoIntent, Speaker, TranscriptTurn } from '@/lib/types';

export type CallPhase = 'idle' | 'ringing' | 'connected' | 'ended';

const RING_MS = 1800;
const THINK_MS = 620;

interface Options {
  intent: DemoIntent;
  onComplete: (intent: DemoIntent) => void;
}

export function useCallSimulation({ intent, onComplete }: Options) {
  const [phase, setPhase] = useState<CallPhase>('idle');
  const [turns, setTurns] = useState<TranscriptTurn[]>([]);
  const [speaking, setSpeaking] = useState<Speaker | null>(null);
  const [seconds, setSeconds] = useState(0);

  const timers = useRef<number[]>([]);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // call duration ticker
  useEffect(() => {
    if (phase !== 'connected') return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const start = useCallback(() => {
    clearTimers();
    setTurns([]);
    setSeconds(0);
    setSpeaking(null);
    setPhase('ringing');

    after(RING_MS, () => {
      setPhase('connected');

      let elapsed = 0;
      intent.turns.forEach((turn: TranscriptTurn) => {
        const gap = turn.speaker === 'system' ? 220 : THINK_MS;
        elapsed += gap;
        const at = elapsed;
        after(at, () => {
          setTurns((prev) => [...prev, turn]);
          setSpeaking(turn.speaker);
        });
        elapsed += turn.duration ?? 2000;
        after(elapsed, () => setSpeaking(null));
      });

      after(elapsed + 900, () => {
        setPhase('ended');
        setSpeaking(null);
        completeRef.current(intent);
      });
    });
  }, [after, clearTimers, intent]);

  const end = useCallback(() => {
    clearTimers();
    setSpeaking(null);
    setPhase((p) => (p === 'idle' ? 'idle' : 'ended'));
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setTurns([]);
    setSeconds(0);
    setSpeaking(null);
    setPhase('idle');
  }, [clearTimers]);

  return { phase, turns, speaking, seconds, start, end, reset };
}

export function formatCallTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
