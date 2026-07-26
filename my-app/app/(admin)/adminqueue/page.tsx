"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car } from "lucide-react";
import styles from "./page.module.css";
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

interface BookingQueueItem {
  id: string | number;
  tokenNumber: string | number;
  bookingReference?: string;
  stationId?: number;
  stationName?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  slotTimeRange?: string;
  fuelType?: string;
  status: string;
  vehicleNumber?: string;
  queuePosition?: number;
  estimatedWaitMinutes?: number;
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
          fetchQueueData(stId);
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

  // Auto-refresh every 30 seconds so admin sees new bookings without manual refresh
  useEffect(() => {
    if (!adminData.stationId) return;
    const interval = setInterval(() => {
      fetchQueueData(adminData.stationId!);
    }, 30000);
    return () => clearInterval(interval);
  }, [adminData.stationId]);

  const fetchQueueData = async (stationId: number) => {
    try {
      // 1. Fetch dashboard metrics (totals, fuel availability)
      const dashRes = await apiClient.get<DashboardData>("/dashboard", { stationId });
      if (dashRes.success && dashRes.data) {
        setMetrics({
          totalBookingsToday: dashRes.data.totalBookingsToday ?? 0,
          vehiclesInQueue: dashRes.data.vehiclesInQueue ?? 0,
          vehiclesServedToday: dashRes.data.vehiclesServedToday ?? 0,
          fuelAvailability: dashRes.data.fuelAvailability || [],
        });
      }

      // 2. Fetch today's actual bookings list from database
      const bookingsRes = await apiClient.get<BookingQueueItem[]>(
        `/bookings/station/${stationId}/today`
      );
      if (bookingsRes.success && Array.isArray(bookingsRes.data)) {
        const mapped: BookingQueueItem[] = bookingsRes.data.map((b: any) => ({
          id: b.id,
          tokenNumber: b.digitalToken?.tokenNumber || b.queuePosition || "—",
          bookingReference: b.bookingReference,
          stationId: b.stationId,
          stationName: b.stationName,
          slotTimeRange: b.slotStartTime
            ? `${b.slotStartTime} - ${b.slotEndTime}`
            : b.slotTimeRange || "—",
          fuelType: b.fuelType,
          status: b.status,
          vehicleNumber: b.vehicleNumber || "—",
          queuePosition: b.queuePosition,
          estimatedWaitMinutes: b.estimatedWaitMinutes,
          createdAt: b.createdAt,
        }));
        setQueueItems(mapped);
      }
    } catch (e) {
      console.warn("Failed to fetch queue data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async (bookingId?: string) => {
    // If no specific bookingId, default to the first item in queue (the "next" one)
    const targetId = bookingId || queueItems[0]?.id;
    if (!targetId) return;

    setCallingNext(true);
    try {
      // Tell the backend this booking is now COMPLETED (vehicle served)
      const res = await apiClient.patch<unknown>(`/bookings/${targetId}/complete`);
      if (res.success) {
        // Optimistically update UI immediately
        setQueueItems((prev) => prev.filter((item) => String(item.id) !== String(targetId)));
        setMetrics((prev) => ({
          ...prev,
          vehiclesInQueue: Math.max(0, (prev.vehiclesInQueue || 1) - 1),
          vehiclesServedToday: (prev.vehiclesServedToday || 0) + 1,
          totalBookingsToday: prev.totalBookingsToday, // stays same — all time total
        }));
      }
    } catch (e) {
      console.error("Failed to complete booking:", e);
    } finally {
      setCallingNext(false);
      // Always re-fetch from backend to sync true state
      if (adminData.stationId) {
        setTimeout(() => fetchQueueData(adminData.stationId!), 800);
      }
    }
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
                  onClick={() => handleCallNext()}
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
                      <div style={{ display: "flex", justifyContent: "center", color: "#94a3b8" }}><Car size={32} /></div>
                      <div style={{ fontWeight: 600, marginTop: 8 }}>No active vehicles in queue</div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>
                        When users book a slot for {adminData.stationName}, they will appear here in sequence.
                      </div>
                    </td>
                  </tr>
                ) : (
                  queueItems.map((item, idx) => (
                    <tr key={String(item.id) || idx}>
                      <td className={styles.token}>
                        {item.tokenNumber || item.bookingReference || `#${idx + 1}`}
                      </td>
                      <td>
                        <div className={styles.identityMain}>{item.vehicleNumber || "—"}</div>
                        <div className={styles.identitySub}>{item.fuelType || "—"}</div>
                      </td>
                      <td className={styles.time}>{item.slotTimeRange || "—"}</td>
                      <td>
                        <span className={`${styles.status} ${
                          item.status === "SERVING" || item.status === "CHECKED_IN"
                            ? styles.statusServing
                            : styles.statusWaiting
                        }`}>
                          ● {item.status === "CHECKED_IN" ? "CHECKED-IN" : item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleCallNext(String(item.id))}
                          title="Mark as served"
                          disabled={callingNext}
                        >
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
                Showing {queueItems.length} of {metrics.vehiclesInQueue} active entries
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

