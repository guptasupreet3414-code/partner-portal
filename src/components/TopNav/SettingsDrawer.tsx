import React, { useEffect, useRef } from 'react';
import {
  Backdrop,
  DrawerPanel,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseBtn,
  DrawerBody,
  DrawerGroup,
  DrawerGroupTitle,
  DrawerLink,
  DrawerDivider,
} from './SettingsDrawer.styles';
import { IconClose } from '../Icons';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const drawerGroups = [
  {
    title: 'User management',
    items: ['Users', 'Groups'],
  },
  {
    title: 'Billing and subscriptions',
    items: ['My subscriptions', 'Receipts', 'Payment details'],
  },
  {
    title: 'Account settings',
    items: ['Overview', 'Access', 'Groups'],
  },
  {
    title: 'Product settings',
    items: ['Overview', 'Identity & access'],
  },
];

const topLinks = [
  'Integrations',
  'API access',
  'Audit logs',
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ open, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    firstFocusRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <Backdrop $open={open} onClick={onClose} aria-hidden="true" />
      <DrawerPanel
        $open={open}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-heading"
        aria-hidden={!open}
      >
        <DrawerHeader>
          <DrawerTitle id="settings-heading">Settings</DrawerTitle>
          <DrawerCloseBtn
            ref={firstFocusRef}
            onClick={onClose}
            aria-label="Close settings"
          >
            <IconClose size={16} color="currentColor" />
          </DrawerCloseBtn>
        </DrawerHeader>

        <DrawerBody aria-label="Settings navigation">
          {drawerGroups.map((group, gi) => (
            <React.Fragment key={group.title}>
              {gi > 0 && <DrawerDivider />}
              <DrawerGroup>
                <DrawerGroupTitle>{group.title}</DrawerGroupTitle>
                {group.items.map((item) => (
                  <DrawerLink
                    key={item}
                    href="#"
                    onClick={(e) => { e.preventDefault(); console.log(`Settings: ${item}`); }}
                  >
                    {item}
                  </DrawerLink>
                ))}
              </DrawerGroup>
            </React.Fragment>
          ))}

          <DrawerDivider />

          <DrawerGroup>
            {topLinks.map((link) => (
              <DrawerLink
                key={link}
                href="#"
                onClick={(e) => { e.preventDefault(); console.log(`Settings: ${link}`); }}
                style={{ paddingLeft: '20px' }}
              >
                {link}
              </DrawerLink>
            ))}
          </DrawerGroup>
        </DrawerBody>
      </DrawerPanel>
    </>
  );
};
