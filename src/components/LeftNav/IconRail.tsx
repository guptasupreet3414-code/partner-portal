import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RailContainer,
  RailGroup,
  RailDivider,
  RailButton,
  RailLabel,
  RailFade,
} from './IconRail.styles';
import { iconRailGroup1, iconRailGroup2, getProductLandingRoute, type IconRailProduct } from '../../data/navConfig';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PartnerRailGuardrail } from '../PartnerRailGuardrail';

interface IconRailProps {
  activeProductId: string;
  onSelectProduct: (id: string) => void;
}

const RailItem: React.FC<{
  product: IconRailProduct;
  isActive: boolean;
  onSelect: (id: string) => void;
  onGuardrailRequest: (product: IconRailProduct) => void;
  activeWorkspace: string;
}> = ({ product, isActive, onSelect, onGuardrailRequest, activeWorkspace }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (activeWorkspace === 'partner' && product.id !== 'dashboard') {
      onGuardrailRequest(product);
      return;
    }
    onSelect(product.id);
    navigate(getProductLandingRoute(product.id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <RailButton
      $active={isActive}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={product.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      <product.Icon aria-hidden="true" focusable="false" />
      {/* Full product name — hidden while collapsed, revealed when the rail
          expands on hover/focus. aria-hidden: aria-label is authoritative. */}
      <RailLabel aria-hidden="true">{product.label}</RailLabel>
    </RailButton>
  );
};

export const IconRail: React.FC<IconRailProps> = ({ activeProductId, onSelectProduct }) => {
  const containerRef = useRef<HTMLElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [guardrailProduct, setGuardrailProduct] = useState<IconRailProduct | null>(null);
  const { activeWorkspace } = useWorkspace();

  // Drive the edge fades: top fade once scrolled down, bottom fade while there's
  // still content below the fold.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const scrollable = el.scrollHeight > el.clientHeight + 1;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 1;
      setCanScrollUp(scrollable && el.scrollTop > 1);
      setCanScrollDown(scrollable && !atBottom);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // Recompute when the rail's own size changes (e.g. viewport height shifts).
    // Guarded: ResizeObserver is absent in some test/SSR environments.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, []);

  // The rail expands on :hover OR :focus-within. After a mouse click, focus
  // lands on the selected button, so :focus-within would keep the overlay open
  // even once the cursor leaves. Dropping focus when the pointer exits lets the
  // overlay collapse on mouse-out. Genuine keyboard users don't fire mouseleave,
  // so their focus (and the expanded rail) is preserved.
  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (el && document.activeElement instanceof HTMLElement && el.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  };

  return (
    <>
      <RailContainer
        ref={containerRef}
        aria-label="Platform navigation"
        onMouseLeave={handleMouseLeave}
      >
        <RailFade $edge="top" $visible={canScrollUp} aria-hidden="true" />

        <RailGroup>
          {iconRailGroup1.map(product => (
            <RailItem
              key={product.id}
              product={product}
              isActive={activeProductId === product.id}
              onSelect={onSelectProduct}
              onGuardrailRequest={setGuardrailProduct}
              activeWorkspace={activeWorkspace}
            />
          ))}
        </RailGroup>

        <RailDivider />

        <RailGroup>
          {iconRailGroup2.map(product => (
            <RailItem
              key={product.id}
              product={product}
              isActive={activeProductId === product.id}
              onSelect={onSelectProduct}
              onGuardrailRequest={setGuardrailProduct}
              activeWorkspace={activeWorkspace}
            />
          ))}
        </RailGroup>

        <RailFade $edge="bottom" $visible={canScrollDown} aria-hidden="true" />
      </RailContainer>

      {guardrailProduct && (
        <PartnerRailGuardrail
          productId={guardrailProduct.id}
          productLabel={guardrailProduct.label}
          onClose={() => setGuardrailProduct(null)}
          onSelectProduct={onSelectProduct}
        />
      )}
    </>
  );
};
