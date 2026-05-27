import styled from 'styled-components';

/* Outer wrapper: animates width; overflow: visible so the chevron can escape the edge */
export const SubNavWrapper = styled.div<{ $open: boolean }>`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  left: ${({ theme }) => theme.layout.iconRailWidth};
  bottom: 0;
  width: ${({ $open }) => ($open ? '220px' : '4px')};
  overflow: visible;
  z-index: 900;
  transition: ${({ $open }) =>
    $open
      ? 'width 220ms cubic-bezier(0.4, 0, 0.2, 1)'
      : 'width 180ms cubic-bezier(0.4, 0, 0.2, 1) 60ms'
  };

  /* No spoke on mobile — full nav is in the hamburger drawer */
  @media (max-width: 639px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/* Clips visible content to the wrapper bounds without clipping the chevron */
export const SubNavClip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  /* Matches the icon-rail container colour — the spoke header reads as a continuation of the same "products hub" surface */
  background: #E7EBEF;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral300};
`;

export const SubNavInner = styled.div<{ $open: boolean }>`
  width: 220px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: ${({ $open }) =>
    $open
      ? 'opacity 100ms cubic-bezier(0.4, 0, 0.2, 1) 60ms'
      : 'opacity 60ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

export const SubNavHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral300};
  flex-shrink: 0;
`;

export const PlanTierLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  color: #757D82;
  line-height: 1.2;
  transition: color 0.15s ease;
`;

/*
 * Clickable variant — used for products whose header itself opens a page (e.g.
 * Trust Lifecycle plan). The spoke header shares its surface colour with the
 * icon rail (both #E7EBEF), so the state backgrounds match the rail button
 * exactly. PlanTierLabel colour mirrors the rail icon-colour pattern too:
 * unchanged on hover, darker when selected, darkest while pressed.
 */
export const SubNavHeaderButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral300};
  background: ${({ $active }) => ($active ? '#C1C8CD' : 'transparent')};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  flex-shrink: 0;
  transition: background 0.15s ease;

  ${({ $active }) =>
    $active &&
    `
    ${PlanTierLabel} {
      color: #44484A;
    }
  `}

  &:hover {
    background: ${({ $active }) => ($active ? '#C1C8CD' : '#D6DCE1')};
  }

  &:active {
    background: #ADB4BA;

    ${PlanTierLabel} {
      color: #353535;
    }
  }

  &:focus-visible {
    outline: 2px solid #1976D2;
    outline-offset: -2px;
  }
`;

export const SubNavTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

/*
 * Instance picker — ghost button: borderless, transparent, color-only hover.
 * Right padding is set so the chevron aligns with section accordion chevrons
 * (section wrapper margin 8px + section header padding-right 12px = 20px
 * inset from the spoke's right edge; here, header padding-right is 16px so
 * the picker absorbs the remaining 4px).
 */
export const InstancePicker = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 24px;
  padding: 2px 4px 2px 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  color: #757D82;
  text-align: left;
  transition: color 0.12s;

  &:hover {
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

export const InstancePickerLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
`;

export const InstancePickerRegion = styled.span`
  margin-left: 4px;
  color: inherit;
`;

export const InstancePickerChevron = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: 12px;
`;


export const SubNavScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  background: #F9FAFB;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral300};
    border-radius: 2px;
  }
`;

export const ChevronTooltip = styled.span`
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.82);
  color: #ffffff;
  font-size: 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 120ms ease;
  z-index: 11;

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/*
 * Wrapper sits on the right edge of the spoke, centered with the header.
 * Hover/focus on the wrapper reveals the tooltip via the sibling rule below.
 */
export const ChevronWrapper = styled.div`
  position: absolute;
  right: -12px;
  top: 16px;
  width: 24px;
  height: 24px;
  z-index: 10;

  &:hover ${ChevronTooltip},
  &:focus-within ${ChevronTooltip} {
    opacity: 1;
  }
`;

export const ChevronButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral600};
  transition: color 0.15s;
  padding: 0;

  & > svg {
    width: 16px;
    height: 16px;
    display: block;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.neutral900};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/*
 * Tablet overlay backdrop — sits behind the spoke (z-index 899) above page content.
 * Clicking it closes the spoke, matching the "overlay dismisses on outside click" spec.
 * Hidden on desktop (spoke pushes content, no dismiss-on-outside-click needed) and mobile.
 */
export const SpokeBackdrop = styled.div<{ $visible: boolean }>`
  display: none;

  @media (min-width: 640px) and (max-width: 1023px) {
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
    position: fixed;
    top: ${({ theme }) => theme.layout.topNavHeight};
    left: ${({ theme }) => theme.layout.iconRailWidth};
    right: 0;
    bottom: 0;
    z-index: 899;
  }
`;
