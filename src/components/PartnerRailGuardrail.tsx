import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { getProductLandingRoute } from '../data/navConfig';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Dialog = styled.div`
  background: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 480px;
  padding: 28px 28px 24px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const DialogTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 10px;
  line-height: 1.3;
`;

const DialogBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0 0 24px;
  line-height: 1.6;
`;

const DialogActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ButtonSecondary = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.neutral900};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
    border-color: ${({ theme }) => theme.colors.neutral400};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const ButtonPrimary = styled.button`
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.blue300};
  color: #ffffff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.blue500};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

interface PartnerRailGuardrailProps {
  productId: string;
  productLabel: string;
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

export const PartnerRailGuardrail: React.FC<PartnerRailGuardrailProps> = ({
  productId,
  productLabel,
  onClose,
  onSelectProduct,
}) => {
  const { setWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const handleOpenInMyWorkspace = () => {
    setWorkspace('my');
    onSelectProduct(productId);
    navigate(getProductLandingRoute(productId));
    onClose();
  };

  return (
    <Overlay
      role="presentation"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guardrail-title"
        tabIndex={-1}
      >
        <DialogTitle id="guardrail-title">
          Open {productLabel} in My workspace?
        </DialogTitle>
        <DialogBody>
          {productLabel} in the main product navigation opens your organization&apos;s {productLabel} experience.
          To work with a managed customer&apos;s {productLabel} account, open that customer from Partner workspace.
        </DialogBody>
        <DialogActions>
          <ButtonSecondary onClick={onClose}>
            Stay in Partner workspace
          </ButtonSecondary>
          <ButtonPrimary onClick={handleOpenInMyWorkspace}>
            Open in My workspace
          </ButtonPrimary>
        </DialogActions>
      </Dialog>
    </Overlay>
  );
};
