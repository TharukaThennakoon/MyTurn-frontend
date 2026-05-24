"use client";

import React from "react";

interface SmartPickProps {
  stationName: string;
  description: string;
  waitTimeLabel: string;
  waitTimeValue: string;
  distance: string;
  onBook?: () => void;
}

export default function SmartPick({
  stationName,
  description,
  waitTimeLabel,
  waitTimeValue,
  distance,
  onBook,
}: SmartPickProps) {
  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.spark}>✦</span>
        <span style={styles.headerText}>Best station for you</span>
      </div>

      {/* Station name */}
      <h3 style={styles.stationName}>{stationName}</h3>
      <p style={styles.description}>{description}</p>

      {/* Wait time */}
      <div style={styles.stat}>
        <span style={styles.statLabel}>{waitTimeLabel}</span>
        <div style={styles.progressTrack}>
          <div style={styles.progressBar} />
        </div>
        <span style={styles.statValue}>{waitTimeValue}</span>
      </div>

      {/* Distance */}
      <div style={styles.stat}>
        <span style={styles.statLabel}>Distance</span>
        <span style={{ flex: 1 }} />
        <span style={styles.distanceValue}>{distance}</span>
      </div>

      {/* CTA */}
      <button style={styles.bookBtn} onClick={onBook}>
        Book Best Option
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: 14,
    padding: "20px 20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 220,
    maxWidth: 240,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  spark: {
    color: "#f59e0b",
    fontSize: 14,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 700,
    color: "#f59e0b",
    letterSpacing: "0.03em",
  },
  stationName: {
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.1,
    letterSpacing: "-0.3px",
  },
  description: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 1.5,
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    width: 72,
    flexShrink: 0,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    background: "#e2e8f0",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressBar: {
    width: "25%",
    height: "100%",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    borderRadius: 99,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2563eb",
    whiteSpace: "nowrap",
  },
  distanceValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
  },
  bookBtn: {
    marginTop: 6,
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "11px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
    transition: "transform 0.15s, box-shadow 0.15s",
    width: "100%",
  },
};
