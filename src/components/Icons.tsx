import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

export const IconDashboard: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="7" height="7" rx="1" fill={color} />
    <rect x="11" y="2" width="7" height="7" rx="1" fill={color} />
    <rect x="2" y="11" width="7" height="7" rx="1" fill={color} />
    <rect x="11" y="11" width="7" height="7" rx="1" fill={color} />
  </svg>
);

export const IconSettings: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="3" stroke={color} strokeWidth="2" />
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconShield: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2L3 5v5c0 4.4 3 8.2 7 9 4-0.8 7-4.6 7-9V5L10 2z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M7 10l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconHierarchy: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="8" y="1" width="4" height="4" rx="1" fill={color} />
    <rect x="2" y="13" width="4" height="4" rx="1" fill={color} />
    <rect x="14" y="13" width="4" height="4" rx="1" fill={color} />
    <path d="M10 5v3M10 8H5v2M10 8h5v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconCycle: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10a6 6 0 0 1 6-6 6 6 0 0 1 4.24 1.76L16 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 4v4h-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 10a6 6 0 0 1-6 6 6 6 0 0 1-4.24-1.76L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M4 16v-4h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCode: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7 6L3 10l4 4M13 6l4 4-4 4M11 4l-2 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconGlobe: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2" />
    <path d="M2 10h16M10 2c-2 3-3 5-3 8s1 5 3 8M10 2c2 3 3 5 3 8s-1 5-3 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconDocument: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 2h7l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 2v4h4M7 9h6M7 12h6M7 15h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconMobile: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="5" y="1" width="10" height="18" rx="2" stroke={color} strokeWidth="2" />
    <circle cx="10" cy="16" r="1" fill={color} />
    <line x1="8" y1="4" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconSparkle: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2l1.8 5.5H18l-4.9 3.5 1.9 5.5L10 13l-4.9 3.5 1.9-5.5L2 7.5h6.2L10 2z" fill={color} />
  </svg>
);

export const IconEnvelope: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="2" />
    <path d="M2 6l8 6 8-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconCart: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M1 1h3l2.5 9.5h8.5l2-6H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="16.5" r="1.5" fill={color} />
    <circle cx="14" cy="16.5" r="1.5" fill={color} />
  </svg>
);

export const IconHelp: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2" />
    <path d="M7.5 7.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="14.5" r="1" fill={color} />
  </svg>
);

export const IconGear: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="3" stroke={color} strokeWidth="2" />
    <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.5 3.5l1.4 1.4M15.1 15.1l1.4 1.4M3.5 16.5l1.4-1.4M15.1 4.9l1.4-1.4"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconHamburger: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <line x1="2" y1="5" x2="18" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="10" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="15" x2="18" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconChevronLeft: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3l5 5-5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronDown: React.FC<IconProps> = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 5l4 4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronUp: React.FC<IconProps> = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 9l4-4 4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconClose: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 2l12 12M14 2L2 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
