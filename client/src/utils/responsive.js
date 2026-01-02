/**
 * Responsive utility functions
 */

// Breakpoints
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

/**
 * Hook to detect if screen is mobile
 * Note: This is a simple utility. For more complex cases, use a library like react-responsive
 */
export function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.mobile;
}

/**
 * Get responsive styles based on screen size
 */
export function getResponsiveStyles(styles) {
  if (typeof window === 'undefined') return styles.desktop || styles;
  
  const isMobileView = window.innerWidth < breakpoints.mobile;
  const isTabletView = window.innerWidth < breakpoints.tablet && window.innerWidth >= breakpoints.mobile;
  
  if (isMobileView && styles.mobile) {
    return { ...styles.desktop, ...styles.mobile };
  }
  if (isTabletView && styles.tablet) {
    return { ...styles.desktop, ...styles.tablet };
  }
  
  return styles.desktop || styles;
}


