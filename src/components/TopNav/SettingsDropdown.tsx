import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  DropdownDivider,
} from './TopNavDropdown.styles';

interface SettingsDropdownProps {
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

const accountLinks = [
  { label: 'User management', route: '/settings/users', productId: 'settings-users' },
  { label: 'Billing and subscriptions', route: '/settings/billing', productId: 'settings-billing' },
  { label: 'Account settings', route: '/settings/account', productId: 'settings-account' },
  { label: 'Product settings', route: '/settings/product', productId: 'settings-product' },
];

const systemLinks = [
  { label: 'Integrations', route: '/settings/integrations', productId: 'settings-integrations' },
  { label: 'API access', route: '/settings/api', productId: 'settings-api' },
  { label: 'Audit logs', route: '/settings/audit-logs', productId: 'settings-audit-logs' },
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

  const handleNav = (route: string, productId: string) => {
    onSelectProduct(productId);
    navigate(route);
    onClose();
  };

  return (
    <DropdownMenu ref={menuRef} role="menu" aria-label="Settings menu">
      <DropdownSection>
        {accountLinks.map(link => (
          <DropdownItem
            key={link.route}
            role="menuitem"
            onClick={() => handleNav(link.route, link.productId)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') handleNav(link.route, link.productId); }}
          >
            {link.label}
          </DropdownItem>
        ))}
      </DropdownSection>

      <DropdownDivider />

      <DropdownSection>
        {systemLinks.map(link => (
          <DropdownItem
            key={link.route}
            role="menuitem"
            onClick={() => handleNav(link.route, link.productId)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') handleNav(link.route, link.productId); }}
          >
            {link.label}
          </DropdownItem>
        ))}
      </DropdownSection>
    </DropdownMenu>
  );
};
