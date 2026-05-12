import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenuWide,
  DropdownUserInfo,
  DropdownUserName,
  DropdownUserEmail,
  DropdownSection,
  DropdownItem,
  DropdownDivider,
} from './TopNavDropdown.styles';

interface ProfileDropdownProps {
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose, onSelectProduct }) => {
  const navigate = useNavigate();

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
    <DropdownMenuWide role="menu" aria-label="User profile menu">
      <DropdownUserInfo>
        <DropdownUserName>Deepika Chauhan</DropdownUserName>
        <DropdownUserEmail>d.chauhan@example.com</DropdownUserEmail>
      </DropdownUserInfo>

      <DropdownDivider />

      <DropdownSection>
        <DropdownItem
          role="menuitem"
          onClick={() => handleNav('/profile', 'profile')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleNav('/profile', 'profile'); }}
        >
          My profile
        </DropdownItem>
        <DropdownItem
          role="menuitem"
          onClick={() => handleNav('/settings/account', 'settings-account')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleNav('/settings/account', 'settings-account'); }}
        >
          Account settings
        </DropdownItem>
      </DropdownSection>

      <DropdownDivider />

      <DropdownSection>
        <DropdownItem
          role="menuitem"
          data-destructive="true"
          onClick={() => { console.log('Sign out'); onClose(); }}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') { console.log('Sign out'); onClose(); } }}
        >
          Sign out
        </DropdownItem>
      </DropdownSection>
    </DropdownMenuWide>
  );
};
