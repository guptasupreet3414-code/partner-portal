import React from 'react';
import { IconRail } from './IconRail';
import { ProductSubNav } from './ProductSubNav';
import { NavDrawer } from './NavDrawer';

interface LeftNavProps {
  activeProductId: string;
  isDrawerOpen: boolean;
  isSpokeOpen: boolean;
  isMobile: boolean;
  /** Icon rail click: selectProduct (sets active + opens spoke) */
  onSelectProduct: (id: string) => void;
  /** Drawer product click: selectProductFromDrawer (sets active + opens spoke + closes drawer) */
  onSelectProductFromDrawer: (id: string) => void;
  onCloseDrawer: () => void;
  onToggleSpoke: () => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({
  activeProductId,
  isDrawerOpen,
  isSpokeOpen,
  isMobile,
  onSelectProduct,
  onSelectProductFromDrawer,
  onCloseDrawer,
  onToggleSpoke,
}) => {
  return (
    <>
      {/* Layer 1: icon rail — hidden on mobile via CSS */}
      <IconRail
        activeProductId={activeProductId}
        onSelectProduct={onSelectProduct}
      />

      {/* Layer 2: spoke panel — hidden on mobile via CSS; overlay on tablet */}
      <ProductSubNav
        activeProductId={activeProductId}
        isSpokeOpen={isSpokeOpen}
        onToggleSpoke={onToggleSpoke}
      />

      {/* Layer 3: hamburger drawer — mobile primary nav, desktop fallback */}
      <NavDrawer
        open={isDrawerOpen}
        activeProductId={activeProductId}
        onSelectProduct={onSelectProductFromDrawer}
        onClose={onCloseDrawer}
        isMobile={isMobile}
      />
    </>
  );
};
