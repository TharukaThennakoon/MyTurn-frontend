import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Admin Login | MyTurn",
  description: "Secure access for station operators and administrators.",
};

export default function AdminLoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.leftPane}>
        <p className={styles.kicker}>MyTurn Control</p>
        <h1>Admin Access Portal</h1>
        <p className={styles.lead}>
          Manage queue flow, monitor pump activity, and handle priority sessions from a
          single dashboard.
        </p>
        <div className={styles.tags}>
          <span>Queue Moderation</span>
          <span>Station Insights</span>
          <span>Operator Controls</span>
        </div>
      </section>

      <section className={styles.rightPane}>
        <div className={styles.card}>
          <h2>Admin Sign In</h2>
          <p className={styles.subtitle}>Authorized personnel only.</p>

          <form className={styles.form}>
            <label htmlFor="admin-email">Work Email</label>
            <input id="admin-email" type="email" placeholder="admin@myturn.com" />

            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" placeholder="Enter your password" />

            <label htmlFor="admin-code">Security Code</label>
            <input id="admin-code" type="text" placeholder="One-time code" />

            <button type="submit">Access Dashboard</button>
          </form>

          <p className={styles.bottomText}>
            Need user access instead? <Link href="/login">Go to user login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
