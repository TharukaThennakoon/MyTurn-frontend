"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavTab = "home" | "stations" | "bookings" | "profile";

interface DashboardBottomNavProps {
  active?: NavTab;
}

const TABS: { id: NavTab; icon: string; label: string; href: string }[] = [
  { id: "home", icon: "⌂", label: "HOME", href: "/dashboard" },
  { id: "stations", icon: "▦", label: "STATIONS", href: "/dashboard" },
  { id: "bookings", icon: "📋", label: "BOOKINGS", href: "/dashboard/bookings" },
  { id: "profile", icon: "👤", label: "PROFILE", href: "/dashboard" },
];

function tabFromPath(pathname: string): NavTab {
  if (pathname.startsWith("/dashboard/bookings")) return "bookings";
  return "home";
}

export default function DashboardBottomNav({ active }: DashboardBottomNavProps) {
  const pathname = usePathname();
  const current = active ?? tabFromPath(pathname);

  return (
    <nav style={styles.nav}>
      {TABS.map((t) => {
        const isActive = t.id === current;
        return (
          <Link
            key={t.id}
            href={t.href}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
              textDecoration: "none",
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
            {isActive && <span style={styles.tabLabel}>{t.label}</span>}
          </Link>
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
