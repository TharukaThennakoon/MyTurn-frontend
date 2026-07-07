"use client";

import React, { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

interface Station {
  id: string;
  name: string;
  address: string;
  status: "LIVE NOW" | "OPENING SOON" | "CLOSED";
  statusColor: string;
  fuel: { type: string; status: "AVAILABLE" | "LIMITED" | "BUSY" }[];
  waitTime: number;
  queueCount: number;
  flowVelocity: number;
  availableSlots: number;
  distance: string;
}

const STATIONS: Station[] = [
  {
    id: "vanguard-east",
    name: "Vanguard Station East",
    address: "42nd Digital Avenue, Sector 7",
    status: "LIVE NOW",
    statusColor: "#22c55e",
    fuel: [
      { type: "95 Octane", status: "AVAILABLE" },
      { type: "Diesel Pro", status: "LIMITED" },
    ],
    waitTime: 12,
    queueCount: 8,
    flowVelocity: 68,
    availableSlots: 2,
    distance: "2.3 km",
  },
  {
    id: "nexus-central",
    name: "Nexus Central Hub",
    address: "156 Commerce Plaza, Downtown",
    status: "LIVE NOW",
    statusColor: "#22c55e",
    fuel: [
      { type: "Premium Petrol", status: "AVAILABLE" },
      { type: "Ultra Diesel", status: "AVAILABLE" },
    ],
    waitTime: 18,
    queueCount: 12,
    flowVelocity: 52,
    availableSlots: 4,
    distance: "3.1 km",
  },
  {
    id: "horizon-west",
    name: "Horizon West Terminal",
    address: "789 Industrial Park, West Zone",
    status: "LIVE NOW",
    statusColor: "#22c55e",
    fuel: [
      { type: "95 Octane", status: "AVAILABLE" },
      { type: "Diesel Pro", status: "BUSY" },
    ],
    waitTime: 22,
    queueCount: 15,
    flowVelocity: 35,
    availableSlots: 1,
    distance: "4.5 km",
  },
];

export default function StationsPage() {
  const [selectedStationId, setSelectedStationId] = useState(STATIONS[0].id);

  const selectedStation = STATIONS.find((s) => s.id === selectedStationId) || STATIONS[0];

  return (
    <div style={styles.shell}>
      <DashboardTopbar />

      <main style={styles.main}>
        {/* Map view — station-hero.jpg background */}
        <div style={styles.mapContainer}>
          <div style={styles.mapPlaceholder}>
            {/* Hero photo */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundImage: "url('/images/station-hero.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Dark overlay so badges stay readable */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background:
                  "linear-gradient(to bottom, rgba(10,20,40,0.45) 0%, rgba(10,20,40,0.25) 60%, rgba(10,20,40,0.55) 100%)",
              }}
            />

            {/* Status badge */}
            <div style={styles.mapBadge}>
              <span style={{ ...styles.statusDot, background: selectedStation.statusColor }} />
              <span style={styles.badgeText}>{selectedStation.status}</span>
            </div>

            {/* Station name overlay */}
            <div style={styles.mapStationLabel}>
              <p style={styles.mapStationName}>{selectedStation.name}</p>
              <p style={styles.mapStationAddr}>📍 {selectedStation.address}</p>
            </div>

            {/* Zoom button */}
            <button style={styles.zoomBtn} aria-label="Zoom map">◎</button>
          </div>
        </div>


        {/* Station info */}
        <div style={styles.infoSection}>
          <h2 style={styles.stationName}>{selectedStation.name}</h2>
          <p style={styles.stationAddress}>
            <span style={styles.pinIcon}>📍</span>
            {selectedStation.address}
          </p>

          {/* Metrics row */}
          <div style={styles.metricsRow}>
            <div style={styles.metric}>
              <p style={styles.metricLabel}>AVAILABILITY</p>
              {selectedStation.fuel.map((f) => (
                <p key={f.type} style={styles.fuelItem}>
                  {f.type}
                  <span
                    style={{
                      ...styles.fuelBadge,
                      background:
                        f.status === "AVAILABLE"
                          ? "#86efac"
                          : f.status === "LIMITED"
                            ? "#fcd34d"
                            : "#fed7aa",
                    }}
                  >
                    {f.status}
                  </span>
                </p>
              ))}
            </div>

            <div style={styles.waitCard}>
              <p style={styles.waitLabel}>WAIT TIME</p>
              <p style={styles.waitTime}>{selectedStation.waitTime}</p>
              <p style={styles.waitSub}>MINUTES</p>
            </div>

            <div style={styles.metric}>
              <p style={styles.metricLabel}>QUEUE</p>
              <p style={styles.queueValue}>{selectedStation.queueCount}</p>
              <p style={styles.queueSub}>VEHICLES</p>
            </div>
          </div>

          {/* Queue flow */}
          <div style={styles.flowSection}>
            <div style={styles.flowHeader}>
              <p style={styles.flowLabel}>QUEUE FLOW VELOCITY</p>
              <p style={styles.flowValue}>Expected throughput: 4.2 v/hr</p>
            </div>
            <div style={styles.flowBar}>
              <div
                style={{
                  ...styles.flowBarFill,
                  width: `${selectedStation.flowVelocity}%`,
                }}
              />
            </div>
            <div style={styles.flowLabels}>
              <span>LOW TRAFFIC</span>
              <span>PEAK FLOW</span>
            </div>
          </div>

          {/* Available slots */}
          <div style={styles.slotsSection}>
            <h3 style={styles.slotsTitle}>Available Slots</h3>
            <div style={styles.slotsList}>
              {[
                { time: "14:15", status: "Selected", isFull: false },
                { time: "14:45", status: "3 Left", isFull: false },
                { time: "15:15", status: "Full", isFull: true },
              ].map((slot) => (
                <button
                  key={slot.time}
                  style={{
                    ...styles.slotCard,
                    ...(slot.status === "Selected" ? styles.slotCardSelected : {}),
                    ...(slot.isFull ? styles.slotCardFull : {}),
                  }}
                >
                  <span style={styles.slotTime}>{slot.time}</span>
                  <span style={styles.slotStatus}>{slot.status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Policy info */}
          <div style={styles.policySection}>
            <span style={styles.policyIcon}>ℹ</span>
            <div>
              <p style={styles.policyTitle}>BOOKING POLICY</p>
              <p style={styles.policyText}>
                Arrival window is 10 minutes. Slots not claimed within this period will be
                released to the general queue.
              </p>
            </div>
          </div>
        </div>

        {/* Stations list */}
        <div style={styles.listSection}>
          <h3 style={styles.listTitle}>Other Nearby Stations</h3>
          <div style={styles.stationsList}>
            {STATIONS.map((station) => (
              <button
                key={station.id}
                onClick={() => setSelectedStationId(station.id)}
                style={{
                  ...styles.stationCard,
                  ...(selectedStationId === station.id ? styles.stationCardActive : {}),
                }}
              >
                <div style={styles.cardTop}>
                  <div>
                    <h4 style={styles.cardName}>{station.name}</h4>
                    <p style={styles.cardDistance}>{station.distance}</p>
                  </div>
                  <div style={styles.cardMeta}>
                    <p style={styles.cardWait}>{station.waitTime} min</p>
                    <p style={styles.cardQueue}>{station.queueCount} vehicles</p>
                  </div>
                </div>
                <div style={styles.cardFuel}>
                  {station.fuel.map((f) => (
                    <span key={f.type} style={styles.cardFuelTag}>
                      {f.type.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <DashboardBottomNav active="stations" />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  main: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: 12,
  },
  mapContainer: {
    width: "100%",
    height: 260,
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.1)",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    background: "#1a3a47",
  },
  mapStationLabel: {
    position: "absolute",
    bottom: 52,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  mapStationName: {
    margin: "0 0 2px",
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
  },
  mapStationAddr: {
    margin: 0,
    fontSize: 13.5,
    color: "rgba(255,255,255,0.8)",
    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },
  mapBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
  },
  badgeText: {
    fontSize: 13.5,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "0.05em",
  },
  zoomBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    padding: "20px 20px 0",
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
  },
  stationName: {
    fontSize: 26,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 8px",
    letterSpacing: "-0.01em",
  },
  stationAddress: {
    fontSize: 15.5,
    color: "#64748b",
    margin: "0 0 16px",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  pinIcon: {
    fontSize: 16,
  },
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 180px 1fr",
    gap: 16,
    marginBottom: 20,
  },
  metric: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 18px",
    border: "1px solid #e2e8f0",
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: "0 0 8px",
  },
  fuelItem: {
    fontSize: 15,
    fontWeight: 600,
    color: "#0f172a",
    margin: "4px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  fuelBadge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 4,
    color: "#0f172a",
    letterSpacing: "0.05em",
  },
  waitCard: {
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    borderRadius: 12,
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
  },
  waitLabel: {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.1em",
    margin: "0 0 4px",
    opacity: 0.9,
  },
  waitTime: {
    fontSize: 32,
    fontWeight: 800,
    margin: 0,
    lineHeight: 1,
  },
  waitSub: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    margin: "2px 0 0",
    opacity: 0.85,
  },
  queueValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 2px",
    lineHeight: 1,
  },
  queueSub: {
    fontSize: 11.5,
    fontWeight: 600,
    color: "#94a3b8",
    margin: 0,
  },
  flowSection: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 18px",
    border: "1px solid #e2e8f0",
    marginBottom: 16,
  },
  flowHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  flowLabel: {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: 0,
  },
  flowValue: {
    fontSize: 13.5,
    fontWeight: 600,
    color: "#64748b",
    margin: 0,
  },
  flowBar: {
    width: "100%",
    height: 6,
    background: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  flowBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
    borderRadius: 4,
  },
  flowLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#94a3b8",
  },
  slotsSection: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 22px",
    border: "1px solid #e2e8f0",
    marginBottom: 16,
  },
  slotsTitle: {
    fontSize: 16.5,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 12px",
  },
  slotsList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  slotCard: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: "14px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  slotCardSelected: {
    background: "#eff6ff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#2563eb",
  },
  slotCardFull: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  slotTime: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
  },
  slotStatus: {
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
  },
  policySection: {
    background: "#eff6ff",
    borderRadius: 12,
    padding: "14px 16px",
    border: "1px solid #dbeafe",
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  policyIcon: {
    width: 24,
    height: 24,
    background: "#2563eb",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13.5,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 2,
  },
  policyTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#1e40af",
    margin: "0 0 4px",
  },
  policyText: {
    fontSize: 13.5,
    color: "#1e40af",
    margin: 0,
    lineHeight: 1.4,
  },
  listSection: {
    padding: "0 20px 24px",
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
  },
  listTitle: {
    fontSize: 16.5,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 12px",
  },
  stationsList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  stationCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "16px 18px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  stationCardActive: {
    background: "#eff6ff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#2563eb",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16.5,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  cardDistance: {
    fontSize: 13.5,
    color: "#64748b",
    margin: 0,
  },
  cardMeta: {
    textAlign: "right",
  },
  cardWait: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 2px",
  },
  cardQueue: {
    fontSize: 13,
    color: "#64748b",
    margin: 0,
  },
  cardFuel: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  cardFuelTag: {
    fontSize: 12.5,
    fontWeight: 700,
    background: "#dbeafe",
    color: "#1e40af",
    padding: "5px 10px",
    borderRadius: 4,
  },
};
