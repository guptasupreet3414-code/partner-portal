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
  MobileProductRow,
  DrawerProductLabel,
  DrawerFooter,
  DrawerFooterButton,
  DrawerFooterIcon,
  DrawerFooterLabel,
  DrawerFooterAvatar,
  MobileProductMetaSection,
  MobilePlanFooter,
  MobilePlanFooterPlan,
  MobilePlanFooterSeats,
  MobilePlanFooterTitle,
  MobileInstancePicker,
  MobileInstancePickerLabel,
  MobileInstancePickerRegion,
  MobileInstancePickerChevron,
} from './NavDrawer.styles';
import {
  DropdownUserInfo,
  DropdownUserName,
  DropdownUserMeta,
  DropdownUserEmail,
  DropdownOrgEnv,
} from '../TopNav/TopNavDropdown.styles';
import { IconClose, IconChevronLeft } from '../Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircleQuestion, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  iconRailGroup1,
  iconRailGroup2,
  productNavConfig,
  getProductLandingRoute,
  type IconRailProduct,
} from '../../data/navConfig';
import { useCertCentralInstance } from '../../hooks/useCertCentralInstance';
import { SwitchInstanceModal } from '../SwitchInstanceModal/SwitchInstanceModal';

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
    navigate(getProductLandingRoute(product.id));
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
        <product.Icon
          aria-hidden="true"
          focusable="false"
          width={18}
          height={18}
          color={isActive ? '#1976D2' : '#6B7280'}
        />
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
      navigate(getProductLandingRoute(product.id));
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
      <MobileProductRow
        $active={isActive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={isActive ? 'page' : undefined}
        aria-haspopup={hasSubNav ? 'menu' : undefined}
      >
        <product.Icon
          aria-hidden="true"
          focusable="false"
          width={22}
          height={22}
          color="currentColor"
        />
        <DrawerProductLabel>{product.label}</DrawerProductLabel>
        {hasSubNav && (
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ fontSize: 12, color: 'currentColor', flexShrink: 0 }}
          />
        )}
      </MobileProductRow>
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
  const navigate = useNavigate();
  const panelRef   = useRef<HTMLDivElement>(null);
  const l2PaneRef  = useRef<HTMLDivElement>(null);
  const drillSrcRef = useRef<HTMLButtonElement | null>(null);

  // Mobile drill-down state
  type FooterKey = 'settings' | 'help' | 'profile';
  const [level, setLevel] = useState<'l1' | 'l2'>('l1');
  const [drillProductId, setDrillProductId] = useState<string | null>(null);
  const [drillFooter, setDrillFooter] = useState<FooterKey | null>(null);
  const [instanceModalOpen, setInstanceModalOpen] = useState(false);
  const certCentralInstance = useCertCentralInstance();

  // Always return to L1 when the drawer is closed
  useEffect(() => {
    if (!open) {
      setLevel('l1');
      setDrillProductId(null);
      setDrillFooter(null);
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
    setDrillFooter(null);
    setDrillProductId(productId);
    setLevel('l2');
    setTimeout(() => {
      l2PaneRef.current?.querySelector<HTMLElement>('button, [href]')?.focus();
    }, 50);
  };

  // Drill into a footer entry (Settings / Help / Profile)
  const handleDrillFooter = (key: FooterKey) => (e: React.MouseEvent<HTMLButtonElement>) => {
    drillSrcRef.current = e.currentTarget;
    setDrillProductId(null);
    setDrillFooter(key);
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

  const footerL2Title: Record<FooterKey, string> = {
    settings: 'Settings',
    help: 'Need help?',
    profile: 'Profile',
  };

  const settingsItems = [
    { label: 'User management', route: '/settings/users' },
    { label: 'Billing and subscriptions', route: '/settings/billing' },
    { label: 'Account settings', route: '/settings/account' },
  ];

  const helpItems = [
    { label: 'AI Assist' },
    { label: "What's new" },
    { label: 'User guide' },
    { label: 'API guide' },
    { label: 'Knowledge base' },
    { label: 'Contact us' },
  ];

  const profileItems = [
    { label: 'View my profile', route: '/profile' },
    { label: 'View environments', route: '/environments' },
    { label: 'Sign out', route: null as string | null },
  ];

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
                <DrawerPaneTitle>Products</DrawerPaneTitle>
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

              {/* Fixed footer: top-nav actions surfaced inside the drawer */}
              <DrawerFooter>
                <DrawerFooterButton
                  type="button"
                  onClick={handleDrillFooter('settings')}
                  aria-haspopup="menu"
                >
                  <DrawerFooterIcon aria-hidden="true">
                    <FontAwesomeIcon icon={faGear} />
                  </DrawerFooterIcon>
                  <DrawerFooterLabel>Settings</DrawerFooterLabel>
                  <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 12, flexShrink: 0 }} />
                </DrawerFooterButton>
                <DrawerFooterButton
                  type="button"
                  onClick={handleDrillFooter('help')}
                  aria-haspopup="menu"
                >
                  <DrawerFooterIcon aria-hidden="true">
                    <FontAwesomeIcon icon={faCircleQuestion} />
                  </DrawerFooterIcon>
                  <DrawerFooterLabel>Need help?</DrawerFooterLabel>
                  <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 12, flexShrink: 0 }} />
                </DrawerFooterButton>
                <DrawerFooterButton
                  type="button"
                  onClick={handleDrillFooter('profile')}
                  aria-haspopup="menu"
                >
                  <DrawerFooterAvatar aria-hidden="true">D</DrawerFooterAvatar>
                  <DrawerFooterLabel>Profile</DrawerFooterLabel>
                  <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 12, flexShrink: 0 }} />
                </DrawerFooterButton>
              </DrawerFooter>
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
                <DrawerPaneTitle>
                  {drillProductNav?.label ?? (drillFooter && footerL2Title[drillFooter]) ?? ''}
                </DrawerPaneTitle>
                <DrawerIconButton onClick={onClose} aria-label="Close menu">
                  <IconClose size={16} color="currentColor" />
                </DrawerIconButton>
              </DrawerPaneHeader>

              <DrawerPaneScroll>
                {drillProductNav?.instance && (
                  <MobileProductMetaSection>
                    {drillProductNav.instance && (
                      <MobileInstancePicker
                        type="button"
                        onClick={() => setInstanceModalOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={instanceModalOpen}
                        aria-label={`Current instance: ${certCentralInstance.current.name} (${certCentralInstance.current.region}). Switch instance.`}
                      >
                        <MobileInstancePickerLabel>
                          {certCentralInstance.current.name}
                          <MobileInstancePickerRegion>({certCentralInstance.current.region})</MobileInstancePickerRegion>
                        </MobileInstancePickerLabel>
                        <MobileInstancePickerChevron aria-hidden="true">
                          <FontAwesomeIcon icon={faChevronRight} />
                        </MobileInstancePickerChevron>
                      </MobileInstancePicker>
                    )}
                  </MobileProductMetaSection>
                )}
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

                {drillFooter === 'settings' && (
                  <nav aria-label="Settings menu">
                    {settingsItems.map(item => (
                      <DrawerSubNavLink
                        key={item.route}
                        to={item.route}
                        $active={location.pathname === item.route}
                        onClick={onClose}
                      >
                        {item.label}
                      </DrawerSubNavLink>
                    ))}
                  </nav>
                )}

                {drillFooter === 'help' && (
                  <nav aria-label="Help menu">
                    {helpItems.map(item => (
                      <DrawerFooterButton
                        key={item.label}
                        type="button"
                        onClick={onClose}
                      >
                        <DrawerFooterLabel>{item.label}</DrawerFooterLabel>
                      </DrawerFooterButton>
                    ))}
                  </nav>
                )}

                {drillFooter === 'profile' && (
                  <>
                    <DropdownUserInfo>
                      <DropdownUserName>Deepika Chauhan</DropdownUserName>
                      <DropdownUserMeta>dchauhan</DropdownUserMeta>
                      <DropdownUserEmail>d.chauhan@example.com</DropdownUserEmail>
                      <DropdownOrgEnv>Acme Corp</DropdownOrgEnv>
                    </DropdownUserInfo>
                    <nav aria-label="Profile menu">
                      {profileItems.map(item => (
                        item.route ? (
                          <DrawerSubNavLink
                            key={item.label}
                            to={item.route}
                            $active={location.pathname === item.route}
                            onClick={onClose}
                          >
                            {item.label}
                          </DrawerSubNavLink>
                        ) : (
                          <DrawerFooterButton
                            key={item.label}
                            type="button"
                            onClick={onClose}
                          >
                            <DrawerFooterLabel>{item.label}</DrawerFooterLabel>
                          </DrawerFooterButton>
                        )
                      ))}
                    </nav>
                  </>
                )}
              </DrawerPaneScroll>

              {drillProductNav?.plan && (
                <MobilePlanFooter
                  type="button"
                  $active={location.pathname === drillProductNav.plan.route}
                  aria-current={location.pathname === drillProductNav.plan.route ? 'page' : undefined}
                  onClick={() => {
                    navigate(drillProductNav.plan!.route);
                    onSelectProduct(drillProductId!);
                  }}
                  aria-label={`${drillProductNav.plan.tier} plan${
                    drillProductNav.plan.seatsUsed != null && drillProductNav.plan.seatsTotal != null
                      ? `, ${drillProductNav.plan.seatsUsed} of ${drillProductNav.plan.seatsTotal} seats used`
                      : ''
                  }. Manage billing and upgrade options.`}
                >
                  <MobilePlanFooterPlan>{drillProductNav.plan.tier} Plan</MobilePlanFooterPlan>
                  {drillProductNav.plan.seatsUsed != null && drillProductNav.plan.seatsTotal != null && (
                    <MobilePlanFooterSeats>
                      {drillProductNav.plan.seatsUsed} / {drillProductNav.plan.seatsTotal} seats used
                    </MobilePlanFooterSeats>
                  )}
                  <MobilePlanFooterTitle>Manage billing</MobilePlanFooterTitle>
                </MobilePlanFooter>
              )}
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

      {isMobile && (
        <SwitchInstanceModal
          open={instanceModalOpen}
          onClose={() => setInstanceModalOpen(false)}
          connected={certCentralInstance.connected}
          available={certCentralInstance.available}
          currentId={certCentralInstance.current.id}
          onSwitch={certCentralInstance.switchTo}
          onAddConnected={certCentralInstance.addConnected}
        />
      )}
    </>
  );
};
