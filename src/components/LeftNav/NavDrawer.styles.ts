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

  @media (max-width: 639px) {
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
  background: #F9FAFB;
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

  @media (max-width: 639px) {
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
  background: #F9FAFB;
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #E8EAED;
  flex-shrink: 0;
  gap: 4px;
`;

export const DrawerPaneTitle = styled.span`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 20px;
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

/* Fixed footer area at the bottom of the mobile L1 pane (Settings / Help / Profile). */
export const DrawerFooter = styled.div`
  flex-shrink: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 8px 0;
  background: #F9FAFB;
`;

export const DrawerFooterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 16px);
  height: 40px;
  margin: 0 8px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: #636A6E;
  text-align: left;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: #ECEFF2;
  }

  &:active {
    background: #CFD6DC;
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

export const DrawerFooterIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  color: inherit;
  font-size: 16px;
`;

export const DrawerFooterLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DrawerFooterAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 50%;
  background: #003E6B;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
`;

/* ─── Mobile L2 product context (plan / instance) ───────────────────────── */

/* Container surfaced above the sub-nav sections when drilled into a product
   that carries a subscription plan or an instance picker. */
export const MobileProductMetaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 16px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

/* Touch-friendly version of the desktop PlanTierPill — same visual language
   (blue tint + trailing arrow) but a 32px tap target. */
export const MobilePlanTierPill = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  height: 32px;
  padding: 0 14px;
  border: 1px solid ${({ $active }) => ($active ? '#8FBEFF' : '#B3D4FF')};
  border-radius: 16px;
  background: ${({ $active }) => ($active ? '#D2E4FF' : '#E2EEFF')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  color: #0048AC;
  white-space: nowrap;
  transition: background 0.12s, border-color 0.12s, color 0.12s;

  & > svg {
    font-size: 11px;
  }

  &:active {
    background: #B3D4FF;
    border-color: #6FA8FF;
    color: #003E6B;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

/* Mobile instance picker — mirrors the desktop ghost-button styling (transparent,
   color-on-hover, trailing chevron) so the visual language is identical across
   breakpoints. Only the tap target is enlarged for touch. */
export const MobileInstancePicker = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 40px;
  padding: 4px 4px 4px 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: #757D82;
  text-align: left;
  transition: color 0.12s;

  &:active {
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

export const MobileInstancePickerLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
`;

export const MobileInstancePickerRegion = styled.span`
  margin-left: 4px;
  color: inherit;
`;

export const MobileInstancePickerChevron = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: 12px;
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

/* Individual sub-nav link in Level 2 — matches the desktop spoke (NavItem) state ladder */
export const DrawerSubNavLink = styled(NavLink)<{ $active: boolean }>`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  width: calc(100% - 16px);
  height: 40px;
  margin: 0 8px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#DEE3E8' : 'transparent')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  color: ${({ $active }) => ($active ? '#44484A' : '#636A6E')};
  text-align: left;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: ${({ $active }) => ($active ? '#DEE3E8' : '#ECEFF2')};
  }

  &:active {
    background: #CFD6DC;
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

/* ─── Desktop / tablet flat-list styles (unchanged) ─────────────────────── */

export const DrawerHeader = styled.div`
  display: none;
  flex-shrink: 0;

  @media (max-width: 639px) {
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

/* Desktop drawer fallback product row — unchanged from the original spec. */
export const DrawerProductRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 16px);
  height: 40px;
  margin: 0 8px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#F0F3F5' : 'transparent')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  color: ${({ $active }) => ($active ? '#44484A' : '#636A6E')};
  text-align: left;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: #F0F3F5;
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

/* Mobile L1 product row — uses the same spoke ladder as DrawerSubNavLink because
   both panes share the #F9FAFB surface on mobile, so hub and spoke read as one
   continuous nav surface (unlike desktop where the rail sits on #E7EBEF). */
export const MobileProductRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 16px);
  height: 40px;
  margin: 0 8px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#DEE3E8' : 'transparent')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  color: ${({ $active }) => ($active ? '#44484A' : '#636A6E')};
  text-align: left;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: ${({ $active }) => ($active ? '#DEE3E8' : '#ECEFF2')};
  }

  &:active {
    background: #CFD6DC;
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

export const DrawerProductLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;
