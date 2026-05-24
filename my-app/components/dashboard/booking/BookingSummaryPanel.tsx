"use client";

import React from "react";
import type { StationOption } from "@/components/dashboard/booking/BookingSelectStation";
import type { FuelOption } from "@/components/dashboard/booking/BookingChooseFuel";
import type { SlotOption } from "@/components/dashboard/booking/BookingPickSlot";

interface BookingSummaryPanelProps {
  referenceId: string;
  station: StationOption | null;
  fuel: FuelOption | null;
  slot: SlotOption | null;
  serviceFee: string;
  waitEstimate: string;
  canConfirm: boolean;
  onConfirm: () => void;
}

export default function BookingSummaryPanel({
  referenceId,
  station,
  fuel,
  slot,
  serviceFee,
  waitEstimate,
  canConfirm,
  onConfirm,
}: BookingSummaryPanelProps) {
  return (
    <aside style={styles.aside}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Booking Summary</h3>
          <span style={styles.refId}>{referenceId}</span>
        </div>

        <div style={styles.cardBody}>
          <SummaryRow
            icon="📍"
            label="STATION"
            value={station?.name ?? "—"}
            sub={station ? "124 Commercial Dr, Downtown" : "Select a station"}
          />
          <SummaryRow
            icon="⛽"
            label="FUEL & PRICING"
            value={fuel ? `${fuel.name} (95)` : "—"}
            sub={fuel ? `${fuel.pricePerLiter} • Pay at Station` : "Select fuel type"}
          />
          <SummaryRow
            icon="🕐"
            label="SCHEDULE"
            value={slot ? `Today, ${slot.time}` : "—"}
            sub={slot ? "Arrival window: 10:40 – 11:00 AM" : "Select a time slot"}
          />

          <div style={styles.divider} />

          <div style={styles.feeRow}>
            <span style={styles.feeLabel}>Service Fee</span>
            <span style={styles.feeValue}>{serviceFee}</span>
          </div>
          <div style={styles.feeRow}>
            <span style={styles.feeLabel}>Wait Time Est.</span>
            <span style={styles.waitValue}>{waitEstimate}</span>
          </div>

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total Est.</span>
            <span style={styles.totalValue}>{fuel?.pricePerLiter ?? "—"}</span>
          </div>

          <button
            type="button"
            style={{
              ...styles.confirmBtn,
              ...(!canConfirm ? styles.confirmBtnDisabled : {}),
            }}
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            Confirm Booking
          </button>

          <p style={styles.disclaimer}>
            By confirming, you agree to MyTurn&apos;s Terms of Service and
            station-specific fueling policies.
          </p>
        </div>
      </div>

      <div style={styles.mapPreview} aria-hidden>
        <div style={styles.mapDots}>
          <span style={{ ...styles.dot, top: "30%", left: "40%" }} />
          <span style={{ ...styles.dot, top: "55%", left: "60%" }} />
          <span style={{ ...styles.dotActive, top: "45%", left: "48%" }} />
        </div>
        <span style={styles.mapLabel}>Route preview</span>
      </div>
    </aside>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div style={styles.row}>
      <span style={styles.rowIcon}>{icon}</span>
      <div>
        <p style={styles.rowLabel}>{label}</p>
        <p style={styles.rowValue}>{value}</p>
        <p style={styles.rowSub}>{sub}</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  aside: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    position: "sticky",
    top: 72,
    alignSelf: "flex-start",
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(37,99,235,0.12)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    padding: "18px 20px",
    color: "#fff",
  },
  cardTitle: { fontSize: 16, fontWeight: 800, margin: "0 0 4px" },
  refId: { fontSize: 11, opacity: 0.85, fontWeight: 500 },
  cardBody: {
    background: "#fff",
    padding: "18px 20px 20px",
  },
  row: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
  },
  rowIcon: { fontSize: 18, flexShrink: 0, marginTop: 2 },
  rowLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: "0 0 4px",
  },
  rowValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 2px",
  },
  rowSub: { fontSize: 11, color: "#64748b", margin: 0 },
  divider: {
    height: 1,
    background: "#f1f5f9",
    margin: "4px 0 14px",
  },
  feeRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 12,
  },
  feeLabel: { color: "#64748b" },
  feeValue: { fontWeight: 600, color: "#0f172a" },
  waitValue: { fontWeight: 700, color: "#16a34a" },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    margin: "14px 0 18px",
    paddingTop: 12,
    borderTop: "1px solid #f1f5f9",
  },
  totalLabel: { fontSize: 13, fontWeight: 600, color: "#64748b" },
  totalValue: { fontSize: 22, fontWeight: 800, color: "#2563eb" },
  confirmBtn: {
    width: "100%",
    padding: "14px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  confirmBtnDisabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
  },
  disclaimer: {
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
    margin: "12px 0 0",
    lineHeight: 1.4,
  },
  mapPreview: {
    height: 100,
    borderRadius: 12,
    background: "linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)",
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#bae6fd",
  },
  mapDots: { position: "absolute", inset: 0 },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#64748b",
    transform: "translate(-50%, -50%)",
  },
  dotActive: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#2563eb",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#fff",
    boxShadow: "0 2px 6px rgba(37,99,235,0.4)",
    transform: "translate(-50%, -50%)",
  },
  mapLabel: {
    position: "absolute",
    bottom: 8,
    left: 10,
    fontSize: 10,
    fontWeight: 600,
    color: "#0369a1",
  },
};
