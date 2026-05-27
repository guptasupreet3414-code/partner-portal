import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faCopy,
  faChevronDown,
  faChevronUp,
  faCheck,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import type { CertCentralInstance } from '../../data/navConfig';

/* ─── Backdrop + dialog ─────────────────────────────────────────────────── */

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 24px;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  width: 100%;
  max-width: 640px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
`;

const DialogTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral700};
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
    color: ${({ theme }) => theme.colors.neutral900};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const DialogBody = styled.div`
  padding: 0 24px 24px;
  overflow-y: auto;
`;

const InfoBanner = styled.div`
  background: #F0F2F5;
  border-radius: 6px;
  padding: 16px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral800};
  margin-bottom: 16px;
`;

/* ─── Instance row ──────────────────────────────────────────────────────── */

const InstanceList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const InstanceRow = styled.li<{ $current: boolean; $clickable: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  border-radius: 6px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background 0.12s;

  ${({ $current, theme }) =>
    $current &&
    css`
      background: ${theme.colors.neutral100};
    `}

  ${({ $clickable, $current, theme }) =>
    $clickable &&
    !$current &&
    css`
      &:hover {
        background: ${theme.colors.neutral50};
      }
    `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

const Avatar = styled.span`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1976D2;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
`;

/* Name + role block; long-hover here surfaces the details popover */
const InstanceNameBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 4px 0;
`;

const InstanceName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
`;

const RegionTag = styled.span`
  color: ${({ theme }) => theme.colors.neutral600};
  font-weight: 400;
  margin-left: 4px;
`;

const InstanceRole = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
`;

const RowAction = styled.span<{ $muted?: boolean }>`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ $muted, theme }) => ($muted ? theme.colors.neutral800 : theme.colors.neutral900)};
  font-weight: 500;
`;

/* ─── Instance details popover ──────────────────────────────────────────── */

const Popover = styled.div`
  position: absolute;
  left: 50%;
  top: -8px;
  z-index: 1300;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04);
  padding: 16px;
  width: 280px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const PopoverTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

const PopoverField = styled.div`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PopoverLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin-bottom: 2px;
`;

const PopoverValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CopyButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.blue300};
  cursor: pointer;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 1px;
  }
`;

/* ─── Footer (add / connect) ────────────────────────────────────────────── */

const FooterDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  margin: 16px 0;
`;

const AddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const DropdownWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const DropdownButton = styled.button<{ $hasValue: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ $hasValue, theme }) => ($hasValue ? theme.colors.neutral900 : theme.colors.neutral600)};
  cursor: pointer;
  transition: border-color 0.12s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.neutral400};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1250;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  margin: 0;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
`;

const DropdownOption = styled.li`
  padding: 8px 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  cursor: pointer;
  transition: background 0.12s;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

/*
 * Always-present slot that reserves space for the confirm/cancel buttons so
 * the dropdown's width never changes when a pending selection appears.
 */
const ActionSlot = styled.div`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 88px; /* two 40px buttons + 8px gap */
`;

const ConfirmButton = styled.button`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: #1976D2;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.15s;

  &:hover {
    background: #1565C0;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const CancelButton = styled.button`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid #1976D2;
  border-radius: 4px;
  color: #1976D2;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.15s;

  &:hover {
    background: #E2EEFF;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const ConnectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ConnectMenu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 220px;
  z-index: 1250;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  margin: 0;
  list-style: none;
`;

const ConnectMenuOption = styled.li`
  padding: 8px 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  cursor: pointer;
  transition: background 0.12s;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.neutral100};
    outline: none;
  }
`;

const ConnectButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 6px 4px;
  color: ${({ theme }) => theme.colors.blue300};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.12s;

  &:hover {
    color: ${({ theme }) => theme.colors.blue500};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

/* ─── Component ─────────────────────────────────────────────────────────── */

interface SwitchInstanceModalProps {
  open: boolean;
  onClose: () => void;
  /** Connected instances in display order — current must already be first. */
  connected: CertCentralInstance[];
  /** Instances available to add via the dropdown (not yet connected). */
  available: CertCentralInstance[];
  currentId: string;
  onSwitch: (id: string) => void;
  onAddConnected: (id: string) => void;
}

type RegionOption = { code: 'US' | 'EU'; label: string };

const CONNECT_REGION_OPTIONS: RegionOption[] = [
  { code: 'US', label: 'United States (US)' },
  { code: 'EU', label: 'Europe (EU)' },
];

const HOVER_DELAY_MS = 700;

const InstanceRowItem: React.FC<{
  instance: CertCentralInstance;
  current: boolean;
  popoverOpen: boolean;
  onRequestPopover: () => void;
  onDismissPopover: () => void;
  onSwitch: () => void;
}> = ({ instance, current, popoverOpen, onRequestPopover, onDismissPopover, onSwitch }) => {
  const hoverTimer = useRef<number | null>(null);

  const startHover = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      onRequestPopover();
    }, HOVER_DELAY_MS);
  };

  const cancelHover = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, []);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleRowClick = () => {
    if (current) return;
    onSwitch();
  };

  const handleRowKey = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (current) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSwitch();
    }
  };

  return (
    <InstanceRow
      $current={current}
      $clickable={!current}
      role={current ? undefined : 'button'}
      tabIndex={current ? undefined : 0}
      aria-label={current ? undefined : `Switch to ${instance.name}`}
      onClick={handleRowClick}
      onKeyDown={handleRowKey}
    >
      <Avatar aria-hidden="true">{instance.name.charAt(0)}</Avatar>

      <InstanceNameBlock
        onMouseEnter={startHover}
        onMouseLeave={cancelHover}
        aria-describedby={popoverOpen ? `instance-popover-${instance.id}` : undefined}
      >
        <InstanceName>
          {instance.name}
          <RegionTag>({instance.region})</RegionTag>
        </InstanceName>
        <InstanceRole>{instance.role}</InstanceRole>
      </InstanceNameBlock>

      <RowAction $muted>{current ? 'Currently on' : 'Switch to'}</RowAction>

      {popoverOpen && (
        <Popover
          id={`instance-popover-${instance.id}`}
          role="dialog"
          aria-label={`${instance.name} details`}
          onClick={e => e.stopPropagation()}
        >
          <PopoverHeader>
            <PopoverTitle>{instance.name}</PopoverTitle>
            <CloseButton
              type="button"
              onClick={e => {
                e.stopPropagation();
                onDismissPopover();
              }}
              aria-label="Close details"
            >
              <FontAwesomeIcon icon={faXmark} />
            </CloseButton>
          </PopoverHeader>

          <PopoverField>
            <PopoverLabel>ID</PopoverLabel>
            <PopoverValue>
              {instance.accountId}
              <CopyButton
                type="button"
                onClick={e => handleCopy(e, instance.accountId)}
                aria-label="Copy ID"
              >
                <FontAwesomeIcon icon={faCopy} />
              </CopyButton>
            </PopoverValue>
          </PopoverField>

          <PopoverField>
            <PopoverLabel>Region</PopoverLabel>
            <PopoverValue>{instance.regionFull}</PopoverValue>
          </PopoverField>

          <PopoverField>
            <PopoverLabel>Tier</PopoverLabel>
            <PopoverValue>{instance.tier}</PopoverValue>
          </PopoverField>

          <PopoverField>
            <PopoverLabel>Account manager</PopoverLabel>
            <PopoverValue>{instance.accountManager.name}</PopoverValue>
            <PopoverValue>
              {instance.accountManager.email}
              <CopyButton
                type="button"
                onClick={e => handleCopy(e, instance.accountManager.email)}
                aria-label="Copy account manager email"
              >
                <FontAwesomeIcon icon={faCopy} />
              </CopyButton>
            </PopoverValue>
          </PopoverField>
        </Popover>
      )}
    </InstanceRow>
  );
};

export const SwitchInstanceModal: React.FC<SwitchInstanceModalProps> = ({
  open,
  onClose,
  connected,
  available,
  currentId,
  onSwitch,
  onAddConnected,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingAddId, setPendingAddId] = useState<string | null>(null);
  const [popoverInstanceId, setPopoverInstanceId] = useState<string | null>(null);
  const [connectMenuOpen, setConnectMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset transient state every time the modal closes
  useEffect(() => {
    if (!open) {
      setDropdownOpen(false);
      setPendingAddId(null);
      setPopoverInstanceId(null);
      setConnectMenuOpen(false);
    }
  }, [open]);

  // Escape closes the modal
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Focus first focusable element on open
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('button, [href]')?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [open]);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!dialogRef.current) return;
      const dropdown = dialogRef.current.querySelector('[data-dropdown-root]');
      if (dropdown && !dropdown.contains(target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Close the connect menu when clicking outside it
  useEffect(() => {
    if (!connectMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!dialogRef.current) return;
      const root = dialogRef.current.querySelector('[data-connect-root]');
      if (root && !root.contains(target)) setConnectMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [connectMenuOpen]);

  if (!open) return null;

  const pendingInstance = pendingAddId
    ? available.find(i => i.id === pendingAddId) ?? null
    : null;
  const dropdownLabel = pendingInstance
    ? `${pendingInstance.name} (${pendingInstance.region})`
    : 'Add a connected CertCentral instance';
  const showAddRow = available.length > 0 || Boolean(pendingInstance);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Backdrop $open={open} onClick={handleBackdropClick} aria-hidden={!open}>
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="switch-instance-title"
      >
        <DialogHeader>
          <DialogTitle id="switch-instance-title">Switch CertCentral instance</DialogTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Close dialog">
            <FontAwesomeIcon icon={faXmark} />
          </CloseButton>
        </DialogHeader>

        <DialogBody>
          <InfoBanner>
            Instances are accounts within CertCentral associated with this environment.
            Switching instances does not switch your environment.
          </InfoBanner>

          <InstanceList>
            {connected.map(instance => (
              <InstanceRowItem
                key={instance.id}
                instance={instance}
                current={instance.id === currentId}
                popoverOpen={popoverInstanceId === instance.id}
                onRequestPopover={() => setPopoverInstanceId(instance.id)}
                onDismissPopover={() => setPopoverInstanceId(null)}
                onSwitch={() => {
                  onSwitch(instance.id);
                  onClose();
                }}
              />
            ))}
          </InstanceList>

          <FooterDivider />

          {showAddRow && (
          <AddRow>
            <DropdownWrapper data-dropdown-root>
              <DropdownButton
                type="button"
                $hasValue={Boolean(pendingInstance)}
                onClick={() => setDropdownOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                <span>{dropdownLabel}</span>
                <FontAwesomeIcon
                  icon={dropdownOpen ? faChevronUp : faChevronDown}
                  style={{ fontSize: 12 }}
                />
              </DropdownButton>

              {dropdownOpen && available.length > 0 && (
                <DropdownMenu role="listbox">
                  {available.map(instance => (
                    <DropdownOption
                      key={instance.id}
                      role="option"
                      aria-selected={pendingAddId === instance.id}
                      tabIndex={0}
                      onClick={() => {
                        setPendingAddId(instance.id);
                        setDropdownOpen(false);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setPendingAddId(instance.id);
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      {instance.name} ({instance.region})
                    </DropdownOption>
                  ))}
                </DropdownMenu>
              )}
            </DropdownWrapper>

            <ActionSlot aria-hidden={!pendingInstance}>
              <ConfirmButton
                type="button"
                onClick={() => {
                  if (!pendingAddId) return;
                  onAddConnected(pendingAddId);
                  setPendingAddId(null);
                }}
                aria-label="Confirm add instance"
                style={{ visibility: pendingInstance ? 'visible' : 'hidden' }}
                tabIndex={pendingInstance ? 0 : -1}
              >
                <FontAwesomeIcon icon={faCheck} />
              </ConfirmButton>
              <CancelButton
                type="button"
                onClick={() => setPendingAddId(null)}
                aria-label="Cancel add instance"
                style={{ visibility: pendingInstance ? 'visible' : 'hidden' }}
                tabIndex={pendingInstance ? 0 : -1}
              >
                <FontAwesomeIcon icon={faXmark} />
              </CancelButton>
            </ActionSlot>
          </AddRow>
          )}

          <ConnectWrapper data-connect-root>
            <ConnectButton
              type="button"
              onClick={() => setConnectMenuOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={connectMenuOpen}
            >
              <FontAwesomeIcon icon={faLink} />
              Connect CertCentral
              <FontAwesomeIcon
                icon={connectMenuOpen ? faChevronUp : faChevronDown}
                style={{ fontSize: 11 }}
              />
            </ConnectButton>

            {connectMenuOpen && (
              <ConnectMenu role="menu">
                {CONNECT_REGION_OPTIONS.map(region => (
                  <ConnectMenuOption
                    key={region.code}
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => setConnectMenuOpen(false)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setConnectMenuOpen(false);
                      }
                    }}
                  >
                    {region.label}
                  </ConnectMenuOption>
                ))}
              </ConnectMenu>
            )}
          </ConnectWrapper>
        </DialogBody>
      </Dialog>
    </Backdrop>
  );
};
