import styled from 'styled-components';

export const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1100;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
`;

export const DrawerPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  z-index: 1200;
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  flex-shrink: 0;
`;

export const DrawerTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

export const DrawerCloseBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.neutral600};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
    color: ${({ theme }) => theme.colors.neutral900};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

export const DrawerBody = styled.nav`
  padding: 8px 0;
  flex: 1;
`;

export const DrawerGroup = styled.div`
  margin: 4px 0;
`;

export const DrawerGroupTitle = styled.div`
  padding: 8px 20px 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.neutral500};
`;

export const DrawerLink = styled.a`
  display: block;
  padding: 9px 20px 9px 28px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  text-decoration: none;
  transition: background 0.15s;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral50};
    color: ${({ theme }) => theme.colors.blue300};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

export const DrawerDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  margin: 4px 0;
`;
