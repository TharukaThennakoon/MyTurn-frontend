"use client";

import React, { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import ActiveAppointmentCard from "@/components/dashboard/ActiveAppointmentCard";
import NearbyStations from "@/components/dashboard/NearbyStations";
import QuickInsights from "@/components/dashboard/QuickInsights";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";
import apiClient from "@/services/apiClient";

interface BackendStation {
  id: number;
  stationName: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  avgServiceTimeMinutes?: number;
}

interface ActiveBooking {
  id: string;
  tokenNumber: number;
  stationName: string;
  slotTimeRange: string;
  status: string;
  estimatedArrivalMins?: number;
}

export default function UserDashboard() {
  const [stations, setStations] = useState<BackendStation[]>([]);
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(null);
  const [lastCompletedBooking, setLastCompletedBooking] = useState<ActiveBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchDashboardData();

    // Track real user live GPS location with high accuracy
    let watchId: number | null = null;
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation permission denied or unavailable:", err);
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }

    const handleStorageChange = () => {
      loadActiveBookingFromStorage();
    };
    window.addEventListener("storage", handleStorageChange);

    // ── Poll every 15 s for booking status changes ────────────────────────────
    // When admin clicks "Call Next Vehicle", the booking status changes to
    // COMPLETED on the backend. This polling detects that change automatically.
    const pollInterval = setInterval(silentPollBooking, 15000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
      if (watchId !== null && typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadActiveBookingFromStorage = () => {
    try {
      const stored = localStorage.getItem("userActiveBooking");
      if (!stored) {
        setActiveBooking(null);
        return;
      }

      const parsed = JSON.parse(stored);
      const userStr = localStorage.getItem("user");
      let currentUserEmail = "";
      let currentVehicle = "";

      if (userStr) {
        const u = JSON.parse(userStr);
        currentUserEmail = u.email || "";
        currentVehicle = u.vehicleNumber || localStorage.getItem("userVehicleNumber") || "";
      }

      // Check if booking belongs to current logged in user
      const isOwner =
        !parsed.userEmail ||
        !currentUserEmail ||
        parsed.userEmail === currentUserEmail ||
        (parsed.vehiclePlate && currentVehicle && parsed.vehiclePlate === currentVehicle) ||
        (parsed.vehicleNumber && currentVehicle && parsed.vehicleNumber === currentVehicle);

      if (isOwner) {
        setActiveBooking(parsed);
      } else {
        setActiveBooking(null);
      }
    } catch (e) {
      setActiveBooking(null);
    }
  };

  /**
   * Silent background poll — no loading spinner, just updates the booking card.
   * Detects when admin marks the booking COMPLETED.
   */
  const silentPollBooking = async () => {
    try {
      const bookingRes = await apiClient.get<ActiveBooking>("/bookings/active");
      if (bookingRes.success && bookingRes.data) {
        setActiveBooking(bookingRes.data);
        setLastCompletedBooking(null);
      }
    } catch (e: any) {
      const msg = e?.message?.toLowerCase() || "";
      if (msg.includes("no active booking") || msg.includes("not found")) {
        // Booking was completed or cancelled — capture it from lastCompletedBooking
        setActiveBooking((prev) => {
          if (prev) setLastCompletedBooking(prev);
          return null;
        });
      }
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    // Load local storage active booking first
    loadActiveBookingFromStorage();

    try {
      // 1. Fetch real stations registered by admins
      const stationsRes = await apiClient.get<BackendStation[]>("/stations");
      if (stationsRes.success && Array.isArray(stationsRes.data)) {
        setStations(stationsRes.data);
      }
    } catch (e) {
      console.warn("Stations fetch error:", e);
    }

    try {
      // 2. Fetch active booking — "No active booking found" is a normal 404, not a real error
      const bookingRes = await apiClient.get<ActiveBooking>("/bookings/active");
      if (bookingRes.success && bookingRes.data) {
        setActiveBooking(bookingRes.data);
      }
    } catch (e: any) {
      const msg = e?.message?.toLowerCase() || "";
      // Silently ignore expected "no active booking" 404 — user just doesn't have one
      if (!msg.includes("no active booking") && !msg.includes("not found")) {
        console.warn("Active booking fetch error:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Haversine Distance Calculation Formula ─────────────────────────
  const getRealDistance = (stLat?: number, stLng?: number): string => {
    if (!stLat || !stLng) return "1.2 km";
    if (!userCoords) return "Locating…";

    const R = 6371; // Earth's radius in KM
    const dLat = ((stLat - userCoords.lat) * Math.PI) / 180;
    const dLon = ((stLng - userCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userCoords.lat * Math.PI) / 180) *
      Math.cos((stLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  };

  // Map real backend stations into NearbyStations prop format
  const mappedNearbyStations = stations.length > 0
    ? stations.map((s, idx) => ({
      id: String(s.id),
      name: s.stationName,
      distance: getRealDistance(s.latitude, s.longitude),
      status: (s.status === "OPEN" ? (idx === 0 ? "OPTIMAL" : "BUSY") : "HIGH") as "OPTIMAL" | "BUSY" | "HIGH",
      waitMin: s.avgServiceTimeMinutes || (idx * 5 + 8),
      queueSize: 6,
      queueLabel: s.status === "OPEN" ? "LOW" : "MED",
      icon: "▦",
      iconBg: s.status === "OPEN" ? "#d1fae5" : "#fef3c7",
      lat: s.latitude,
      lng: s.longitude,
    }))
    : [
      {
        id: "1",
        name: "Registered Fuel Station",
        distance: "0.8 km",
        status: "OPTIMAL" as const,
        waitMin: 8,
        queueSize: 6,
        queueLabel: "LOW",
        icon: "▦",
        iconBg: "#d1fae5",
      },
    ];

  const QUICK_INSIGHTS = [
    { icon: "▦", label: "AVAILABILITY", value: "95%" },
    { icon: "⊙", label: "STATIONS", value: String(Math.max(1, stations.length)) },
    { icon: "↗", label: "PEAK HOUR", value: "6:00 PM" },
    { icon: "▣", label: "REGIONS", value: "Sri Lanka" },
  ];

  return (
    <div style={styles.shell}>
      {/* Top bar */}
      <DashboardTopbar />

      {/* Scrollable body */}
      <main style={styles.body}>
        {/* Active appointment / Completed card */}
        {activeBooking ? (
          <ActiveAppointmentCard
            tokenNumber={activeBooking.tokenNumber || 101}
            status={activeBooking.status as any || "Active"}
            stationName={activeBooking.stationName || "Fuel Station"}
            timeRange={activeBooking.slotTimeRange || "Today"}
            arrivalMins={activeBooking.estimatedArrivalMins || 15}
            stationLat={stations[0]?.latitude || 6.7181078}
            stationLng={stations[0]?.longitude || 80.7875539}
            userLat={userCoords?.lat}
            userLng={userCoords?.lng}
          />
        ) : lastCompletedBooking ? (
          /* ── Booking Completed Banner ───────────────────────────────────── */
          <div style={styles.completedCard}>
            <div style={styles.completedIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#15803d", margin: 0 }}>
                Fuel Dispensed — All Done! ✓
              </h3>
              <p style={{ fontSize: 13, color: "#166534", margin: "4px 0 0" }}>
                Your booking at <strong>{lastCompletedBooking.stationName || "the station"}</strong> has been
                completed. Token <strong>#{lastCompletedBooking.tokenNumber}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div style={styles.noActiveCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={styles.noActiveIcon}>⛽</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  No Active Booking Currently
                </h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
                  Select a station below to reserve your fuel slot and skip the line.
                </p>
              </div>
            </div>
          </div>
        )}


        {/* Nearby Stations — full width, no SmartPick */}
        <div style={styles.nearbyCard}>
          <NearbyStations stations={mappedNearbyStations} />
        </div>

        {/* Quick Insights */}
        <QuickInsights insights={QUICK_INSIGHTS} />
      </main>

      {/* Bottom nav */}
      <DashboardBottomNav active="home" />
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "18px 18px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  noActiveCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "20px 24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
  },
  noActiveIcon: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  nearbyCard: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
    padding: "14px 18px 18px",
  },
  completedCard: {
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    borderRadius: 16,
    padding: "20px 24px",
    border: "1.5px solid #86efac",
    boxShadow: "0 4px 16px rgba(22, 163, 74, 0.12)",
    display: "flex",
    alignItems: "center",
    gap: 16,
    animation: "fadeInUp 0.4s ease",
  },
  completedIconWrap: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#ffffff",
    border: "2px solid #86efac",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(22, 163, 74, 0.15)",
  },
};
