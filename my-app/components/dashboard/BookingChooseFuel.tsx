"use client";

import React from "react";

export type FuelIconKind = "barrel" | "jerrycan";

export interface FuelOption {
  id: string;
  name: string;
  description: string;
  pricePerLiter: string;
  icon: FuelIconKind;
}

interface BookingChooseFuelProps {
  fuels: FuelOption[];
  selectedId: string | null;
  onSelect: (fuel: FuelOption) => void;
}

function parsePrice(price: string): { amount: string; unit: string } {
  const match = price.match(/^(\$[\d.]+)(\/L)$/i);
  if (match) return { amount: match[1], unit: match[2] };
  return { amount: price, unit: "" };
}

function FuelBarrelIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <ellipse cx="22" cy="10" rx="11" ry="3.5" fill="#3b82f6" />
      <path
        d="M11 10c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v24c0 2.2-1.8 4-4 4H15c-2.2 0-4-1.8-4-4V10z"
        fill="#2563eb"
      />
      <rect
        x="11"
        y="16"
        width="22"
        height="2"
        rx="1"
        fill="#1d4ed8"
        opacity="0.5"
      />
      <rect
        x="11"
        y="22"
        width="22"
        height="2"
        rx="1"
        fill="#1d4ed8"
        opacity="0.5"
      />
      <rect
        x="11"
        y="28"
        width="22"
        height="2"
        rx="1"
        fill="#1d4ed8"
        opacity="0.5"
      />
      <path
        d="M22 17.5c-2.8 0-5 2.2-5 5 0 2.4 1.7 4.4 4 4.8V30h2v-2.7c2.3-.4 4-2.4 4-4.8 0-2.8-2.2-5-5-5z"
        fill="#fff"
      />
    </svg>
  );
}

function FuelJerrycanIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <path
        d="M16 12h5.5L24 17h10.5c1.1 0 2 .9 2 2v17.5c0 2.5-2 4.5-4.5 4.5h-17C12.5 41 10.5 39 10.5 36.5V19c0-1.1.9-2 2-2h3.5z"
        fill="#166534"
      />
      <path d="M19.5 9h5v5h-5V9z" fill="#15803d" />
      <path d="M15 12h3v2h-3v-2z" fill="#14532d" />
      <path
        d="M22 21.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z"
        fill="#fff"
      />
      <circle cx="22" cy="26" r="1.8" fill="#166534" />
    </svg>
  );
}

function FuelIcon({ kind }: { kind: FuelIconKind }) {
  return kind === "barrel" ? <FuelBarrelIcon /> : <FuelJerrycanIcon />;
}

function FuelPrice({ price, selected }: { price: string; selected: boolean }) {
  const { amount, unit } = parsePrice(price);
  const color = selected ? "#2563eb" : "#0f172a";
  return (
    <p style={styles.price}>
      <span style={{ ...styles.priceAmount, color }}>{amount}</span>
      {unit && <span style={{ ...styles.priceUnit, color }}>{unit}</span>}
    </p>
  );
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
                ...(selected ? styles.cardSelected : styles.cardDefault),
              }}
              onClick={() => onSelect(fuel)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.iconWrap}>
                  <FuelIcon kind={fuel.icon} />
                </div>
                <FuelPrice price={fuel.pricePerLiter} selected={selected} />
              </div>

              <p style={styles.cardName}>{fuel.name}</p>
              <p style={styles.cardDesc}>{fuel.description}</p>
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
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  card: {
    textAlign: "left",
    borderRadius: 14,
    padding: "18px 18px 20px",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  cardDefault: {
    background: "#fff",
    border: "1px solid transparent",
    boxShadow: "none",
  },
  cardSelected: {
    background: "#eff6ff",
    border: "1.5px solid #2563eb",
    boxShadow: "0 1px 4px rgba(37, 99, 235, 0.08)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 8,
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 6px",
    lineHeight: 1.3,
  },
  cardDesc: {
    fontSize: 12,
    color: "#94a3b8",
    margin: 0,
    lineHeight: 1.4,
    fontWeight: 400,
  },
  price: {
    margin: 0,
    lineHeight: 1,
    textAlign: "right",
    flexShrink: 0,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: 600,
    marginLeft: 1,
  },
};
