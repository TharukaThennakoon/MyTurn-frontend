"use client";

import React from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import ActiveAppointmentCard from "@/components/dashboard/ActiveAppointmentCard";
import SmartPick from "@/components/dashboard/SmartPick";
import NearbyStations from "@/components/dashboard/NearbyStations";
import QuickInsights from "@/components/dashboard/QuickInsights";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

// ─── Static mock data ────────────────────────────────────────────────────────
const NEARBY_STATIONS = [
  {
    id: "ws",
    name: "West Side Plaza",
    distance: "0.8 km",
    status: "OPTIMAL" as const,
    waitMin: 8,
    queueSize: 6,
    queueLabel: "LOW",
    icon: "▦",
    iconBg: "#d1fae5",
  },
  {
    id: "ew",
    name: "Express Way Point",
    distance: "2.4 km",
    status: "BUSY" as const,
    waitMin: 22,
    queueSize: 6,
    queueLabel: "MED",
    icon: "▦",
    iconBg: "#fef3c7",
  },
  {
    id: "dc",
    name: "Downtown Core",
    distance: "3.1 km",
    status: "HIGH" as const,
    waitMin: 45,
    queueSize: 6,
    queueLabel: "HIGH",
    icon: "▦",
    iconBg: "#fee2e2",
  },
];

const QUICK_INSIGHTS = [
  { icon: "▦", label: "AVAILABILITY", value: "92%" },
  { icon: "⊙", label: "AVG FLOW",     value: "Fast"  },
  { icon: "↗", label: "PEAK HOUR",    value: "7:00 PM" },
  { icon: "▣", label: "REGIONS",      value: "12" },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function UserDashboard() {
  return (
    <div style={styles.shell}>
      {/* Top bar */}
      <DashboardTopbar />

      {/* Scrollable body */}
      <main style={styles.body}>
        {/* Active appointment */}
        <ActiveAppointmentCard
          tokenNumber={145}
          status="Active"
          stationName="Central Hub Station"
          timeRange="5:30 PM – 5:45 PM Today"
          arrivalMins={20}
        />

        {/* Smart Pick + Nearby Stations – side by side */}
        <div style={styles.midRow}>
          {/* Smart Pick panel */}
          <div style={styles.smartPickWrapper}>
            <p style={styles.sectionLabel}>SMART PICK</p>
            <SmartPick
              stationName="North Creek Terminal"
              description="Based on your current location and real-time traffic data."
              waitTimeLabel="Wait Time"
              waitTimeValue="~5 mins"
              distance="1.2 km"
            />
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Nearby stations panel */}
          <div style={styles.nearbyWrapper}>
            <NearbyStations stations={NEARBY_STATIONS} />
          </div>
        </div>

        {/* Quick Insights */}
        <QuickInsights insights={QUICK_INSIGHTS} />
      </main>

      {/* Bottom nav */}
      <DashboardBottomNav active="home" />
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "18px 18px 8px",
    display: "flex",
    flexDirection: "column",
  },
  midRow: {
    display: "flex",
    gap: 0,
    border: "1.5px dashed #2563eb",
    borderRadius: 14,
    overflow: "hidden",
  },
  smartPickWrapper: {
    padding: "14px 18px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#fff",
    flexShrink: 0,
  },
  divider: {
    width: 1,
    background: "#dbeafe",
    alignSelf: "stretch",
  },
  nearbyWrapper: {
    flex: 1,
    padding: "14px 18px 18px",
    background: "#fff",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#64748b",
  },
};
