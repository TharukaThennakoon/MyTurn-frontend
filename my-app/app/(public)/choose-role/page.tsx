"use client";

import Link from "next/link";
import { useState } from "react";
import { Car, Building2, Lock, CheckCircle2 } from "lucide-react";

type Role = "citizen" | "admin";

interface RoleCardProps {
  role: Role;
}

function RoleCard({ role }: RoleCardProps) {
  const isCitizen = role === "citizen";
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const accent = isCitizen ? "#1a56db" : "#0f172a";
  const accentLight = isCitizen ? "#eff6ff" : "#f1f5f9";
  const accentBorder = isCitizen ? "#bfdbfe" : "#cbd5e1";
  const gradientBtn = isCitizen
    ? "linear-gradient(135deg, #1a56db, #3b82f6)"
    : "linear-gradient(135deg, #0f172a, #1e293b)";
  const shadowBtn = isCitizen
    ? "0 4px 16px rgba(26,86,219,0.35)"
    : "0 4px 16px rgba(15,23,42,0.3)";

  const loginLink = isCitizen ? "/login" : "/adminlogin";
  const registerLink = isCitizen ? "/register?role=citizen" : "/adminregister?role=admin";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 60px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)";
      }}
    >
      {/* Card Header */}
      <div
        style={{
          background: isCitizen
            ? "linear-gradient(135deg, #1e3a6e 0%, #1a56db 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "32px 32px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            background: "rgba(255,255,255,0.07)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: "40%",
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }}
        />

        {/* Icon + Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, position: "relative" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              backdropFilter: "blur(6px)",
            }}
          >
            {isCitizen
              ? <Car size={22} color="rgba(255,255,255,0.9)" />
              : <Building2 size={22} color="rgba(255,255,255,0.9)" />}
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.55)",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {isCitizen ? "For Drivers" : "For Stations"}
            </p>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.3px",
              }}
            >
              {isCitizen ? "Citizen" : "Station Admin"}
            </h2>
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.6,
            position: "relative",
            maxWidth: 280,
          }}
        >
          {isCitizen
            ? "Skip the queue. Book your slot, manage tokens, and arrive exactly when it's your turn."
            : "Manage queues, track analytics, and optimize your station flow in real-time."}
        </p>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #f1f5f9",
          background: "#fafafa",
        }}
      >
        {(["login", "register"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "14px 0",
              fontSize: 13.5,
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? accent : "#94a3b8",
              background: activeTab === tab ? "#fff" : "transparent",
              border: "none",
              borderBottom: activeTab === tab ? `2px solid ${accent}` : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.02em",
              textTransform: "capitalize",
              fontFamily: "inherit",
            }}
          >
            {tab === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      {/* Form Body */}
      <div style={{ padding: "28px 32px 32px", flex: 1 }}>
        {activeTab === "login" ? (
          <LoginForm accent={accent} gradientBtn={gradientBtn} shadowBtn={shadowBtn} loginLink={loginLink} isCitizen={isCitizen} />
        ) : (
          <RegisterPrompt accent={accent} accentLight={accentLight} accentBorder={accentBorder} gradientBtn={gradientBtn} shadowBtn={shadowBtn} registerLink={registerLink} isCitizen={isCitizen} />
        )}
      </div>
    </div>
  );
}

/* ─── Inline Login Form ─────────────────────────────────────────── */
function LoginForm({
  accent,
  gradientBtn,
  shadowBtn,
  loginLink,
  isCitizen,
}: {
  accent: string;
  gradientBtn: string;
  shadowBtn: string;
  loginLink: string;
  isCitizen: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Brief description */}
      <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
        {isCitizen
          ? "Sign in to your citizen account to manage your queue tokens and bookings."
          : "Sign in to your admin dashboard to manage station queues and analytics."}
      </p>

      {/* Sign In button */}
      <Link
        href={loginLink}
        style={{
          display: "block",
          width: "100%",
          padding: "13px",
          background: gradientBtn,
          color: "#fff",
          fontWeight: 700,
          fontSize: 14.5,
          borderRadius: 10,
          textDecoration: "none",
          textAlign: "center",
          boxShadow: shadowBtn,
          transition: "opacity 0.15s, transform 0.1s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Sign In →
      </Link>

      <p style={{ textAlign: "center", fontSize: 12, color: "#cbd5e1", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
        <Lock size={12} color="#94a3b8" /> Secure login. Your data is protected.
      </p>
    </div>
  );
}

/* ─── Register Prompt ───────────────────────────────────────────── */
function RegisterPrompt({
  accent,
  accentLight,
  accentBorder,
  gradientBtn,
  shadowBtn,
  registerLink,
  isCitizen,
}: {
  accent: string;
  accentLight: string;
  accentBorder: string;
  gradientBtn: string;
  shadowBtn: string;
  registerLink: string;
  isCitizen: boolean;
}) {
  const features = isCitizen
    ? ["Real-time queue updates", "Priority booking slots", "SMS & push notifications"]
    : ["Live station analytics", "Digital queue management", "Fuel level monitoring"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {features.map((f) => (
          <div
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              background: accentLight,
              border: `1px solid ${accentBorder}`,
              borderRadius: 10,
              fontSize: 13,
              color: "#374151",
              fontWeight: 500,
            }}
          >
            <span style={{ color: accent, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center" }}>
              <CheckCircle2 size={15} color={accent} />
            </span>
            {f}
          </div>
        ))}
      </div>

      <Link
        href={registerLink}
        style={{
          display: "block",
          width: "100%",
          padding: "12px",
          background: gradientBtn,
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          borderRadius: 10,
          textDecoration: "none",
          textAlign: "center",
          boxShadow: shadowBtn,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {isCitizen ? "Create Citizen Account →" : "Register as Admin →"}
      </Link>

      <p style={{ textAlign: "center", fontSize: 12.5, color: "#94a3b8", margin: 0 }}>
        Free to join. No credit card required.
      </p>
    </div>
  );
}

/* ─── Shared Styles ─────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  display: "block",
  marginBottom: 5,
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function ChooseRolePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f0f4ff 0%, #e8edf8 50%, #f7f8fc 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 60px",
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 600 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 16px",
            borderRadius: 999,
            background: "#e8f0ff",
            border: "1px solid #c7d7ff",
            marginBottom: 20,
          }}
        >
          <span style={{ width: 7, height: 7, background: "#047857", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.12em", fontWeight: 700, color: "#1a56db", textTransform: "uppercase" }}>
            Digital Queueing Platform
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: 14,
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}
        >
          How will you use <span style={{ color: "#1a56db" }}>MyTurn?</span>
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 460, margin: "0 auto" }}>
          Choose your role to sign in or create an account. Skip the wait — your turn starts here.
        </p>
      </div>

      {/* Two Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 28,
          width: "100%",
          maxWidth: 840,
        }}
      >
        <RoleCard role="citizen" />
        <RoleCard role="admin" />
      </div>

      {/* Footer note */}
      <p style={{ marginTop: 36, fontSize: 12.5, color: "#94a3b8", textAlign: "center" }}>
        By continuing, you agree to MyTurn&apos;s{" "}
        <a href="/terms-of-service" style={{ color: "#1a56db", textDecoration: "none" }}>Terms</a>
        {" & "}
        <a href="/privacy-policy" style={{ color: "#1a56db", textDecoration: "none" }}>Privacy Policy</a>.
      </p>
    </div>
  );
}