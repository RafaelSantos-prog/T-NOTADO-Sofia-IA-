import { useState } from 'react';
import { useAutoResize } from '../../../hooks/useAutoResize';
import { Button } from '../../ui/Button/Button';
import styles from './ChatInput.module.css';

/**
 * Chat input component with auto-expanding textarea.
 * Handles Enter to send, Shift+Enter for new lines.
 * @param {function} onSendMessage - Callback with message text
 * @param {boolean} isDisabled - Disable input state
 * @param {boolean} isLoading - Show loading state
 */
export function ChatInput({ onSendMessage, isDisabled = false, isLoading = false }) {
  const [message, setMessage] = useState('');
  const textareaRef = useAutoResize(120);

  const handleSend = () => {
    if (message.trim() && !isDisabled && !isLoading) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter creates new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Digite sua mensagem aqui... (Shift+Enter para quebra de linha)"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isLoading}
          aria-label="Message input"
          rows={1}
        />
        <Button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!message.trim() || isDisabled || isLoading}
          isLoading={isLoading}
          aria-label="Send message"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
