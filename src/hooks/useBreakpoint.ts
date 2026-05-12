import { useState, useEffect } from 'react';

export type BreakpointMode = 'mobile' | 'tablet' | 'desktop';

function derive(): BreakpointMode {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function useBreakpoint(): BreakpointMode {
  const [mode, setMode] = useState<BreakpointMode>(() =>
    typeof window !== 'undefined' ? derive() : 'desktop'
  );

  useEffect(() => {
    const handler = () => setMode(derive());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return mode;
}
