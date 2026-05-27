import 'styled-components';
import type { Theme } from './theme';

declare module 'styled-components' {
  // styled-components uses interface merging for theme augmentation.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
