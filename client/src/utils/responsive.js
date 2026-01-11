export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

// Detects if the current screen width is below mobile breakpoint
export function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.mobile;
}

// Returns responsive styles merged based on current screen size (mobile, tablet, or desktop)
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
