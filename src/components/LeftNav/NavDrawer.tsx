import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DrawerBackdrop,
  DrawerPanel,
  DrawerViewport,
  DrawerPane,
  DrawerPaneHeader,
  DrawerPaneTitle,
  DrawerIconButton,
  DrawerPaneScroll,
  DrawerSubSectionLabel,
  DrawerSubNavLink,
  DrawerInner,
  DrawerGroup,
  DrawerDivider,
  DrawerProductRow,
  DrawerProductLabel,
} from './NavDrawer.styles';
import { getProductIcon, IconClose, IconChevronLeft, IconChevronRight } from '../Icons';
import {
  iconRailGroup1,
  iconRailGroup2,
  productNavConfig,
  type IconRailProduct,
} from '../../data/navConfig';

interface NavDrawerProps {
  open: boolean;
  activeProductId: string;
  /** Selects product + opens spoke + closes drawer */
  onSelectProduct: (id: string) => void;
  /** Backdrop / Escape / close button — no product change */
  onClose: () => void;
  isMobile: boolean;
}

/* ─── Desktop / tablet flat-list item (unchanged behaviour) ────────────── */

const DrawerItem: React.FC<{
  product: IconRailProduct;
  isActive: boolean;
  onSelect: (id: string) => void;
}> = ({ product, isActive, onSelect }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect(product.id);
    navigate(product.route);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = e.currentTarget.closest('div')?.nextElementSibling?.querySelector('button');
      (next as HTMLElement | null)?.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = e.currentTarget.closest('div')?.previousElementSibling?.querySelector('button');
      (prev as HTMLElement | null)?.focus();
    }
  };

  return (
    <div>
      <DrawerProductRow
        $active={isActive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={isActive ? 'page' : undefined}
      >
        {getProductIcon(product.iconType, 18, isActive ? '#1976D2' : '#6B7280')}
        <DrawerProductLabel>{product.label}</DrawerProductLabel>
      </DrawerProductRow>
    </div>
  );
};

/* ─── Mobile Level-1 item ───────────────────────────────────────────────── */

const MobileL1Item: React.FC<{
  product: IconRailProduct;
  isActive: boolean;
  hasSubNav: boolean;
  onSelect: (id: string) => void;
  onDrill: (productId: string, source: HTMLButtonElement) => void;
}> = ({ product, isActive, hasSubNav, onSelect, onDrill }) => {
  const navigate = useNavigate();

  const activate = (source: HTMLButtonElement) => {
    if (hasSubNav) {
      onDrill(product.id, source);
    } else {
      navigate(product.route);
      onSelect(product.id);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => activate(e.currentTarget);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(e.currentTarget); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = e.currentTarget.parentElement?.nextElementSibling?.querySelector<HTMLButtonElement>('button');
      next?.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = e.currentTarget.parentElement?.previousElementSibling?.querySelector<HTMLButtonElement>('button');
      prev?.focus();
    }
  };

  return (
    <div>
      <DrawerProductRow
        $active={isActive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={isActive ? 'page' : undefined}
        aria-haspopup={hasSubNav ? 'menu' : undefined}
      >
        {getProductIcon(product.iconType, 18, isActive ? '#1976D2' : '#6B7280')}
        <DrawerProductLabel>{product.label}</DrawerProductLabel>
        {hasSubNav && (
          <IconChevronRight size={14} color={isActive ? '#1976D2' : '#9CA3AF'} />
        )}
      </DrawerProductRow>
    </div>
  );
};

/* ─── Main component ────────────────────────────────────────────────────── */

export const NavDrawer: React.FC<NavDrawerProps> = ({
  open,
  activeProductId,
  onSelectProduct,
  onClose,
  isMobile,
}) => {
  const location = useLocation();
  const panelRef   = useRef<HTMLDivElement>(null);
  const l2PaneRef  = useRef<HTMLDivElement>(null);
  const drillSrcRef = useRef<HTMLButtonElement | null>(null);

  // Mobile drill-down state
  const [level, setLevel] = useState<'l1' | 'l2'>('l1');
  const [drillProductId, setDrillProductId] = useState<string | null>(null);

  // Always return to L1 when the drawer is closed
  useEffect(() => {
    if (!open) {
      setLevel('l1');
      setDrillProductId(null);
    }
  }, [open]);

  // Prevent keyboard access into the closed drawer panel
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (!open) {
      el.setAttribute('inert', '');
    } else {
      el.removeAttribute('inert');
    }
  }, [open]);

  // Focus first button on open; return focus to hamburger trigger on close
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }, 50);
      return () => clearTimeout(t);
    } else {
      const hamburger = document.querySelector<HTMLElement>('[aria-controls="nav-drawer"]');
      hamburger?.focus();
    }
  }, [open]);

  // Focus trap + Escape
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Swipe-left to dismiss — mobile only
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dx < -80 && dy < 60) onClose();
  };

  // Drill into a product's sub-nav
  const handleDrill = (productId: string, source: HTMLButtonElement) => {
    drillSrcRef.current = source;
    setDrillProductId(productId);
    setLevel('l2');
    setTimeout(() => {
      l2PaneRef.current?.querySelector<HTMLElement>('button, [href]')?.focus();
    }, 50);
  };

  // Go back from L2 to L1
  const handleBack = () => {
    setLevel('l1');
    setTimeout(() => {
      drillSrcRef.current?.focus();
    }, 50);
  };

  const drillProductNav = drillProductId ? productNavConfig[drillProductId] : null;

  return (
    <>
      <DrawerBackdrop $open={open} onClick={onClose} aria-hidden="true" />

      <DrawerPanel
        $open={open}
        ref={panelRef}
        id="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        {isMobile ? (
          /* ── Mobile: two-level slide ─────────────────────────────────── */
          <DrawerViewport $open={open}>

            {/* Level 1 — app list */}
            <DrawerPane
              $offset={level === 'l1' ? 0 : -100}
              aria-hidden={level !== 'l1'}
            >
              <DrawerPaneHeader>
                <DrawerPaneTitle>Navigation</DrawerPaneTitle>
                <DrawerIconButton onClick={onClose} aria-label="Close menu">
                  <IconClose size={16} color="currentColor" />
                </DrawerIconButton>
              </DrawerPaneHeader>

              <DrawerPaneScroll>
                <nav aria-label="Product list">
                  <DrawerGroup>
                    {iconRailGroup1.map(product => (
                      <MobileL1Item
                        key={product.id}
                        product={product}
                        isActive={activeProductId === product.id}
                        hasSubNav={Boolean(productNavConfig[product.id])}
                        onSelect={onSelectProduct}
                        onDrill={handleDrill}
                      />
                    ))}
                  </DrawerGroup>

                  <DrawerDivider />

                  <DrawerGroup>
                    {iconRailGroup2.map(product => (
                      <MobileL1Item
                        key={product.id}
                        product={product}
                        isActive={activeProductId === product.id}
                        hasSubNav={Boolean(productNavConfig[product.id])}
                        onSelect={onSelectProduct}
                        onDrill={handleDrill}
                      />
                    ))}
                  </DrawerGroup>
                </nav>
              </DrawerPaneScroll>
            </DrawerPane>

            {/* Level 2 — sub-nav for the drilled product */}
            <DrawerPane
              $offset={level === 'l2' ? 0 : 100}
              ref={l2PaneRef}
              aria-hidden={level !== 'l2'}
            >
              <DrawerPaneHeader>
                <DrawerIconButton onClick={handleBack} aria-label="Back to menu">
                  <IconChevronLeft size={16} color="currentColor" />
                </DrawerIconButton>
                <DrawerPaneTitle>{drillProductNav?.label ?? ''}</DrawerPaneTitle>
                <DrawerIconButton onClick={onClose} aria-label="Close menu">
                  <IconClose size={16} color="currentColor" />
                </DrawerIconButton>
              </DrawerPaneHeader>

              <DrawerPaneScroll>
                {drillProductNav && (
                  <nav aria-label={`${drillProductNav.label} navigation`}>
                    {drillProductNav.sections.map((section, si) => (
                      <div key={section.title || si}>
                        {section.title && (
                          <DrawerSubSectionLabel>{section.title}</DrawerSubSectionLabel>
                        )}
                        {section.items.map(item => {
                          const isActive = location.pathname === item.route;
                          return (
                            <DrawerSubNavLink
                              key={item.route}
                              to={item.route}
                              $active={isActive}
                              aria-current={isActive ? 'page' : undefined}
                              onClick={() => {
                                onSelectProduct(drillProductId!);
                              }}
                            >
                              {item.label}
                            </DrawerSubNavLink>
                          );
                        })}
                      </div>
                    ))}
                  </nav>
                )}
              </DrawerPaneScroll>
            </DrawerPane>

          </DrawerViewport>
        ) : (
          /* ── Desktop / tablet: flat list (unchanged) ─────────────────── */
          <>
            <DrawerInner $open={open}>
              <nav aria-label="Product list">
                <DrawerGroup>
                  {iconRailGroup1.map(product => (
                    <DrawerItem
                      key={product.id}
                      product={product}
                      isActive={activeProductId === product.id}
                      onSelect={onSelectProduct}
                    />
                  ))}
                </DrawerGroup>

                <DrawerDivider />

                <DrawerGroup>
                  {iconRailGroup2.map(product => (
                    <DrawerItem
                      key={product.id}
                      product={product}
                      isActive={activeProductId === product.id}
                      onSelect={onSelectProduct}
                    />
                  ))}
                </DrawerGroup>
              </nav>
            </DrawerInner>
          </>
        )}
      </DrawerPanel>
    </>
  );
};
