export const theme = {
  colors: {
    // Brand
    topNavBg: '#1976D2',
    leftNavBg: '#1E2A3A',
    subNavBg: '#F0F2F5',
    // Blues
    blue300: '#0174C3',
    blue500: '#015A99',
    blue600: '#004A80',
    // Neutrals
    neutral50: '#F9FAFB',
    neutral100: '#F3F5F5',
    neutral200: '#E7EBEF',
    neutral300: '#D6DCE1',
    neutral400: '#C1C8CD',
    neutral500: '#757D82',
    neutral600: '#757D82',
    neutral700: '#636A6E',
    neutral800: '#44484A',
    neutral900: '#353535',
    // Semantic
    white: '#FFFFFF',
    error: '#DC2626',
    success: '#27A872',
    warning: '#F5B517',
    info: '#0F73FF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2x': '24px',
    '3x': '28px',
    '4x': '32px',
    '5x': '40px',
    '6x': '48px',
  },
  borderRadius: {
    default: '3px',
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    sizes: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
  },
  transitions: {
    default: 'all 0.2s ease',
    panel: '0.2s ease',
  },
  // Breakpoints are not in the original design tokens — added for the
  // responsive nav pattern. Values are px integers for use in JS; media
  // queries in styled-components must still hardcode these strings.
  breakpoints: {
    mobile: 768,   // < 768px  → mobile
    tablet: 1024,  // 768–1023 → tablet, ≥ 1024 → desktop
  },
  layout: {
    topNavHeight: '56px',
    iconRailWidth: '56px',
    subNavWidth: '220px',
  },
} as const;

export type Theme = typeof theme;
