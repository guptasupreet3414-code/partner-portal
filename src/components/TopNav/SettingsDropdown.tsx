import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenuWide,
  DropdownHeader,
  DropdownSection,
  DropdownItem,
  DropdownDivider,
} from './TopNavDropdown.styles';

interface SettingsDropdownProps {
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

interface SettingsLink {
  label: string;
  route: string;
  productId?: string;
}

const settingsLinks: SettingsLink[] = [
  { label: 'User management', route: '/settings/users', productId: 'settings-users' },
  { label: 'Billing and subscriptions', route: '/settings/billing', productId: 'settings-billing' },
  { label: 'Account settings', route: '/settings/account', productId: 'settings-account' },
];

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ onClose, onSelectProduct }) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleNav = (link: SettingsLink) => {
    if (link.productId) onSelectProduct(link.productId);
    navigate(link.route);
    onClose();
  };

  return (
    <DropdownMenuWide ref={menuRef} role="menu" aria-label="Settings menu">
      <DropdownHeader>Settings</DropdownHeader>
      <DropdownDivider />
      <DropdownSection>
        {settingsLinks.map(link => (
          <DropdownItem
            key={link.route}
            role="menuitem"
            onClick={() => handleNav(link)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') handleNav(link); }}
          >
            {link.label}
          </DropdownItem>
        ))}
      </DropdownSection>
    </DropdownMenuWide>
  );
};
