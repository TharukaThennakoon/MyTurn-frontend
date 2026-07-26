"use client";

import React, { useMemo, useState, useEffect } from "react";
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
import apiClient from "@/services/apiClient";

interface BackendStation {
  id: number;
  stationName: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  avgServiceTimeMinutes?: number;
  status?: string;
}

// Matches TimeSlotResponse.java exactly
interface Timeslot {
  id: number;
  slotDate: string;
  startTime: string;      // "08:00:00"
  endTime: string;
  fuelType: string;
  totalCapacity: number;
  availableCapacity: number;
  status: "OPEN" | "FULL" | "BLOCKED";
  bookable: boolean;
}

// Fuel type IDs MUST exactly match the backend FuelType enum:
// PETROL92, PETROL95, DIESEL, SUPER_DIESEL
const REAL_FUELS: FuelOption[] = [
  {
    id: "PETROL95",
    name: "Petrol 95 Octane",
    description: "95 Octane High Performance",
    pricePerLiter: "LKR 370/L",
  },
  {
    id: "DIESEL",
    name: "Auto Diesel (95)",
    description: "Low Sulfur Eco Grade Diesel",
    pricePerLiter: "LKR 325/L",
  },
  {
    id: "PETROL92",
    name: "Petrol 92 Octane",
    description: "Standard Regular 92 Octane",
    pricePerLiter: "LKR 340/L",
  },
  {
    id: "SUPER_DIESEL",
    name: "Super Diesel",
    description: "Premium High Cetane Diesel",
    pricePerLiter: "LKR 365/L",
  },
];

export default function BookingFlow() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [stationList, setStationList] = useState<StationOption[]>([]);
  const [slotList, setSlotList] = useState<SlotOption[]>([]);

  const [station, setStation] = useState<StationOption | null>(null);
  const [fuel, setFuel] = useState<FuelOption | null>(null);
  const [slot, setSlot] = useState<SlotOption | null>(null);

  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [tokenNumber, setTokenNumber] = useState<string>("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStations();

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => setUserCoords(null),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const getRealDistance = (stLat?: number, stLng?: number): { distStr: string; driveMin: number } => {
    if (!stLat || !stLng || !userCoords) {
      return { distStr: "1.8 km", driveMin: 6 };
    }
    const R = 6371;
    const dLat = ((stLat - userCoords.lat) * Math.PI) / 180;
    const dLon = ((stLng - userCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userCoords.lat * Math.PI) / 180) *
      Math.cos((stLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = R * c;
    const driveMins = Math.max(3, Math.round(distKm * 3));
    return {
      distStr: distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`,
      driveMin: driveMins,
    };
  };

  const fetchStations = async () => {
    try {
      const res = await apiClient.get<BackendStation[]>("/stations");
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: StationOption[] = res.data.map((s, idx) => {
          const { distStr, driveMin } = getRealDistance(s.latitude, s.longitude);
          return {
            id: String(s.id),
            name: s.stationName,
            address: `${distStr} • ${s.address || s.district || s.city || "Sri Lanka"}`,
            status: s.status === "OPEN" ? "AVAILABLE" : "BUSY",
            waitMin: s.avgServiceTimeMinutes || (idx * 4 + 8),
            driveMin,
            lat: s.latitude || 6.7181,
            lng: s.longitude || 80.7875,
          };
        });
        setStationList(mapped);
        setStation(mapped[0]);
        fetchTimeslotsForStation(Number(mapped[0].id));
      } else {
        fallbackStations();
      }
    } catch (e) {
      fallbackStations();
    }
  };

  const fallbackStations = () => {
    const defaultM: StationOption[] = [
      {
        id: "1",
        name: "Ceypetco 1",
        address: "1.8 km • Trincomalee, Sri Lanka",
        status: "AVAILABLE",
        waitMin: 8,
        driveMin: 6,
        lat: 6.7181078,
        lng: 80.7875539,
      },
      {
        id: "2",
        name: "Lanka IOC Central",
        address: "3.4 km • Trincomalee Expressway",
        status: "BUSY",
        waitMin: 18,
        driveMin: 12,
        lat: 8.540307,
        lng: 81.184,
      },
    ];
    setStationList(defaultM);
    setStation(defaultM[0]);
    fetchTimeslotsForStation(1);
  };

  const fetchTimeslotsForStation = async (stId: number, fuelType?: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      // Correct endpoint: GET /api/v1/stations/{stationId}/slots?date=...&fuelType=...
      // fuelType must match backend FuelType enum: PETROL92, PETROL95, DIESEL, SUPER_DIESEL
      const ft = fuelType || "DIESEL";
      const res = await apiClient.get<Timeslot[]>(
        `/stations/${stId}/slots?date=${today}&fuelType=${ft}`
      );
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mappedSlots: SlotOption[] = res.data.map((ts: Timeslot) => {
          const startHour = parseInt(ts.startTime.split(":")[0]);
          const period = startHour < 12 ? "MORNING" : startHour < 14 ? "NOON" : "AFTERNOON";
          // availableCapacity = slots still bookable
          const left = ts.availableCapacity;
          const level: SlotOption["capacityLevel"] = left > 5 ? "high" : left > 2 ? "moderate" : "near";
          return {
            id: String(ts.id),  // Real numeric ID from DB
            period,
            time: `${ts.startTime.substring(0, 5)} - ${ts.endTime.substring(0, 5)}`,
            capacity: left > 0 ? `${left} Slots Left` : "Near Full",
            capacityLevel: level,
          };
        });
        setSlotList(mappedSlots);
        setSlot(mappedSlots[0]);
      } else {
        // Backend returned no slots (shouldn't happen since backend auto-generates)
        // Use fallback slots for offline/error cases
        fallbackSlots();
      }
    } catch (e) {
      fallbackSlots();
    }
  };

  const fallbackSlots = () => {
    const defaultS: SlotOption[] = [
      { id: "s1", period: "MORNING", time: "08:00 - 08:10", capacity: "High Capacity", capacityLevel: "high" },
      { id: "s2", period: "MORNING", time: "08:10 - 08:20", capacity: "Near Full", capacityLevel: "near" },
      { id: "s3", period: "NOON", time: "12:15 - 12:25", capacity: "Moderate", capacityLevel: "moderate" },
      { id: "s4", period: "AFTERNOON", time: "02:30 - 02:40", capacity: "Very Busy", capacityLevel: "busy" },
    ];
    setSlotList(defaultS);
    setSlot(defaultS[0]);
  };

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
    // Only fetch slots if a fuel is already selected
    if (fuel) {
      fetchTimeslotsForStation(Number(s.id), fuel.id);
    }
  };

  const handleFuelSelect = (f: FuelOption) => {
    setFuel(f);
    setSlot(null);
    setConfirmed(false);
    // Fetch timeslots filtered by the selected fuel type
    if (station) {
      fetchTimeslotsForStation(Number(station.id), f.id);
    }
  };

  const handleSlotSelect = (s: SlotOption) => {
    setSlot(s);
    setConfirmed(false);
  };

  const handleConfirm = async () => {
    if (!station || !fuel || !slot) return;
    setSubmitting(true);
    setBookingError(null);

    // Get vehicleId stored at login (backend @NotNull field)
    const getVehicleId = (): number | null => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const u = JSON.parse(userStr);
          return u.vehicleId ? Number(u.vehicleId) : null;
        }
      } catch (e) {}
      return null;
    };

    const vehicleId = getVehicleId();
    if (!vehicleId) {
      setBookingError("Vehicle not found. Please log out and log in again to refresh your session.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        stationId: Number(station.id),
        vehicleId,                        // Required by backend — from user session
        fuelType: fuel.id as any,         // e.g. "PETROL95", "DIESEL" — matches backend enum
        timeSlotId: Number(slot.id),      // Correct camelCase matching backend field name
      };

      const res = await apiClient.post<any>("/bookings", payload);

      if (!res.success) {
        throw new Error(res.message || "Booking failed. Please try again.");
      }

      const bookingData = res.data || {};
      // Use backend token number, fall back to booking reference
      const generatedToken = bookingData.digitalToken?.tokenNumber
        || bookingData.bookingReference
        || `#TK-${Math.floor(100 + Math.random() * 900)}`;

      setTokenNumber(generatedToken);
      setConfirmed(true);

      // Get vehicle number for display
      const getUserVehicleNumber = (): string => {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const u = JSON.parse(userStr);
            if (u.vehicleNumber) return u.vehicleNumber;
          }
        } catch (e) {}
        return bookingData.vehicleNumber || "—";
      };

      const userVehicleNum = getUserVehicleNumber();

      // Save active booking for dashboard display
      const activeObj = {
        id: bookingData.id,
        bookingReference: bookingData.bookingReference,
        tokenNumber: bookingData.digitalToken?.tokenNumber || generatedToken,
        status: bookingData.status || "CONFIRMED",
        stationName: station.name,
        slotTimeRange: slot.time,
        estimatedArrivalMins: bookingData.estimatedWaitMinutes || 15,
        fuelType: fuel.name,
        vehicleNumber: userVehicleNum,
      };
      localStorage.setItem("userActiveBooking", JSON.stringify(activeObj));
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      setBookingError(err.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canConfirm = Boolean(station && fuel && slot && !confirmed && !submitting);

  return (
    <div style={styles.shell}>
      <DashboardTopbar />

      <main style={styles.main}>
        <BookingStepper activeStep={activeStep} completedStep={completedStep} />

        {confirmed && (
          <div style={styles.successBanner} role="status">
            ✓ Booking confirmed! Token <strong>{tokenNumber}</strong> issued — see you at <strong>{station?.name}</strong>.
          </div>
        )}

        {bookingError && (
          <div style={styles.errorBanner} role="alert">
            ⚠️ {bookingError}
          </div>
        )}

        <div style={styles.layout} className="booking-flow-layout">
          <div style={styles.left}>
            <BookingSelectStation
              stations={stationList}
              selectedId={station?.id ?? null}
              onSelect={handleStationSelect}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <BookingChooseFuel
              fuels={REAL_FUELS}
              selectedId={fuel?.id ?? null}
              onSelect={handleFuelSelect}
            />

            <BookingPickSlot
              slots={slotList}
              selectedId={slot?.id ?? null}
              onSelect={handleSlotSelect}
              waitEstimateMins={station?.waitMin || 15}
            />
          </div>

          <BookingSummaryPanel
            referenceId={tokenNumber}
            station={station}
            fuel={fuel}
            slot={slot}
            serviceFee="LKR 150"
            waitEstimate={`~${station?.waitMin || 15} mins`}
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
  errorBanner: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fca5a5",
  },
};
