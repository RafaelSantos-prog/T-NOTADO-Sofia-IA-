import styles from './CrisisBanner.module.css';

/**
 * Crisis warning banner displayed when crisis keywords detected.
 * Shows emergency resources and support information.
 */
export function CrisisBanner() {
  return (
    <div className={styles.banner} role="alert">
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.icon}>!</span>
          <h3 className={styles.title}>Suporte Imediato</h3>
        </div>
        <p className={styles.text}>
          Se você está em crise, procure ajuda profissional imediatamente:
        </p>
        <div className={styles.resources}>
          <div className={styles.resource}>
            <strong>CVV (Valorização à Vida)</strong>
            <div>Ligue <span className={styles.highlight}>188</span></div>
            <div className={styles.info}>24h - Gratuito - Sigiloso</div>
          </div>
          <div className={styles.resource}>
            <strong>SAMU Emergência</strong>
            <div>Ligue <span className={styles.highlight}>192</span></div>
            <div className={styles.info}>Emergência médica imediata</div>
          </div>
        </div>
        <p className={styles.note}>
          Sofia não substitui acompanhamento profissional presencial.
        </p>
      </div>
    </div>
  );
}
