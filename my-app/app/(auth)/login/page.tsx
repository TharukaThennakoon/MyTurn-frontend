import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "MyTurn Login",
  description:
    "Login to MyTurn and manage your fuel access queue in real time.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const showInvalidCredentials = params.error === "invalid_credentials";
  const showSuccess = params.success === "true";

  return (
    <main className={styles.wrapper}>
      <section className={styles.showcase}>
        <div className={styles.overlay} />
        <div className={styles.showcaseContent}>
          <p className={styles.badge}>Premium Access</p>
          <h1>Fuel Access, Right On Time.</h1>
          <p>
            Welcome back to MyTurn. Check queue status, confirm your slot, and
            arrive only when your pump is ready.
          </p>

          <div className={styles.benefits}>
            <span>Live queue visibility</span>
            <span>Priority lane alerts</span>
            <span>Session-secured access</span>
          </div>
        </div>
      </section>

      <section className={styles.formSide}>
        <div className={styles.card}>
          <h2>Login to MyTurn</h2>
          <p className={styles.subtitle}>
            Continue your seamless fueling journey.
          </p>

          {showInvalidCredentials && (
            <p className={styles.errorMessage} role="alert" aria-live="polite">
              Invalid credentials. Please check your email and password.
            </p>
          )}

          {showSuccess && (
            <p
              className={styles.successMessage}
              role="status"
              aria-live="polite"
            >
              Login successful!
            </p>
          )}

          <form className={styles.form}>
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" placeholder="john@example.com" />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />

            <div className={styles.row}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="#" className={styles.forgot}>
                Forgot password?
              </Link>
            </div>

            <button type="submit">Login</button>
          </form>

          <p className={styles.footerText}>
            New here? <Link href="#">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
