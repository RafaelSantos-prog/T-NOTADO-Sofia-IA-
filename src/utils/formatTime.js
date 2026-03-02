/**
 * Format timestamp to readable time string.
 * @param {Date} timestamp - The timestamp to format
 * @returns {string} Formatted time (HH:mm)
 */
export function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format timestamp to date string (relative to today).
 * @param {Date} timestamp - The timestamp to format
 * @returns {string} Today, Yesterday, or date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('pt-BR');
}
