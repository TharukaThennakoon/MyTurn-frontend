"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import stationAdminService from "@/services/stationAdminService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await stationAdminService.adminLogin({ email, password });
      const token = res.data?.accessToken || res.data?.token;

      if (res.success) {
        if (token) {
          localStorage.setItem("adminToken", token);
        }
        // Save real admin data for dashboard display
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            name: res.data?.name || res.data?.fullName || email.split("@")[0],
            email: res.data?.email || email,
            phone: res.data?.phone || "",
            stationId: res.data?.stationId || null,
            stationName: res.data?.stationName || "",
            role: res.data?.role || "ROLE_ADMIN",
          })
        );
        router.push("/admindashboard");
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.leftPane}>
        <p className={styles.brand}>MyTurn</p>
        <h1>Fuel Access, Without the Wait.</h1>
        <p className={styles.lead}>
          Join the MyTurn operator network and keep stations moving with secure,
          real-time queue controls.
        </p>
        <div className={styles.featureList}>
          <span>Real-time queue status updates</span>
          <span>Priority session controls</span>
        </div>
      </section>

      <section className={styles.rightPane}>
        <div className={styles.card}>
          <h2>Admin Sign In</h2>
          <p className={styles.subtitle}>
            Secure access for station operators.
          </p>

          {error && (
            <p className={styles.errorMessage} role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <form className={styles.form} onSubmit={handleLogin}>
            <label htmlFor="admin-email">Work Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@myturn.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="admin-password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", fontSize: 16,
                  color: "#64748b"
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Signing in…" : "Access Dashboard"}
            </button>
          </form>

          <p className={styles.bottomText}>
            Don&apos;t have an account?{" "}
            <Link href="/adminregister">Register as Admin</Link>
          </p>
          <p className={styles.bottomText}>
            Need user access instead?{" "}
            <Link href="/login">Go to user login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
