"use client";

import React, { useState } from "react";

type NavTab = "home" | "stations" | "bookings" | "profile";

interface DashboardBottomNavProps {
  active?: NavTab;
  onChange?: (tab: NavTab) => void;
}

const TABS: { id: NavTab; icon: string; label: string }[] = [
  { id: "home",     icon: "⌂",   label: "HOME"     },
  { id: "stations", icon: "▦",   label: "STATIONS" },
  { id: "bookings", icon: "📋",  label: "BOOKINGS" },
  { id: "profile",  icon: "👤",  label: "PROFILE"  },
];

export default function DashboardBottomNav({
  active = "home",
  onChange,
}: DashboardBottomNavProps) {
  const [current, setCurrent] = useState<NavTab>(active);

  const handleClick = (tab: NavTab) => {
    setCurrent(tab);
    onChange?.(tab);
  };

  return (
    <nav style={styles.nav}>
      {TABS.map((t) => {
        const isActive = t.id === current;
        return (
          <button
            key={t.id}
            onClick={() => handleClick(t.id)}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
            }}
          >
            <span
              style={{
                ...styles.tabIcon,
                ...(isActive ? styles.tabIconActive : {}),
              }}
            >
              {t.icon}
            </span>
            {isActive && (
              <span style={styles.tabLabel}>{t.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px 16px",
    background: "#fff",
    borderTop: "1px solid #e2e8f0",
    position: "sticky",
    bottom: 0,
    zIndex: 50,
  },
  tab: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 14px",
    borderRadius: 12,
    transition: "background 0.18s",
    minWidth: 64,
  },
  tabActive: {
    background: "#eff6ff",
  },
  tabIcon: {
    fontSize: 20,
    color: "#94a3b8",
    lineHeight: 1,
  },
  tabIconActive: {
    color: "#2563eb",
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#2563eb",
  },
};
