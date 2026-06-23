import styled from 'styled-components';

/* Expanded width when the rail is hovered/focused. Wide enough for the longest
   product label ("Quantum Central") alongside the 24px icon. */
const RAIL_EXPANDED_WIDTH = '248px';

export const RailContainer = styled.nav`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  left: 0;
  bottom: 0;
  width: ${({ theme }) => theme.layout.iconRailWidth};
  background: #E7EBEF;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 8px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.08);

  /* Sits above the spoke (z 900) so the expanded panel overlays the product
     sub-nav rather than pushing it. At rest the rail is exactly iconRailWidth
     wide and ends flush against the spoke, so there is no overlap until hover. */
  z-index: 1000;

  /* Collapsed → expanded: the rail grows in place to reveal labels, overlaying
     the spoke. Width + shadow animate; labels fade in via RailLabel. */
  transition: width 180ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 180ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  &:focus-within {
    width: ${RAIL_EXPANDED_WIDTH};
    box-shadow: 4px 0 18px rgba(0, 0, 0, 0.14);
  }

  /* When products exceed the viewport height, the rail scrolls rather than
     clipping icons at the fold. Horizontal stays hidden so collapsed labels
     don't spill past the rail edge.

     The scrollbar itself is hidden for a cleaner look — scrolling still works via
     wheel/trackpad/touch, and RailFade (below) provides the "more below" cue. */
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: none;            /* Firefox */
  &::-webkit-scrollbar {
    display: none;                  /* WebKit/Blink */
  }

  /* Icon rail has no purpose on mobile — full nav is in the hamburger drawer */
  @media (max-width: 639px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

/*
 * Scroll affordance. Since the scrollbar is hidden, these soft fades are the only
 * cue that products sit beyond the fold. Each is a sticky child pinned to an edge
 * of the container; a negative margin on the off-edge lets it overlay the adjacent
 * row instead of adding scroll height. Visibility is driven from JS scroll state —
 * the top fade shows once scrolled down, the bottom fade while there's more below.
 *
 * Gradient colour matches the rail background (#E7EBEF). Render the top fade as the
 * first child and the bottom fade as the last child of RailContainer.
 */
export const RailFade = styled.div<{ $visible: boolean; $edge: 'top' | 'bottom' }>`
  position: sticky;
  ${({ $edge }) => ($edge === 'top' ? 'top: 0; margin-bottom: -28px;' : 'bottom: 0; margin-top: -28px;')}
  align-self: stretch;
  flex: 0 0 auto;
  height: 28px;
  pointer-events: none;
  background: linear-gradient(
    ${({ $edge }) => ($edge === 'top' ? 'to bottom' : 'to top')},
    #E7EBEF 25%,
    rgba(231, 235, 239, 0)
  );
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 150ms ease;

  @media (max-width: 639px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

export const RailGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 2px;
`;

export const RailDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 8px 10px;
  width: calc(100% - 20px);
`;

/*
 * Each product is a row: icon in a fixed left zone, label to its right.
 *
 * The icon zone is sized so the 24px icon sits centred within the collapsed rail
 * width (margin 8 + padding-left 16 + half-icon 12 = 36px = half of the 72px
 * rail). Because the padding is fixed, the icon stays put when the rail expands —
 * only the label is revealed to its right, so nothing appears to shift.
 */
export const RailButton = styled.button<{ $active: boolean }>`
  position: relative;
  width: calc(100% - 16px);
  margin: 0 8px;
  min-height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 4px 12px 4px 16px;
  border: none;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#C1C8CD' : 'transparent')};
  color: ${({ $active }) => ($active ? '#44484A' : '#757D82')};
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;

  & > svg {
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    display: block;
    shape-rendering: geometricPrecision;
  }

  /* Hover only applies to inactive buttons — hovering an already-selected
     product shouldn't lighten it back to the hover tone. */
  &:hover {
    background: ${({ $active }) => ($active ? '#C1C8CD' : '#D6DCE1')};
  }

  &:active {
    background: #ADB4BA;
    color: #353535;
  }

  &:focus-visible {
    outline: 2px solid #1976D2;
    outline-offset: -2px;
  }
`;

/*
 * Full product name shown to the right of the icon. Hidden while the rail is
 * collapsed (icon-only) and faded in when the rail expands on hover/focus.
 *
 * Inherits color from RailButton, so it tracks the active/inactive icon tone.
 * The button's aria-label is authoritative for screen readers — this visible
 * text is decorative (aria-hidden) and not separately announced.
 */
export const RailLabel = styled.span`
  flex: 1;
  min-width: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;

  /* Collapsed by default; revealed when the rail expands. */
  opacity: 0;
  transition: opacity 140ms ease;

  ${RailContainer}:hover &,
  ${RailContainer}:focus-within & {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;
