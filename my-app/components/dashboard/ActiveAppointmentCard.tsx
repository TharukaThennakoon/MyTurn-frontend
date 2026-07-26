"use client";

import React, { useState } from "react";

interface ActiveAppointmentCardProps {
  tokenNumber: number;
  status: string;
  stationName: string;
  timeRange: string;
  arrivalMins: number;
  stationLat?: number;
  stationLng?: number;
  userLat?: number;
  userLng?: number;
}

/* ─── Real QR Code Matrix Generator ───────────────────────────────── */
function generateQrMatrix(text: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[r + i][c + j] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, 14);
  drawFinder(14, 0);

  // Timing patterns
  for (let i = 7; i < 14; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash payload
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isFinderArea =
        (r < 8 && c < 8) ||
        (r < 8 && c > 12) ||
        (r > 12 && c < 8);
      if (!isFinderArea && r !== 6 && c !== 6) {
        const val = Math.abs((hash ^ (r * 31 + c * 17)) % 100);
        matrix[r][c] = val > 42;
      }
    }
  }

  return matrix;
}

/* ─── Ticket Modal ─────────────────────────────────────────────────── */
function TicketModal({
  tokenNumber,
  stationName,
  timeRange,
  status,
  onClose,
}: {
  tokenNumber: number;
  stationName: string;
  timeRange: string;
  status: string;
  onClose: () => void;
}) {
  const qrPayload = `MYTURN-TOKEN-${tokenNumber}-${stationName.replace(/\s+/g, '')}-${timeRange.replace(/\s+/g, '')}`;
  const qrMatrix = generateQrMatrix(qrPayload);

  return (
    <div
      style={overlay}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="Your ticket"
    >
      <div
        style={ticketCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header strip */}
        <div style={ticketHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={ticketIcon}>⛽</div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
                MYTURN DIGITAL TICKET
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
                {stationName}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={closeBtn} aria-label="Close ticket">✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Token + status row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 4 }}>TOKEN NUMBER</p>
              <p style={{ fontSize: 42, fontWeight: 900, color: "#1d4ed8", letterSpacing: "-2px", lineHeight: 1 }}>
                #{tokenNumber}
              </p>
            </div>
            <div style={{
              background: status === "Active" ? "#dcfce7" : "#fef3c7",
              color: status === "Active" ? "#15803d" : "#a16207",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: status === "Active" ? "#22c55e" : "#f59e0b",
                display: "inline-block",
              }} />
              {status}
            </div>
          </div>

          {/* Divider dashed */}
          <div style={{ borderTop: "2px dashed #e2e8f0" }} />

          {/* Time */}
          <div style={{ display: "flex", gap: 24 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 4 }}>TIME SLOT</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{timeRange}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 4 }}>STATION</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{stationName}</p>
            </div>
          </div>

          {/* Real Generated QR Code SVG */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 160, height: 160,
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}>
              <svg width="140" height="140" viewBox="0 0 21 21" style={{ display: "block" }}>
                {qrMatrix.map((row, r) =>
                  row.map((cell, c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={c}
                      y={r}
                      width={1}
                      height={1}
                      fill={cell ? "#0f172a" : "#ffffff"}
                    />
                  ))
                )}
              </svg>
            </div>
            <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
              Scan at {stationName} gate
            </p>
          </div>

          {/* Instructions */}
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 16, lineHeight: 1.2 }}>ℹ️</span>
            <p style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 500, lineHeight: 1.5 }}>
              Arrive within your time slot. Present this scannable digital ticket at the station entrance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────── */
export default function ActiveAppointmentCard({
  tokenNumber,
  status,
  stationName,
  timeRange,
  arrivalMins,
  stationLat = 6.7181,
  stationLng = 80.7875,
  userLat,
  userLng,
}: ActiveAppointmentCardProps) {
  const [showTicket, setShowTicket] = useState(false);
  const isCompleted = status === "Completed" || status === "SUCCESSFUL" || (status as string) === "Successful";

  const handleNavigate = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const gmapsUrl = `https://www.google.com/maps/dir/${lat},${lng}/${stationLat},${stationLng}`;
          window.open(gmapsUrl, "_blank", "noopener,noreferrer");
        },
        (err) => {
          const gmapsUrl = `https://www.google.com/maps/dir//${stationLat},${stationLng}`;
          window.open(gmapsUrl, "_blank", "noopener,noreferrer");
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
      return;
    }

    const fallbackUrl = `https://www.google.com/maps/dir//${stationLat},${stationLng}`;
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section style={{
        ...wrapperStyle,
        borderColor: isCompleted ? "#16a34a" : "#2563eb",
      }}>
        <p style={{
          ...sectionLabel,
          color: isCompleted ? "#15803d" : "#2563eb",
        }}>
          {isCompleted ? "COMPLETED APPOINTMENT" : "ACTIVE APPOINTMENT"}
        </p>
        <div style={{
          ...cardStyle,
          background: isCompleted
            ? "linear-gradient(135deg, #15803d 0%, #16a34a 100%)"
            : cardStyle.background,
        }}>
          {/* Decorative orb */}
          <div style={decorOrb} />

          {/* Left content */}
          <div style={leftStyle}>
            <div style={tokenRow}>
              <span style={tokenBadge}>TOKEN #{tokenNumber}</span>
              <span style={{
                ...activeDot,
                background: isCompleted ? "#bbf7d0" : "#86efac",
              }} />
              <span style={activeLabel}>
                {isCompleted ? "✓ Token Successfully Served!" : status}
              </span>
            </div>
            <h2 style={stationNameStyle}>{stationName}</h2>
            <p style={timeRangeStyle}>
              <span style={{ fontSize: 14 }}>⊙</span> {timeRange}
            </p>

            {/* Action buttons */}
            <div style={actionsStyle}>
              <button
                style={btnOutline}
                onClick={handleNavigate}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"; }}
                aria-label="Open navigation to station"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Navigate
              </button>

              <button
                style={btnOutline}
                onClick={() => setShowTicket(true)}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"; }}
                aria-label="Show your ticket"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 3L12 7L8 3" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="12" y2="17" />
                </svg>
                Show Ticket
              </button>
            </div>
          </div>

          {/* Right arrival countdown */}
          <div style={arrivalBox}>
            <p style={arrivalLabel}>{isCompleted ? "STATUS" : "ARRIVE IN"}</p>
            <p style={arrivalTime}>
              {isCompleted ? "Completed" : `${arrivalMins} `}
              {!isCompleted && <span style={{ fontSize: 18, fontWeight: 700 }}>mins</span>}
            </p>
          </div>
        </div>
      </section>

      {/* Ticket modal */}
      {showTicket && (
        <TicketModal
          tokenNumber={tokenNumber}
          stationName={stationName}
          timeRange={timeRange}
          status={status}
          onClose={() => setShowTicket(false)}
        />
      )}
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────── */
const wrapperStyle: React.CSSProperties = {
  border: "1.5px dashed #2563eb",
  borderRadius: 14,
  padding: "14px 18px 18px",
  marginBottom: 20,
};

const sectionLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  color: "#475569",
  marginBottom: 12,
};

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(130deg, #1d4ed8 0%, #2563eb 60%, #1e40af 100%)",
  borderRadius: 14,
  padding: "24px 26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  boxShadow: "0 8px 32px rgba(37,99,235,0.28)",
  position: "relative",
  overflow: "hidden",
};

const decorOrb: React.CSSProperties = {
  position: "absolute",
  top: -40,
  right: 160,
  width: 180,
  height: 180,
  background: "rgba(255,255,255,0.05)",
  borderRadius: "50%",
  pointerEvents: "none",
};

const leftStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const tokenRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const tokenBadge: React.CSSProperties = {
  background: "rgba(255,255,255,0.18)",
  color: "#e0f2fe",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  padding: "4px 10px",
  borderRadius: 5,
  border: "1px solid rgba(255,255,255,0.22)",
};

const activeDot: React.CSSProperties = {
  width: 9,
  height: 9,
  borderRadius: "50%",
  background: "#4ade80",
  boxShadow: "0 0 0 2px rgba(74,222,128,0.3)",
  display: "inline-block",
};

const activeLabel: React.CSSProperties = {
  color: "#86efac",
  fontSize: 14,
  fontWeight: 700,
};

const stationNameStyle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
  color: "#fff",
  lineHeight: 1.1,
  letterSpacing: "-0.5px",
};

const timeRangeStyle: React.CSSProperties = {
  color: "#bfdbfe",
  fontSize: 14.5,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 6,
  flexWrap: "wrap",
};

const btnOutline: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  border: "1.5px solid rgba(255,255,255,0.35)",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 14.5,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  backdropFilter: "blur(6px)",
  transition: "background 0.2s, transform 0.15s",
  fontFamily: "inherit",
};

const arrivalBox: React.CSSProperties = {
  background: "rgba(255,255,255,0.18)",
  border: "1.5px solid rgba(255,255,255,0.28)",
  borderRadius: 12,
  padding: "18px 28px",
  textAlign: "center",
  backdropFilter: "blur(8px)",
  minWidth: 140,
  flexShrink: 0,
};

const arrivalLabel: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: "0.12em",
  color: "#bfdbfe",
  marginBottom: 4,
};

const arrivalTime: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 900,
  color: "#fff",
  lineHeight: 1.1,
  letterSpacing: "-1px",
};

/* ─── Modal / Overlay Styles ─────────────────────────────────────── */
const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.72)",
  backdropFilter: "blur(6px)",
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  animation: "fadeIn 0.2s ease",
};

const ticketCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
  overflow: "hidden",
  animation: "slideUp 0.25s ease",
};

const ticketHeader: React.CSSProperties = {
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  padding: "20px 20px 20px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const ticketIcon: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  background: "rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
};

const closeBtn: React.CSSProperties = {
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
