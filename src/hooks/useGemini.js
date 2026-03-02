import { useCallback, useState } from 'react';
import { sendMessage } from '../api/geminiService';

/**
 * Custom hook for Gemini API interaction.
 * Manages API calls, errors, and loading state.
 * @returns {object} Methods and state for Gemini interaction
 */
export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (apiKey, history, systemPrompt) => {
    setIsLoading(true);
    setError(null);

    try {
      // Backend gerencia a validação da API key
      const response = await sendMessage(apiKey, history, systemPrompt);
      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { call, isLoading, error, clearError };
}
