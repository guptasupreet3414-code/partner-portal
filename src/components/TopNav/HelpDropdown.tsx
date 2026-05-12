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
  { label: 'AI Assist', href: '#' },
  { label: "What's new", href: '#' },
  { label: 'User guide', href: '#' },
  { label: 'API guide', href: '#' },
  { label: 'Knowledge base', href: '#' },
  { label: 'Contact us', href: '#' },
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
