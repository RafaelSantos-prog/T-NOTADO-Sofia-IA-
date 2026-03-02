/**
 * Gemini API configuration.
 * @constant {object}
 */
export const GEMINI_CONFIG = {
  BASE_URL: 'https://generativelanguage.googleapis.com/v1/models',
  MODEL: 'gemini-2.5-flash',
  GENERATION_CONFIG: {
    temperature: 0.85,
    topP: 0.95,
    maxOutputTokens: 800,
  },
  SAFETY_SETTINGS: [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  ],
};
