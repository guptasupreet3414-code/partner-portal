import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  RailContainer,
  RailGroup,
  RailDivider,
  RailButton,
  RailTooltip,
} from './IconRail.styles';
import { getProductIcon } from '../Icons';
import { iconRailGroup1, iconRailGroup2, type IconRailProduct } from '../../data/navConfig';

interface IconRailProps {
  activeProductId: string;
  onSelectProduct: (id: string) => void;
}

const HOVER_DELAY_MS = 350;

const RailItem: React.FC<{
  product: IconRailProduct;
  isActive: boolean;
  onSelect: (id: string) => void;
}> = ({ product, isActive, onSelect }) => {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // y is the viewport centre-Y of the button — used for position: fixed tooltip placement
  const [tip, setTip] = useState<{ visible: boolean; y: number }>({ visible: false, y: 0 });

  // Clear pending hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const getButtonMidY = (): number => {
    const rect = buttonRef.current?.getBoundingClientRect();
    return rect ? rect.top + rect.height / 2 : 0;
  };

  const showTip = (immediate: boolean) => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    if (immediate) {
      setTip({ visible: true, y: getButtonMidY() });
    } else {
      hoverTimer.current = setTimeout(() => {
        setTip({ visible: true, y: getButtonMidY() });
      }, HOVER_DELAY_MS);
    }
  };

  const hideTip = () => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    setTip(prev => ({ ...prev, visible: false }));
  };

  const handleClick = () => {
    hideTip();
    onSelect(product.id);
    navigate(product.route);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') {
      // Dismiss tooltip only — do NOT move focus (WCAG 1.4.13)
      hideTip();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <RailButton
        ref={buttonRef}
        $active={isActive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => showTip(false)}   // delayed — prevents flicker on mouse-across
        onMouseLeave={hideTip}
        onFocus={() => showTip(true)}          // immediate — keyboard users need instant feedback
        onBlur={hideTip}
        aria-label={product.ariaLabel}
        aria-current={isActive ? 'page' : undefined}
      >
        {getProductIcon(product.iconType, 20, isActive ? '#111827' : '#6B7280')}
      </RailButton>

      {/*
        * Portal to document.body: RailContainer is position:fixed with z-index and
        * overflow:hidden — Chrome clips position:fixed descendants to that stacking
        * context's visual bounds. A portal escapes the DOM subtree entirely.
        */}
      {createPortal(
        <RailTooltip
          $visible={tip.visible}
          style={{ top: `${tip.y}px` }}
          role="tooltip"
          aria-hidden="true"
        >
          {product.label}
        </RailTooltip>,
        document.body
      )}
    </>
  );
};

export const IconRail: React.FC<IconRailProps> = ({ activeProductId, onSelectProduct }) => {
  return (
    <RailContainer aria-label="Product navigation">
      <RailGroup>
        {iconRailGroup1.map(product => (
          <RailItem
            key={product.id}
            product={product}
            isActive={activeProductId === product.id}
            onSelect={onSelectProduct}
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
          />
        ))}
      </RailGroup>
    </RailContainer>
  );
};
