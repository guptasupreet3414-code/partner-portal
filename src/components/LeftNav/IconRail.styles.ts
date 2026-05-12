import styled from 'styled-components';

export const RailContainer = styled.nav`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  left: 0;
  bottom: 0;
  width: ${({ theme }) => theme.layout.iconRailWidth};
  background: #E7EBEF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 900;
  overflow: hidden;

  /* Icon rail has no purpose on mobile — full nav is in the hamburger drawer */
  @media (max-width: 639px) {
    display: none;
  }
`;

export const RailGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 2px;
`;

export const RailDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 8px 10px;
  width: calc(100% - 20px);
`;

export const RailButton = styled.button<{ $active: boolean }>`
  position: relative;
  width: 56px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#D6DCE1' : 'transparent')};
  color: ${({ $active }) => ($active ? '#44484A' : '#757D82')};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  & > svg {
    width: 20px;
    height: 20px;
    display: block;
  }

  &:hover {
    background: #D6DCE1;
  }

  &:active {
    background: #C1C8CD;
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid #1976D2;
    outline-offset: -2px;
  }
`;

/*
 * Tooltip is position: fixed so it escapes the rail's overflow: hidden container.
 * The `top` value is injected via inline style from getBoundingClientRect in the
 * component — CSS alone cannot track the button's dynamic viewport Y position.
 *
 * left = iconRailWidth (56px) + gap (8px) = 64px (hardcoded to match the token).
 * If iconRailWidth ever changes, update this value to match.
 */
export const RailTooltip = styled.span<{ $visible: boolean }>`
  position: fixed;
  left: calc(${({ theme }) => theme.layout.iconRailWidth} + 8px);
  /* top is set by inline style */
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.82);
  color: #ffffff;
  font-size: 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 120ms ease;
  /* Above rail (900) and spoke (900), below modals/dialogs (1200+) */
  z-index: 950;

  /* No tooltip logic on mobile — the rail itself is hidden there */
  @media (max-width: 639px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;
