/**
 * Sanitize user input to prevent XSS attacks.
 * Removes malicious scripts while preserving text content.
 * @param {string} html - Raw user input
 * @returns {string} Sanitized text
 */
export function sanitizeHtml(html) {
  if (!html) return '';

  // Create a temporary element to leverage browser's innerHTML parsing
  const temp = document.createElement('div');
  temp.textContent = html;

  return temp.innerHTML;
}

/**
 * Escape special characters in text for safe display.
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Strip HTML tags from text.
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export function stripHtml(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.innerText || temp.textContent || '';
}
