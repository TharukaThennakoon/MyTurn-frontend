"use client";

import React, { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";
import apiClient from "@/services/apiClient";
import SmartPick from "@/components/dashboard/SmartPick";

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
  openingTime?: string;
  closingTime?: string;
}

interface Timeslot {
  id: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  status: "OPEN" | "FULL" | "BLOCKED";
}

export default function StationsPage() {
  const [stations, setStations] = useState<BackendStation[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fuelStatus, setFuelStatus] = useState<{ petrol: string; diesel: string }>({
    petrol: "AVAILABLE",
    diesel: "LIMITED",
  });
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetchRealStations();

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

  const fetchRealStations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<BackendStation[]>("/stations");
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setStations(res.data);
        const first = res.data[0];
        setSelectedStationId(first.id);
        fetchTimeslotsForStation(first.id);
        loadFuelStatusForStation(first.id);
      }
    } catch (e) {
      console.warn("Failed to fetch real stations:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeslotsForStation = async (stId: number) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await apiClient.get<Timeslot[]>(`/timeslots?stationId=${stId}&date=${today}`);
      if (res.success && Array.isArray(res.data)) {
        setTimeslots(res.data);
      }
    } catch (e) {
      console.warn("Failed to fetch timeslots:", e);
    }
  };

  const loadFuelStatusForStation = (stId: number) => {
    try {
      const stored = localStorage.getItem(`stationFuelStatus_${stId}`) || localStorage.getItem("stationFuelStatus_latest");
      if (stored) {
        const parsed = JSON.parse(stored);
        setFuelStatus({
          petrol: parsed.petrol || "AVAILABLE",
          diesel: parsed.diesel || "LIMITED",
        });
      }
    } catch (e) {}
  };

  const handleSelectStation = (st: BackendStation) => {
    setSelectedStationId(st.id);
    fetchTimeslotsForStation(st.id);
    loadFuelStatusForStation(st.id);
  };

  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  const getRealDistance = (stLat?: number, stLng?: number): string => {
    if (!stLat || !stLng) return "1.2 km";
    if (!userCoords) return "Locating…";
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
    const dist = R * c;
    return dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
  };

  const latNum = selectedStation?.latitude || 6.7181;
  const lonNum = selectedStation?.longitude || 80.7875;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lonNum - 0.015}%2C${latNum - 0.015}%2C${lonNum + 0.015}%2C${latNum + 0.015}&layer=mapnik&marker=${latNum}%2C${lonNum}`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${latNum},${lonNum}&travelmode=driving`;

  const fullAddr = [selectedStation?.address, selectedStation?.city, selectedStation?.district].filter(Boolean).join(", ") || "Sri Lanka";

  return (
    <div style={styles.shell}>
      <DashboardTopbar />

      <main style={styles.main}>
        {/* Map view hero iframe */}
        <div style={styles.mapContainer}>
          <div style={styles.mapPlaceholder}>
            <iframe
              title="Station Map View"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={mapEmbedUrl}
              style={{ border: 0 }}
            />

            {/* Status badge */}
            <div style={styles.mapBadge}>
              <span style={{ ...styles.statusDot, background: "#22c55e" }} />
              <span style={styles.badgeText}>LIVE NOW</span>
            </div>

            {/* Station name overlay */}
            <div style={styles.mapStationLabel}>
              <p style={styles.mapStationName}>{selectedStation?.stationName || "Registered Fuel Station"}</p>
              <p style={styles.mapStationAddr}>📍 {fullAddr}</p>
            </div>

            {/* Zoom / Navigation button */}
            <button
              style={styles.zoomBtn}
              onClick={() => window.open(gmapsUrl, "_blank")}
              aria-label="Open in Google Maps"
              title="Open turn-by-turn navigation"
            >
              ↗
            </button>
          </div>
        </div>

        {/* Station info */}
        <div style={styles.infoSection}>
          <h2 style={styles.stationName}>{selectedStation?.stationName || "Registered Fuel Station"}</h2>
          <p style={styles.stationAddress}>
            <span style={styles.pinIcon}>📍</span>
            {fullAddr}
          </p>

          {/* Metrics row */}
          <div style={styles.metricsRow}>
            <div style={styles.metric}>
              <p style={styles.metricLabel}>AVAILABILITY</p>
              <p style={styles.fuelItem}>
                95 Octane
                <span
                  style={{
                    ...styles.fuelBadge,
                    background: fuelStatus.petrol === "AVAILABLE" ? "#86efac" : fuelStatus.petrol === "LIMITED" ? "#fcd34d" : "#fed7aa",
                  }}
                >
                  {fuelStatus.petrol}
                </span>
              </p>
              <p style={styles.fuelItem}>
                Diesel Pro
                <span
                  style={{
                    ...styles.fuelBadge,
                    background: fuelStatus.diesel === "AVAILABLE" ? "#86efac" : fuelStatus.diesel === "LIMITED" ? "#fcd34d" : "#fed7aa",
                  }}
                >
                  {fuelStatus.diesel}
                </span>
              </p>
            </div>

            <div style={styles.waitCard}>
              <p style={styles.waitLabel}>WAIT TIME</p>
              <p style={styles.waitTime}>{selectedStation?.avgServiceTimeMinutes || 8}</p>
              <p style={styles.waitSub}>MINUTES</p>
            </div>

            <div style={styles.metric}>
              <p style={styles.metricLabel}>QUEUE</p>
              <p style={styles.queueValue}>6</p>
              <p style={styles.queueSub}>VEHICLES</p>
            </div>
          </div>

          {/* Queue flow */}
          <div style={styles.flowSection}>
            <div style={styles.flowHeader}>
              <p style={styles.flowLabel}>QUEUE FLOW VELOCITY</p>
              <p style={styles.flowValue}>Expected throughput: 4.2 v/hr</p>
            </div>
            <div style={styles.flowBar}>
              <div
                style={{
                  ...styles.flowBarFill,
                  width: `68%`,
                }}
              />
            </div>
            <div style={styles.flowLabels}>
              <span>LOW TRAFFIC</span>
              <span>PEAK FLOW</span>
            </div>
          </div>

          {/* Available slots */}
          <div style={styles.slotsSection}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={styles.slotsTitle}>Available Slots</h3>
              <button
                onClick={() => setBookingOpen(true)}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Book Slot
              </button>
            </div>

            <div style={styles.slotsList}>
              {timeslots.length > 0 ? (
                timeslots.slice(0, 4).map((slot, idx) => {
                  const isFull = slot.status === "FULL" || slot.bookedCount >= slot.maxCapacity;
                  const left = Math.max(0, slot.maxCapacity - slot.bookedCount);
                  return (
                    <button
                      key={slot.id}
                      onClick={() => !isFull && setBookingOpen(true)}
                      style={{
                        ...styles.slotCard,
                        ...(idx === 0 ? styles.slotCardSelected : {}),
                        ...(isFull ? styles.slotCardFull : {}),
                      }}
                    >
                      <span style={styles.slotTime}>{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>
                      <span style={styles.slotStatus}>{isFull ? "Full" : `${left} Left`}</span>
                    </button>
                  );
                })
              ) : (
                [
                  { time: "08:00 - 08:10", status: "Selected" },
                  { time: "08:10 - 08:20", status: "3 Left" },
                  { time: "08:20 - 08:30", status: "5 Left" },
                ].map((slot, idx) => (
                  <button
                    key={slot.time}
                    onClick={() => setBookingOpen(true)}
                    style={{
                      ...styles.slotCard,
                      ...(idx === 0 ? styles.slotCardSelected : {}),
                    }}
                  >
                    <span style={styles.slotTime}>{slot.time}</span>
                    <span style={styles.slotStatus}>{slot.status}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Policy info */}
          <div style={styles.policySection}>
            <span style={styles.policyIcon}>ℹ</span>
            <div>
              <p style={styles.policyTitle}>BOOKING POLICY</p>
              <p style={styles.policyText}>
                Arrival window is 10 minutes. Slots not claimed within this period will be
                released to the general queue.
              </p>
            </div>
          </div>
        </div>

        {/* Stations list */}
        <div style={styles.listSection}>
          <h3 style={styles.listTitle}>Other Nearby Stations</h3>
          <div style={styles.stationsList}>
            {stations.length > 0 ? (
              stations.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleSelectStation(st)}
                  style={{
                    ...styles.stationCard,
                    ...(selectedStationId === st.id ? styles.stationCardActive : {}),
                  }}
                >
                  <div style={styles.cardTop}>
                    <div>
                      <h4 style={styles.cardName}>{st.stationName}</h4>
                      <p style={styles.cardDistance}>{getRealDistance(st.latitude, st.longitude)}</p>
                    </div>
                    <div style={styles.cardMeta}>
                      <p style={styles.cardWait}>{st.avgServiceTimeMinutes || 8} min</p>
                      <p style={styles.cardQueue}>6 vehicles</p>
                    </div>
                  </div>
                  <div style={styles.cardFuel}>
                    <span style={styles.cardFuelTag}>Petrol 95</span>
                    <span style={styles.cardFuelTag}>Diesel</span>
                  </div>
                </button>
              ))
            ) : (
              <div style={{ padding: "20px 0", color: "#64748b", fontSize: 13 }}>Loading registered stations…</div>
            )}
          </div>
        </div>
      </main>

      <DashboardBottomNav active="stations" />

      {/* Smart Booking Modal */}
      {bookingOpen && selectedStation && (
        <SmartPick
          stationId={selectedStation.id}
          stationName={selectedStation.stationName}
          description={`Registered station in ${selectedStation.city || selectedStation.district || "Sri Lanka"}`}
          waitTimeLabel="Wait Time"
          waitTimeValue={`${selectedStation.avgServiceTimeMinutes || 8} mins`}
          distance={getRealDistance(selectedStation.latitude, selectedStation.longitude)}
        />
      )}
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
    paddingBottom: 12,
  },
  mapContainer: {
    width: "100%",
    height: 320,
    position: "relative",
    zIndex: 5,
    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.12)",
    borderRadius: "0 0 16px 16px",
    overflow: "hidden",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    background: "#0f172a",
  },
  mapStationLabel: {
    position: "absolute",
    bottom: 52,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  mapStationName: {
    margin: "0 0 2px",
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
  },
  mapStationAddr: {
    margin: 0,
    fontSize: 13.5,
    color: "rgba(255,255,255,0.8)",
    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },
  mapBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
  },
  badgeText: {
    fontSize: 13.5,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "0.05em",
  },
  zoomBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    padding: "20px 20px 0",
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
  },
  stationName: {
    fontSize: 26,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 8px",
    letterSpacing: "-0.01em",
  },
  stationAddress: {
    fontSize: 15.5,
    color: "#64748b",
    margin: "0 0 16px",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  pinIcon: {
    fontSize: 16,
  },
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 180px 1fr",
    gap: 16,
    marginBottom: 20,
  },
  metric: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 18px",
    border: "1px solid #e2e8f0",
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: "0 0 8px",
  },
  fuelItem: {
    fontSize: 15,
    fontWeight: 600,
    color: "#0f172a",
    margin: "4px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  fuelBadge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 4,
    color: "#0f172a",
    letterSpacing: "0.05em",
  },
  waitCard: {
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    borderRadius: 12,
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
  },
  waitLabel: {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.1em",
    margin: "0 0 4px",
    opacity: 0.9,
  },
  waitTime: {
    fontSize: 32,
    fontWeight: 800,
    margin: 0,
    lineHeight: 1,
  },
  waitSub: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    margin: "2px 0 0",
    opacity: 0.85,
  },
  queueValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 2px",
    lineHeight: 1,
  },
  queueSub: {
    fontSize: 11.5,
    fontWeight: 600,
    color: "#94a3b8",
    margin: 0,
  },
  flowSection: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 18px",
    border: "1px solid #e2e8f0",
    marginBottom: 16,
  },
  flowHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  flowLabel: {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: 0,
  },
  flowValue: {
    fontSize: 13.5,
    fontWeight: 600,
    color: "#64748b",
    margin: 0,
  },
  flowBar: {
    width: "100%",
    height: 6,
    background: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  flowBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
    borderRadius: 4,
  },
  flowLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#94a3b8",
  },
  slotsSection: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 22px",
    border: "1px solid #e2e8f0",
    marginBottom: 16,
  },
  slotsTitle: {
    fontSize: 16.5,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 12px",
  },
  slotsList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  slotCard: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: "14px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  slotCardSelected: {
    background: "#eff6ff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#2563eb",
  },
  slotCardFull: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  slotTime: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
  },
  slotStatus: {
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
  },
  policySection: {
    background: "#eff6ff",
    borderRadius: 12,
    padding: "14px 16px",
    border: "1px solid #dbeafe",
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  policyIcon: {
    width: 24,
    height: 24,
    background: "#2563eb",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13.5,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 2,
  },
  policyTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#1e40af",
    margin: "0 0 4px",
  },
  policyText: {
    fontSize: 13.5,
    color: "#1e40af",
    margin: 0,
    lineHeight: 1.4,
  },
  listSection: {
    padding: "0 20px 24px",
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
  },
  listTitle: {
    fontSize: 16.5,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 12px",
  },
  stationsList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  stationCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "16px 18px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  stationCardActive: {
    background: "#eff6ff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#2563eb",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16.5,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  cardDistance: {
    fontSize: 13.5,
    color: "#64748b",
    margin: 0,
  },
  cardMeta: {
    textAlign: "right",
  },
  cardWait: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 2px",
  },
  cardQueue: {
    fontSize: 13,
    color: "#64748b",
    margin: 0,
  },
  cardFuel: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  cardFuelTag: {
    fontSize: 12.5,
    fontWeight: 700,
    background: "#dbeafe",
    color: "#1e40af",
    padding: "5px 10px",
    borderRadius: 4,
  },
};
