export const colors = {
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
  success: '#01B574',
  warning: '#FFB547',
  error: '#E31A1A',
  info: '#4318FF',
  background: {
    main: '#F4F7FE',
    card: '#FFFFFF',
    secondary: '#FAFCFE',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#64748B',
    accent: '#1E3A8A',
    disabled: '#94A3B8',
    white: '#FFFFFF',
    tertiary: '#64748B',
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
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
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

export const inputStyles = {
  base: {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    border: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.background.card,
    color: '#1B2559',
    fontWeight: typography.fontWeight.semibold,
    transition: 'all 0.2s ease',
    outline: 'none',
    outlineWidth: 0,
    boxSizing: 'border-box',
  },
  focus: {
    borderColor: colors.brand[500],
    boxShadow: `0 0 0 2px ${colors.brand[50]}`,
    transform: 'scale(1.01)',
    outline: 'none',
    outlineWidth: 0,
    borderWidth: '1px',
  },
};

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
    color: colors.text.white,
    marginTop: spacing.xs,
    fontWeight: typography.fontWeight.semibold,
  },
};

export const tableStyles = {
  header: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: `${spacing.md} ${spacing.lg}`,
    color: colors.text.white,
  },
  cell: {
    padding: `${spacing.lg} ${spacing.lg}`,
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    color: colors.text.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
};

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

export const glassStyles = {
  base: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  subtle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(30px) saturate(160%)',
    WebkitBackdropFilter: 'blur(30px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.3), 0 4px 16px 0 rgba(31, 38, 135, 0.2)',
  },
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px) saturate(150%)',
    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  active: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.5), 0 2px 8px 0 rgba(99, 102, 241, 0.2)',
  },
  frosty: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(50px) saturate(200%)',
    WebkitBackdropFilter: 'blur(50px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25), inset 0 1px 2px 0 rgba(255, 255, 255, 0.4)',
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
  glassStyles,
};

export default horizonTheme;
