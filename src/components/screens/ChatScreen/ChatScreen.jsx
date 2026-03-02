import { useContext, useState } from 'react';
import { useChat } from '../../../hooks/useChat';
import { ChatContext, ToastContext, AuthContext } from '../../../context';
import { ChatHeader } from '../../chat/ChatHeader/ChatHeader';
import { MessageList } from '../../chat/MessageList/MessageList';
import { ChatInput } from '../../chat/ChatInput/ChatInput';
import { CrisisBanner } from '../../chat/CrisisBanner/CrisisBanner';
import styles from './ChatScreen.module.css';

/**
 * Main chat screen component.
 * Displays messages, input, and handles chat logic.
 * @param {function} onLogout - Logout callback
 */
export function ChatScreen({ onLogout }) {
  const { messages, setMessages, isLoading } = useContext(ChatContext);
  const { addToast } = useContext(ToastContext);
  const { apiKey, logout } = useContext(AuthContext);
  const { sendMessageToSofia, clearChat } = useChat(apiKey);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);

  const handleSendMessage = async (messageText) => {
    try {
      const response = await sendMessageToSofia(messageText);

      // Check for crisis in both user and sofia messages
      const hasCrisisInChat =
        messages.some((m) => m.hasCrisis) ||
        response?.hasCrisis ||
        messageText.toLowerCase().includes('suicídio');

      setShowCrisisBanner(hasCrisisInChat);

      if (hasCrisisInChat) {
        addToast('Aviso: Detectamos indicadores de crise. Recursos de suporte disponíveis abaixo.', 'warning', 7000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
      addToast(errorMessage, 'error', 6000);
    }
  };

  const handleClearChat = () => {
    clearChat();
    setShowCrisisBanner(false);
    addToast('Chat limpo com sucesso', 'success', 3000);
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className={styles.container}>
      <ChatHeader onClearChat={handleClearChat} onLogout={handleLogout} />

      <div className={styles.chatArea}>
        <MessageList messages={messages} isLoading={isLoading} />

        {showCrisisBanner && <CrisisBanner />}
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isDisabled={false}
        isLoading={isLoading}
      />
    </div>
  );
}
