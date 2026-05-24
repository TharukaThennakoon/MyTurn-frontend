"use client";

import React from "react";

export interface SlotOption {
  id: string;
  period: string;
  time: string;
  capacity: string;
  capacityLevel: "high" | "near" | "moderate" | "busy";
}

interface BookingPickSlotProps {
  slots: SlotOption[];
  selectedId: string | null;
  onSelect: (slot: SlotOption) => void;
  waitEstimateMins?: number;
}

const CAPACITY_COLORS: Record<SlotOption["capacityLevel"], string> = {
  high: "#93c5fd",
  near: "#2563eb",
  moderate: "#60a5fa",
  busy: "#d97706",
};

export default function BookingPickSlot({
  slots,
  selectedId,
  onSelect,
  waitEstimateMins,
}: BookingPickSlotProps) {
  const selected = slots.find((s) => s.id === selectedId);

  return (
    <section style={styles.section}>
      <p style={styles.stepTag}>STEP 3</p>
      <h2 style={styles.title}>Pick a Slot</h2>

      <div style={styles.grid} className="booking-slot-grid">
        {slots.map((slot) => {
          const isSelected = slot.id === selectedId;
          return (
            <button
              key={slot.id}
              type="button"
              style={{
                ...styles.card,
                ...(isSelected ? styles.cardSelected : {}),
              }}
              onClick={() => onSelect(slot)}
            >
              <span style={styles.period}>{slot.period}</span>
              <span style={styles.time}>{slot.time}</span>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: isSelected ? "100%" : "65%",
                    background: isSelected
                      ? "#fff"
                      : CAPACITY_COLORS[slot.capacityLevel],
                  }}
                />
              </div>
              <span style={styles.capacity}>{slot.capacity}</span>
            </button>
          );
        })}
      </div>

      {selected && waitEstimateMins != null && (
        <div style={styles.infoBanner} role="status">
          <span style={styles.infoIcon}>ℹ</span>
          <p style={styles.infoText}>
            Estimated wait time for the {selected.time} slot is currently{" "}
            {waitEstimateMins} minutes based on live traffic.
          </p>
        </div>
      )}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { marginBottom: 24 },
  stepTag: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#2563eb",
    marginBottom: 4,
  },
  title: { fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
    background: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: "14px 12px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    minHeight: 120,
  },
  cardSelected: {
    background: "#2563eb",
    borderColor: "#2563eb",
    color: "#fff",
  },
  period: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    opacity: 0.85,
  },
  time: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
  },
  barTrack: {
    width: "100%",
    height: 4,
    background: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: "auto",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.2s",
  },
  capacity: {
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.9,
  },
  infoBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 16,
    padding: "12px 14px",
    background: "#eff6ff",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#bfdbfe",
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoText: {
    fontSize: 12,
    color: "#1e40af",
    margin: 0,
    lineHeight: 1.5,
  },
};
