import React, { useEffect } from 'react';
import {
  SubNavWrapper,
  SubNavClip,
  SubNavInner,
  SubNavHeader,
  SubNavTitle,
  SubNavScrollArea,
  ChevronButton,
  SpokeBackdrop,
} from './ProductSubNav.styles';
import { NavSection } from './NavSection';
import { IconChevronLeft } from '../Icons';
import { productNavConfig } from '../../data/navConfig';

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

        {/* Single chevron outside the clip layer — rotates 180° when spoke closes */}
        <ChevronButton
          $open={isSpokeOpen}
          onClick={onToggleSpoke}
          aria-label="Toggle product navigation"
          aria-expanded={isSpokeOpen}
          aria-controls="spoke-panel"
        >
          <IconChevronLeft size={14} color="currentColor" />
        </ChevronButton>
      </SubNavWrapper>
    </>
  );
};
