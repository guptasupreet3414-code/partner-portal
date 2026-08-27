import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
  InstancePicker,
  InstancePickerLabel,
  InstancePickerRegion,
  InstancePickerChevron,
  PlanFooter,
  PlanFooterPlan,
  PlanFooterSeats,
  PlanFooterTitle,
} from './ProductSubNav.styles';
import { NavSection } from './NavSection';
import { productNavConfig } from '../../data/navConfig';
import { useCertCentralInstance } from '../../hooks/useCertCentralInstance';
import { SwitchInstanceModal } from '../SwitchInstanceModal/SwitchInstanceModal';
import ExpandIcon from '../../assets/expand.svg?react';
import CollapseIcon from '../../assets/collapse.svg?react';

const NavBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  padding: 9px 16px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral300};
  background: transparent;
  color: ${({ theme }) => theme.colors.blue300};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

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
  const navigate = useNavigate();
  const location = useLocation();
  const certCentralInstance = useCertCentralInstance();
  const [instanceModalOpen, setInstanceModalOpen] = useState(false);

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
                {['settings-users', 'settings-billing', 'settings-account'].includes(activeProductId) && (
                  <NavBackButton onClick={() => navigate(-1)} aria-label="Go back">
                    ‹ Back
                  </NavBackButton>
                )}
                <SubNavHeader>
                  <SubNavTitle>{productNav.label}</SubNavTitle>

                  {productNav.instance && (
                    <InstancePicker
                      type="button"
                      onClick={() => setInstanceModalOpen(true)}
                      aria-haspopup="dialog"
                      aria-expanded={instanceModalOpen}
                      aria-label={`Current instance: ${certCentralInstance.current.name} (${certCentralInstance.current.region}). Switch instance.`}
                    >
                      <InstancePickerLabel>
                        {certCentralInstance.current.name}
                        <InstancePickerRegion>({certCentralInstance.current.region})</InstancePickerRegion>
                      </InstancePickerLabel>
                      <InstancePickerChevron aria-hidden="true">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </InstancePickerChevron>
                    </InstancePicker>
                  )}
                </SubNavHeader>
                <SubNavScrollArea>
                  <nav aria-label="Product navigation">
                    {productNav.sections.map((section, i) => (
                      <NavSection key={section.title || i} section={section} index={i} />
                    ))}
                  </nav>
                </SubNavScrollArea>

                {productNav.plan && (
                  <PlanFooter
                    type="button"
                    $active={location.pathname === productNav.plan.route}
                    aria-current={location.pathname === productNav.plan.route ? 'page' : undefined}
                    onClick={() => navigate(productNav.plan!.route)}
                    aria-label={`${productNav.plan.tier} plan${
                      productNav.plan.seatsUsed != null && productNav.plan.seatsTotal != null
                        ? `, ${productNav.plan.seatsUsed} of ${productNav.plan.seatsTotal} seats used`
                        : ''
                    }. Manage billing and upgrade options.`}
                  >
                    <PlanFooterPlan>{productNav.plan.tier} Plan</PlanFooterPlan>
                    {productNav.plan.seatsUsed != null && productNav.plan.seatsTotal != null && (
                      <PlanFooterSeats>
                        {productNav.plan.seatsUsed} / {productNav.plan.seatsTotal} seats used
                      </PlanFooterSeats>
                    )}
                    <PlanFooterTitle>Manage billing</PlanFooterTitle>
                  </PlanFooter>
                )}
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

      {productNav.instance && (
        <SwitchInstanceModal
          open={instanceModalOpen}
          onClose={() => setInstanceModalOpen(false)}
          connected={certCentralInstance.connected}
          available={certCentralInstance.available}
          currentId={certCentralInstance.current.id}
          onSwitch={certCentralInstance.switchTo}
          onAddConnected={certCentralInstance.addConnected}
        />
      )}
    </>
  );
};
