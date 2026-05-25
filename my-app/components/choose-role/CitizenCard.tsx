"use client";
import Link from "next/link";
import styles from "./choose-role.module.css";

export default function CitizenCard() {
  return (
    <div className={styles.citizenCard}>
      <div className={styles.citizenImageWrapper}>
        <img
          src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=1600&auto=format&fit=crop"
          alt="Citizen"
          className={styles.citizenImage}
        />
        <div className={styles.imageOverlay}></div>
      </div>

      <div className={styles.citizenContent}>
        <div className={styles.iconBox}>🚗</div>
        <span className={styles.cardLabel}>For drivers</span>
        <h2 className={styles.cardTitle}>Citizen</h2>
        <p className={styles.cardDescription}>
          Secure your spot in line and skip the wait at your favourite stations.
          Manage digital tokens, check live wait times, and arrive exactly when
          it&apos;s your turn.
        </p>

        <div className={styles.buttonGroup}>
          <Link href="/register?role=citizen" className={styles.primaryButton}>
            Get started →
          </Link>
          <button className={styles.secondaryButton}>Learn more</button>
        </div>

        <div className={styles.dividerRow}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>already have an account?</span>
          <span className={styles.dividerLine} />
        </div>

        <Link href="/login" className={styles.loginButton}>
          Sign in
        </Link>
      </div>
    </div>
  );
}