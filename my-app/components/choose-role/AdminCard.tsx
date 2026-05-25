"use client";
import Link from "next/link";
import styles from "./choose-role.module.css";

export default function AdminCard() {
  return (
    <div className={styles.adminCard}>
      <div className={styles.adminContent}>
        <div className={styles.adminIconBox}>⊞</div>
        <span className={styles.adminCardLabel}>For stations</span>
        <h2 className={styles.cardTitle}>Station Admin</h2>
        <p className={styles.cardDescription}>
          Optimize your station&apos;s flow and eliminate physical queues with
          digital management tools. Monitor real-time analytics and update fuel
          levels instantly.
        </p>

        <div className={styles.analyticsBox}>
          <span className={styles.analyticsDot}></span>
          <span>Live station analytics enabled</span>
        </div>

        <div className={styles.buttonGroup}>
          <Link href="/adminregister?role=admin" className={styles.adminButton}>
            Admin dashboard ↗
          </Link>
        </div>

        <div className={styles.adminDividerRow}>
          <span className={styles.adminDividerLine} />
          <span className={styles.adminDividerText}>already have an account?</span>
          <span className={styles.adminDividerLine} />
        </div>

        <Link href="/adminlogin" className={styles.adminLoginButton}>
          Admin sign in
        </Link>
      </div>

      <div className={styles.adminImageWrapper}>
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
          alt="Analytics"
          className={styles.adminImage}
        />
      </div>
    </div>
  );
}