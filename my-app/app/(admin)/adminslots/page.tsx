"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminSlots() {
  const [vehiclesPerSlot, setVehiclesPerSlot] = useState(8);

  const handleDecrease = () => setVehiclesPerSlot(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setVehiclesPerSlot(prev => prev + 1);

  return (
    <div className={styles.container}>
      <AdminSidebar activeNav="Slots" />

      <main className={styles.main}>
        {/* Header */}
        <AdminHeader searchPlaceholder="Search slots..." />

        <div className={styles.content}>
          
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.pageTitle}>Time Slot Management</h1>
              <p className={styles.pageSubtitle}>
                Fine-tune your station's capacity and booking intervals for peak efficiency.
              </p>
            </div>

            <div className={styles.bookingStatusCard}>
              <div className={styles.bookingStatusHeader}>
                <span className={styles.bookingStatusLabel}>BOOKING STATUS</span>
                <div className={styles.toggleSwitch}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>
              <div className={styles.bookingStatusTitle}>Accepting New Bookings</div>
              <div className={styles.bookingStatusDesc}>
                Disable to temporarily stop public reservations while maintaining current queue.
              </div>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className={styles.infoCardsGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={`${styles.infoIconWrap} ${styles.blue}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.28l1.08 3.11H5.79L6.85 7zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
                <span className={styles.infoCardTitle}>Vehicles per Slot</span>
              </div>
              <div className={styles.infoCardContent}>
                <div className={styles.counterControl}>
                  <button className={styles.counterBtn} onClick={handleDecrease}>-</button>
                  <span className={styles.counterValue}>{vehiclesPerSlot.toString().padStart(2, '0')}</span>
                  <button className={styles.counterBtn} onClick={handleIncrease}>+</button>
                </div>
                <p className={styles.infoCardDesc}>Maximum capacity per 10-minute interval.</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={`${styles.infoIconWrap} ${styles.green}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <span className={styles.infoCardTitle}>Slot Duration</span>
              </div>
              <div className={styles.infoCardContent}>
                <div className={styles.dropdownControl}>
                  <span>10 min</span>
                  <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
                <p className={styles.infoCardDesc}>Interval length for individual bookings.</p>
              </div>
            </div>

            <div className={styles.scheduleCard}>
              <div className={styles.scheduleHeader}>
                <div className={styles.scheduleTitle}>Current Schedule</div>
                <div className={styles.scheduleSubtitle}>Daily operational window</div>
              </div>
              <div className={styles.scheduleRow}>
                <div className={styles.schedulePills}>
                  <span className={styles.timePill}>08:00 AM</span>
                  <svg className={styles.timeArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <span className={styles.timePill}>08:00 PM</span>
                </div>
                <div className={styles.dailySlotsWrap}>
                  <div className={styles.dailySlotsValue}>72</div>
                  <div className={styles.dailySlotsLabel}>DAILY SLOTS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interval Schedule Section */}
          <div className={styles.intervalSection}>
            <div className={styles.intervalHeader}>
              <div>
                <h2 className={styles.intervalTitle}>Interval Schedule</h2>
                <p className={styles.intervalSubtitle}>Monitor and override specific time intervals.</p>
              </div>
              <div className={styles.intervalActions}>
                <button className={styles.btnPrimary}>Bulk Actions</button>
                <button className={styles.btnPrimary}>Reset All</button>
              </div>
            </div>

            <div className={styles.intervalGrid}>
              {/* Card 1 */}
              <div className={styles.intervalCard}>
                <div className={styles.intervalCardTop}>
                  <div className={styles.intervalTimeWrap}>
                    <span className={styles.intervalTime}>08:00 - 08:10</span>
                    <span className={`${styles.badge} ${styles.badgeOptimal}`}><span className={styles.badgeDot}></span>OPTIMAL</span>
                  </div>
                  <svg className={styles.disableIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
                <div className={styles.utilRow}>
                  <span className={styles.utilLabel}>UTILIZATION</span>
                  <span className={styles.utilValue}>5 / 8 VEHICLES</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressFill} ${styles.progressBlue}`} style={{ width: '62.5%' }}></div>
                </div>
              </div>

              {/* Card 2 */}
              <div className={styles.intervalCard}>
                <div className={styles.intervalCardTop}>
                  <div className={styles.intervalTimeWrap}>
                    <span className={styles.intervalTime}>08:10 - 08:20</span>
                    <span className={`${styles.badge} ${styles.badgeLimited}`}>LIMITED</span>
                  </div>
                  <svg className={styles.disableIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
                <div className={styles.utilRow}>
                  <span className={styles.utilLabel}>UTILIZATION</span>
                  <span className={styles.utilValue}>8 / 8 VEHICLES</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressFill} ${styles.progressYellow}`} style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Card 3 (Blocked) */}
              <div className={`${styles.intervalCard} ${styles.intervalCardBlocked}`}>
                <div className={styles.intervalCardTop}>
                  <div className={styles.intervalTimeWrap}>
                    <span className={`${styles.intervalTime} ${styles.intervalTimeBlocked}`}>08:20 - 08:30</span>
                    <span className={`${styles.badge} ${styles.badgeBlocked}`}>BLOCKED</span>
                  </div>
                  <button className={styles.unblockBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v6h6" />
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                    UNBLOCK
                  </button>
                </div>
                <div className={styles.blockedMsg}>
                  Station maintenance scheduled or pump offline.
                </div>
              </div>

              {/* Card 4 */}
              <div className={styles.intervalCard}>
                <div className={styles.intervalCardTop}>
                  <div className={styles.intervalTimeWrap}>
                    <span className={styles.intervalTime}>08:30 - 08:40</span>
                    <span className={`${styles.badge} ${styles.badgeOptimal}`}><span className={styles.badgeDot}></span>OPTIMAL</span>
                  </div>
                  <svg className={styles.disableIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
                <div className={styles.utilRow}>
                  <span className={styles.utilLabel}>UTILIZATION</span>
                  <span className={styles.utilValue}>1 / 8 VEHICLES</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressFill} ${styles.progressBlue}`} style={{ width: '12.5%' }}></div>
                </div>
              </div>

              {/* Card 5 */}
              <div className={styles.intervalCard}>
                <div className={styles.intervalCardTop}>
                  <div className={styles.intervalTimeWrap}>
                    <span className={styles.intervalTime}>08:40 - 08:50</span>
                    <span className={`${styles.badge} ${styles.badgeOptimal}`}><span className={styles.badgeDot}></span>OPTIMAL</span>
                  </div>
                  <svg className={styles.disableIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
                <div className={styles.utilRow}>
                  <span className={styles.utilLabel}>UTILIZATION</span>
                  <span className={styles.utilValue}>4 / 8 VEHICLES</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressFill} ${styles.progressBlue}`} style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* Card 6 */}
              <div className={styles.intervalCard}>
                <div className={styles.intervalCardTop}>
                  <div className={styles.intervalTimeWrap}>
                    <span className={styles.intervalTime}>08:50 - 09:00</span>
                    <span className={`${styles.badge} ${styles.badgeHighTraffic}`}>HIGH TRAFFIC</span>
                  </div>
                  <svg className={styles.disableIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
                <div className={styles.utilRow}>
                  <span className={styles.utilLabel}>UTILIZATION</span>
                  <span className={styles.utilValue}>7 / 8 VEHICLES</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressFill} ${styles.progressDarkBlue}`} style={{ width: '87.5%' }}></div>
                </div>
              </div>
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotGreen}`}></span>
                  OPTIMAL CAPACITY
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotYellow}`}></span>
                  HIGH DEMAND
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotRed}`}></span>
                  BLOCKED / CLOSED
                </div>
              </div>
              <div className={styles.syncTime}>Last sync: Today at 09:42 AM</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
