import React from 'react';
import {
  TopNavBar,
  NavLeft,
  NavRight,
  NavDropdownWrapper,
  HamburgerWrapper,
  LogoText,
  IconButton,
  CartBadge,
  UserAvatar,
} from './TopNav.styles';
import { SettingsDropdown } from './SettingsDropdown';
import { HelpDropdown } from './HelpDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { CartPanel } from './CartPanel';
import { AIAssistPanel } from './AIAssistPanel';
import { TransparentBackdrop } from './TopNavDropdown.styles';
import {
  IconHamburger,
  IconCart,
  IconGear,
  IconHelp,
  IconSparkle,
} from '../Icons';
import type { ActiveTopNav } from '../../hooks/useNavState';

interface TopNavProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  activeTopNav: ActiveTopNav;
  onOpenTopNav: (panel: Exclude<ActiveTopNav, null>) => void;
  onCloseTopNav: () => void;
  onSelectProduct: (id: string) => void;
  cartCount?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  isDrawerOpen,
  onToggleDrawer,
  activeTopNav,
  onOpenTopNav,
  onCloseTopNav,
  onSelectProduct,
  cartCount = 3,
}) => {
  const hasDropdown = activeTopNav === 'settings' || activeTopNav === 'help' || activeTopNav === 'profile';

  return (
    <>
      <TopNavBar role="banner">
        <NavLeft>
          {/* Visible only on mobile (<768px) — CSS controls display */}
          <HamburgerWrapper>
            <IconButton
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
              aria-controls="nav-drawer"
              onClick={onToggleDrawer}
            >
              <IconHamburger size={20} />
            </IconButton>
          </HamburgerWrapper>
          <LogoText aria-label="DigiCert ONE">
            <span className="logo-normal">digicert </span>
            <span className="logo-bold">ONE</span>
          </LogoText>
        </NavLeft>

        <NavRight>
          {/* Cart */}
          <NavDropdownWrapper>
            <IconButton
              aria-label="Open cart"
              aria-expanded={activeTopNav === 'cart'}
              aria-haspopup="dialog"
              onClick={() => onOpenTopNav('cart')}
            >
              <IconCart size={20} />
              {cartCount > 0 && <CartBadge aria-hidden="true">{cartCount}</CartBadge>}
            </IconButton>
          </NavDropdownWrapper>

          {/* Settings gear → dropdown */}
          <NavDropdownWrapper>
            <IconButton
              aria-label="Settings"
              aria-expanded={activeTopNav === 'settings'}
              aria-haspopup="menu"
              onClick={() => onOpenTopNav('settings')}
            >
              <IconGear size={20} />
            </IconButton>
            {activeTopNav === 'settings' && (
              <SettingsDropdown onClose={onCloseTopNav} onSelectProduct={onSelectProduct} />
            )}
          </NavDropdownWrapper>

          {/* Help → dropdown */}
          <NavDropdownWrapper>
            <IconButton
              aria-label="Help"
              aria-expanded={activeTopNav === 'help'}
              aria-haspopup="menu"
              onClick={() => onOpenTopNav('help')}
            >
              <IconHelp size={20} />
            </IconButton>
            {activeTopNav === 'help' && (
              <HelpDropdown onClose={onCloseTopNav} />
            )}
          </NavDropdownWrapper>

          {/* AI Assist → push panel */}
          <IconButton
            aria-label="Open AI Assist"
            aria-expanded={activeTopNav === 'ai-assist'}
            onClick={() => onOpenTopNav('ai-assist')}
          >
            <IconSparkle size={20} />
          </IconButton>

          {/* User avatar → dropdown */}
          <NavDropdownWrapper>
            <UserAvatar
              aria-label="User profile"
              aria-expanded={activeTopNav === 'profile'}
              aria-haspopup="menu"
              onClick={() => onOpenTopNav('profile')}
            >
              D
            </UserAvatar>
            {activeTopNav === 'profile' && (
              <ProfileDropdown onClose={onCloseTopNav} onSelectProduct={onSelectProduct} />
            )}
          </NavDropdownWrapper>
        </NavRight>
      </TopNavBar>

      {/* Transparent backdrop closes dropdowns when clicking outside */}
      {hasDropdown && <TransparentBackdrop onClick={onCloseTopNav} aria-hidden="true" />}

      {/* Cart — right-side overlay panel */}
      <CartPanel open={activeTopNav === 'cart'} onClose={onCloseTopNav} />

      {/* AI Assist — right-side push panel (no backdrop) */}
      <AIAssistPanel open={activeTopNav === 'ai-assist'} onClose={onCloseTopNav} />
    </>
  );
};
