/**
 * Horizon UI Design System Tokens
 * Clean, modern admin dashboard aesthetic with card-based layouts
 */

export const colors = {
  // Brand colors
  brand: {
    50: '#E9E3FF',
    100: '#C0B8FE',
    200: '#A195FD',
    300: '#8171FC',
    400: '#7551FF',
    500: '#422AFB',
    600: '#3311DB',
    700: '#2111A5',
    800: '#190793',
    900: '#11047A',
  },
  // Navy/Dark colors
  navy: {
    50: '#d0dcfb',
    100: '#aac0fe',
    200: '#a3b9f8',
    300: '#728fea',
    400: '#3652ba',
    500: '#1b3bbb',
    600: '#24388a',
    700: '#1B254B',
    800: '#111c44',
    900: '#0b1437',
  },
  // Gray scale
  gray: {
    50: '#f4f7fe',
    100: '#E0E5F2',
    200: '#E1E9F8',
    300: '#A3AED0',
    400: '#707EAE',
    500: '#8F9BBA',
    600: '#2D3748',
    700: '#1B2559',
    800: '#111C44',
    900: '#0B1437',
  },
  // Semantic colors
  success: '#01B574',
  warning: '#FFB547',
  error: '#E31A1A',
  info: '#4318FF',
  // Background
  background: {
    main: '#F4F7FE',
    card: '#FFFFFF',
    secondary: '#FAFCFE',
  },
  // Text
  text: {
    primary: '#1B2559',
    secondary: '#707EAE',
    tertiary: '#A3AED0',
    white: '#FFFFFF',
  },
};

export const shadows = {
  card: '0px 18px 40px rgba(112, 144, 176, 0.12)',
  cardHover: '0px 18px 40px rgba(112, 144, 176, 0.18)',
  sm: '0px 2px 4px rgba(112, 144, 176, 0.08)',
  md: '0px 4px 8px rgba(112, 144, 176, 0.12)',
  lg: '0px 8px 16px rgba(112, 144, 176, 0.16)',
  xl: '0px 12px 24px rgba(112, 144, 176, 0.20)',
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
};

export const typography = {
  fontFamily: {
    base: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Card component styles
export const cardStyles = {
  base: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
    padding: spacing['2xl'],
    transition: 'all 0.2s ease',
  },
  hover: {
    boxShadow: shadows.cardHover,
    transform: 'translateY(-2px)',
  },
};

// Button component styles
export const buttonStyles = {
  base: {
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  },
  primary: {
    backgroundColor: colors.brand[500],
    color: colors.text.white,
    boxShadow: shadows.sm,
  },
  secondary: {
    backgroundColor: colors.gray[100],
    color: colors.text.primary,
    boxShadow: shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.brand[500],
    border: `1px solid ${colors.brand[500]}`,
  },
};

// Input component styles
export const inputStyles = {
  base: {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    border: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.background.card,
    color: colors.text.primary,
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  focus: {
    borderColor: colors.brand[500],
    boxShadow: `0 0 0 3px ${colors.brand[50]}`,
  },
};

// Stat card styles (for QuickStats)
export const statCardStyles = {
  base: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    boxShadow: shadows.card,
  },
  icon: {
    width: '56px',
    height: '56px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  value: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
};

// Table styles
export const tableStyles = {
  header: {
    backgroundColor: colors.gray[50],
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: `${spacing.md} ${spacing.lg}`,
  },
  cell: {
    padding: `${spacing.lg} ${spacing.lg}`,
    borderBottom: `1px solid ${colors.gray[100]}`,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
  },
};

// Sidebar navigation styles
export const sidebarStyles = {
  base: {
    backgroundColor: colors.background.card,
    borderRight: `1px solid ${colors.gray[100]}`,
    padding: spacing['2xl'],
  },
  item: {
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    marginBottom: spacing.xs,
  },
  itemActive: {
    backgroundColor: colors.brand[500],
    color: colors.text.white,
    boxShadow: shadows.sm,
  },
  itemHover: {
    backgroundColor: colors.gray[50],
  },
};

const horizonTheme = {
  colors,
  shadows,
  borderRadius,
  spacing,
  typography,
  cardStyles,
  buttonStyles,
  inputStyles,
  statCardStyles,
  tableStyles,
  sidebarStyles,
};

export default horizonTheme;

