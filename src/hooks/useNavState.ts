import { useState, useCallback } from 'react';

export type ActiveTopNav = 'cart' | 'settings' | 'help' | 'profile' | null;

interface NavState {
  activeProductId: string;
  isDrawerOpen: boolean;
  isSpokeOpen: boolean;
  activeTopNav: ActiveTopNav;
}

interface NavActions {
  /** Hamburger button only */
  toggleDrawer: () => void;
  /** Backdrop / Escape close without product change */
  closeDrawer: () => void;
  /** Chevron button only */
  toggleSpoke: () => void;
  /** Icon rail OR drawer product row — sets product and always opens spoke */
  selectProduct: (id: string) => void;
  /** Drawer product row — also closes the drawer */
  selectProductFromDrawer: (id: string) => void;
  openTopNav: (panel: Exclude<ActiveTopNav, null>) => void;
  closeTopNav: () => void;
}

export function useNavState(): NavState & NavActions {
  const [activeProductId, setActiveProductId] = useState<string>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen]       = useState<boolean>(false);
  const [isSpokeOpen,  setIsSpokeOpen]        = useState<boolean>(true);
  const [activeTopNav, setActiveTopNav]       = useState<ActiveTopNav>(null);

  const toggleDrawer = useCallback(() => setIsDrawerOpen(p => !p), []);
  const closeDrawer  = useCallback(() => setIsDrawerOpen(false), []);
  const toggleSpoke  = useCallback(() => setIsSpokeOpen(p => !p), []);

  // Icon rail click: update product + open spoke
  const selectProduct = useCallback((id: string) => {
    setActiveProductId(id);
    setIsSpokeOpen(true);
  }, []);

  // Drawer product click: update product + open spoke + close drawer
  const selectProductFromDrawer = useCallback((id: string) => {
    setActiveProductId(id);
    setIsSpokeOpen(true);
    setIsDrawerOpen(false);
  }, []);

  const openTopNav = useCallback((panel: Exclude<ActiveTopNav, null>) => {
    setActiveTopNav(prev => (prev === panel ? null : panel));
  }, []);

  const closeTopNav = useCallback(() => setActiveTopNav(null), []);

  return {
    activeProductId,
    isDrawerOpen,
    isSpokeOpen,
    activeTopNav,
    toggleDrawer,
    closeDrawer,
    toggleSpoke,
    selectProduct,
    selectProductFromDrawer,
    openTopNav,
    closeTopNav,
  };
}
