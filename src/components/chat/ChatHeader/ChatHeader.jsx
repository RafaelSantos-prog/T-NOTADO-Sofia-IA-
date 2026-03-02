import { Avatar } from '../../ui/Avatar/Avatar';
import { Button } from '../../ui/Button/Button';
import styles from './ChatHeader.module.css';

/**
 * Chat header displaying Sofia's info and action buttons.
 * @param {function} onClearChat - Handle clear chat action
 * @param {function} onLogout - Handle logout action
 */
export function ChatHeader({ onClearChat, onLogout }) {
  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar o histórico? Essa ação não pode ser desfeita.')) {
      onClearChat();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.info}>
          <Avatar initials="SF" isOnline size="md" />
          <div className={styles.text}>
            <h1 className={styles.title}>Sofia</h1>
            <p className={styles.subtitle}>Psicóloga Virtual IA</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            aria-label="Limpar histórico de chat"
          >
            Limpar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            aria-label="Fazer logout"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
