import { useState, useEffect } from 'react';
import { theme } from '../theme';

export type Breakpoint = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** Navigation mode derived from the breakpoint. */
export type NavMode = 'drawer' | 'overlay-spoke' | 'push-spoke';

function deriveBreakpoint(): Breakpoint {
  const w = window.innerWidth;
  if (w >= theme.breakpoints.xlarge) return 'xlarge';
  if (w >= theme.breakpoints.large) return 'large';
  if (w >= theme.breakpoints.medium) return 'medium';
  if (w >= theme.breakpoints.small) return 'small';
  return 'xsmall';
}

export function getNavMode(bp: Breakpoint): NavMode {
  if (bp === 'xsmall' || bp === 'small') return 'drawer';
  if (bp === 'medium') return 'overlay-spoke';
  return 'push-spoke';
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window !== 'undefined' ? deriveBreakpoint() : 'large',
  );

  useEffect(() => {
    const handler = () => setBp(deriveBreakpoint());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return bp;
}
