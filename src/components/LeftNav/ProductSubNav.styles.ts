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
  @media (max-width: 767px) {
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
  background: #E8EAED;
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
  padding: 14px 16px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral300};
  flex-shrink: 0;
`;

export const SubNavTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

export const SubNavScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral300};
    border-radius: 2px;
  }
`;

/* Single chevron positioned outside the clip layer; rotates 180° when spoke closes */
export const ChevronButton = styled.button<{ $open: boolean }>`
  position: absolute;
  right: -12px;
  top: 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: ${({ theme }) => theme.colors.neutral600};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transform: ${({ $open }) => ($open ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition: background 0.15s, color 0.15s, transform 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
    color: ${({ theme }) => theme.colors.neutral900};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/*
 * Tablet overlay backdrop — sits behind the spoke (z-index 899) above page content.
 * Clicking it closes the spoke, matching the "overlay dismisses on outside click" spec.
 * Hidden on desktop (spoke pushes content, no dismiss-on-outside-click needed) and mobile.
 */
export const SpokeBackdrop = styled.div<{ $visible: boolean }>`
  display: none;

  @media (max-width: 1023px) and (min-width: 768px) {
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
    position: fixed;
    top: ${({ theme }) => theme.layout.topNavHeight};
    left: ${({ theme }) => theme.layout.iconRailWidth};
    right: 0;
    bottom: 0;
    z-index: 899;
  }
`;
