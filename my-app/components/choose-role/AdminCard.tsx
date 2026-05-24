"use client";

import Link from "next/link";
import styles from "./choose-role.module.css";

export default function AdminCard() {
  return (
    <div className={styles.adminCard}>
      <div className={styles.adminContent}>
        <div className={styles.adminIconBox}>
          ⊞
        </div>

        <h2 className={styles.cardTitle}>
          Station Admin
        </h2>

        <p className={styles.cardDescription}>
          Optimize your station&apos;s flow and eliminate physical
          queues with digital management tools. Monitor
          real-time analytics and update fuel levels instantly.
        </p>

        <div className={styles.analyticsBox}>
          <span className={styles.analyticsDot}></span>
          <span>Live station analytics enabled</span>
        </div>

        <Link
          href="/adminregister?role=admin"
          className={styles.adminButton}
        >
          Admin Dashboard ↗
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