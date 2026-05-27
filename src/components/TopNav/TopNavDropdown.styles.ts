import styled from 'styled-components';

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16), 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 1100;
  overflow: hidden;
  animation: dropIn 0.12s ease;

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export const DropdownMenuWide = styled(DropdownMenu)`
  width: 320px;
`;

/* ─── Environments section ─────────────────────────────────────────────── */

export const EnvironmentsSection = styled.div`
  padding: 8px 8px 12px;
`;

export const EnvironmentsLabel = styled.div`
  padding: 4px 8px 8px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
`;

export const EnvironmentRow = styled.button<{ $current: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 8px;
  border: none;
  background: ${({ $current }) => ($current ? '#ECEFF2' : 'transparent')};
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: background 0.12s;

  &:hover {
    background: ${({ $current }) => ($current ? '#ECEFF2' : '#F3F5F5')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

export const EnvironmentAvatar = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #143E6B;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 600;
`;

export const EnvironmentText = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const EnvironmentName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EnvironmentSubtitle = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral700};
  line-height: 1.3;
`;

export const EnvironmentAction = styled.span<{ $primary?: boolean }>`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 400;
  color: ${({ $primary, theme }) => ($primary ? theme.colors.blue300 : theme.colors.neutral600)};
  padding: 0 4px;
`;

export const DropdownSection = styled.div`
  padding: 4px 0;
`;

export const DropdownHeader = styled.div`
  padding: 12px 16px 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
`;

export const DropdownUserInfo = styled.div`
  padding: 12px 16px;
`;

export const DropdownUserName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  line-height: 1.25;
`;

export const DropdownUserMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin-top: 4px;
  word-break: break-word;
`;

export const DropdownUserEmail = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin-top: 2px;
  word-break: break-word;
`;

export const DropdownOrgEnv = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin-top: 2px;
  word-break: break-word;
`;

export const DropdownDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  margin: 0;
`;

export const DropdownItem = styled.a`
  display: block;
  padding: 9px 16px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral900};
  text-decoration: none;
  cursor: pointer;
  transition: background 0.12s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral50};
    color: ${({ theme }) => theme.colors.blue300};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }

  &[data-destructive='true'] {
    color: ${({ theme }) => theme.colors.error};
    &:hover { background: #FEF2F2; color: ${({ theme }) => theme.colors.error}; }
  }
`;

export const DropdownSectionLabel = styled.div`
  padding: 8px 16px 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral500};
`;

/* Transparent backdrop catches outside clicks without visual overlay */
export const TransparentBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: transparent;
`;
