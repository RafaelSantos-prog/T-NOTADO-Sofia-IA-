import { formatTime } from '../../../utils/formatTime';
import { Avatar } from '../../ui/Avatar/Avatar';
import styles from './MessageBubble.module.css';

/**
 * Message bubble component for chat messages.
 * @param {string} role - 'user' or 'sofia'
 * @param {string} text - Message content
 * @param {Date} timestamp - Message timestamp
 * @param {boolean} hasCrisis - Shows crisis indicator
 */
export function MessageBubble({ role, text, timestamp, hasCrisis = false }) {
  const isUser = role === 'user';

  return (
    <div className={`${styles.bubble} ${styles[role]}`}>
      {!isUser && <Avatar initials="SF" size="sm" />}
      <div className={styles.content}>
        <p className={styles.text}>{text}</p>
        <time className={styles.time}>{formatTime(timestamp)}</time>
      </div>
      {hasCrisis && <span className={styles.crisis} title="Indicador de crise" />}
    </div>
  );
}
