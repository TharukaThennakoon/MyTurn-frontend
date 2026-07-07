"use client";

import React from "react";

interface DashboardTopbarProps {
  userName?: string;
  avatarUrl?: string;
  onHistory?: () => void;
  onNotifications?: () => void;
}

export default function DashboardTopbar({
  onHistory,
  onNotifications,
}: DashboardTopbarProps) {
  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo}>
        <img src="/images/logo.svg" alt="MyTurn Logo" style={{ height: "30px", width: "auto" }} />
        <span style={styles.logoText}>
          <span style={{ color: "#2563eb" }}>My</span>
          <span style={{ color: "#0f172a" }}>Turn</span>
        </span>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.iconBtn} onClick={onHistory} title="History">
          <svg width="20" height="20" fill="none" stroke="#475569" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.05 11A9 9 0 1 1 3 13" strokeLinecap="round" />
            <path d="M3 7v4h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button style={styles.iconBtn} onClick={onNotifications} title="Notifications">
          <span style={styles.notifWrapper}>
            <svg width="20" height="20" fill="none" stroke="#475569" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={styles.notifDot} />
          </span>
        </button>

        {/* Avatar */}
        <div style={styles.avatar}>
          <span style={styles.avatarEmoji}>👤</span>
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: 60,
    background: "rgba(255, 255, 255, 0.72)",
    backdropFilter: "blur(14px) saturate(180%)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    borderRadius: 16,
    position: "sticky",
    top: 12,
    margin: "12px 16px 0",
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01)",
    transition: "all 0.3s ease",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 800,
    color: "#2563eb",
    letterSpacing: "-0.5px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },
  notifWrapper: {
    position: "relative",
    display: "inline-flex",
  },
  notifDot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    background: "#ef4444",
    borderRadius: "50%",
    border: "1.5px solid #fff",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    border: "2px solid #e2e8f0",
  },
  avatarEmoji: {
    fontSize: 16,
    filter: "brightness(0) invert(1)",
  },
};
