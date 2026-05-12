import styled from 'styled-components';

/* Icon rail is always visible — container never translates or hides */
export const LeftNavContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.layout.topNavHeight};
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  z-index: 900;
`;
