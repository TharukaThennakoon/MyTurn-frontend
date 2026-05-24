"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavTab = "home" | "stations" | "bookings" | "profile";

interface DashboardBottomNavProps {
  active?: NavTab;
}

const ACTIVE_COLOR = "#1d4ed8";
const INACTIVE_COLOR = "#94a3b8";

const TABS: { id: NavTab; label: string; href: string }[] = [
  { id: "home", label: "HOME", href: "/dashboard" },
  { id: "stations", label: "STATIONS", href: "/dashboard/stations" },
  { id: "bookings", label: "BOOKINGS", href: "/dashboard/bookings" },
  { id: "profile", label: "PROFILE", href: "/dashboard/profile" },
];

function tabFromPath(pathname: string): NavTab {
  if (pathname.startsWith("/dashboard/bookings")) return "bookings";
  if (pathname.startsWith("/dashboard/stations")) return "stations";
  if (pathname.startsWith("/dashboard/profile")) return "profile";
  return "home";
}

function HomeIcon({ active }: { active: boolean }) {
  const fill = active ? ACTIVE_COLOR : "none";
  const stroke = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
          fill={fill}
        />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StationsIcon({ active }: { active: boolean }) {
  const stroke = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4h8v16H6V4z"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14 8h4l2 3v9"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9v3M9 15v2"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect
        x="7"
        y="6"
        width="6"
        height="3"
        rx="0.5"
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BookingsIcon({ active }: { active: boolean }) {
  const stroke = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        rx="2"
        stroke={stroke}
        strokeWidth="1.75"
      />
      <path
        d="M12 6v12"
        stroke={stroke}
        strokeWidth="1.75"
        strokeDasharray="2 2"
      />
      <circle cx="8.5" cy="12" r="1.25" fill={stroke} />
      <circle cx="15.5" cy="12" r="1.25" fill={stroke} />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const stroke = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke={stroke} strokeWidth="1.75" />
      <path
        d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavIcon({ tab, active }: { tab: NavTab; active: boolean }) {
  switch (tab) {
    case "home":
      return <HomeIcon active={active} />;
    case "stations":
      return <StationsIcon active={active} />;
    case "bookings":
      return <BookingsIcon active={active} />;
    case "profile":
      return <ProfileIcon active={active} />;
  }
}

export default function DashboardBottomNav({ active }: DashboardBottomNavProps) {
  const pathname = usePathname();
  const current = active ?? tabFromPath(pathname);

  return (
    <nav style={styles.nav}>
      {TABS.map((t) => {
        const isActive = t.id === current;
        const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <Link
            key={t.id}
            href={t.href}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
              textDecoration: "none",
            }}
            aria-current={isActive ? "page" : undefined}
          >
            <span style={styles.iconWrap}>
              <NavIcon tab={t.id} active={isActive} />
            </span>
            <span style={{ ...styles.tabLabel, color }}>{t.label}</span>
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
    padding: "10px 12px 14px",
    background: "#f8fafc",
    borderTop: "1px solid #e8edf2",
    borderRadius: "20px 20px 0 0",
    position: "sticky",
    bottom: 0,
    zIndex: 50,
    boxShadow: "0 -4px 16px rgba(15, 23, 42, 0.04)",
  },
  tab: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: 14,
    transition: "background 0.2s ease",
    minWidth: 72,
    flex: 1,
    maxWidth: 100,
  },
  tabActive: {
    background: "#dbeafe",
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.08em",
    lineHeight: 1,
  },
};
