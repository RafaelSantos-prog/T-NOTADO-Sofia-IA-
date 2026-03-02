/**
 * Validadores puros para formulários de autenticação
 */

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidName = (name) => {
  return name.trim().length >= 2;
};

export const isValidAge = (age) => {
  const num = Number(age);
  return num >= 13 && num <= 120;
};

export const isValidPassword = (password) => {
  return password.length >= 8;
};

export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Calcula a força da senha (0-4)
 * +1 → mínimo 8 caracteres
 * +1 → maiúscula + minúscula
 * +1 → pelo menos 1 número
 * +1 → pelo menos 1 caractere especial
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return 0;

  let score = 0;

  // Tamanho
  if (password.length >= 8) score++;

  // Maiúscula + minúscula
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;

  // Número
  if (/\d/.test(password)) score++;

  // Caractere especial
  if (/[!@#$%^&*._-]/.test(password)) score++;

  return score;
};

export const getPasswordStrengthLabel = (score) => {
  const labels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
  return labels[score] || 'Muito fraca';
};

export const getPasswordStrengthColor = (score) => {
  const colors = [
    'var(--strength-weak)',     // 0
    'var(--strength-weak)',     // 1
    'var(--strength-fair)',     // 2
    'var(--strength-good)',     // 3
    'var(--strength-strong)',   // 4
  ];
  return colors[score];
};
