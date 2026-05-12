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

export const LogoText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: 0.02em;
  user-select: none;

  .logo-bold {
    font-weight: 700;
  }

  .logo-normal {
    font-weight: 400;
  }
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
    background: rgba(255, 255, 255, 0.15);
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

/* Wrapper for buttons that own a dropdown — provides the relative positioning anchor */
export const NavDropdownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

/* Hamburger is only relevant on mobile — hide it on tablet and desktop */
export const HamburgerWrapper = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
  }
`;

export const UserAvatar = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0D2137;
  border: 2px solid rgba(255, 255, 255, 0.3);
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

  &:hover {
    border-color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }
`;
