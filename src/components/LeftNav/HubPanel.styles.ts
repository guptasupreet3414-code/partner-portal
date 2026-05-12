import styled from 'styled-components';

export const HubWrapper = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? '220px' : '0')};
  overflow: hidden;
  flex-shrink: 0;
  background: #EAECEF;
  border-right: ${({ $open }) => ($open ? '1px solid rgba(0,0,0,0.08)' : 'none')};
  transition: width 0.2s ease;
  display: flex;
  flex-direction: column;
`;

export const HubInner = styled.div`
  width: 220px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
  }
`;

export const HubGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HubDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 8px 12px;
`;

export const HubProductRow = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  padding: 0 14px 0 16px;
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(25, 118, 210, 0.08)' : 'transparent')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
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
    background: ${({ $active }) => ($active ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0,0,0,0.05)')};
    color: ${({ $active }) => ($active ? '#1976D2' : '#111827')};
  }

  &:focus-visible {
    outline: 2px solid #1976D2;
    outline-offset: -2px;
  }
`;

export const HubProductLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;
