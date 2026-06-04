"use client";

import React from "react";
import dynamic from "next/dynamic";

export interface StationOption {
  id: string;
  name: string;
  address: string;
  status: "AVAILABLE" | "BUSY";
  waitMin: number;
  driveMin: number;
}

interface BookingSelectStationProps {
  stations: StationOption[];
  selectedId: string | null;
  onSelect: (station: StationOption) => void;
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
}

// Dynamically import to avoid SSR issues with Leaflet (needs window/document)
const StationMap = dynamic(() => import("@/components/dashboard/booking/StationMap"), { ssr: false });

export default function BookingSelectStation({
  stations,
  selectedId,
  onSelect,
  viewMode,
  onViewModeChange,
}: BookingSelectStationProps) {
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <div>
          <p style={styles.stepTag}>STEP 1</p>
          <h2 style={styles.title}>Select Station</h2>
        </div>
        <div style={styles.toggle}>
          <button
            type="button"
            style={{
              ...styles.toggleBtn,
              ...(viewMode === "list" ? styles.toggleBtnActive : {}),
            }}
            onClick={() => onViewModeChange("list")}
          >
            ☰ List
          </button>
          <button
            type="button"
            style={{
              ...styles.toggleBtn,
              ...(viewMode === "map" ? styles.toggleBtnActive : {}),
            }}
            onClick={() => onViewModeChange("map")}
          >
            🗺 Map
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div style={styles.grid}>
          {stations.map((station) => {
            const selected = station.id === selectedId;
            return (
              <button
                key={station.id}
                type="button"
                style={{
                  ...styles.card,
                  ...(selected ? styles.cardSelected : {}),
                }}
                onClick={() => onSelect(station)}
              >
                <div style={styles.cardTop}>
                  <div style={styles.iconBox}>⛽</div>
                  <div style={styles.cardInfo}>
                    <p style={styles.cardName}>{station.name}</p>
                    <p style={styles.cardAddress}>{station.address}</p>
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      ...(station.status === "AVAILABLE"
                        ? styles.badgeAvailable
                        : styles.badgeBusy),
                    }}
                  >
                    {station.status}
                  </span>
                </div>
                <div style={styles.metrics}>
                  <div style={styles.metric}>
                    <span style={styles.metricLabel}>Wait Time</span>
                    <span style={styles.metricValue}>
                      {station.waitMin} mins
                    </span>
                  </div>
                  <div style={styles.metric}>
                    <span style={styles.metricLabel}>Distance</span>
                    <span style={styles.metricValue}>
                      {station.driveMin} min drive
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <StationMap
          stations={stations}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )}
    </section>
  );
}


const styles: Record<string, React.CSSProperties> = {
  section: { marginBottom: 32 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 16,
  },
  stepTag: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#2563eb",
    marginBottom: 4,
  },
  title: { fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 },
  toggle: {
    display: "flex",
    background: "#f1f5f9",
    borderRadius: 8,
    padding: 3,
    gap: 2,
  },
  toggleBtn: {
    border: "none",
    background: "transparent",
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    borderRadius: 6,
    cursor: "pointer",
  },
  toggleBtnActive: {
    background: "#fff",
    color: "#0f172a",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  card: {
    textAlign: "left",
    background: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 16,
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  cardSelected: {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 1px #2563eb",
  },
  cardTop: { display: "flex", gap: 12, marginBottom: 14 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  cardInfo: { flex: 1, minWidth: 0 },
  cardName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  cardAddress: { fontSize: 11, color: "#64748b", margin: 0 },
  badge: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "4px 8px",
    borderRadius: 6,
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  badgeAvailable: { background: "#dcfce7", color: "#15803d" },
  badgeBusy: { background: "#fef3c7", color: "#a16207" },
  metrics: { display: "flex", gap: 10 },
  metric: {
    flex: 1,
    background: "#f8fafc",
    borderRadius: 8,
    padding: "10px 12px",
  },
  metricLabel: {
    display: "block",
    fontSize: 10,
    color: "#94a3b8",
    marginBottom: 2,
  },
  metricValue: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  mapPlaceholder: {
    background: "#f1f5f9",
    borderRadius: 14,
    padding: 48,
    textAlign: "center",
    border: "2px dashed #cbd5e1",
  },
  mapIcon: { fontSize: 32, display: "block", marginBottom: 8 },
  mapText: { fontSize: 13, color: "#64748b", margin: 0 },
};
