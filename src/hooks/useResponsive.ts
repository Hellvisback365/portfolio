'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * 
 * @returns Object containing:
 * - isMobile: true if screen width is < 640px
 * - isTablet: true if screen width is >= 640px and < 1024px
 * - isDesktop: true if screen width is >= 1024px
 * - breakpoint: current breakpoint as string ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 */
export function useResponsive() {
  // Initialize with a default for server-side rendering
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  // Update screen size on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tailwind CSS breakpoints
  const isMobile = screenSize.width < 640; // xs
  const isTablet = screenSize.width >= 640 && screenSize.width < 1024; // sm, md
  const isDesktop = screenSize.width >= 1024; // lg, xl, 2xl
  
  // Determine current breakpoint
  let breakpoint = 'xs';
  if (screenSize.width >= 1536) breakpoint = '2xl';
  else if (screenSize.width >= 1280) breakpoint = 'xl';
  else if (screenSize.width >= 1024) breakpoint = 'lg';
  else if (screenSize.width >= 768) breakpoint = 'md';
  else if (screenSize.width >= 640) breakpoint = 'sm';

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    screenWidth: screenSize.width,
    screenHeight: screenSize.height,
  };
}

export default useResponsive; 