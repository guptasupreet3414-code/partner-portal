import React, { useEffect, useState } from 'react';
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
  EnvironmentsSection,
  EnvironmentsLabel,
  EnvironmentRow,
  EnvironmentAvatar,
  EnvironmentText,
  EnvironmentName,
  EnvironmentSubtitle,
  EnvironmentAction,
} from './TopNavDropdown.styles';

interface ProfileDropdownProps {
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

interface Environment {
  id: string;
  name: string;
  productCount: number;
}

const ENVIRONMENTS: Environment[] = [
  { id: 'production', name: 'ACME — Production', productCount: 2 },
  { id: 'test', name: 'ACME — Test', productCount: 1 },
  { id: 'eu-dev', name: 'ACME EU — Dev', productCount: 2 },
];

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose, onSelectProduct }) => {
  const navigate = useNavigate();
  const [currentEnvId, setCurrentEnvId] = useState('production');

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

  const handleEnvironmentClick = (envId: string) => {
    if (envId === currentEnvId) {
      // Current environment → go to manage page
      navigate('/environments');
      onClose();
      return;
    }
    setCurrentEnvId(envId);
    onClose();
  };

  return (
    <DropdownMenuWide role="menu" aria-label="User profile menu">
      <DropdownUserInfo>
        <DropdownUserName>Deepika Chauhan</DropdownUserName>
        <DropdownUserMeta>dchauhan</DropdownUserMeta>
        <DropdownUserEmail>d.chauhan@example.com</DropdownUserEmail>
        <DropdownOrgEnv>Acme Corp</DropdownOrgEnv>
      </DropdownUserInfo>

      <DropdownDivider />

      <EnvironmentsSection>
        <EnvironmentsLabel>Environments</EnvironmentsLabel>
        {ENVIRONMENTS.map(env => {
          const isCurrent = env.id === currentEnvId;
          return (
            <EnvironmentRow
              key={env.id}
              type="button"
              role="menuitem"
              $current={isCurrent}
              onClick={() => handleEnvironmentClick(env.id)}
              aria-current={isCurrent ? 'true' : undefined}
              aria-label={
                isCurrent
                  ? `${env.name}. Currently active. Click to manage.`
                  : `Switch to ${env.name}`
              }
            >
              <EnvironmentAvatar aria-hidden="true">
                {env.name.charAt(0)}
              </EnvironmentAvatar>
              <EnvironmentText>
                <EnvironmentName>{env.name}</EnvironmentName>
                <EnvironmentSubtitle>
                  {env.productCount} connected {env.productCount === 1 ? 'product' : 'products'}
                </EnvironmentSubtitle>
              </EnvironmentText>
              <EnvironmentAction $primary={isCurrent}>
                {isCurrent ? 'Manage' : 'Switch to'}
              </EnvironmentAction>
            </EnvironmentRow>
          );
        })}
      </EnvironmentsSection>

      <DropdownDivider />

      <DropdownSection>
        <DropdownItem
          role="menuitem"
          onClick={() => handleNav('/environments', 'environments')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleNav('/environments', 'environments'); }}
        >
          View all environments
        </DropdownItem>
        <DropdownItem
          role="menuitem"
          onClick={() => handleNav('/profile', 'profile')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleNav('/profile', 'profile'); }}
        >
          View my profile
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
