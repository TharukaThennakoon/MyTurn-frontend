"use client";

import { useState } from "react";

import styles from "./page.module.css";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminAnalytics() {
  const [showModal, setShowModal] = useState(false);
  const [timeRange, setTimeRange] = useState("WEEK");

  return (
    <div className={styles.container}>
      <AdminSidebar activeNav="Analytics" />

      <main className={styles.main}>
        <AdminHeader searchPlaceholder="Search analytics..." />

        <div className={styles.content}>
          
          <div className={styles.topRow}>
            {/* Peak Hours Card */}
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Peak Hours</h2>
                  <p className={styles.cardSubtitle}>Distribution of demand throughout the last 24h</p>
                </div>
                <span className={styles.badgeGreen}>Live Traffic</span>
              </div>
              <div className={styles.barChartContainer}>
                {/* Simulated Bar Chart */}
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barLight}`} style={{ height: '15%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barLight}`} style={{ height: '25%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barDark}`} style={{ height: '50%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barDark}`} style={{ height: '60%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barDark}`} style={{ height: '55%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barLight}`} style={{ height: '35%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barLight}`} style={{ height: '22%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barLight}`} style={{ height: '18%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barLight}`} style={{ height: '20%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barDark}`} style={{ height: '48%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barDark}`} style={{ height: '60%' }}></div></div>
                <div className={styles.barWrap}><div className={`${styles.bar} ${styles.barDark}`} style={{ height: '52%' }}></div></div>
              </div>
              <div className={styles.chartXAxis}>
                <span>06:00</span>
                <span>10:00</span>
                <span>14:00</span>
                <span>18:00</span>
                <span>22:00</span>
                <span>02:00</span>
              </div>
            </div>

            {/* Demand Trends Card */}
            <div className={styles.blueCard}>
              <h2 className={styles.blueCardTitle}>Demand Trends</h2>
              <p className={styles.blueCardDesc}>
                Predicted influx of <strong>24% higher</strong> volume expected for the morning shift. Consider opening additional fueling lanes.
              </p>
              <div className={styles.confidenceSection}>
                <div className={styles.iconWrapTrend}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                </div>
                <div>
                  <div className={styles.confidenceLabel}>CONFIDENCE RATE</div>
                  <div className={styles.confidenceValue}>92.4%</div>
                </div>
              </div>
              <button className={styles.btnWhite} onClick={() => setShowModal(true)}>
                View Full Forecast
              </button>
            </div>
          </div>

          <div className={styles.middleRow}>
            {/* Average Waiting Time */}
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Average Waiting Time</h2>
                  <p className={styles.cardSubtitle}>Current session average per vehicle</p>
                </div>
                <div className={styles.iconWrapPie}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                </div>
              </div>
              <div className={styles.circularChartContainer}>
                <div className={styles.circleRing}>
                  <div className={styles.circleContent}>
                    <span className={styles.circleNumber}>18</span>
                    <span className={styles.circleUnit}>MINUTES</span>
                  </div>
                </div>
              </div>
              <div className={styles.statFooter}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>FASTEST</span>
                  <span className={styles.statVal}>4m</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>SLOWEST</span>
                  <span className={styles.statVal}>42m</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>TARGET</span>
                  <span className={styles.statValGreen}>15m</span>
                </div>
              </div>
            </div>

            {/* Total Vehicles/Day */}
            <div className={styles.chartCardLarge}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Total Vehicles/Day</h2>
                  <p className={styles.cardSubtitle}>Weekly throughput volume overview</p>
                </div>
                <div className={styles.toggleGroup}>
                  <button 
                    className={`${styles.toggleBtn} ${timeRange === "WEEK" ? styles.toggleActive : ""}`}
                    onClick={() => setTimeRange("WEEK")}
                  >
                    WEEK
                  </button>
                  <button 
                    className={`${styles.toggleBtn} ${timeRange === "MONTH" ? styles.toggleActive : ""}`}
                    onClick={() => setTimeRange("MONTH")}
                  >
                    MONTH
                  </button>
                </div>
              </div>
              <div className={styles.lineChartContainer}>
                {timeRange === "WEEK" ? (
                  <>
                    <svg viewBox="0 0 500 150" className={styles.lineChartSvg} preserveAspectRatio="none">
                      <path d="M0,120 C50,110 100,60 150,60 C200,60 250,110 300,110 C350,110 400,20 450,20 C480,20 500,60 500,60" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <circle cx="150" cy="60" r="4" fill="#3b82f6" />
                      <circle cx="450" cy="20" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                    <div className={styles.chartTooltip} style={{ left: '85%', top: '0%' }}>
                      1,402 Veh
                    </div>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 500 150" className={styles.lineChartSvg} preserveAspectRatio="none">
                      <path d="M0,80 C80,40 160,130 240,60 C320,10 400,100 500,30" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <circle cx="240" cy="60" r="4" fill="#3b82f6" />
                      <circle cx="500" cy="30" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                    <div className={styles.chartTooltip} style={{ left: '95%', top: '10%' }}>
                      6,850 Veh
                    </div>
                  </>
                )}
              </div>
              <div className={styles.chartXAxis}>
                {timeRange === "WEEK" ? (
                  <><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></>
                ) : (
                  <><span>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span>WEEK 4</span></>
                )}
              </div>
            </div>
          </div>

          <div className={styles.notificationCard}>
            <div className={styles.notifHeader}>
               <div className={styles.notifIconWrapBlue}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                   <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                 </svg>
               </div>
               <div>
                 <h2 className={styles.cardTitle}>Notification Panel</h2>
                 <p className={styles.cardSubtitle}>Broadcast alerts and status updates to your customers</p>
               </div>
            </div>
            
            <div className={styles.notifBody}>
               <div className={styles.notifLeft}>
                 <label className={styles.formLabel}>RECIPIENTS</label>
                 <div className={styles.recipientButtons}>
                   <button className={`${styles.btnRecipient} ${styles.btnRecipientActive}`}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                     Send to all active
                   </button>
                   <button className={styles.btnRecipient}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                     Next 5 tokens
                   </button>
                 </div>
                 
                 <label className={styles.formLabel}>PRESET QUICK ALERTS</label>
                 <div className={styles.quickAlerts}>
                   <button className={styles.alertBrown}>Fuel running low</button>
                   <button className={styles.alertRed}>Delay in service</button>
                   <button className={styles.alertGray}>Station closed</button>
                 </div>
               </div>
               
               <div className={styles.notifRight}>
                 <label className={styles.formLabel}>CUSTOM MESSAGE</label>
                 <textarea className={styles.formTextarea} placeholder="Type your custom notification here..."></textarea>
                 <div className={styles.notifActions}>
                   <button className={styles.btnBroadcast}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                     Broadcast Notification
                   </button>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </main>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>7-Day Demand Forecast</h2>
              <button className={styles.modalCloseBtn} onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.forecastMetrics}>
                <div className={styles.fMetric}>
                  <div className={styles.fLabel}>EXPECTED PEAK</div>
                  <div className={styles.fValue}>Tomorrow, 08:00 AM</div>
                </div>
                <div className={styles.fMetric}>
                  <div className={styles.fLabel}>VOLUME INCREASE</div>
                  <div className={styles.fValueGreen}>+24%</div>
                </div>
              </div>
              <div className={styles.forecastChart}>
                <div className={styles.fChartTitle}>Weekly Projection</div>
                <svg viewBox="0 0 400 100" className={styles.fChartSvg} preserveAspectRatio="none">
                  <path d="M0,80 C50,60 100,90 150,40 C200,10 250,50 300,20 C350,10 400,60 400,60" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <path d="M0,80 C50,60 100,90 150,40 C200,10 250,50 300,20 C350,10 400,60 400,60 L400,100 L0,100 Z" fill="rgba(59, 130, 246, 0.1)" stroke="none" />
                </svg>
              </div>
              <div className={styles.forecastAction}>
                <div className={styles.fActionText}>
                  <strong>Recommendation:</strong> Staff 2 extra attendants and open all fuel lanes during the peak window to minimize waiting times.
                </div>
                <button className={styles.btnApply}>Apply Staffing Preset</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
