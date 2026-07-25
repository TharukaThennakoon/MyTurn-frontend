"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardTopbarProps {
  userName?: string;
  avatarUrl?: string;
  onHistory?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

export default function DashboardTopbar({
  userName,
  onHistory,
  onNotifications,
  onProfile,
}: DashboardTopbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [userData, setUserData] = useState({
    name: "Driver",
    email: "",
    phone: "",
    vehicleNumber: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserData({
          name: parsed.name || parsed.fullName || "Driver",
          email: parsed.email || "",
          phone: parsed.phone || "Not specified",
          vehicleNumber: parsed.vehicleNumber || "Not registered",
        });
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHistoryClick = () => {
    if (onHistory) {
      onHistory();
    } else {
      setShowHistory(!showHistory);
      setShowNotifications(false);
      setShowProfile(false);
    }
  };

  const handleNotificationsClick = () => {
    if (onNotifications) {
      onNotifications();
    } else {
      setShowNotifications(!showNotifications);
      setShowHistory(false);
      setShowProfile(false);
    }
  };

  const handleProfileClick = () => {
    if (onProfile) {
      onProfile();
    } else {
      setShowProfile(!showProfile);
      setShowHistory(false);
      setShowNotifications(false);
    }
  };

  return (
    <header
      style={{
        ...styles.header,
        width: scrolled ? "min(580px, calc(100% - 32px))" : "calc(100% - 32px)",
        borderRadius: scrolled ? "999px" : "16px",
        top: scrolled ? "16px" : "12px",
        margin: scrolled ? "12px auto 0" : "12px 16px 0",
        background: scrolled ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.72)",
        boxShadow: scrolled ? "0 10px 30px rgba(0, 0, 0, 0.08)" : "0 4px 20px rgba(0, 0, 0, 0.03)",
      }}
    >
      {/* Clickable Logo and Words linking to Landing Screen */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", cursor: "pointer" }}>
        <img src="/images/logo.svg" alt="MyTurn Logo" style={{ height: "30px", width: "auto" }} />
        <span style={styles.logoText}>
          <span style={{ color: "#2563eb" }}>My</span>
          <span style={{ color: "#0f172a" }}>Turn</span>
        </span>
      </Link>

      {/* Actions container with relative positioning for dropdown overlays */}
      <div style={actionsContainerStyle}>
        <button style={styles.iconBtn} onClick={handleHistoryClick} title="History">
          <svg width="20" height="20" fill="none" stroke="#475569" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.05 11A9 9 0 1 1 3 13" strokeLinecap="round" />
            <path d="M3 7v4h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button style={styles.iconBtn} onClick={handleNotificationsClick} title="Notifications">
          <span style={styles.notifWrapper}>
            <svg width="20" height="20" fill="none" stroke="#475569" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={styles.notifDot} />
          </span>
        </button>

        {/* Profile Greeting Rounded Responsive Box */}
        <span style={greetingBoxStyle}>
          Hii {userData.name.split(" ")[0] || "Driver"}
        </span>

        {/* Avatar */}
        <div style={styles.avatar} onClick={handleProfileClick} role="button" tabIndex={0} aria-label="Profile">
          <span style={styles.avatarEmoji}>👤</span>
        </div>

        {/* ── History Dropdown ── */}
        {showHistory && (
          <>
            <div style={backdropStyle} onClick={() => setShowHistory(false)} />
            <div style={dropdownStyle}>
              <div style={dropdownHeaderStyle}>
                <span style={{ fontSize: 16 }}>⏱️</span>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 14.5 }}>Queue History</span>
              </div>
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8, maxHeight: 270, overflowY: "auto" }}>
                {[
                  { station: "Central Hub Station", date: "June 28, 2026", fuel: "Petrol", token: "#102", status: "COMPLETED" },
                  { station: "West Side Plaza", date: "June 15, 2026", fuel: "Diesel", token: "#84", status: "COMPLETED" },
                  { station: "Express Way Point", date: "May 30, 2026", fuel: "Petrol", token: "#51", status: "COMPLETED" }
                ].map((item, i) => (
                  <div key={i} style={historyItemStyle}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a", margin: 0 }}>{item.station}</p>
                      <p style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>{item.date} · {item.fuel}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", background: "#eff6ff", padding: "2px 6px", borderRadius: 4 }}>Token {item.token}</span>
                      <span style={{ display: "block", fontSize: 9.5, fontWeight: 800, color: "#16a34a", marginTop: 4 }}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Notifications Dropdown ── */}
        {showNotifications && (
          <>
            <div style={backdropStyle} onClick={() => setShowNotifications(false)} />
            <div style={dropdownStyle}>
              <div style={dropdownHeaderStyle}>
                <span style={{ fontSize: 16 }}>🔔</span>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 14.5 }}>Notifications</span>
              </div>
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8, maxHeight: 270, overflowY: "auto" }}>
                {[
                  { title: "⛽ Booking Confirmed", desc: "Your booking at Central Hub Station is confirmed.", time: "10m ago", active: true },
                  { title: "🚗 Turn Approaching", desc: "You are next in queue. Please arrive at the station gate.", time: "1h ago", active: true },
                  { title: "📱 Profile Verified", desc: "Your driver license was verified successfully.", time: "1d ago", active: false }
                ].map((item, i) => (
                  <div key={i} style={{ ...historyItemStyle, borderLeft: item.active ? "4px solid #2563eb" : "1px solid #e2e8f0", paddingLeft: item.active ? 10 : 12 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", margin: 0 }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: "#64748b", marginTop: 2, lineHeight: 1.4 }}>{item.desc}</p>
                    </div>
                    <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Profile Dropdown ── */}
        {showProfile && (
          <>
            <div style={backdropStyle} onClick={() => setShowProfile(false)} />
            <div style={dropdownStyle}>
              <div style={dropdownHeaderStyle}>
                <span style={{ fontSize: 16 }}>👤</span>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 14.5 }}>Driver Profile</span>
              </div>
              <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Profile card preview */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    👤
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a", margin: 0 }}>{userData.name || "Driver"}</h4>
                    <span style={{ fontSize: 9.5, fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: 4, marginTop: 2, display: "inline-block" }}>✓ VERIFIED</span>
                  </div>
                </div>

                {/* Minimal Details */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#64748b" }}>Email:</span>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{userData.email || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#64748b" }}>Phone:</span>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{userData.phone || "Not specified"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#64748b" }}>Vehicle Tag:</span>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{userData.vehicleNumber || "Not registered"}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <Link
                  href="/choose-role"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    background: "#fee2e2",
                    border: "1px solid #fecaca",
                    color: "#991b1b",
                    fontWeight: 700,
                    fontSize: 13,
                    borderRadius: 8,
                    textDecoration: "none",
                    textAlign: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fca5a5"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fee2e2"; }}
                >
                  Log Out
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
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
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
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

const actionsContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  position: "relative",
};

const greetingBoxStyle: React.CSSProperties = {
  fontSize: 14.5,
  fontWeight: 700,
  color: "#2563eb",
  background: "rgba(37, 99, 235, 0.08)",
  padding: "6px 14px",
  borderRadius: "99px",
  marginRight: 6,
  marginLeft: 6,
  display: "inline-flex",
  alignItems: "center",
  whiteSpace: "nowrap",
};

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "transparent",
  zIndex: 9990,
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 12px)",
  right: 0,
  width: "min(360px, calc(100vw - 32px))",
  background: "#fff",
  borderRadius: "16px",
  border: "1px solid rgba(226, 232, 240, 0.9)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  zIndex: 9991,
  overflow: "hidden",
  animation: "fadeInUp 0.2s ease-out",
};

const dropdownHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderBottom: "1px solid #f1f5f9",
  background: "#f8fafc",
};

const historyItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  gap: 12,
};
