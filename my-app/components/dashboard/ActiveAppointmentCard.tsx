"use client";

import React from "react";

interface ActiveAppointmentCardProps {
  tokenNumber: number;
  status: "Active" | "Pending" | "Completed";
  stationName: string;
  timeRange: string;
  arrivalMins: number;
}

export default function ActiveAppointmentCard({
  tokenNumber,
  status,
  stationName,
  timeRange,
  arrivalMins,
}: ActiveAppointmentCardProps) {
  return (
    <section style={styles.wrapper}>
      <p style={styles.sectionLabel}>ACTIVE APPOINTMENT</p>
      <div style={styles.card}>
        {/* Left content */}
        <div style={styles.left}>
          <div style={styles.tokenRow}>
            <span style={styles.tokenBadge}>TOKEN #{tokenNumber}</span>
            <span style={styles.activeDot} />
            <span style={styles.activeLabel}>{status}</span>
          </div>
          <h2 style={styles.stationName}>{stationName}</h2>
          <p style={styles.timeRange}>
            <span style={styles.clockIcon}>⊙</span> {timeRange}
          </p>
          <div style={styles.actions}>
            <button style={styles.btnOutline}>
              <span style={styles.btnIcon}>◈</span> Navigate
            </button>
            <button style={styles.btnOutline}>
              <span style={styles.btnIcon}>▦</span> Show Ticket
            </button>
          </div>
        </div>

        {/* Right arrival countdown */}
        <div style={styles.arrivalBox}>
          <p style={styles.arrivalLabel}>ARRIVE IN</p>
          <p style={styles.arrivalTime}>{arrivalMins} mins</p>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    border: "1.5px dashed #2563eb",
    borderRadius: 14,
    padding: "14px 18px 18px",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#64748b",
    marginBottom: 10,
  },
  card: {
    background: "linear-gradient(130deg, #1d4ed8 0%, #2563eb 60%, #1e40af 100%)",
    borderRadius: 12,
    padding: "22px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    boxShadow: "0 8px 32px rgba(37,99,235,0.28)",
    position: "relative",
    overflow: "hidden",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tokenRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  tokenBadge: {
    background: "rgba(255,255,255,0.18)",
    color: "#e0f2fe",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "3px 9px",
    borderRadius: 5,
    border: "1px solid rgba(255,255,255,0.22)",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4ade80",
    boxShadow: "0 0 0 2px rgba(74,222,128,0.3)",
    display: "inline-block",
  },
  activeLabel: {
    color: "#86efac",
    fontSize: 12,
    fontWeight: 600,
  },
  stationName: {
    fontSize: 28,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.1,
    letterSpacing: "-0.5px",
  },
  timeRange: {
    color: "#bfdbfe",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  clockIcon: {
    fontSize: 14,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 6,
  },
  btnOutline: {
    background: "rgba(255,255,255,0.15)",
    border: "1.5px solid rgba(255,255,255,0.35)",
    color: "#fff",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    backdropFilter: "blur(6px)",
    transition: "background 0.2s, transform 0.15s",
  },
  btnIcon: {
    fontSize: 15,
  },
  arrivalBox: {
    background: "rgba(255,255,255,0.18)",
    border: "1.5px solid rgba(255,255,255,0.28)",
    borderRadius: 12,
    padding: "16px 26px",
    textAlign: "center",
    backdropFilter: "blur(8px)",
    minWidth: 130,
  },
  arrivalLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#bfdbfe",
    marginBottom: 4,
  },
  arrivalTime: {
    fontSize: 32,
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.1,
    letterSpacing: "-1px",
  },
};
