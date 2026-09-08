import { useCallback, useEffect, useState } from 'react';
import { isScreenId } from '@/lib/nav';
import type { ScreenId } from '@/lib/types';

function readHash(): ScreenId {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return isScreenId(raw) ? raw : 'overview';
}

export function useHashRoute(): [ScreenId, (next: ScreenId) => void] {
  const [screen, setScreen] = useState<ScreenId>(() => readHash());

  useEffect(() => {
    const onChange = () => setScreen(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: ScreenId) => {
    window.location.hash = `#/${next}`;
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return [screen, navigate];
}
