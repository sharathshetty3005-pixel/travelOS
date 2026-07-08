import { animation } from './animation';
import { shadows } from './shadows';

export const spacing = {
  micro: 4,
  tiny: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  huge: 40,
  xhuge: 48,
  xxhuge: 64,
  giant: 80,
  super: 96,
} as const;

export const radii = {
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  capsule: 999,
} as const;

export const typography = {
  display: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '700' as const,
  },
  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;

export const opacity = {
  disabled: 0.35,
  subtle: 0.60,
  medium: 0.80,
  solid: 1.0,
} as const;

export const zIndex = {
  back: -1,
  base: 0,
  card: 1,
  header: 10,
  overlay: 100,
  modal: 200,
} as const;

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

export const avatarSizes = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
} as const;

export const screenPadding = {
  horizontal: 20,
  vertical: 24,
} as const;

export const cardSpacing = {
  inner: 16,
  outer: 12,
  gap: 16,
} as const;

export const blur = {
  low: 15,
  medium: 30,
  high: 50,
} as const;

export const colors = {
  dark: {
    backgroundPrimary: 'rgb(18, 18, 22)', // Deep charcoal instead of pure black
    backgroundSecondary: 'rgb(26, 26, 32)', // Card surfaces
    backgroundTertiary: 'rgb(34, 34, 42)',
    textPrimary: 'rgb(247, 247, 249)',
    textSecondary: 'rgba(247, 247, 249, 0.60)',
    accentGold: 'rgb(212, 175, 55)',
    accentTeal: 'rgb(0, 242, 254)',
    glassBackdrop: 'rgba(18, 18, 22, 0.50)',
    border: 'rgba(255, 255, 255, 0.08)',
    cardBg: 'rgba(26, 26, 32, 0.80)',
    overlay: 'rgba(0, 0, 0, 0.25)',
    success: 'rgb(52, 199, 89)',
    error: 'rgb(255, 59, 48)',
    warning: 'rgb(255, 149, 0)',
  },
  light: {
    backgroundPrimary: '#F6F8FC', // Soft warm neutral inspired by Arc/Linear
    backgroundSecondary: '#FFFFFF', // Clean off-white layered surfaces
    backgroundTertiary: '#EEF1F6', // Subtle contrasts
    textPrimary: '#1A1C20', // Dark charcoal primary typography
    textSecondary: '#606470', // Muted slate secondary labels
    accentGold: '#C59918', // Refined gold accents
    accentTeal: '#0F8C9E', // Luxury blue-teal highlight
    glassBackdrop: 'rgba(255, 255, 255, 0.70)', // Light frosted glass
    border: 'rgba(26, 28, 32, 0.07)', // Soft borders
    cardBg: 'rgba(255, 255, 255, 0.82)', // Premium glass float
    overlay: 'rgba(26, 28, 32, 0.04)',
    success: '#1D8A48', // Forest green success
    error: '#D32F2F', // Clean dark red error
    warning: '#E65100', // Muted orange warning
  },
} as const;

export { animation, shadows };
