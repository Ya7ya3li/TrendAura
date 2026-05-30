import { useState, useEffect } from 'react';

/**
 * TrendAura Adaptive Viewport Monitor Hook
 * Captures browser dimension shifts matching exact Tailwind breakpoint configurations.
 */
export default function useResponsive() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isDesktop: !isMobile
  };
}