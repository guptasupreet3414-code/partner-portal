import React, { useEffect } from 'react';
import {
  SubNavWrapper,
  SubNavClip,
  SubNavInner,
  SubNavHeader,
  SubNavTitle,
  SubNavScrollArea,
  ChevronWrapper,
  ChevronButton,
  ChevronTooltip,
  SpokeBackdrop,
} from './ProductSubNav.styles';
import { NavSection } from './NavSection';
import { productNavConfig } from '../../data/navConfig';
import ExpandIcon from '../../assets/expand.svg?react';
import CollapseIcon from '../../assets/collapse.svg?react';

interface ProductSubNavProps {
  activeProductId: string;
  isSpokeOpen: boolean;
  onToggleSpoke: () => void;
}

export const ProductSubNav: React.FC<ProductSubNavProps> = ({
  activeProductId,
  isSpokeOpen,
  onToggleSpoke,
}) => {
  const productNav = productNavConfig[activeProductId];

  // Escape closes spoke (lower priority — drawer Escape is handled first in NavDrawer)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSpokeOpen) onToggleSpoke();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isSpokeOpen, onToggleSpoke]);

  // Explore products (no nav config) render a landing page instead of a spoke.
  if (!productNav) return null;

  return (
    <>
      {/* Tablet-only backdrop: clicking outside the spoke closes it */}
      <SpokeBackdrop $visible={isSpokeOpen} onClick={onToggleSpoke} aria-hidden="true" />

      <SubNavWrapper
        $open={isSpokeOpen}
        id="spoke-panel"
        aria-hidden={!isSpokeOpen}
      >
        <SubNavClip>
          <SubNavInner $open={isSpokeOpen}>
            {productNav && (
              <>
                <SubNavHeader>
                  <SubNavTitle>{productNav.label}</SubNavTitle>
                </SubNavHeader>
                <SubNavScrollArea>
                  <nav aria-label="Product navigation">
                    {productNav.sections.map((section, i) => (
                      <NavSection key={section.title || i} section={section} index={i} />
                    ))}
                  </nav>
                </SubNavScrollArea>
              </>
            )}
          </SubNavInner>
        </SubNavClip>

        {/* Toggle button outside the clip layer; tooltip shows on hover/focus */}
        <ChevronWrapper>
          <ChevronButton
            onClick={onToggleSpoke}
            aria-label={isSpokeOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isSpokeOpen}
            aria-controls="spoke-panel"
          >
            {isSpokeOpen
              ? <CollapseIcon aria-hidden="true" focusable="false" />
              : <ExpandIcon aria-hidden="true" focusable="false" />
            }
          </ChevronButton>
          <ChevronTooltip role="tooltip" aria-hidden="true">
            {isSpokeOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          </ChevronTooltip>
        </ChevronWrapper>
      </SubNavWrapper>
    </>
  );
};
