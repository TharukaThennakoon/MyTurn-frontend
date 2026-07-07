"use client";

import React, { useState } from "react";

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
  lat?: number;
  lng?: number;
}

interface NearbyStationsProps {
  stations: Station[];
}

const STATUS_COLORS: Record<StatusLevel, { bg: string; text: string; dot: string }> = {
  OPTIMAL: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  BUSY:    { bg: "#fef9c3", text: "#a16207", dot: "#f59e0b" },
  HIGH:    { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" },
};

/* ─── Full-screen Map Modal ─────────────────────────────────────────── */
function MapModal({
  stations,
  onClose,
}: {
  stations: Station[];
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Station | null>(null);

  const openMaps = (station: Station) => {
    const lat = station.lat ?? 6.9271;
    const lng = station.lng ?? 79.8612;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={overlayStyle}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="View map"
    >
      <div
        style={mapModalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={mapHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={mapHeaderIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700, letterSpacing: "0.1em" }}>
                NEARBY STATIONS
              </p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Station Map View</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={mapCloseBtn}
            aria-label="Close map"
          >
            ✕
          </button>
        </div>

        {/* Map area */}
        <div style={mapArea}>
          {/* Simulated map background */}
          <div style={mapBg}>
            {/* Grid lines */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`h${i}`}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${(i + 1) * 12.5}%`,
                  height: 1,
                  background: "rgba(203,213,225,0.5)",
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`v${i}`}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${(i + 1) * 12.5}%`,
                  width: 1,
                  background: "rgba(203,213,225,0.5)",
                }}
              />
            ))}

            {/* Roads */}
            <div style={{ position: "absolute", left: "20%", right: "20%", top: "48%", height: 4, background: "#e2e8f0", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: "48%", top: "15%", bottom: "15%", width: 4, background: "#e2e8f0", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: "10%", right: "40%", top: "70%", height: 3, background: "#f1f5f9", borderRadius: 2, transform: "rotate(-8deg)" }} />

            {/* You are here */}
            <div style={{
              position: "absolute",
              left: "48%",
              top: "48%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#2563eb",
                border: "3px solid #fff",
                boxShadow: "0 2px 12px rgba(37,99,235,0.5)",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: "50%",
                  background: "rgba(37,99,235,0.2)",
                  animation: "none",
                }} />
              </div>
              <div style={{
                position: "absolute",
                top: 22,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#2563eb",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 4,
                whiteSpace: "nowrap",
              }}>
                You
              </div>
            </div>

            {/* Station pins */}
            {[
              { id: "ws", left: "28%", top: "32%" },
              { id: "ew", left: "68%", top: "62%" },
              { id: "dc", left: "72%", top: "28%" },
            ].map((pos) => {
              const station = stations.find((s) => s.id === pos.id);
              if (!station) return null;
              const sc = STATUS_COLORS[station.status];
              const isSelected = selected?.id === pos.id;

              return (
                <button
                  key={pos.id}
                  style={{
                    position: "absolute",
                    left: pos.left,
                    top: pos.top,
                    transform: "translate(-50%, -100%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    zIndex: isSelected ? 20 : 10,
                  }}
                  onClick={() => setSelected(isSelected ? null : station)}
                  aria-label={`Select ${station.name}`}
                >
                  {/* Pin */}
                  <div style={{
                    background: isSelected ? "#1d4ed8" : "#fff",
                    border: `2px solid ${isSelected ? "#1d4ed8" : sc.dot}`,
                    borderRadius: 10,
                    padding: "5px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    boxShadow: isSelected ? "0 4px 16px rgba(29,78,216,0.4)" : "0 2px 10px rgba(0,0,0,0.12)",
                    transition: "all 0.18s",
                    whiteSpace: "nowrap",
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: sc.dot, display: "inline-block", flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: isSelected ? "#fff" : "#0f172a",
                    }}>
                      {station.waitMin}m
                    </span>
                  </div>
                  {/* Needle */}
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: `6px solid ${isSelected ? "#1d4ed8" : "#fff"}`,
                    margin: "0 auto",
                  }} />
                </button>
              );
            })}
          </div>

          {/* Selected station detail */}
          {selected && (
            <div style={selectedPanel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{
                      ...badgeStyle,
                      background: STATUS_COLORS[selected.status].bg,
                      color: STATUS_COLORS[selected.status].text,
                    }}>
                      {selected.status}
                    </span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>↗ {selected.distance}</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{selected.name}</p>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    Wait: <strong style={{ color: "#0f172a" }}>{selected.waitMin} min</strong> · {selected.queueSize} in queue
                  </p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16, padding: 0 }}>✕</button>
              </div>
              <button
                onClick={() => openMaps(selected)}
                style={navigateToBtn}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Navigate Here
              </button>
            </div>
          )}
        </div>

        {/* Station list below map */}
        <div style={stationListPanel}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#64748b", marginBottom: 10 }}>
            ALL NEARBY STATIONS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stations.map((s) => {
              const sc = STATUS_COLORS[s.status];
              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: selected?.id === s.id ? "#eff6ff" : "#f8fafc",
                    border: selected?.id === s.id ? "1.5px solid #bfdbfe" : "1px solid #f1f5f9",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setSelected(s)}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>↗ {s.distance}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                    <span style={{ ...badgeStyle, background: sc.bg, color: sc.text }}>{s.status}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>~{s.waitMin} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main NearbyStations ─────────────────────────────────────────── */
export default function NearbyStations({ stations }: NearbyStationsProps) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <div style={panelStyle}>
        <div style={headerStyle}>
          <span style={labelStyle}>NEARBY STATIONS</span>
          <button
            style={viewMapBtn}
            onClick={() => setMapOpen(true)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
            aria-label="View full map"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            View Map
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stations.map((s) => {
            const sc = STATUS_COLORS[s.status];
            return (
              <div
                key={s.id}
                style={rowStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#f0f9ff";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#f8fafc";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div style={{ ...iconBox, background: s.iconBg }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ fontSize: 16.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>{s.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>↗ {s.distance}</span>
                    <span style={{ ...badgeStyle, background: sc.bg, color: sc.text }}>{s.status}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Wait: {s.waitMin} min</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, fontWeight: 700, letterSpacing: "0.04em", margin: 0 }}>
                    {s.queueSize} QUEUE · {s.queueLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {mapOpen && <MapModal stations={stations} onClose={() => setMapOpen(false)} />}
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const panelStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  color: "#475569",
};

const viewMapBtn: React.CSSProperties = {
  background: "transparent",
  border: "1.5px solid #bfdbfe",
  borderRadius: 8,
  color: "#2563eb",
  fontSize: 13.5,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: "6px 14px",
  transition: "all 0.18s",
  fontFamily: "inherit",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "14px 16px",
  borderRadius: 10,
  background: "#f8fafc",
  border: "1px solid #f1f5f9",
  transition: "background 0.18s, box-shadow 0.18s",
  cursor: "pointer",
};

const iconBox: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const badgeStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.08em",
  padding: "2px 7px",
  borderRadius: 4,
};

/* Map modal */
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.75)",
  backdropFilter: "blur(6px)",
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const mapModalCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  width: "100%",
  maxWidth: 580,
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
};

const mapHeader: React.CSSProperties = {
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  padding: "18px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
};

const mapHeaderIcon: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 9,
  background: "rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mapCloseBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  border: "1.5px solid rgba(255,255,255,0.3)",
  color: "#fff",
  borderRadius: 8,
  width: 34,
  height: 34,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  fontFamily: "inherit",
  flexShrink: 0,
};

const mapArea: React.CSSProperties = {
  position: "relative",
  flexShrink: 0,
};

const mapBg: React.CSSProperties = {
  height: 260,
  background: "linear-gradient(145deg, #f8fafc 0%, #f0f4ff 100%)",
  position: "relative",
  overflow: "hidden",
};

const selectedPanel: React.CSSProperties = {
  position: "absolute",
  bottom: 12,
  left: 12,
  right: 12,
  background: "#fff",
  borderRadius: 12,
  padding: "12px 14px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const navigateToBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: 9,
  padding: "10px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  fontFamily: "inherit",
  transition: "opacity 0.15s",
  boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
};

const stationListPanel: React.CSSProperties = {
  padding: "14px 16px 20px",
  overflowY: "auto",
  flex: 1,
};
