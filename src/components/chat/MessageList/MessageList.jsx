import { useAutoScroll } from '../../../hooks/useAutoScroll';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import styles from './MessageList.module.css';

/**
 * Message list component displaying all chat messages.
 * Auto-scrolls to latest message.
 * @param {Array} messages - Array of message objects
 * @param {boolean} isLoading - Shows typing indicator when true
 */
export function MessageList({ messages, isLoading }) {
  const containerRef = useAutoScroll(messages.length);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      <div className={styles.content}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            text={msg.text}
            timestamp={msg.timestamp}
            hasCrisis={msg.hasCrisis}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
}
