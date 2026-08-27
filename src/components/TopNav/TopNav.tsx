import React, { useState } from 'react';
import {
  TopNavBar,
  NavLeft,
  NavRight,
  NavDropdownWrapper,
  HamburgerWrapper,
  HideOnMobile,
  LogoImage,
  IconButton,
  CartBadge,
  TopNavTooltip,
  UserAvatar,
} from './TopNav.styles';
import digicertOneLogo from '../../assets/dc-one-logo.png';
import { SettingsDropdown } from './SettingsDropdown';
import { HelpDropdown } from './HelpDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { CartPanel } from './CartPanel';
import { TransparentBackdrop } from './TopNavDropdown.styles';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { IconHamburger } from '../Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faGear, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
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
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);

  const handleOpenWorkspaceSwitcher = () => {
    onCloseTopNav();
    setWorkspaceSwitcherOpen(true);
  };

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
          <LogoImage src={digicertOneLogo} alt="DigiCert ONE" />
          <WorkspaceSwitcher
            isOpen={workspaceSwitcherOpen}
            onOpen={handleOpenWorkspaceSwitcher}
            onClose={() => setWorkspaceSwitcherOpen(false)}
          />
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
              <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: 20 }} />
              {cartCount > 0 && <CartBadge aria-hidden="true">{cartCount}</CartBadge>}
            </IconButton>
            <TopNavTooltip role="tooltip" aria-hidden="true">Cart</TopNavTooltip>
          </NavDropdownWrapper>

          {/* Settings / Help / Profile move into the hamburger drawer on mobile */}
          <HideOnMobile>
            {/* Settings gear → dropdown */}
            <NavDropdownWrapper>
              <IconButton
                aria-label="Settings"
                aria-expanded={activeTopNav === 'settings'}
                aria-haspopup="menu"
                onClick={() => onOpenTopNav('settings')}
              >
                <FontAwesomeIcon icon={faGear} style={{ fontSize: 20 }} />
              </IconButton>
              <TopNavTooltip role="tooltip" aria-hidden="true">Settings</TopNavTooltip>
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
                <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 20 }} />
              </IconButton>
              <TopNavTooltip role="tooltip" aria-hidden="true">Need help?</TopNavTooltip>
              {activeTopNav === 'help' && (
                <HelpDropdown onClose={onCloseTopNav} />
              )}
            </NavDropdownWrapper>

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
              <TopNavTooltip role="tooltip" aria-hidden="true">Profile</TopNavTooltip>
              {activeTopNav === 'profile' && (
                <ProfileDropdown onClose={onCloseTopNav} onSelectProduct={onSelectProduct} />
              )}
            </NavDropdownWrapper>
          </HideOnMobile>
        </NavRight>
      </TopNavBar>

      {/* Transparent backdrop closes dropdowns when clicking outside */}
      {hasDropdown && <TransparentBackdrop onClick={onCloseTopNav} aria-hidden="true" />}


      {/* Cart — right-side overlay panel */}
      <CartPanel open={activeTopNav === 'cart'} onClose={onCloseTopNav} />

    </>
  );
};
