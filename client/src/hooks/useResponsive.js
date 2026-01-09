import { useState, useEffect } from "react";
import { breakpoints } from "../utils/responsive";

/**
 * Provides responsive breakpoint information based on window width.
 */
export function useResponsive() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < breakpoints.mobile;

  return {
    isMobile
  };
}

