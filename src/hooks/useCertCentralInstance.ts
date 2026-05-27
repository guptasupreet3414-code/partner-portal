import { useCallback, useEffect, useMemo, useState } from 'react';
import { certCentralInstances, productNavConfig, type CertCentralInstance } from '../data/navConfig';

const CURRENT_STORAGE_KEY = 'certcentral-instance-id';
const CONNECTED_STORAGE_KEY = 'certcentral-connected-ids';

function getDefaultCurrentId(): string {
  return productNavConfig.certcentral?.instance?.defaultId ?? certCentralInstances[0]?.id ?? '';
}

function getDefaultConnectedIds(): string[] {
  return (
    productNavConfig.certcentral?.instance?.defaultConnectedIds ?? [getDefaultCurrentId()]
  );
}

function readStoredCurrentId(): string {
  if (typeof window === 'undefined') return getDefaultCurrentId();
  const stored = window.localStorage.getItem(CURRENT_STORAGE_KEY);
  if (stored && certCentralInstances.some(i => i.id === stored)) return stored;
  return getDefaultCurrentId();
}

function readStoredConnectedIds(): string[] {
  if (typeof window === 'undefined') return getDefaultConnectedIds();
  try {
    const raw = window.localStorage.getItem(CONNECTED_STORAGE_KEY);
    if (!raw) return getDefaultConnectedIds();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return getDefaultConnectedIds();
    const valid = parsed.filter(
      (id): id is string => typeof id === 'string' && certCentralInstances.some(i => i.id === id),
    );
    return valid.length > 0 ? valid : getDefaultConnectedIds();
  } catch {
    return getDefaultConnectedIds();
  }
}

export interface UseCertCentralInstanceResult {
  /** The instance the user is actively on */
  current: CertCentralInstance;
  /** Connected instances in display order — current is always first */
  connected: CertCentralInstance[];
  /** Instances that exist but are not connected; surfaced in the "Add" dropdown */
  available: CertCentralInstance[];
  /** Switch the active instance. The id must already be connected. */
  switchTo: (id: string) => void;
  /** Connect a previously-available instance. Appears at the top of the list (just below current). */
  addConnected: (id: string) => void;
}

export function useCertCentralInstance(): UseCertCentralInstanceResult {
  const [currentId, setCurrentId] = useState<string>(readStoredCurrentId);
  const [connectedIds, setConnectedIds] = useState<string[]>(readStoredConnectedIds);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CURRENT_STORAGE_KEY, currentId);
    }
  }, [currentId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CONNECTED_STORAGE_KEY, JSON.stringify(connectedIds));
    }
  }, [connectedIds]);

  const instanceMap = useMemo(
    () => new Map(certCentralInstances.map(i => [i.id, i])),
    [],
  );

  const current = instanceMap.get(currentId) ?? certCentralInstances[0];

  // Display order: current first, then connectedIds in stored order minus current.
  const connected = useMemo(() => {
    const ordered: CertCentralInstance[] = [];
    if (current) ordered.push(current);
    for (const id of connectedIds) {
      if (id === current.id) continue;
      const inst = instanceMap.get(id);
      if (inst) ordered.push(inst);
    }
    return ordered;
  }, [current, connectedIds, instanceMap]);

  const available = useMemo(
    () => certCentralInstances.filter(i => !connectedIds.includes(i.id)),
    [connectedIds],
  );

  const switchTo = useCallback((id: string) => {
    setConnectedIds(prev => (prev.includes(id) ? prev : [id, ...prev]));
    setCurrentId(id);
  }, []);

  const addConnected = useCallback((id: string) => {
    if (!certCentralInstances.some(i => i.id === id)) return;
    setConnectedIds(prev => {
      if (prev.includes(id)) return prev;
      // Insert at index 1 so the new instance sits right under the current one.
      const next = [...prev];
      const currentIndex = next.indexOf(currentId);
      const insertAt = currentIndex === 0 ? 1 : 0;
      next.splice(insertAt, 0, id);
      return next;
    });
  }, [currentId]);

  return { current, connected, available, switchTo, addConnected };
}
