import { CRISIS_KEYWORDS } from '../constants/crisisKeywords';

/**
 * Detect crisis keywords in text.
 * @param {string} text - Text to analyze
 * @returns {boolean} True if crisis keywords detected
 */
export function detectCrisis(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Create a standardized message object.
 * @param {string} role - 'user' or 'sofia'
 * @param {string} text - Message text
 * @returns {object} Message object with metadata
 */
export function createMessage(role, text) {
  return {
    id: crypto.randomUUID(),
    role, // 'user' | 'sofia'
    text,
    timestamp: new Date(),
    hasCrisis: detectCrisis(text),
  };
}

/**
 * Convert internal message format to Gemini API format.
 * @param {object} message - Internal message object
 * @returns {object} Gemini-compatible message
 */
export function messageToGeminiFormat(message) {
  return {
    role: message.role === 'user' ? 'user' : 'model',
    parts: [{ text: message.text }],
  };
}

/**
 * Convert Gemini API format to internal message format.
 * @param {object} geminiMessage - Gemini API message
 * @param {string} role - 'user' or 'sofia'
 * @returns {object} Internal message object
 */
export function geminiFormatToMessage(geminiMessage, role) {
  const text = geminiMessage?.parts?.[0]?.text || '';
  return createMessage(role === 'model' ? 'sofia' : 'user', text);
}
