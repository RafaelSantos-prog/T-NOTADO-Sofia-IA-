import { useCallback, useContext } from 'react';
import { useGemini } from './useGemini';
import { ChatContext } from '../context/ChatContext';
import { createMessage, messageToGeminiFormat } from '../utils/messageFactory';
import { SYSTEM_PROMPT } from '../constants/systemPrompt';

/**
 * Custom hook orchestrating chat operations.
 * Manages message sending, history, and Sofia's responses.
 * @param {string} apiKey - Gemini API key
 * @returns {object} Chat control methods
 */
export function useChat(apiKey) {
  const { call: callGemini } = useGemini();
  const { messages, setMessages, setHistory, setIsLoading } = useContext(ChatContext);

  /**
   * Send user message and get Sofia's response
   */
  const sendMessageToSofia = useCallback(
    async (userText) => {
      if (!userText.trim()) return;

      // Create and add user message
      const userMessage = createMessage('user', userText);
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Update history for Gemini
      const userGeminiMessage = messageToGeminiFormat(userMessage);
      const updatedHistory = [
        ...updatedMessages
          .filter((m) => m.role === 'user' || m.role === 'sofia')
          .map(messageToGeminiFormat),
      ];
      setHistory(updatedHistory);

      setIsLoading(true);

      try {
        // Call Gemini API
        const sofiaResponse = await callGemini(apiKey, updatedHistory, SYSTEM_PROMPT);

        // Create Sofia's message
        const sofiaMessage = createMessage('sofia', sofiaResponse);
        const finalMessages = [...updatedMessages, sofiaMessage];
        setMessages(finalMessages);

        // Update history
        const finalHistory = [
          ...finalMessages
            .filter((m) => m.role === 'user' || m.role === 'sofia')
            .map(messageToGeminiFormat),
        ];
        setHistory(finalHistory);

        return sofiaMessage;
      } catch (error) {
        // Remove last user message on error
        setMessages(updatedMessages);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, setMessages, setHistory, setIsLoading, apiKey, callGemini]
  );

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    const welcomeMessage = createMessage(
      'sofia',
      'Olá! Sou a Sofia, sua psicóloga virtual. Estou aqui para ouvir e apoiar você. Como posso ajudar hoje?'
    );
    setMessages([welcomeMessage]);
    setHistory([messageToGeminiFormat(welcomeMessage)]);
  }, [setMessages, setHistory]);

  return { sendMessageToSofia, clearChat };
}
