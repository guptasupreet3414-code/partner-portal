import React, { useEffect, useRef } from 'react';
import {
  CartBackdrop,
  CartPanelEl,
  CartHeader,
  CartTitle,
  CartCloseBtn,
  CartBody,
  CartEmptyText,
  CartContinueBtn,
} from './CartPanel.styles';

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ open, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <>
      <CartBackdrop $open={open} onClick={onClose} aria-hidden="true" />
      <CartPanelEl
        $open={open}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        aria-hidden={!open}
      >
        <CartHeader>
          <CartTitle id="cart-heading">Cart</CartTitle>
          <CartCloseBtn ref={closeRef} onClick={onClose} aria-label="Close cart">×</CartCloseBtn>
        </CartHeader>
        <CartBody>
          <CartEmptyText>Your cart is empty.</CartEmptyText>
          <CartContinueBtn onClick={() => console.log('Continue shopping')}>
            Continue shopping
          </CartContinueBtn>
        </CartBody>
      </CartPanelEl>
    </>
  );
};
