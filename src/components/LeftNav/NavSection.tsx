import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { IconChevronDown, IconChevronUp } from '../Icons';
import type { NavSection as NavSectionType } from '../../data/navConfig';

const SectionWrapper = styled.div`
  margin-bottom: 2px;
`;

const SectionHeader = styled.button<{ $hasTitle: boolean }>`
  display: ${({ $hasTitle }) => ($hasTitle ? 'flex' : 'none')};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px 6px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral700};
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.neutral900};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

const ItemsContainer = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '800px' : '0')};
  transition: max-height 0.2s ease;
`;

const NavItem = styled(NavLink)`
  display: block;
  padding: 7px 12px 7px 20px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
  border-radius: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral200};
    color: ${({ theme }) => theme.colors.neutral900};
  }

  &.active,
  &[aria-current='page'] {
    background: ${({ theme }) => theme.colors.blue300};
    color: ${({ theme }) => theme.colors.white};
    font-weight: 500;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
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
        <span>{section.title}</span>
        {open ? <IconChevronUp size={12} color="currentColor" /> : <IconChevronDown size={12} color="currentColor" />}
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
            {item.label}
          </NavItem>
        ))}
      </ItemsContainer>
    </SectionWrapper>
  );
};

