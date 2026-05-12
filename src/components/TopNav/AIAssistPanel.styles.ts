import styled from 'styled-components';

export const AIAssistPanelEl = styled.div<{ $open: boolean }>`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  right: 0;
  bottom: 0;
  width: 400px;
  background: #ffffff;
  z-index: 900;
  border-left: 1px solid ${({ theme }) => theme.colors.neutral200};
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
`;

export const AIHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  flex-shrink: 0;
`;

export const AITitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

export const AICloseBtn = styled.button`
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
  font-size: 18px;
  line-height: 1;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.blue300}; outline-offset: 2px; }
`;

export const AIBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  gap: 16px;
`;

export const AIPromptText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin: 0;
`;

export const AIInputRow = styled.div`
  margin-top: auto;
  display: flex;
  gap: 8px;
`;

export const AIInput = styled.input`
  flex: 1;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.neutral500};
  border-radius: 3px;
  padding: 0 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};

  &::placeholder { color: ${({ theme }) => theme.colors.neutral500}; }
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.blue300}; }
`;

export const AISendBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.blue300};
  color: white;
  border: none;
  border-radius: 3px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.blue500}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.blue300}; outline-offset: 2px; }
`;
