import styles from "./choose-role.module.css";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div>
          <h3 className={styles.footerLogo}>
            MyTurn
          </h3>

          <p className={styles.footerText}>
            © 2024 MyTurn Digital Queueing. Part of the
            FuelPass Velocity Framework.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Station Partners</a>
          <a href="#">Contact</a>
        </div>

        <div className={styles.footerIcons}>
          <div className={styles.circleIcon}>🌐</div>
          <div className={styles.circleIcon}>⊕</div>
        </div>
      </div>
    </footer>
  );
}