import styles from "./choose-role.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        <span className={styles.badgeDot}></span>

        <span className={styles.badgeText}>
          VELOCITY FRAMEWORK V2.0
        </span>
      </div>

      <h1 className={styles.heroTitle}>
        How will you use <span>MyTurn?</span>
      </h1>

      <p className={styles.heroDescription}>
        Experience the digital concierge for high-demand services.
        Choose your journey to begin skipping the wait.
      </p>
    </section>
  );
}