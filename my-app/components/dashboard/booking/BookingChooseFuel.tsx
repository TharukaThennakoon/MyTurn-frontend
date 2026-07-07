"use client";

import React from "react";

export interface FuelOption {
  id: string;
  name: string;
  description: string;
  pricePerLiter: string;
}

interface BookingChooseFuelProps {
  fuels: FuelOption[];
  selectedId: string | null;
  onSelect: (fuel: FuelOption) => void;
}

export default function BookingChooseFuel({
  fuels,
  selectedId,
  onSelect,
}: BookingChooseFuelProps) {
  return (
    <section style={styles.section}>
      <p style={styles.stepTag}>STEP 2</p>
      <h2 style={styles.title}>Choose Fuel</h2>

      <div style={styles.grid}>
        {fuels.map((fuel) => {
          const selected = fuel.id === selectedId;
          return (
            <button
              key={fuel.id}
              type="button"
              style={{
                ...styles.card,
                ...(selected ? styles.cardSelected : {}),
              }}
              onClick={() => onSelect(fuel)}
            >
              <div style={styles.cardTop}>
                <div style={styles.iconBox}>⛽</div>
                <div style={styles.cardInfo}>
                  <p style={styles.cardName}>{fuel.name}</p>
                  <p style={styles.cardDesc}>{fuel.description}</p>
                </div>
              </div>
              <p
                style={{
                  ...styles.price,
                  ...(selected ? styles.priceSelected : {}),
                }}
              >
                {fuel.pricePerLiter}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { marginBottom: 32 },
  stepTag: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#2563eb",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 16px",
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
  cardTop: { display: "flex", gap: 12, marginBottom: 12 },
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
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  cardDesc: { fontSize: 11, color: "#64748b", margin: 0 },
  price: {
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    textAlign: "right",
  },
  priceSelected: { color: "#2563eb" },
};
