"use client";

import React, { useState } from "react";

interface ActiveAppointmentCardProps {
  tokenNumber: number;
  status: "Active" | "Pending" | "Completed";
  stationName: string;
  timeRange: string;
  arrivalMins: number;
  stationLat?: number;
  stationLng?: number;
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

          {/* QR code (SVG placeholder) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 140, height: 140,
              background: "#f8fafc",
              border: "2px solid #e2e8f0",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: "block" }}>
                {/* QR code pattern */}
                {[0,1,2,3,4,5,6].map(row =>
                  [0,1,2,3,4,5,6].map(col => {
                    const isCorner =
                      (row < 3 && col < 3) ||
                      (row < 3 && col > 3) ||
                      (row > 3 && col < 3);
                    const filled = isCorner || Math.random() > 0.5;
                    return (
                      <rect
                        key={`${row}-${col}`}
                        x={10 + col * 15}
                        y={10 + row * 15}
                        width={12}
                        height={12}
                        rx={2}
                        fill={filled ? "#1d4ed8" : "transparent"}
                        opacity={filled ? 1 : 0}
                      />
                    );
                  })
                )}
                {/* Corner squares */}
                <rect x={10} y={10} width={30} height={30} rx={4} fill="none" stroke="#1d4ed8" strokeWidth={3} />
                <rect x={80} y={10} width={30} height={30} rx={4} fill="none" stroke="#1d4ed8" strokeWidth={3} />
                <rect x={10} y={80} width={30} height={30} rx={4} fill="none" stroke="#1d4ed8" strokeWidth={3} />
                <rect x={16} y={16} width={18} height={18} rx={2} fill="#1d4ed8" />
                <rect x={86} y={16} width={18} height={18} rx={2} fill="#1d4ed8" />
                <rect x={16} y={86} width={18} height={18} rx={2} fill="#1d4ed8" />
              </svg>
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
              Show this QR at the station gate
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
              Arrive within your time slot. Your token expires 5 minutes after your window.
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
  stationLat = 6.9271,
  stationLng = 79.8612,
}: ActiveAppointmentCardProps) {
  const [showTicket, setShowTicket] = useState(false);

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stationLat},${stationLng}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section style={wrapperStyle}>
        <p style={sectionLabel}>ACTIVE APPOINTMENT</p>
        <div style={cardStyle}>
          {/* Decorative orb */}
          <div style={decorOrb} />

          {/* Left content */}
          <div style={leftStyle}>
            <div style={tokenRow}>
              <span style={tokenBadge}>TOKEN #{tokenNumber}</span>
              <span style={activeDot} />
              <span style={activeLabel}>{status}</span>
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
            <p style={arrivalLabel}>ARRIVE IN</p>
            <p style={arrivalTime}>{arrivalMins} <span style={{ fontSize: 18, fontWeight: 700 }}>mins</span></p>
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
