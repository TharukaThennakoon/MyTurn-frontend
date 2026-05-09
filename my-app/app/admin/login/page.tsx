import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Admin Login | MyTurn",
  description: "Secure access for station operators and administrators.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const showInvalidCredentials = params.error === "invalid_credentials";
  const showSuccess = params.success === "true";

  return (
    <main className={styles.page}>
      <section className={styles.leftPane}>
        <p className={styles.brand}>MyTurn</p>
        <h1>Fuel Access, Without the Wait.</h1>
        <p className={styles.lead}>
          Join the MyTurn operator network and keep stations moving with secure, real-time
          queue controls.
        </p>
        <div className={styles.featureList}>
          <span>Real-time queue status updates</span>
          <span>Priority session controls</span>
        </div>
      </section>

      <section className={styles.rightPane}>
        <div className={styles.card}>
          <h2>Admin Sign In</h2>
          <p className={styles.subtitle}>Secure access for station operators.</p>

          {showInvalidCredentials && (
            <p className={styles.errorMessage} role="alert" aria-live="polite">
              Invalid credentials. Please check your email, password, and security code.
            </p>
          )}

          {showSuccess && (
            <p className={styles.successMessage} role="status" aria-live="polite">
              Login successful! Redirecting to dashboard...
            </p>
          )}

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
