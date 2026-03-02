import { useCallback } from 'react';
import { detectCrisis } from '../utils/messageFactory';

/**
 * Custom hook for detecting crisis indicators in messages.
 * Returns a function to check text for crisis keywords.
 * @returns {Function} Function to detect crisis in text
 */
export function useCrisisDetection() {
  const checkCrisis = useCallback((text) => {
    return detectCrisis(text);
  }, []);

  return checkCrisis;
}
