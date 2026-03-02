import styles from './Avatar.module.css';

/**
 * Avatar component for displaying user/Sofia profile image.
 * @param {string} initials - Fallback initials if no image
 * @param {string} image - Avatar image URL
 * @param {string} alt - Image alt text
 * @param {boolean} isOnline - Shows online indicator
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 */
export function Avatar({
  initials = 'A',
  image = null,
  alt = 'Avatar',
  isOnline = false,
  size = 'md',
}) {
  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      {image ? (
        <img src={image} alt={alt} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
      {isOnline && <span className={styles.indicator} title="Online" />}
    </div>
  );
}
