"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import apiClient from "@/services/apiClient";

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

interface BookingQueueItem {
  id: number;
  tokenNumber: number;
  stationId?: number;
  stationName?: string;
  slotTimeRange?: string;
  slotTime?: string;
  fuelType?: string;
  status: string;
  vehicleNumber?: string;
  vehiclePlate?: string;
  createdAt?: string;
}

export default function AdminQueue() {
  const router = useRouter();

  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "",
    stationId: null as number | null,
    stationName: "Your Station",
  });

  const [metrics, setMetrics] = useState<DashboardData>({
    totalBookingsToday: 0,
    vehiclesInQueue: 0,
    vehiclesServedToday: 0,
    fuelAvailability: [],
  });

  const [queueItems, setQueueItems] = useState<BookingQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingNext, setCallingNext] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        const stId = parsed.stationId || null;
        setAdminData({
          name: parsed.name || parsed.fullName || "Admin",
          email: parsed.email || "",
          stationId: stId,
          stationName: parsed.stationName || "Your Station",
        });

        if (stId) {
          fetchQueueMetrics(stId);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const loadQueueFromStorage = (stationId: number | null) => {
    try {
      const keys = [
        stationId ? `stationBookings_${stationId}` : null,
        "stationBookings_latest",
        "stationBookings_general",
        "userActiveBooking",
      ].filter(Boolean) as string[];

      for (const k of keys) {
        const stored = localStorage.getItem(k);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQueueItems(parsed);
            return parsed;
          } else if (parsed && typeof parsed === "object" && parsed.tokenNumber) {
            const single: BookingQueueItem[] = [{
              id: parsed.id || Date.now(),
              tokenNumber: parsed.tokenNumber,
              vehicleNumber: parsed.vehicleNumber || parsed.vehiclePlate || "WP CAB-1234",
              vehiclePlate: parsed.vehiclePlate || parsed.vehicleNumber || "WP CAB-1234",
              fuelType: parsed.fuelType || "Petrol 95",
              slotTimeRange: parsed.slotTimeRange || parsed.slotTime || "08:00 AM - 08:10 AM",
              slotTime: parsed.slotTime || parsed.slotTimeRange || "08:00 AM - 08:10 AM",
              status: "WAITING",
              createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }];
            setQueueItems(single);
            return single;
          }
        }
      }
    } catch (e) { }
    return [];
  };

  const fetchQueueMetrics = async (stationId: number) => {
    const localQueue = loadQueueFromStorage(stationId);

    try {
      const res = await apiClient.get<DashboardData>("/dashboard", { stationId });
      if (res.success && res.data) {
        const queueCount = Math.max(res.data.vehiclesInQueue ?? 0, localQueue.length);
        setMetrics({
          totalBookingsToday: Math.max(res.data.totalBookingsToday ?? 0, localQueue.length),
          vehiclesInQueue: queueCount,
          vehiclesServedToday: res.data.vehiclesServedToday ?? 0,
          fuelAvailability: res.data.fuelAvailability || [],
        });
      } else if (localQueue.length > 0) {
        setMetrics({
          totalBookingsToday: localQueue.length,
          vehiclesInQueue: localQueue.length,
          vehiclesServedToday: 0,
          fuelAvailability: [],
        });
      }
    } catch (e) {
      if (localQueue.length > 0) {
        setMetrics({
          totalBookingsToday: localQueue.length,
          vehiclesInQueue: localQueue.length,
          vehiclesServedToday: 0,
          fuelAvailability: [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = () => {
    if (queueItems.length === 0 && metrics.vehiclesInQueue === 0) return;
    setCallingNext(true);

    setTimeout(() => {
      setCallingNext(false);
      const updatedList = queueItems.slice(1);
      setQueueItems(updatedList);

      const stId = adminData.stationId || 1;
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

      // Mark user active booking as SUCCESSFUL / COMPLETED
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
      } catch (e) { }

      // Broadcast storage event so all open tabs sync live
      window.dispatchEvent(new Event("storage"));
    }, 600);
  };

  const petrolAvailable = metrics.fuelAvailability?.some(
    (f) => f.fuelType.toLowerCase().includes("petrol") && f.available
  );

  return (
    <div className={styles.container}>
      <AdminSidebar activeNav="Queue" />

      <main className={styles.main}>
        <AdminHeader searchPlaceholder="Search queue entries..." />

        <div className={styles.content}>
          <div className={styles.topCards}>
            <div className={`${styles.card} ${styles.queueOverview}`}>
              <h2 className={styles.queueOverviewTitle}>Station Queue Monitor</h2>
              <p className={styles.queueOverviewSub}>
                Live sequence for {adminData.stationName}. Call next vehicle to advance.
              </p>
              <div className={styles.queueActions}>
                <button
                  className={styles.callBtn}
                  onClick={handleCallNext}
                  disabled={callingNext || (queueItems.length === 0 && metrics.vehiclesInQueue === 0)}
                  style={{ opacity: (queueItems.length === 0 && metrics.vehiclesInQueue === 0) ? 0.6 : 1 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5V19L19 12L8 5Z" />
                  </svg>
                  {callingNext ? "Calling…" : "Call Next Vehicle"}
                </button>
                <div className={styles.liveBadge}>
                  <div className={styles.liveDot}></div>
                  LIVE
                </div>
              </div>
            </div>

            <div className={styles.statCard} style={{ padding: '24px' }}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIconWrap} ${styles.blue}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`${styles.statTrend} ${styles.green}`}>Live</span>
              </div>
              <div className={styles.statValue}>{loading ? "…" : metrics.vehiclesInQueue}</div>
              <div className={styles.statLabel}>Active Queue Count</div>
            </div>

            <div className={styles.statCard} style={{ padding: '24px' }}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIconWrap} ${styles.orange}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`${styles.statTrend} ${styles.green}`}>Today</span>
              </div>
              <div className={styles.statValue}>{loading ? "…" : metrics.vehiclesServedToday}</div>
              <div className={styles.statLabel}>Vehicles Served Today</div>
            </div>
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>
                Vehicle Queue Sequence — {adminData.stationName}
              </div>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Vehicle Identity</th>
                  <th>Scheduled Slot</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
                      <div>🚗</div>
                      <div style={{ fontWeight: 600, marginTop: 8 }}>No active vehicles in queue</div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>
                        When users book a slot for {adminData.stationName}, they will appear here in sequence.
                      </div>
                    </td>
                  </tr>
                ) : (
                  queueItems.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className={styles.token}>#TK-{item.tokenNumber}</td>
                      <td>
                        <div className={styles.identityMain}>{item.vehicleNumber || "WP CAB-1234"}</div>
                        <div className={styles.identitySub}>{item.fuelType || "Petrol (95 Octane)"}</div>
                      </td>
                      <td className={styles.time}>{item.slotTimeRange || "Today"}</td>
                      <td>
                        <span className={`${styles.status} ${idx === 0 ? styles.statusServing : styles.statusWaiting}`}>
                          ● {idx === 0 ? "SERVING" : "WAITING"}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className={styles.actionBtn} onClick={handleCallNext} title="Call vehicle">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5V19L19 12L8 5Z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className={styles.tableFooter}>
              <span>
                Showing {metrics.vehiclesInQueue === 0 ? 0 : 1} of {metrics.vehiclesInQueue} active entries
              </span>
              <div className={styles.pagination}>
                <button className={styles.pageBtn}>&lsaquo;</button>
                <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                <button className={styles.pageBtn}>&rsaquo;</button>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className={styles.bottomCards}>
            <div className={styles.warningCard}>
              <h3 className={styles.warningTitle}>Station Operational Status</h3>
              <p className={styles.warningText}>
                Monitoring active slots and queue flow for <strong>{adminData.stationName}</strong>.<br />
                Maintain average serving time under 5 minutes per vehicle.
              </p>
            </div>

            <div className={styles.fuelCard}>
              <div className={styles.fuelHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg className={styles.fuelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="5" width="10" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 8h2a2 2 0 012 2v2a2 2 0 002 2h0V9l-3-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <div className={styles.fuelLabel}>Station Fuel Level</div>
                  </div>
                </div>
                <div className={styles.fuelBadge}>
                  {petrolAvailable ? "STATION ACTIVE" : "LIMITED STOCK"}
                </div>
              </div>
              <div className={styles.fuelValue}>
                {metrics.fuelAvailability && metrics.fuelAvailability.length > 0
                  ? metrics.fuelAvailability.map((f) => `${f.fuelType}: ${f.status}`).join(" | ")
                  : "Normal Availability"}
              </div>
              <div className={styles.fuelTrack}>
                <div className={styles.fuelFill} style={{ width: petrolAvailable ? "80%" : "40%" }}></div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

