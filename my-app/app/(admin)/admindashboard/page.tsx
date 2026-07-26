"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import { adminApiClient as apiClient } from "@/services/apiClient";


interface DashboardData {
  totalBookingsToday: number;
  vehiclesInQueue: number;
  vehiclesServedToday: number;
  fuelAvailability?: Array<{
    fuelType: string;
    available: boolean;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "",
    phone: "",
    stationId: null as number | null,
    stationName: "Your Station",
  });

  const [metrics, setMetrics] = useState<DashboardData>({
    totalBookingsToday: 0,
    vehiclesInQueue: 0,
    vehiclesServedToday: 0,
    fuelAvailability: [],
  });

  const [loading, setLoading] = useState(true);

  const [fuelStatus, setFuelStatus] = useState({
    petrol: "AVAILABLE",
    diesel: "AVAILABLE",
  });

  const [queueList, setQueueList] = useState<any[]>([]);

  useEffect(() => {
    let currentStId: number | null = null;
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        currentStId = parsed.stationId || null;
        setAdminData({
          name: parsed.name || parsed.fullName || "Admin",
          email: parsed.email || "",
          phone: parsed.phone || "",
          stationId: currentStId,
          stationName: parsed.stationName || "Your Station",
        });

        loadFuelStatusFromStorage(currentStId);
        loadQueueFromStorage(currentStId);

        if (currentStId) {
          fetchDashboardMetrics(currentStId);
        } else {
          setLoading(false);
        }
      } else {
        loadFuelStatusFromStorage(null);
        loadQueueFromStorage(null);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }

    const handleStorageChange = () => {
      loadFuelStatusFromStorage(currentStId);
      loadQueueFromStorage(currentStId);
    };

    window.addEventListener("storage", handleStorageChange);

    // ── Auto-refresh metrics every 30 s ─────────────────────────────────────
    // When the Queue page marks a vehicle as COMPLETED via the API, this timer
    // picks up the updated counts (vehiclesServedToday, vehiclesInQueue).
    const refreshInterval = setInterval(() => {
      if (currentStId) fetchDashboardMetrics(currentStId);
    }, 30000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(refreshInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDisplayVehiclePlate = (): string => {
    // 1. Check top item in queueList
    const topItem = queueList[0];
    if (topItem) {
      const v = topItem.vehiclePlate || topItem.vehicleNumber;
      if (v && v.trim() !== "" && v !== adminData.stationName) {
        return v;
      }
    }

    // 2. Check direct user vehicle stored in localStorage
    try {
      const userVeh = localStorage.getItem("userVehicleNumber") || localStorage.getItem("vehicleNumber");
      if (userVeh && userVeh.trim() !== "") return userVeh;

      const userObj = localStorage.getItem("user");
      if (userObj) {
        const parsed = JSON.parse(userObj);
        const v = parsed.vehicleNumber || parsed.vehicleRegistration || parsed.plateNumber;
        if (v && v.trim() !== "") return v;
      }
    } catch (e) {}

    // 3. Check active booking item
    try {
      const activeStr = localStorage.getItem("userActiveBooking");
      if (activeStr) {
        const activeObj = JSON.parse(activeStr);
        const v = activeObj.vehiclePlate || activeObj.vehicleNumber;
        if (v && v.trim() !== "") return v;
      }
    } catch (e) {}

    return "WP CAB-8899";
  };

  const loadQueueFromStorage = (stId: number | null) => {
    try {
      const keys = [
        "userActiveBooking",
        "stationBookings_latest",
        stId ? `stationBookings_${stId}` : null,
        "stationBookings_general",
      ].filter(Boolean) as string[];

      for (const k of keys) {
        const stored = localStorage.getItem(k);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQueueList(parsed);
            setMetrics((prev) => ({
              ...prev,
              totalBookingsToday: Math.max(prev.totalBookingsToday, parsed.length),
              vehiclesInQueue: parsed.length,
            }));
            return parsed;
          } else if (parsed && typeof parsed === "object" && parsed.tokenNumber) {
            const single = [{
              id: parsed.id || Date.now(),
              tokenNumber: parsed.tokenNumber,
              vehiclePlate: parsed.vehiclePlate || parsed.vehicleNumber || getDisplayVehiclePlate(),
              fuelType: parsed.fuelType || "Petrol 95",
              slotTime: parsed.slotTimeRange || "08:00 AM - 08:10 AM",
              status: "WAITING",
            }];
            setQueueList(single);
            setMetrics((prev) => ({
              ...prev,
              totalBookingsToday: Math.max(prev.totalBookingsToday, 1),
              vehiclesInQueue: 1,
            }));
            return single;
          }
        }
      }
    } catch (e) {}
    return [];
  };

  const loadFuelStatusFromStorage = (stId: number | null) => {
    try {
      const stored = localStorage.getItem("stationFuelStatus_latest") || (stId ? localStorage.getItem(`stationFuelStatus_${stId}`) : null);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFuelStatus({
          petrol: parsed.petrol || "AVAILABLE",
          diesel: parsed.diesel || "AVAILABLE",
        });
      }
    } catch (e) {}
  };

  const handleCompleteFilling = () => {
    const stId = adminData.stationId || 1;
    const updatedList = queueList.slice(1);
    setQueueList(updatedList);

    localStorage.setItem(`stationBookings_${stId}`, JSON.stringify(updatedList));
    localStorage.setItem("stationBookings_latest", JSON.stringify(updatedList));
    localStorage.setItem("stationBookings_general", JSON.stringify(updatedList));

    const servedCount = (metrics.vehiclesServedToday || 0) + 1;
    const newQueueCount = Math.max(0, (metrics.vehiclesInQueue || 1) - 1);
    const newMetrics = {
      vehiclesServedToday: servedCount,
      vehiclesInQueue: newQueueCount,
      totalBookingsToday: Math.max(metrics.totalBookingsToday, servedCount + updatedList.length),
    };

    setMetrics((prev) => ({
      ...prev,
      ...newMetrics,
    }));

    localStorage.setItem("adminServedMetrics", JSON.stringify(newMetrics));
    localStorage.setItem(`adminServedMetrics_${stId}`, JSON.stringify(newMetrics));

    try {
      const userActive = localStorage.getItem("userActiveBooking");
      if (userActive) {
        const parsed = JSON.parse(userActive);
        const updatedActive = {
          ...parsed,
          status: "Completed",
          tokenStatus: "SUCCESSFUL",
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        localStorage.setItem("userActiveBooking", JSON.stringify(updatedActive));
      }
    } catch (e) {}

    window.dispatchEvent(new Event("storage"));
  };

  const fetchDashboardMetrics = async (stationId: number) => {
    const localQueue = loadQueueFromStorage(stationId);
    const activeCount = localQueue.filter(q => q.status === "WAITING" || q.status === "SERVING" || !q.status).length;
    const servedStored = typeof window !== "undefined" ? localStorage.getItem("adminServedMetrics") || localStorage.getItem(`adminServedMetrics_${stationId}`) : null;
    const localServed = servedStored ? JSON.parse(servedStored).vehiclesServedToday || 0 : 0;

    try {
      const res = await apiClient.get<DashboardData>("/dashboard", { stationId });
      if (res.success && res.data) {
        const totalB = Math.max(res.data.totalBookingsToday ?? 0, localQueue.length + localServed);
        const activeQ = Math.max(res.data.vehiclesInQueue ?? 0, activeCount);
        const servedT = Math.max(res.data.vehiclesServedToday ?? 0, localServed);
        setMetrics({
          totalBookingsToday: totalB,
          vehiclesInQueue: activeQ,
          vehiclesServedToday: servedT,
          fuelAvailability: res.data.fuelAvailability || [],
        });

        if (res.data.fuelAvailability && res.data.fuelAvailability.length > 0) {
          const p = res.data.fuelAvailability.find(f => f.fuelType.toLowerCase().includes("petrol"));
          const d = res.data.fuelAvailability.find(f => f.fuelType.toLowerCase().includes("diesel"));
          setFuelStatus({
            petrol: p?.available ? "AVAILABLE" : "LIMITED",
            diesel: d?.available ? "AVAILABLE" : "LIMITED",
          });
        }
      } else {
        setMetrics({
          totalBookingsToday: Math.max(1, localQueue.length + localServed),
          vehiclesInQueue: activeCount,
          vehiclesServedToday: localServed,
          fuelAvailability: [],
        });
      }
    } catch (e) {
      setMetrics({
        totalBookingsToday: Math.max(1, localQueue.length + localServed),
        vehiclesInQueue: activeCount,
        vehiclesServedToday: localServed,
        fuelAvailability: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <AdminSidebar activeNav="Overview" />

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className={styles.main}>
        {/* Topbar */}
        <AdminHeader searchPlaceholder="Search tokens..." />

        {/* Scrollable body */}
        <div className={styles.body}>
          {/* ── KPI Row ──────────────────────────────────────────────── */}
          <div className={styles.kpiGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentBlue}`} />
              <div className={styles.statHeader}>
                <svg className={`${styles.statIcon} ${styles.iconBlue}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span className={styles.badgeGreen}>
                  Live
                </span>
              </div>
              <span className={styles.statLabel}>Total Bookings Today</span>
              <span className={styles.statValue}>{loading ? "…" : metrics.totalBookingsToday}</span>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentAmber}`} />
              <div className={styles.statHeader}>
                <svg className={`${styles.statIcon} ${styles.iconAmber}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className={styles.badgeLive}>
                  <div className={styles.liveDot} />
                  Live
                </span>
              </div>
              <span className={styles.statLabel}>Active Queue Count</span>
              <span className={styles.statValue}>{loading ? "…" : metrics.vehiclesInQueue}</span>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentGreen}`} />
              <div className={styles.statHeader}>
                <svg className={`${styles.statIcon} ${styles.iconGreen}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={styles.statLabel}>Vehicles Served Today</span>
              <span className={styles.statValue}>{loading ? "…" : metrics.vehiclesServedToday}</span>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentRed}`} />
              <div className={styles.statHeader}>
                <svg className={`${styles.statIcon} ${styles.iconRed}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="5" width="10" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
                  <path d="M14 8h2a2 2 0 012 2v2a2 2 0 002 2h0V9l-3-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
                </svg>
                <span className={fuelStatus.petrol === "AVAILABLE" ? styles.badgeGreen : fuelStatus.petrol === "LIMITED" ? styles.badgeAmber : styles.badgeRed}>
                  {fuelStatus.petrol}
                </span>
              </div>
              <span className={styles.statLabel}>Fuel Availability (Petrol / Diesel)</span>
              <span className={styles.statValue}>
                {fuelStatus.petrol} / {fuelStatus.diesel}
              </span>
            </div>
          </div>

          {/* ── Mid row ─────────────────────────────────────────────── */}
          <div className={styles.midGrid}>
            {/* Now Serving */}
            <div className={styles.nowServing}>
              <div className={styles.nowServingHeader}>
                <span className={styles.nowServingPill}>
                  NOW SERVING
                  <div className={styles.liveDot} />
                </span>
              </div>

              <span className={styles.nowServingSubLabel}>Station Token</span>
              <div className={styles.nowServingTokenRow}>
                <div className={styles.tokenId}>
                  {queueList.length > 0
                    ? `#TK-${queueList[0].tokenNumber}`
                    : (metrics.vehiclesInQueue > 0 ? `#TK-${metrics.vehiclesServedToday + 1}` : "NONE")}
                </div>
                <div className={styles.vehiclePlateBox}>
                  <span className={styles.vehiclePlateLabel}>VEHICLE NUMBER</span>
                  <span className={styles.vehiclePlateValue}>
                    {getDisplayVehiclePlate()}
                  </span>
                </div>
              </div>

              <div className={styles.actionRow}>
                <button
                  className={styles.btnComplete}
                  onClick={handleCompleteFilling}
                  disabled={metrics.vehiclesInQueue === 0 && queueList.length === 0}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Filling
                </button>
                <button
                  className={styles.btnNoShow}
                  onClick={handleCompleteFilling}
                  disabled={metrics.vehiclesInQueue === 0 && queueList.length === 0}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  No Show
                </button>
              </div>
            </div>

            {/* Right panel */}
            <div className={styles.rightPanel}>
              <div className={styles.stationStatusBtn}>
                <svg className={styles.stationIconWrap} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <span className={styles.stationLabel}>Station Status</span>
                  <span className={styles.stationSub}>{adminData.stationName} is currently OPEN</span>
                </div>
              </div>

              <div className={styles.quickActions}>
                <button className={styles.btnFuelUpdate} onClick={() => router.push("/adminfuel")}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={styles.btnFuelLabel}>Update Fuel Availability</span>
                </button>

                <button className={styles.btnPause} onClick={() => router.push("/adminqueue")}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={styles.btnPauseLabel}>Manage Queue</span>
                </button>
              </div>

              <button className={styles.btnTransactions} onClick={() => router.push("/adminanalytics")}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1d4ed8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Analytics & Reports
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Bottom row ──────────────────────────────────────────── */}
          <div className={styles.bottomGrid}>
            <div className={styles.queueCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Upcoming Queue</span>
                <button className={styles.viewAllBtn} onClick={() => router.push("/adminqueue")}>View Queue</button>
              </div>

              <div className={styles.tableRows}>
                {queueList.length === 0 && metrics.vehiclesInQueue === 0 ? (
                  <div style={{ padding: "24px 0", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                    No active vehicles currently waiting in queue for {adminData.stationName}.
                  </div>
                ) : (
                  (queueList.length > 0 ? queueList : [{
                    id: 1,
                    tokenNumber: metrics.vehiclesServedToday + 1,
                    vehiclePlate: "WP CAB-1234",
                    fuelType: "Petrol 95",
                    slotTime: "Today",
                  }]).map((item, idx) => (
                    <div key={item.id || idx} className={styles.tableRow}>
                      <div className={styles.rowId}>#TK-{item.tokenNumber}</div>
                      <div className={styles.rowInfo}>
                        <span className={styles.rowPlate}>{item.vehiclePlate || item.vehicleNumber || "WP CAB-1234"}</span>
                        <span className={styles.rowTime}>{item.fuelType || "Petrol 95"} · {item.slotTime || item.slotTimeRange || "08:00 AM - 08:10 AM"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={styles.velocityCard}>
              <span className={styles.cardTitle}>Station Service Metrics</span>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>TOTAL BOOKINGS</span>
                    <span className={`${styles.metricValue} ${styles.metricValueBlue}`}>{metrics.totalBookingsToday}</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div className={styles.metricFill} style={{ width: metrics.totalBookingsToday > 0 ? '100%' : '0%', background: '#3b82f6' }} />
                  </div>
                </div>

                <div className={styles.metric}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>SERVED TODAY</span>
                    <span className={`${styles.metricValue} ${styles.metricValueGreen}`}>{metrics.vehiclesServedToday}</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div className={styles.metricFill} style={{ width: metrics.totalBookingsToday > 0 ? `${Math.min(100, Math.round((metrics.vehiclesServedToday / Math.max(1, metrics.totalBookingsToday)) * 100))}%` : '0%', background: '#10b981' }} />
                  </div>
                </div>
              </div>

              <div className={styles.advisory}>
                <svg className={styles.advisoryIcon} width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className={styles.advisoryText}>
                  Station status: active and responding to real-time queue tokens for {adminData.stationName}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}