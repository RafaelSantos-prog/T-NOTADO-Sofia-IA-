import { createContext, useState, useCallback, useEffect } from 'react';
import { createMessage, messageToGeminiFormat } from '../utils/messageFactory';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * ChatContext for managing messages, history, and loading state.
 * Persists chat history to localStorage for session recovery.
 */
export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useLocalStorage('sofia-messages', []);
  const [history, setHistory] = useLocalStorage('sofia-history', []);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = createMessage(
        'sofia',
        'Olá! Sou a Sofia, sua psicóloga virtual. Estou aqui para ouvir e apoiar você. Como posso ajudar hoje?'
      );
      setMessages([welcomeMessage]);
      setHistory([messageToGeminiFormat(welcomeMessage)]);
    }
  }, []);

  const clearChatHistory = useCallback(() => {
    const welcomeMessage = createMessage(
      'sofia',
      'Olá! Sou a Sofia, sua psicóloga virtual. Estou aqui para ouvir e apoiar você. Como posso ajudar hoje?'
    );
    setMessages([welcomeMessage]);
    setHistory([messageToGeminiFormat(welcomeMessage)]);
  }, [setMessages, setHistory]);

  const value = {
    messages,
    setMessages,
    history,
    setHistory,
    isLoading,
    setIsLoading,
    clearChatHistory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
