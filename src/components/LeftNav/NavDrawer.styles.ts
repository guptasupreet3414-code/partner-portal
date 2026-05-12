import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const DrawerBackdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1100;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 767px) {
    top: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

export const DrawerPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  left: 0;
  bottom: 0;
  width: ${({ $open }) => ($open ? '260px' : '0')};
  background: #E8EAED;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: ${({ $open }) =>
    $open
      ? 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)'
      : 'width 200ms cubic-bezier(0.4, 0, 0.2, 1) 80ms'
  };

  @media (max-width: 767px) {
    top: 0;
    width: ${({ $open }) => ($open ? 'min(85vw, 380px)' : '0')};
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/* ─── Mobile two-level slide viewport ─────────────────────────────────────── */

/*
 * Clips both panes. Each pane is absolutely positioned inside this container.
 * Height fills the remaining space below the panel header (handled by flex: 1).
 */
export const DrawerViewport = styled.div<{ $open: boolean }>`
  flex: 1;
  position: relative;
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: ${({ $open }) =>
    $open
      ? 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 100ms'
      : 'opacity 80ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/*
 * $offset is a percentage: 0 = on screen, -100 = exited left, 100 = exited right.
 */
export const DrawerPane = styled.div<{ $offset: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #E8EAED;
  transform: translateX(${({ $offset }) => $offset}%);
  transition: transform 270ms cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/* Header bar inside each pane — sticky at top */
export const DrawerPaneHeader = styled.div`
  display: flex;
  align-items: center;
  height: ${({ theme }) => theme.layout.topNavHeight};
  padding: 0 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: #E8EAED;
  flex-shrink: 0;
  gap: 4px;
`;

export const DrawerPaneTitle = styled.span`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DrawerIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral700};
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

/* Scrollable content area inside each pane */
export const DrawerPaneScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
  }
`;

/* Section label in Level 2 sub-nav */
export const DrawerSubSectionLabel = styled.div`
  padding: 10px 16px 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral600};
`;

/* Individual sub-nav link in Level 2 */
export const DrawerSubNavLink = styled(NavLink)<{ $active: boolean }>`
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 0 16px 0 24px;
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(25, 118, 210, 0.10)' : 'transparent')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  color: ${({ $active }) => ($active ? '#1976D2' : '#374151')};
  text-align: left;
  transition: background 0.12s, color 0.12s;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 24px;
    background: ${({ $active }) => ($active ? '#1976D2' : 'transparent')};
    border-radius: 0 2px 2px 0;
  }

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(25, 118, 210, 0.14)' : 'rgba(0, 0, 0, 0.06)'};
    color: ${({ $active }) => ($active ? '#1976D2' : '#111827')};
  }

  &:focus-visible {
    outline: 2px solid #1976D2;
    outline-offset: -2px;
  }
`;

/* ─── Desktop / tablet flat-list styles (unchanged) ─────────────────────── */

export const DrawerHeader = styled.div`
  display: none;
  flex-shrink: 0;

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${({ theme }) => theme.layout.topNavHeight};
    padding: 0 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background: #E8EAED;
  }
`;

export const DrawerHeaderTitle = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
`;

export const DrawerCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral700};
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

export const DrawerInner = styled.div<{ $open: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: ${({ $open }) =>
    $open
      ? 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 100ms'
      : 'opacity 80ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
  }
`;

export const DrawerGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DrawerDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 8px 12px;
`;

export const DrawerProductRow = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(25, 118, 210, 0.10)' : 'transparent')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  color: ${({ $active }) => ($active ? '#1976D2' : '#374151')};
  text-align: left;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 28px;
    background: ${({ $active }) => ($active ? '#1976D2' : 'transparent')};
    border-radius: 0 2px 2px 0;
    transition: background 0.15s;
  }

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(25, 118, 210, 0.14)' : 'rgba(0, 0, 0, 0.06)'};
    color: ${({ $active }) => ($active ? '#1976D2' : '#111827')};
  }

  &:focus-visible {
    outline: 2px solid #1976D2;
    outline-offset: -2px;
  }
`;

export const DrawerProductLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;
