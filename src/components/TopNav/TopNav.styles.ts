import styled from 'styled-components';

export const TopNavBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.layout.topNavHeight};
  background: ${({ theme }) => theme.colors.topNavBg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const LogoImage = styled.img`
  height: 20px;
  width: auto;
  display: block;
  user-select: none;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;

  &:hover {
    background: #0165AC;
  }

  &:active,
  &[aria-expanded='true'] {
    background: #004A80;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }
`;

export const CartBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  pointer-events: none;
`;

/*
 * Tooltip shown beneath top-nav icon buttons. Hidden by default; revealed by
 * the wrapper's :hover / :focus-within. Suppressed while a dropdown is open
 * (button[aria-expanded="true"]) so the tooltip never overlaps the menu.
 */
export const TopNavTooltip = styled.span`
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
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
  z-index: 1050;

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/* Wrapper for buttons that own a dropdown — provides the relative positioning anchor */
export const NavDropdownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:hover ${TopNavTooltip},
  &:focus-within ${TopNavTooltip} {
    opacity: 1;
  }

  /* Hide the tooltip while the button's dropdown is open */
  &:has(button[aria-expanded='true']) ${TopNavTooltip} {
    opacity: 0;
  }
`;

/*
 * Settings / Help / Profile move into the hamburger drawer in mobile mode,
 * so we hide their top-nav entries below the drawer breakpoint.
 */
export const HideOnMobile = styled.div`
  display: contents;

  @media (max-width: 639px) {
    display: none;
  }
`;

/* Hamburger is only relevant on mobile — hide it on tablet and desktop */
export const HamburgerWrapper = styled.div`
  display: none;

  @media (max-width: 639px) {
    display: flex;
    align-items: center;
  }
`;

export const UserAvatar = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #003E6B;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 700;
  transition: ${({ theme }) => theme.transitions.default};
  margin-left: 4px;

  &:hover,
  &:active,
  &[aria-expanded='true'] {
    border-color: #1297F3;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }
`;
