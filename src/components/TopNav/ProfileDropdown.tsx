import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenuWide,
  DropdownUserInfo,
  DropdownUserName,
  DropdownUserMeta,
  DropdownUserEmail,
  DropdownOrgEnv,
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
        <DropdownUserMeta>dchauhan</DropdownUserMeta>
        <DropdownUserEmail>d.chauhan@example.com</DropdownUserEmail>
        <DropdownOrgEnv>
          <span>Acme Corp</span>
          <span>Production</span>
        </DropdownOrgEnv>
      </DropdownUserInfo>

      <DropdownDivider />

      <DropdownSection>
        <DropdownItem
          role="menuitem"
          onClick={() => handleNav('/profile', 'profile')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleNav('/profile', 'profile'); }}
        >
          View my profile
        </DropdownItem>
        <DropdownItem
          role="menuitem"
          onClick={() => handleNav('/environments', 'environments')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleNav('/environments', 'environments'); }}
        >
          View environments
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
