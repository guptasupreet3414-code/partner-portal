import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { IconChevronDown, IconChevronUp } from '../Icons';
import type { NavSection as NavSectionType } from '../../data/navConfig';

const SectionWrapper = styled.div`
  margin: 0 8px 2px;
`;

const SectionHeader = styled.button<{ $hasTitle: boolean }>`
  display: ${({ $hasTitle }) => ($hasTitle ? 'flex' : 'none')};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 12px 0 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #757D82;
  transition: color 0.15s;

  &:hover {
    color: #44484A;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

const HeaderTitle = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;

const HeaderRight = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const NewBadge = styled.span`
  height: 20px;
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  border-radius: 4px;
  background: #E2EEFF;
  color: #0048AC;
  font-size: 11px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  line-height: 1;
  white-space: nowrap;
  flex-shrink: 0;
`;

const ItemsContainer = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '800px' : '0')};
  transition: max-height 0.2s ease;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 0 12px 0 20px;
  overflow: hidden;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral700};
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: #F0F3F5;
  }

  &.active,
  &[aria-current='page'] {
    background: #F0F3F5;
    color: #44484A;
    font-weight: 500;
  }

  &:active {
    background: #E7EBEF;
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

const ItemLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NumberBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #636A6E;
  color: #ffffff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  flex-shrink: 0;
`;

interface NavSectionProps {
  section: NavSectionType;
  index: number;
}

export const NavSection: React.FC<NavSectionProps> = ({ section, index }) => {
  const [open, setOpen] = useState(section.defaultExpanded ?? (index === 0));
  const location = useLocation();
  const hasTitle = Boolean(section.title);

  const sectionId = `nav-section-${section.title.replace(/\s+/g, '-').toLowerCase() || index}`;

  return (
    <SectionWrapper>
      <SectionHeader
        $hasTitle={hasTitle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={sectionId}
      >
        <HeaderTitle>{section.title}</HeaderTitle>
        <HeaderRight>
          {section.badge && <NewBadge>New</NewBadge>}
          {open ? <IconChevronUp size={12} color="currentColor" /> : <IconChevronDown size={12} color="currentColor" />}
        </HeaderRight>
      </SectionHeader>

      <ItemsContainer
        id={sectionId}
        $open={open || !hasTitle}
      >
        {section.items.map((item) => (
          <NavItem
            key={item.route}
            to={item.route}
            end
            aria-current={location.pathname === item.route ? 'page' : undefined}
          >
            <ItemLabel>{item.label}</ItemLabel>
            {item.numberBadge !== undefined && (
              <NumberBadge aria-label={`${item.numberBadge} items`}>{item.numberBadge}</NumberBadge>
            )}
            {item.badge && <NewBadge>New</NewBadge>}
          </NavItem>
        ))}
      </ItemsContainer>
    </SectionWrapper>
  );
};

