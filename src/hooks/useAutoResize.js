import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-expanding textarea based on content.
 * Expands up to maxHeight, then allows internal scroll.
 * @param {number} maxHeight - Maximum height before scrolling (default 120px)
 */
export function useAutoResize(maxHeight = 120) {
  const ref = useRef(null);

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    const handleResize = () => {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
    };

    // Initial resize
    handleResize();

    // Listen to input changes
    textarea.addEventListener('input', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      textarea.removeEventListener('input', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [maxHeight]);

  return ref;
}
