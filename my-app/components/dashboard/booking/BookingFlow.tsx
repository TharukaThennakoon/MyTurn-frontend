"use client";

import React, { useMemo, useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";
import BookingStepper, {
  type BookingStep,
} from "@/components/dashboard/booking/BookingStepper";
import BookingSelectStation, {
  type StationOption,
} from "@/components/dashboard/booking/BookingSelectStation";
import BookingChooseFuel, {
  type FuelOption,
} from "@/components/dashboard/booking/BookingChooseFuel";
import BookingPickSlot, {
  type SlotOption,
} from "@/components/dashboard/booking/BookingPickSlot";
import BookingSummaryPanel from "@/components/dashboard/booking/BookingSummaryPanel";

const STATIONS: StationOption[] = [
  {
    id: "central",
    name: "Velocity Central Hub",
    address: "4.2 km • Downtown District",
    status: "AVAILABLE",
    waitMin: 12,
    driveMin: 8,
  },
  {
    id: "metro",
    name: "Metro North Point",
    address: "6.8 km • Uptown Expressway",
    status: "BUSY",
    waitMin: 35,
    driveMin: 15,
  },
];

const FUELS: FuelOption[] = [
  {
    id: "premium",
    name: "Premium Petrol",
    description: "95 Octane High Performance",
    pricePerLiter: "$1.84/L",
  },
  {
    id: "diesel",
    name: "Ultra Diesel",
    description: "Low Sulfur Environmental Grade",
    pricePerLiter: "$1.72/L",
  },
];

const SLOTS: SlotOption[] = [
  {
    id: "s1",
    period: "MORNING",
    time: "09:30 AM",
    capacity: "High Capacity",
    capacityLevel: "high",
  },
  {
    id: "s2",
    period: "MORNING",
    time: "10:45 AM",
    capacity: "Near Full",
    capacityLevel: "near",
  },
  {
    id: "s3",
    period: "NOON",
    time: "12:15 PM",
    capacity: "Moderate",
    capacityLevel: "moderate",
  },
  {
    id: "s4",
    period: "AFTERNOON",
    time: "02:30 PM",
    capacity: "Very Busy",
    capacityLevel: "busy",
  },
];

export default function BookingFlow() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [station, setStation] = useState<StationOption | null>(null);
  const [fuel, setFuel] = useState<FuelOption | null>(null);
  const [slot, setSlot] = useState<SlotOption | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const completedStep = useMemo(() => {
    if (slot) return 3;
    if (fuel) return 2;
    if (station) return 1;
    return 0;
  }, [station, fuel, slot]);

  const activeStep = useMemo((): BookingStep => {
    if (confirmed) return 4;
    if (slot) return 4;
    if (fuel) return 3;
    if (station) return 2;
    return 1;
  }, [station, fuel, slot, confirmed]);

  const handleStationSelect = (s: StationOption) => {
    setStation(s);
    setConfirmed(false);
  };

  const handleFuelSelect = (f: FuelOption) => {
    setFuel(f);
    setConfirmed(false);
  };

  const handleSlotSelect = (s: SlotOption) => {
    setSlot(s);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (station && fuel && slot) {
      setConfirmed(true);
    }
  };

  const canConfirm = Boolean(station && fuel && slot && !confirmed);

  return (
    <div style={styles.shell}>
      <DashboardTopbar />

      <main style={styles.main}>
        <BookingStepper activeStep={activeStep} completedStep={completedStep} />

        {confirmed && (
          <div style={styles.successBanner} role="status">
            Booking confirmed! Reference #MT-2934-X — see you at {station?.name}
            .
          </div>
        )}

        <div style={styles.layout} className="booking-flow-layout">
          <div style={styles.left}>
            <BookingSelectStation
              stations={STATIONS}
              selectedId={station?.id ?? null}
              onSelect={handleStationSelect}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <BookingChooseFuel
              fuels={FUELS}
              selectedId={fuel?.id ?? null}
              onSelect={handleFuelSelect}
            />

            <BookingPickSlot
              slots={SLOTS}
              selectedId={slot?.id ?? null}
              onSelect={handleSlotSelect}
              waitEstimateMins={slot ? 18 : undefined}
            />
          </div>

          <BookingSummaryPanel
            referenceId="#MT-2934-X"
            station={station}
            fuel={fuel}
            slot={slot}
            serviceFee="$0.45"
            waitEstimate="~18 mins"
            canConfirm={canConfirm}
            onConfirm={handleConfirm}
          />
        </div>
      </main>

      <DashboardBottomNav active="bookings" />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "0 24px 24px",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 28,
    alignItems: "start",
  },
  left: {
    minWidth: 0,
  },
  successBanner: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#86efac",
  },
};
