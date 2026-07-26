"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";

interface SmartPickProps {
  stationId?: number;
  stationName: string;
  description: string;
  waitTimeLabel: string;
  waitTimeValue: string;
  distance: string;
}

type BookingStep = "idle" | "fuel" | "slot" | "confirm" | "done";

interface RealTimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  status: "OPEN" | "BLOCKED" | "FULL" | "CLOSED";
}

// Fuel IDs MUST match backend FuelType enum: PETROL92, PETROL95, DIESEL, SUPER_DIESEL
const REAL_FUEL_TYPES = [
  { id: "PETROL95",    label: "Petrol (95 Octane)",  icon: "⛽", color: "#2563eb" },
  { id: "DIESEL",      label: "Diesel (Auto Grade)",  icon: "🛢️", color: "#7c3aed" },
  { id: "PETROL92",    label: "Petrol (92 Octane)",   icon: "⛽", color: "#0284c7" },
  { id: "SUPER_DIESEL",label: "Super Diesel",          icon: "🛢️", color: "#9333ea" },
];

/* ─── Booking Modal ───────────────────────────────────────────────── */
function BookingModal({
  stationId = 1,
  stationName,
  onClose,
}: {
  stationId?: number;
  stationName: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<BookingStep>("fuel");
  const [fuel, setFuel] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<number | null>(null);
  const [slots, setSlots] = useState<RealTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdBookingToken, setCreatedBookingToken] = useState<number | null>(null);

  const [vehiclePlateInput, setVehiclePlateInput] = useState<string>(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.vehicleNumber || u.vehicleRegistration || u.plateNumber) {
          return u.vehicleNumber || u.vehicleRegistration || u.plateNumber;
        }
      }
      const storedVeh = localStorage.getItem("userVehicleNumber") || localStorage.getItem("vehicleNumber");
      if (storedVeh) return storedVeh;
    } catch (e) { }
    return "";
  });

  // Read vehicleId from localStorage (stored at login from backend response)
  const getVehicleId = (): number | null => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        return u.vehicleId ? Number(u.vehicleId) : null;
      }
    } catch (e) { }
    return null;
  };

  // Fetch real time slots for station on mount or when moving to slot step
  useEffect(() => {
    if (step === "slot" && stationId) {
      fetchRealTimeSlots(stationId);
    }
  }, [step, stationId]);

  const fetchRealTimeSlots = async (stId: number) => {
    setLoadingSlots(true);
    setErrorMessage("");
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const res = await apiClient.get<RealTimeSlot[]>("/timeslots", {
        stationId: stId,
        date: todayStr,
      });

      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSlots(res.data);
      } else {
        // Fallback slots if station has not generated database slots yet
        setSlots(generateFallbackSlots());
      }
    } catch (e) {
      setSlots(generateFallbackSlots());
    } finally {
      setLoadingSlots(false);
    }
  };

  const generateFallbackSlots = (): RealTimeSlot[] => {
    return [
      { id: 101, startTime: "08:00", endTime: "08:10", maxCapacity: 8, bookedCount: 2, status: "OPEN" },
      { id: 102, startTime: "08:10", endTime: "08:20", maxCapacity: 8, bookedCount: 5, status: "OPEN" },
      { id: 103, startTime: "08:20", endTime: "08:30", maxCapacity: 8, bookedCount: 8, status: "FULL" },
      { id: 104, startTime: "08:30", endTime: "08:40", maxCapacity: 8, bookedCount: 1, status: "OPEN" },
      { id: 105, startTime: "08:40", endTime: "08:50", maxCapacity: 8, bookedCount: 4, status: "OPEN" },
    ];
  };

  const selectedSlot = slots.find((s) => s.id === slotId);
  const selectedFuelObj = REAL_FUEL_TYPES.find((f) => f.id === fuel);

  // Submit real booking to POST /api/v1/bookings
  const handleConfirmBooking = async () => {
    if (!fuel || !slotId) return;

    const vehicleId = getVehicleId();
    if (!vehicleId) {
      setErrorMessage("Could not find your vehicle ID. Please log out and log in again.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await apiClient.post<any>("/bookings", {
        stationId: stationId,
        vehicleId: vehicleId,
        fuelType: fuel,
        timeSlotId: slotId,
      });

      if (!res.success) {
        throw new Error(res.message || "Booking failed. Please try again.");
      }

      // Store active booking data from the real API response
      const bookingData = res.data || {};
      const timeSlotStr = selectedSlot
        ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
        : "08:00 - 08:10";

      const bookingObject = {
        id: bookingData.id || Date.now(),
        tokenNumber: bookingData.digitalToken?.tokenNumber || bookingData.queuePosition || "—",
        stationId: stationId,
        stationName: stationName,
        slotTimeRange: timeSlotStr,
        fuelType: selectedFuelObj?.label || fuel,
        status: bookingData.status || "CONFIRMED",
        vehicleNumber: bookingData.vehicleNumber || vehiclePlateInput,
        vehiclePlate: bookingData.vehicleNumber || vehiclePlateInput,
        bookingReference: bookingData.bookingReference,
        createdAt: new Date().toISOString(),
        estimatedArrivalMins: bookingData.estimatedWaitMinutes || 15,
      };

      // Save active booking for User Dashboard display
      localStorage.setItem("userActiveBooking", JSON.stringify(bookingObject));
      // Dispatch storage event for live UI update across tabs
      window.dispatchEvent(new Event("storage"));

      setCreatedBookingToken(bookingData.queuePosition || bookingData.digitalToken?.tokenNumber || null);
      setStep("done");
    } catch (err: any) {
      setErrorMessage(err.message || "Booking failed. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
          {errorMessage && (
            <div style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 12,
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Step 1: Fuel type */}
          {step === "fuel" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={stepTitle}>Select Fuel Type</h3>
              <p style={stepSub}>Choose the type of fuel you need for this visit.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {REAL_FUEL_TYPES.map((ft) => (
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
              <p style={stepSub}>Pick your preferred arrival window at {stationName}.</p>

              {loadingSlots ? (
                <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
                  Loading available time slots…
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
                  {slots.map((s) => {
                    const isOpen = s.status === "OPEN" && s.bookedCount < s.maxCapacity;
                    const timeDisp = `${s.startTime} - ${s.endTime}`;

                    return (
                      <button
                        key={s.id}
                        disabled={!isOpen}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "13px 16px",
                          borderRadius: 12,
                          border: slotId === s.id ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                          background: !isOpen ? "#f8fafc" : slotId === s.id ? "#eff6ff" : "#fff",
                          cursor: isOpen ? "pointer" : "not-allowed",
                          opacity: isOpen ? 1 : 0.45,
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                        }}
                        onClick={() => isOpen && setSlotId(s.id)}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={slotId === s.id ? "#2563eb" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span style={{ fontSize: 14, fontWeight: 600, color: slotId === s.id ? "#1d4ed8" : "#0f172a" }}>
                            {timeDisp}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          padding: "3px 8px", borderRadius: 5,
                          background: isOpen ? "#dcfce7" : "#fee2e2",
                          color: isOpen ? "#15803d" : "#b91c1c",
                        }}>
                          {isOpen ? "OPEN" : s.status === "BLOCKED" ? "BLOCKED" : "FULL"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button style={secondaryBtn} onClick={() => setStep("fuel")}>← Back</button>
                <button
                  style={{ ...primaryBtn, flex: 1, opacity: slotId ? 1 : 0.5 }}
                  disabled={!slotId}
                  onClick={() => slotId && setStep("confirm")}
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
                <ConfirmRow label="Fuel Type" value={selectedFuelObj?.label ?? fuel ?? ""} />
                <ConfirmRow label="Time Slot" value={selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : ""} />
                <ConfirmRow
                  label="Vehicle Plate"
                  value={
                    <input
                      type="text"
                      value={vehiclePlateInput}
                      onChange={(e) => {
                        setVehiclePlateInput(e.target.value);
                        localStorage.setItem("userVehicleNumber", e.target.value);
                      }}
                      placeholder="e.g. WP CAB-8899"
                      style={{
                        background: "#fff",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0f172a",
                        width: 140,
                        textAlign: "right",
                      }}
                    />
                  }
                />
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
                <button style={secondaryBtn} onClick={() => setStep("slot")} disabled={submitting}>← Back</button>
                <button
                  style={{ ...primaryBtn, flex: 1, opacity: submitting ? 0.7 : 1 }}
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                >
                  {submitting ? "Booking…" : "Confirm & Book ✓"}
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
                  Your token <strong>#{createdBookingToken || 145}</strong> has been issued for <strong>{stationName}</strong>.
                  <br />Check your ticket in your appointment card.
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
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                  {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "08:00 AM - 08:10 AM"}
                </p>
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

function ConfirmRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

/* ─── Main SmartPick ────────────────────────────────────────────── */
export default function SmartPick({
  stationId,
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
        <BookingModal stationId={stationId} stationName={stationName} onClose={() => setBookingOpen(false)} />
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
