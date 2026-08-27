import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useWorkspace, type Workspace } from '../../context/WorkspaceContext';
import { TransparentBackdrop } from './TopNavDropdown.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: ${({ theme }) => theme.transitions.default};
  height: 32px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &[aria-expanded='true'] {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }

  svg {
    font-size: 10px;
    opacity: 0.8;
  }
`;

const SwitcherWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 12px;

  @media (max-width: 639px) {
    display: none;
  }
`;

const SwitcherMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16), 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 1100;
  overflow: hidden;
  animation: dropIn 0.12s ease;

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const MenuHeader = styled.div`
  padding: 12px 16px 8px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral500};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const WorkspaceOption = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${({ $active }) => $active ? '#F0F6FF' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;

  &:hover {
    background: ${({ $active }) => $active ? '#E8F0FD' : '#F9FAFB'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

const OptionIcon = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, theme }) => $active ? theme.colors.blue300 : 'transparent'};
  font-size: 13px;
`;

const OptionText = styled.div`
  flex: 1;
  min-width: 0;
`;

const OptionLabel = styled.div<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? 600 : 400};
  color: ${({ $active, theme }) => $active ? theme.colors.blue300 : theme.colors.neutral900};
  line-height: 1.3;
`;

const OptionDesc = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-top: 2px;
  line-height: 1.4;
`;

const workspaces: { id: Workspace; label: string; description: string }[] = [
  {
    id: 'my',
    label: 'My workspace',
    description: 'Manage DigiCert for my organization',
  },
  {
    id: 'partner',
    label: 'Partner workspace',
    description: 'Manage customers and partner operations',
  },
];

interface WorkspaceSwitcherProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  const { activeWorkspace, setWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSelect = (ws: Workspace) => {
    setWorkspace(ws);
    onClose();
    if (ws === 'partner') {
      navigate('/partner');
    } else {
      navigate('/dashboard');
    }
  };

  const currentLabel = activeWorkspace === 'partner' ? 'Partner workspace' : 'My workspace';

  return (
    <>
      <SwitcherWrapper>
        <SwitcherButton
          aria-label={`Current workspace: ${currentLabel}. Click to switch workspace.`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={isOpen ? onClose : onOpen}
        >
          {currentLabel}
          <FontAwesomeIcon icon={faChevronDown} />
        </SwitcherButton>

        {isOpen && (
          <SwitcherMenu ref={menuRef} role="menu" aria-label="Switch workspace">
            <MenuHeader>Workspace</MenuHeader>
            {workspaces.map(ws => {
              const isActive = activeWorkspace === ws.id;
              return (
                <WorkspaceOption
                  key={ws.id}
                  $active={isActive}
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => handleSelect(ws.id)}
                >
                  <OptionIcon $active={isActive}>
                    {isActive && <FontAwesomeIcon icon={faCheck} />}
                  </OptionIcon>
                  <OptionText>
                    <OptionLabel $active={isActive}>{ws.label}</OptionLabel>
                    <OptionDesc>{ws.description}</OptionDesc>
                  </OptionText>
                </WorkspaceOption>
              );
            })}
          </SwitcherMenu>
        )}
      </SwitcherWrapper>

      {isOpen && <TransparentBackdrop onClick={onClose} aria-hidden="true" />}
    </>
  );
};
