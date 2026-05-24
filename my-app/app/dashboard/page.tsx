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
  { icon: "⊙", label: "AVG FLOW", value: "Fast" },
  { icon: "⏱", label: "PEAK HOURS", value: "6-9PM" },
];

export default function DashboardPage() {
  return (
    <div style={styles.page}>
      <DashboardTopbar />

      <div style={styles.main}>
        <div style={styles.content}>
          <ActiveAppointmentCard 
            tokenNumber={1234}
            status="Active"
            stationName="Velocity Central Hub"
            timeRange="Today, 10:45 AM - 11:00 AM"
            arrivalMins={12}
          />
          <SmartPick 
            stationName="Velocity Central Hub"
            description="4.2 km • Downtown District"
            waitTimeLabel="Wait Time"
            waitTimeValue="8 mins"
            distance="4.2 km"
          />
          <NearbyStations stations={NEARBY_STATIONS} />
          <QuickInsights insights={QUICK_INSIGHTS} />
        </div>
      </div>

      <DashboardBottomNav />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#f8fafc",
  },
  main: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    overflowY: "auto",
  },
};
