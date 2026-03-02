import { useEffect, useRef } from 'react';

/**
 * Custom hook for smooth auto-scrolling to bottom of element.
 * Useful for chat containers to keep latest messages visible.
 * @param {*} dependency - Dependency array trigger for scrolling
 */
export function useAutoScroll(dependency) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [dependency]);

  return containerRef;
}
