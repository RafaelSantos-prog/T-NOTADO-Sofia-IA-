/**
 * Hook que calcula a força da senha em 4 níveis
 * @param {string} password
 * @returns {{ score: 0|1|2|3|4, label: string, color: string, percent: number }}
 */

import { useMemo } from 'react';
import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '../utils/validators';

export function usePasswordStrength(password) {
  return useMemo(() => {
    const score = calculatePasswordStrength(password);
    const label = getPasswordStrengthLabel(score);
    const color = getPasswordStrengthColor(score);
    const percent = (score / 4) * 100;

    return {
      score,
      label,
      color,
      percent,
    };
  }, [password]);
}
