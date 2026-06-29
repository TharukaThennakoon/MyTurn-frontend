"use client";

import { useState } from "react";
import Link from "next/link";
import VehicleDetails from "./VehicleDetails";

type Props = {
  type: "login" | "register";
};

export default function AuthForm({ type }: Props) {
  const isRegister = type === "register";
  const [showPass, setShowPass] = useState(false);

  return (
    <div style={styles.wrapper}>
      {/* Heading */}
      <h2 style={styles.title}>
        {isRegister ? "Create an Account" : "Welcome Back"}
      </h2>
      <p style={styles.subtitle}>
        {isRegister
          ? "Join the elite network of efficient fueling."
          : "Sign in to manage your queue and bookings."}
      </p>

      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        {/* Full Name — register only */}
        {isRegister && (
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputRow}>
              <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="#94a3b8" strokeWidth="1.6"/>
                <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="John Doe" style={styles.input}/>
            </div>
          </div>
        )}

        {/* Phone Number */}
        <div style={styles.field}>
          <label style={styles.label}>Phone Number</label>
          <div style={styles.inputRow}>
            <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="none">
              <path d="M6.5 3h7a1 1 0 011 1v12a1 1 0 01-1 1h-7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#94a3b8" strokeWidth="1.6"/>
              <circle cx="10" cy="14.5" r=".7" fill="#94a3b8"/>
            </svg>
            <input type="tel" placeholder="+1 (555) 000-0000" style={styles.input}/>
          </div>
        </div>

        {/* Email Address */}
        <div style={styles.field}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputRow}>
            <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="#94a3b8" strokeWidth="1.6"/>
              <path d="M2 7l8 5 8-5" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input type="email" placeholder="john@example.com" style={styles.input}/>
          </div>
        </div>


        {/* Password */}
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputRow}>
            <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="none">
              <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="#94a3b8" strokeWidth="1.6"/>
              <path d="M7 9V6a3 3 0 016 0v3" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              style={styles.input}
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPass(!showPass)}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                {showPass ? (
                  <path d="M3 3l14 14M8.5 8.6A3 3 0 0011.4 11.5M4.1 5.9A9.3 9.3 0 002 10s2.7 6 8 6a7.6 7.6 0 003.8-1.1M7.4 3.8A7.6 7.6 0 0110 3c5.3 0 8 6 8 6a10.8 10.8 0 01-1.8 2.7" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
                ) : (
                  <>
                    <path d="M2 10s2.7-6 8-6 8 6 8 6-2.7 6-8 6-8-6-8-6z" stroke="#94a3b8" strokeWidth="1.6"/>
                    <circle cx="10" cy="10" r="2.5" stroke="#94a3b8" strokeWidth="1.6"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Vehicle Details — register only */}
        {isRegister && <VehicleDetails />}

        {/* Submit */}
        <button type="submit" style={styles.submitBtn}>
          {isRegister ? "Create Account" : "Login"} →
        </button>

        {/* Footer link */}
        <p style={styles.footerText}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          {" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            style={styles.footerLink}
          >
            {isRegister ? "Login here" : "Register here"}
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: "100%",
    maxWidth: 340,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    margin: "0 0 18px",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 11,
  },
  row: {
    display: "flex",
    gap: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "#374151",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f4f7fb",
    borderRadius: 8,
    padding: "0 12px",
    height: 44,
    border: "1.5px solid transparent",
    transition: "border-color 0.2s",
  },
  inputIcon: {
    width: 15,
    height: 15,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    color: "#0f172a",
    fontFamily: "inherit",
    minWidth: 0,
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  submitBtn: {
    height: 46,
    background: "#1d3461",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 4,
    transition: "background 0.2s",
  },
  footerText: {
    textAlign: "center" as const,
    fontSize: 14,
    color: "#64748b",
    margin: "2px 0 0",
  },
  footerLink: {
    color: "#1d4ed8",
    fontWeight: 600,
    textDecoration: "none",
  },
};