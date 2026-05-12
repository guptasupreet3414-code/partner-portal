import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HubWrapper,
  HubInner,
  HubGroup,
  HubDivider,
  HubProductRow,
  HubProductLabel,
} from './HubPanel.styles';
import { getProductIcon } from '../Icons';
import { iconRailGroup1, iconRailGroup2, type IconRailProduct } from '../../data/navConfig';

interface HubPanelProps {
  open: boolean;
  activeProductId: string;
  onSelectProduct: (id: string) => void;
}

const HubItem: React.FC<{
  product: IconRailProduct;
  isActive: boolean;
  onSelect: (id: string) => void;
}> = ({ product, isActive, onSelect }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect(product.id);
    navigate(product.route);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = e.currentTarget.parentElement?.nextElementSibling?.querySelector('button');
      (next as HTMLElement | null)?.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = e.currentTarget.parentElement?.previousElementSibling?.querySelector('button');
      (prev as HTMLElement | null)?.focus();
    }
  };

  return (
    <div>
      <HubProductRow
        $active={isActive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={isActive ? 'page' : undefined}
        aria-label={product.label}
      >
        {getProductIcon(product.iconType, 18, isActive ? '#1976D2' : '#6B7280')}
        <HubProductLabel>{product.label}</HubProductLabel>
      </HubProductRow>
    </div>
  );
};

export const HubPanel: React.FC<HubPanelProps> = ({ open, activeProductId, onSelectProduct }) => {
  return (
    <HubWrapper $open={open} id="hub-panel" aria-hidden={!open}>
      <HubInner>
        <nav aria-label="Product hub">
          <HubGroup>
            {iconRailGroup1.map(product => (
              <HubItem
                key={product.id}
                product={product}
                isActive={activeProductId === product.id}
                onSelect={onSelectProduct}
              />
            ))}
          </HubGroup>

          <HubDivider />

          <HubGroup>
            {iconRailGroup2.map(product => (
              <HubItem
                key={product.id}
                product={product}
                isActive={activeProductId === product.id}
                onSelect={onSelectProduct}
              />
            ))}
          </HubGroup>
        </nav>
      </HubInner>
    </HubWrapper>
  );
};
