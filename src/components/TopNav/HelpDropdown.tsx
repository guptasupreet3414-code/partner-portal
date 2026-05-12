import React, { useEffect } from 'react';
import {
  DropdownMenuWide,
  DropdownHeader,
  DropdownSection,
  DropdownItem,
  DropdownDivider,
} from './TopNavDropdown.styles';

interface HelpDropdownProps {
  onClose: () => void;
}

const helpLinks = [
  { label: 'Documentation', href: '#' },
  { label: 'Contact support', href: '#' },
  { label: 'Video tutorials', href: '#' },
  { label: 'Release notes', href: '#' },
  { label: 'Community forum', href: '#' },
];

export const HelpDropdown: React.FC<HelpDropdownProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <DropdownMenuWide role="menu" aria-label="Help menu">
      <DropdownHeader>Need help?</DropdownHeader>
      <DropdownDivider />
      <DropdownSection>
        {helpLinks.map(link => (
          <DropdownItem
            key={link.label}
            role="menuitem"
            href={link.href}
            onClick={onClose}
            tabIndex={0}
          >
            {link.label}
          </DropdownItem>
        ))}
      </DropdownSection>
    </DropdownMenuWide>
  );
};
