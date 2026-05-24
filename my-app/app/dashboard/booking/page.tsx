"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "station" | "fuel" | "slot" | "confirm";

interface Station {
  id: string;
  name: string;
  distance: string;
  waitMin: number;
  driveMin: number;
  status: "AVAILABLE" | "BUSY" | "FULL";
}

interface FuelType {
  id: string;
  name: string;
  description: string;
  price: string;
  octane?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  period: string;
  capacity: string;
}

const STATIONS: Station[] = [
  {
    id: "vch",
    name: "Velocity Central Hub",
    distance: "4.2 km",
    waitMin: 12,
    driveMin: 8,
    status: "AVAILABLE",
  },
  {
    id: "mnp",
    name: "Metro North Point",
    distance: "6.8 km",
    waitMin: 35,
    driveMin: 15,
    status: "BUSY",
  },
  {
    id: "east",
    name: "Eastside Express",
    distance: "3.5 km",
    waitMin: 8,
    driveMin: 5,
    status: "AVAILABLE",
  },
];

const FUEL_TYPES: FuelType[] = [
  {
    id: "premium",
    name: "Premium Petrol",
    description: "95 Octane High Performance",
    price: "$1.84",
    octane: "95",
  },
  {
    id: "diesel",
    name: "Ultra Diesel",
    description: "Low Sulfur Environmental Grade",
    price: "$1.72",
  },
  {
    id: "eco",
    name: "EcoPetrol",
    description: "91 Octane Economy",
    price: "$1.64",
    octane: "91",
  },
];

const TIME_SLOTS: TimeSlot[] = [
  { id: "morning1", time: "09:30", period: "MORNING", capacity: "High Capacity" },
  { id: "morning2", time: "10:45", period: "MORNING", capacity: "Near Full" },
  { id: "noon", time: "12:15", period: "NOON", capacity: "Moderate" },
  { id: "afternoon", time: "02:30", period: "AFTERNOON", capacity: "Very Busy" },
];

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("station");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setStep("fuel");
  };

  const handleFuelSelect = (fuel: FuelType) => {
    setSelectedFuel(fuel);
    setStep("slot");
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep("confirm");
  };

  const handleConfirm = () => {
    // TODO: Send booking to backend
    alert("Booking confirmed! Reference: #VP-2934-X");
    router.push("/dashboard");
  };

  const handleBack = () => {
    if (step === "station") {
      router.push("/dashboard");
    } else if (step === "fuel") {
      setStep("station");
    } else if (step === "slot") {
      setStep("fuel");
    } else {
      setStep("slot");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Progress Steps */}
        <div style={styles.progressBar}>
          {["STATION", "FUEL", "TIME", "CONFIRM"].map((label, idx) => (
            <div key={idx} style={styles.progressStep}>
              <div
                style={{
                  ...styles.stepCircle,
                  ...(idx < (step === "station" ? 1 : step === "fuel" ? 2 : step === "slot" ? 3 : 4)
                    ? styles.stepCircleActive
                    : {}),
                }}
              >
                {idx + 1}
              </div>
              <span style={styles.stepLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={styles.stepContent}>
          {step === "station" && (
            <StationStep stations={STATIONS} onSelect={handleStationSelect} />
          )}
          {step === "fuel" && selectedStation && (
            <FuelStep fuels={FUEL_TYPES} onSelect={handleFuelSelect} />
          )}
          {step === "slot" && selectedFuel && (
            <SlotStep slots={TIME_SLOTS} onSelect={handleSlotSelect} />
          )}
          {step === "confirm" && (
            <ConfirmStep
              station={selectedStation!}
              fuel={selectedFuel!}
              slot={selectedSlot!}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={styles.buttonGroup}>
          <button style={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          {step === "confirm" && (
            <button style={styles.confirmButton} onClick={handleConfirm}>
              Confirm Booking
            </button>
          )}
        </div>
      </div>

      {/* Booking Summary Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Booking Summary</h3>
        <p style={styles.reference}>Reference: #VP-2934-X</p>

        {selectedStation && (
          <div style={styles.summarySection}>
            <div style={styles.sectionLabel}>📍 STATION</div>
            <div style={styles.sectionValue}>{selectedStation.name}</div>
            <div style={styles.sectionDetail}>
              124 Commercial Dr, Downtown
            </div>
          </div>
        )}

        {selectedFuel && (
          <div style={styles.summarySection}>
            <div style={styles.sectionLabel}>⛽ FUEL & PRICING</div>
            <div style={styles.sectionValue}>{selectedFuel.name}</div>
            <div style={styles.sectionDetail}>{selectedFuel.price}</div>
          </div>
        )}

        {selectedSlot && (
          <div style={styles.summarySection}>
            <div style={styles.sectionLabel}>⏰ SCHEDULE</div>
            <div style={styles.sectionValue}>
              Today, {selectedSlot.time} {selectedSlot.period}
            </div>
            <div style={styles.sectionDetail}>
              Arrival window: 10:40 - 11:00 AM
            </div>
          </div>
        )}

        {selectedSlot && (
          <div style={styles.summarySection}>
            <div style={styles.sectionLabel}>Service Fee</div>
            <div style={styles.sectionValue}>$0.45</div>
            <div style={styles.sectionDetail}>Wait Time Est. ~18 mins</div>
          </div>
        )}

        {selectedFuel && selectedSlot && (
          <div style={styles.totalSection}>
            <div style={styles.totalLabel}>Total Est.</div>
            <div style={styles.totalPrice}>{selectedFuel.price}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Station Selection Step ───────────────────────────────────────────────────

function StationStep({
  stations,
  onSelect,
}: {
  stations: Station[];
  onSelect: (station: Station) => void;
}) {
  return (
    <div>
      <h2 style={styles.stepTitle}>STEP 1</h2>
      <h1 style={styles.mainTitle}>Select Station</h1>

      <div style={styles.stationGrid}>
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => onSelect(station)}
            style={styles.stationCard}
          >
            <div style={styles.stationHeader}>
              <div>
                <div style={styles.stationName}>{station.name}</div>
                <div style={styles.stationDistance}>
                  {station.distance} • {station.status}
                </div>
              </div>
            </div>
            <div style={styles.stationDetails}>
              <div style={styles.stationDetail}>
                <span>Wait Time</span>
                <strong>{station.waitMin} mins</strong>
              </div>
              <div style={styles.stationDetail}>
                <span>Distance</span>
                <strong>{station.driveMin} min drive</strong>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Fuel Selection Step ──────────────────────────────────────────────────────

function FuelStep({
  fuels,
  onSelect,
}: {
  fuels: FuelType[];
  onSelect: (fuel: FuelType) => void;
}) {
  return (
    <div>
      <h2 style={styles.stepTitle}>STEP 2</h2>
      <h1 style={styles.mainTitle}>Choose Fuel</h1>

      <div style={styles.fuelGrid}>
        {fuels.map((fuel) => (
          <button
            key={fuel.id}
            onClick={() => onSelect(fuel)}
            style={styles.fuelCard}
          >
            <div style={styles.fuelIcon}>⛽</div>
            <div style={styles.fuelName}>{fuel.name}</div>
            <div style={styles.fuelDescription}>{fuel.description}</div>
            {fuel.octane && (
              <div style={styles.fuelOctane}>{fuel.octane} Octane</div>
            )}
            <div style={styles.fuelPrice}>{fuel.price}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Time Slot Selection Step ────────────────────────────────────────────────

function SlotStep({
  slots,
  onSelect,
}: {
  slots: TimeSlot[];
  onSelect: (slot: TimeSlot) => void;
}) {
  return (
    <div>
      <h2 style={styles.stepTitle}>STEP 3</h2>
      <h1 style={styles.mainTitle}>Pick a Slot</h1>

      <div style={styles.slotGrid}>
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelect(slot)}
            style={styles.slotCard}
          >
            <div style={styles.slotPeriod}>{slot.period}</div>
            <div style={styles.slotTime}>{slot.time}</div>
            <div style={styles.slotCapacity}>{slot.capacity}</div>
          </button>
        ))}
      </div>

      <p style={styles.slotNote}>
        ℹ️ Estimated wait time for the 10:45 AM slot is currently 18 minutes
        based on live traffic.
      </p>
    </div>
  );
}

// ─── Confirmation Step ────────────────────────────────────────────────────────

function ConfirmStep({
  station,
  fuel,
  slot,
}: {
  station: Station;
  fuel: FuelType;
  slot: TimeSlot;
}) {
  return (
    <div>
      <h2 style={styles.stepTitle}>STEP 4</h2>
      <h1 style={styles.mainTitle}>Confirm Booking</h1>

      <div style={styles.confirmDetails}>
        <div style={styles.confirmSection}>
          <span style={styles.confirmLabel}>Station:</span>
          <span>{station.name}</span>
        </div>
        <div style={styles.confirmSection}>
          <span style={styles.confirmLabel}>Fuel:</span>
          <span>{fuel.name}</span>
        </div>
        <div style={styles.confirmSection}>
          <span style={styles.confirmLabel}>Price:</span>
          <span>{fuel.price}</span>
        </div>
        <div style={styles.confirmSection}>
          <span style={styles.confirmLabel}>Time:</span>
          <span>
            {slot.time} {slot.period}
          </span>
        </div>
      </div>

      <p style={styles.confirmNote}>
        By confirming, you agree to our Terms of Service and arrival window
        policies.
      </p>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    gap: "24px",
    padding: "24px",
    minHeight: "100vh",
    background: "#f8fafc",
  },
  content: {
    flex: 1,
    background: "#fff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  progressBar: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "32px",
  },
  progressStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  stepCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  stepCircleActive: {
    background: "#3b82f6",
    color: "#fff",
  },
  stepLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: "0.05em",
  },
  stepContent: {
    marginBottom: "24px",
  },
  stepTitle: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: "600",
    letterSpacing: "0.1em",
    margin: "0 0 8px 0",
  },
  mainTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 24px 0",
  },
  stationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  stationCard: {
    padding: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    fontFamily: "inherit",
  },
  stationHeader: {
    marginBottom: "12px",
  },
  stationName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },
  stationDistance: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
  },
  stationDetails: {
    display: "flex",
    gap: "16px",
  },
  stationDetail: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fuelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  fuelCard: {
    padding: "20px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    fontFamily: "inherit",
  },
  fuelIcon: {
    fontSize: "32px",
  },
  fuelName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },
  fuelDescription: {
    fontSize: "12px",
    color: "#64748b",
    textAlign: "center",
  },
  fuelOctane: {
    fontSize: "12px",
    color: "#3b82f6",
    fontWeight: "500",
  },
  fuelPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#3b82f6",
    marginTop: "8px",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "24px",
  },
  slotCard: {
    padding: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
    fontFamily: "inherit",
  },
  slotPeriod: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
    letterSpacing: "0.05em",
    marginBottom: "4px",
  },
  slotTime: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "4px",
  },
  slotCapacity: {
    fontSize: "12px",
    color: "#64748b",
  },
  slotNote: {
    fontSize: "13px",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "12px",
    borderRadius: "8px",
    margin: "0",
  },
  confirmDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  confirmSection: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  confirmLabel: {
    fontWeight: "600",
    color: "#1e293b",
  },
  confirmNote: {
    fontSize: "12px",
    color: "#64748b",
    margin: "0",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-start",
  },
  backButton: {
    padding: "10px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  confirmButton: {
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  sidebar: {
    width: "320px",
    background: "#1e40af",
    color: "#fff",
    padding: "24px",
    borderRadius: "12px",
    height: "fit-content",
    position: "sticky",
    top: "24px",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  reference: {
    fontSize: "13px",
    color: "#bfdbfe",
    margin: "0 0 24px 0",
  },
  summarySection: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.1em",
    color: "#bfdbfe",
    marginBottom: "4px",
  },
  sectionValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "4px",
  },
  sectionDetail: {
    fontSize: "12px",
    color: "#bfdbfe",
  },
  totalSection: {
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  totalLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#bfdbfe",
  },
  totalPrice: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#fff",
  },
};
