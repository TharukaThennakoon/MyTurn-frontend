"use client";

import React, { useState } from "react";

interface SmartPickProps {
  stationName: string;
  description: string;
  waitTimeLabel: string;
  waitTimeValue: string;
  distance: string;
}

type BookingStep = "idle" | "fuel" | "slot" | "confirm" | "done";

const FUEL_TYPES = [
  { id: "petrol", label: "Petrol", icon: "⛽", color: "#2563eb" },
  { id: "diesel", label: "Diesel", icon: "🛢️", color: "#7c3aed" },
  { id: "cng",    label: "CNG",    icon: "💨", color: "#059669" },
];

const SLOTS = [
  { id: "s1", time: "5:30 PM – 5:45 PM", available: true },
  { id: "s2", time: "5:45 PM – 6:00 PM", available: true },
  { id: "s3", time: "6:00 PM – 6:15 PM", available: false },
  { id: "s4", time: "6:15 PM – 6:30 PM", available: true },
];

/* ─── Booking Modal ───────────────────────────────────────────────── */
function BookingModal({
  stationName,
  onClose,
}: {
  stationName: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<BookingStep>("fuel");
  const [fuel, setFuel] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const selectedSlot = SLOTS.find((s) => s.id === slot);

  return (
    <div
      style={overlayStyle}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="Book best option"
    >
      <div
        style={modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={headerIcon}>✦</div>
            <div>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700, letterSpacing: "0.1em" }}>
                SMART BOOKING
              </p>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{stationName}</p>
            </div>
          </div>
          <button onClick={onClose} style={closeBtn} aria-label="Close">✕</button>
        </div>

        {/* Step indicator */}
        <div style={stepBar}>
          {(["fuel", "slot", "confirm"] as BookingStep[]).map((s, i) => {
            const stepNames = ["fuel", "slot", "confirm"];
            const currentIndex = stepNames.indexOf(step);
            const thisIndex = i;
            const isDone = currentIndex > thisIndex;
            const isActive = currentIndex === thisIndex;
            return (
              <React.Fragment key={s}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isDone ? "#22c55e" : isActive ? "#2563eb" : "#e2e8f0",
                    color: isDone || isActive ? "#fff" : "#94a3b8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800,
                    transition: "all 0.2s",
                  }}>
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? "#2563eb" : "#94a3b8", letterSpacing: "0.05em" }}>
                    {s === "fuel" ? "FUEL" : s === "slot" ? "SLOT" : "CONFIRM"}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: 2, marginBottom: 16,
                    background: isDone ? "#22c55e" : "#e2e8f0",
                    borderRadius: 2, transition: "background 0.2s",
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Body */}
        <div style={modalBody}>
          {/* Step 1: Fuel type */}
          {step === "fuel" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={stepTitle}>Select Fuel Type</h3>
              <p style={stepSub}>Choose the type of fuel you need for this visit.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FUEL_TYPES.map((ft) => (
                  <button
                    key={ft.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: fuel === ft.id ? `2px solid ${ft.color}` : "1.5px solid #e2e8f0",
                      background: fuel === ft.id ? `${ft.color}10` : "#f8fafc",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                    onClick={() => setFuel(ft.id)}
                  >
                    <span style={{ fontSize: 24 }}>{ft.icon}</span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: fuel === ft.id ? ft.color : "#0f172a",
                    }}>
                      {ft.label}
                    </span>
                    {fuel === ft.id && (
                      <span style={{
                        marginLeft: "auto",
                        width: 20, height: 20,
                        borderRadius: "50%",
                        background: ft.color,
                        color: "#fff",
                        fontSize: 12,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                style={{ ...primaryBtn, opacity: fuel ? 1 : 0.5 }}
                disabled={!fuel}
                onClick={() => fuel && setStep("slot")}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Slot selection */}
          {step === "slot" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={stepTitle}>Choose a Time Slot</h3>
              <p style={stepSub}>Pick your preferred arrival window at the station.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SLOTS.map((s) => (
                  <button
                    key={s.id}
                    disabled={!s.available}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 16px",
                      borderRadius: 12,
                      border: slot === s.id ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                      background: !s.available ? "#f8fafc" : slot === s.id ? "#eff6ff" : "#fff",
                      cursor: s.available ? "pointer" : "not-allowed",
                      opacity: s.available ? 1 : 0.45,
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                    onClick={() => s.available && setSlot(s.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={slot === s.id ? "#2563eb" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span style={{ fontSize: 14, fontWeight: 600, color: slot === s.id ? "#1d4ed8" : "#0f172a" }}>
                        {s.time}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      padding: "3px 8px", borderRadius: 5,
                      background: s.available ? "#dcfce7" : "#fee2e2",
                      color: s.available ? "#15803d" : "#b91c1c",
                    }}>
                      {s.available ? "OPEN" : "FULL"}
                    </span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={secondaryBtn} onClick={() => setStep("fuel")}>← Back</button>
                <button
                  style={{ ...primaryBtn, flex: 1, opacity: slot ? 1 : 0.5 }}
                  disabled={!slot}
                  onClick={() => slot && setStep("confirm")}
                >
                  Review Booking →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={stepTitle}>Confirm Booking</h3>
              <div style={{
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                <ConfirmRow label="Station" value={stationName} />
                <ConfirmRow label="Fuel Type" value={FUEL_TYPES.find((f) => f.id === fuel)?.label ?? ""} />
                <ConfirmRow label="Time Slot" value={selectedSlot?.time ?? ""} />
              </div>

              <div style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 10,
                padding: "10px 14px",
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 14 }}>ℹ️</span>
                <p style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 500, lineHeight: 1.5 }}>
                  A digital token will be issued immediately. Arrive within your time window.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button style={secondaryBtn} onClick={() => setStep("slot")}>← Back</button>
                <button
                  style={{ ...primaryBtn, flex: 1 }}
                  onClick={() => setStep("done")}
                >
                  Confirm & Book ✓
                </button>
              </div>
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 8 }}>
              <div style={{
                width: 72, height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32,
                boxShadow: "0 8px 24px rgba(34,197,94,0.35)",
              }}>✓</div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Booking Confirmed!</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                  Your token has been issued for <strong>{stationName}</strong>.
                  <br />Check your ticket in the appointment card.
                </p>
              </div>
              <div style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                borderRadius: 12,
                padding: "14px 20px",
                textAlign: "center",
                width: "100%",
              }}>
                <p style={{ fontSize: 11, color: "#15803d", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>YOUR TIME SLOT</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{selectedSlot?.time}</p>
              </div>
              <button style={{ ...primaryBtn, width: "100%" }} onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

/* ─── Main SmartPick ────────────────────────────────────────────── */
export default function SmartPick({
  stationName,
  description,
  waitTimeLabel,
  waitTimeValue,
  distance,
}: SmartPickProps) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#f59e0b", fontSize: 15 }}>✦</span>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.03em" }}>
            Best station for you
          </span>
        </div>

        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
          {stationName}
        </h3>
        <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>{description}</p>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13.5, color: "#64748b", width: 85, flexShrink: 0 }}>{waitTimeLabel}</span>
          <div style={{ flex: 1, height: 5, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: "25%", height: "100%", background: "linear-gradient(90deg, #2563eb, #60a5fa)", borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#2563eb", whiteSpace: "nowrap" }}>{waitTimeValue}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13.5, color: "#64748b", width: 85, flexShrink: 0 }}>Distance</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{distance}</span>
        </div>

        <button
          style={bookBtn}
          onClick={() => setBookingOpen(true)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(37,99,235,0.3)";
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
        >
          ✦ Book Best Option
        </button>
      </div>

      {bookingOpen && (
        <BookingModal stationName={stationName} onClose={() => setBookingOpen(false)} />
      )}
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid #e2e8f0",
  borderRadius: 14,
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  width: "100%",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};

const bookBtn: React.CSSProperties = {
  marginTop: 6,
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "13px 0",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
  transition: "transform 0.15s, box-shadow 0.15s",
  width: "100%",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};

/* Modal styles */
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.72)",
  backdropFilter: "blur(6px)",
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const modalCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  width: "100%",
  maxWidth: 420,
  boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
  overflow: "hidden",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
};

const modalHeader: React.CSSProperties = {
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  padding: "18px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
};

const headerIcon: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 9,
  background: "rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
  color: "#fbbf24",
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

const stepBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "16px 24px 0",
  flexShrink: 0,
};

const modalBody: React.CSSProperties = {
  padding: "16px 24px 24px",
  overflowY: "auto",
  flex: 1,
};

const stepTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.3px",
};

const stepSub: React.CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.5,
};

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "13px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
  transition: "opacity 0.15s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const secondaryBtn: React.CSSProperties = {
  background: "#f1f5f9",
  color: "#475569",
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  padding: "13px 16px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "background 0.15s",
};
