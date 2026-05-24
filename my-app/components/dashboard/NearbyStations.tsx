"use client";

import React from "react";

type StatusLevel = "OPTIMAL" | "BUSY" | "HIGH";

interface Station {
  id: string;
  name: string;
  distance: string;
  status: StatusLevel;
  waitMin: number;
  queueSize: number;
  queueLabel: string;
  icon: string;
  iconBg: string;
}

interface NearbyStationsProps {
  stations: Station[];
  onViewMap?: () => void;
}

const STATUS_COLORS: Record<StatusLevel, { bg: string; text: string }> = {
  OPTIMAL: { bg: "#dcfce7", text: "#15803d" },
  BUSY:    { bg: "#fef9c3", text: "#a16207" },
  HIGH:    { bg: "#fee2e2", text: "#b91c1c" },
};

export default function NearbyStations({ stations, onViewMap }: NearbyStationsProps) {
  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.label}>NEARBY STATIONS</span>
        <button style={styles.viewMap} onClick={onViewMap}>
          View Map 🗺
        </button>
      </div>

      <div style={styles.list}>
        {stations.map((s) => {
          const sc = STATUS_COLORS[s.status];
          return (
            <div key={s.id} style={styles.row}>
              {/* Icon */}
              <div style={{ ...styles.iconBox, background: s.iconBg }}>
                <span style={styles.iconText}>{s.icon}</span>
              </div>

              {/* Name + distance */}
              <div style={styles.info}>
                <p style={styles.name}>{s.name}</p>
                <div style={styles.meta}>
                  <span style={styles.distance}>↗ {s.distance}</span>
                  <span
                    style={{
                      ...styles.badge,
                      background: sc.bg,
                      color: sc.text,
                    }}
                  >
                    {s.status}
                  </span>
                </div>
              </div>

              {/* Wait + queue */}
              <div style={styles.waitCol}>
                <p style={styles.waitTime}>Wait: {s.waitMin} min</p>
                <p style={styles.queue}>
                  {s.queueSize} QUEUE · {s.queueLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#64748b",
  },
  viewMap: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 14px",
    borderRadius: 10,
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    transition: "background 0.18s, box-shadow 0.18s",
    cursor: "pointer",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconText: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  distance: {
    fontSize: 11,
    color: "#64748b",
  },
  badge: {
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.08em",
    padding: "2px 7px",
    borderRadius: 4,
  },
  waitCol: {
    textAlign: "right",
  },
  waitTime: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
  },
  queue: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
};
