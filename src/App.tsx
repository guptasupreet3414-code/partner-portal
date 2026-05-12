import React, { useRef, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { TopNav } from './components/TopNav/TopNav';
import { LeftNav } from './components/LeftNav/LeftNav';
import { StubPage } from './pages/StubPage';
import { ExplorePage } from './pages/ExplorePage';
import { useNavState } from './hooks/useNavState';
import { useBreakpoint, getNavMode } from './hooks/useBreakpoint';
import { exploreProductIds, productNavConfig } from './data/navConfig';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-padding-top: ${({ theme }) => theme.layout.topNavHeight};
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.neutral900};
    -webkit-font-smoothing: antialiased;
  }

  /* Skip-to-main */
  .skip-link {
    position: absolute;
    top: -9999px;
    left: 0;
    z-index: 9999;
    padding: 8px 16px;
    background: ${({ theme }) => theme.colors.blue300};
    color: white;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    border-radius: 0 0 4px 4px;

    &:focus {
      top: 0;
    }
  }
`;

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const ContentArea = styled.div<{ $leftOffset: string; $rightOffset: string }>`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  left: ${({ $leftOffset }) => $leftOffset};
  right: ${({ $rightOffset }) => $rightOffset};
  bottom: 0;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
  transition: left 0.2s ease, right 0.2s ease;

  /* medium: tablet — spoke overlays content; rail visible */
  @media (min-width: 640px) and (max-width: 1023px) {
    left: ${({ theme }) => theme.layout.iconRailWidth};
    right: 0;
    padding: 24px;
  }

  /* large: small desktop — spoke pushes content */
  @media (min-width: 1024px) {
    padding: 32px;
  }

  /* xlarge: more generous breathing room */
  @media (min-width: 1280px) {
    padding: 40px;
  }

  /* drawer mode (< medium): no icon rail, full width */
  @media (max-width: 639px) {
    left: 0;
    right: 0;
  }
`;

const allRoutes = [
  '/',
  '/dashboard',
  '/dashboard/clients-tools',
  '/quantum-central',
  '/quantum-central/dashboard',
  '/quantum-central/settings',
  '/certcentral',
  '/certcentral/dashboard',
  '/certcentral/reports',
  '/certcentral/audit-logs',
  '/certcentral/inventory',
  '/certcentral/trust-store',
  '/certcentral/certificate-profiles',
  '/certcentral/certificate-templates',
  '/certcentral/alert-rules',
  '/certcentral/workflow-rules',
  '/certcentral/agents',
  '/certcentral/sensors',
  '/certcentral/network-scans',
  '/certcentral/scripts',
  '/certcentral/connectors',
  '/certcentral/client-tools',
  '/certcentral/product-settings',
  '/certcentral/alert-destinations',
  '/certcentral/business-units',
  '/certcentral/seats',
  '/trust-lifecycle',
  '/trust-lifecycle/dashboard',
  '/trust-lifecycle/alerts',
  '/trust-lifecycle/reports',
  '/trust-lifecycle/audit-logs',
  '/trust-lifecycle/releases',
  '/trust-lifecycle/threat-scanning',
  '/trust-lifecycle/keypairs',
  '/trust-lifecycle/key-rotations',
  '/trust-lifecycle/keypair-profiles',
  '/trust-lifecycle/gpg-keypairs',
  '/trust-lifecycle/certificates',
  '/trust-lifecycle/certificate-profiles',
  '/trust-lifecycle/certcentral-orders',
  '/trust-lifecycle/connectors',
  '/trust-lifecycle/tools',
  '/trust-lifecycle/product-settings',
  '/trust-lifecycle/projects',
  '/trust-lifecycle/teams',
  '/trust-lifecycle/user-groups',
  '/private-ca',
  '/private-ca/dashboard',
  '/private-ca/audit-logs',
  '/private-ca/roots',
  '/private-ca/intermediates',
  '/private-ca/hierarchy',
  '/private-ca/end-entity-certificates',
  '/private-ca/certificate-profiles',
  '/private-ca/certificate-templates',
  '/private-ca/crls',
  '/private-ca/ocsps',
  '/private-ca/aias',
  '/private-ca/registered-partitions',
  '/private-ca/master-escrow-keys',
  '/private-ca/providers',
  '/private-ca/remote-proxy',
  '/private-ca/product-settings',
  '/private-ca/accounts',
  '/software-trust',
  '/software-trust/dashboard',
  '/software-trust/alerts',
  '/software-trust/reports',
  '/software-trust/audit-logs',
  '/software-trust/orders',
  '/software-trust/requests',
  '/software-trust/certificates',
  '/software-trust/domains',
  '/software-trust/organizations',
  '/software-trust/certificate-authority',
  '/software-trust/discovery-dashboard',
  '/software-trust/view-results',
  '/software-trust/manage-discovery',
  '/software-trust/automate-now',
  '/software-trust/manage-automation',
  '/software-trust/manage-profiles',
  '/software-trust/automated-ips',
  '/software-trust/automation-plus',
  '/software-trust/subaccounts',
  '/software-trust/subaccounts-orders',
  '/software-trust/api-keys',
  '/software-trust/acme-directory-urls',
  '/software-trust/webhooks',
  '/software-trust/ultra-dns',
  '/software-trust/ssl-installation-tool',
  '/software-trust/certificate-utility',
  '/software-trust/csr-generator',
  '/software-trust/preferences',
  '/software-trust/product-settings',
  '/software-trust/custom-order-fields',
  '/software-trust/security-settings',
  '/software-trust/users',
  '/software-trust/service-users',
  '/software-trust/divisions',
  '/software-trust/guest-access',
  '/software-trust/user-invitations',
  '/dns',
  '/dns/dashboard',
  '/dns/settings',
  '/content-trust',
  '/content-trust/dashboard',
  '/content-trust/settings',
  '/device-trust',
  '/device-trust/dashboard',
  '/device-trust/settings',
  '/ai-agents',
  '/ai-agents/dashboard',
  '/ai-agents/settings',
  '/valimail',
  '/valimail/dashboard',
  '/valimail/settings',
  '/settings/users',
  '/settings/users/groups',
  '/settings/billing',
  '/settings/billing/receipts',
  '/settings/billing/payment-details',
  '/settings/account',
  '/settings/product',
  '/settings/integrations',
  '/settings/api',
  '/settings/audit-logs',
  '/profile',
];

export const App: React.FC = () => {
  const {
    activeProductId,
    isDrawerOpen,
    isSpokeOpen,
    activeTopNav,
    selectProduct,
    selectProductFromDrawer,
    toggleDrawer,
    closeDrawer,
    toggleSpoke,
    openTopNav,
    closeTopNav,
  } = useNavState();

  const breakpoint = useBreakpoint();
  const navMode = getNavMode(breakpoint);
  const isMobile = navMode === 'drawer';

  // Close the drawer if the viewport grows beyond drawer mode
  useEffect(() => {
    if (navMode !== 'drawer' && isDrawerOpen) closeDrawer();
  }, [navMode, isDrawerOpen, closeDrawer]);

  // Make the main content area inert while the mobile drawer is open so that
  // screen readers and keyboard users cannot reach content behind the overlay.
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isMobile && isDrawerOpen) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    }
  }, [isMobile, isDrawerOpen]);

  // Desktop: content shifts right when spoke is open. Tablet/mobile: CSS overrides.
  // Explore products have no spoke — content fills the area right of the icon rail.
  const hasSpoke = Boolean(productNavConfig[activeProductId]);
  const leftOffset = isSpokeOpen && hasSpoke ? '276px' : '72px';
  const rightOffset = activeTopNav === 'ai-assist' ? '400px' : '0px';

  return (
    <AppShell>
      <GlobalStyle />
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <TopNav
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={toggleDrawer}
        activeTopNav={activeTopNav}
        onOpenTopNav={openTopNav}
        onCloseTopNav={closeTopNav}
        onSelectProduct={selectProduct}
      />

      <LeftNav
        activeProductId={activeProductId}
        isDrawerOpen={isDrawerOpen}
        isSpokeOpen={isSpokeOpen}
        isMobile={isMobile}
        onSelectProduct={selectProduct}
        onSelectProductFromDrawer={selectProductFromDrawer}
        onCloseDrawer={closeDrawer}
        onToggleSpoke={toggleSpoke}
      />

      <ContentArea
        ref={contentRef}
        id="main-content"
        $leftOffset={leftOffset}
        $rightOffset={rightOffset}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {[...exploreProductIds].map(id => (
            <Route key={id} path={`/${id}`} element={<ExplorePage productId={id} />} />
          ))}
          {allRoutes.filter(r => r !== '/' && ![...exploreProductIds].some(id => r === `/${id}` || r.startsWith(`/${id}/`))).map(route => (
            <Route key={route} path={route} element={<StubPage />} />
          ))}
          <Route path="*" element={<StubPage />} />
        </Routes>
      </ContentArea>
    </AppShell>
  );
};
