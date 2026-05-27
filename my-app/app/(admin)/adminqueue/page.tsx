"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

import AdminSidebar from "@/components/layout/AdminSidebar";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminQueue() {

  const QUEUE_DATA = [
    {
      id: "#145",
      plate: "CAS-8821",
      model: "Toyota Land Cruiser",
      time: "10:15 - 10:25",
      status: "SERVING",
      action: null,
    },
    {
      id: "#146",
      plate: "BBA-4490",
      model: "Honda Civic",
      time: "10:25 - 10:35",
      status: "WAITING",
      action: "play-primary",
    },
    {
      id: "#144",
      plate: "WP-1122",
      model: "Suzuki Swift",
      time: "10:05 - 10:15",
      status: "COMPLETED",
      action: "0.45 ETH Fuelled",
    },
    {
      id: "#143",
      plate: "CAF-9201",
      model: "Hyundai Tucson",
      time: "09:55 - 10:05",
      status: "MISSED",
      action: "Re-Queue",
    },
    {
      id: "#147",
      plate: "KY-0012",
      model: "Mitsubishi Montero",
      time: "10:35 - 10:45",
      status: "WAITING",
      action: "play-outline",
    },
  ];

  return (
    <div className={styles.container}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <AdminSidebar activeNav="Queue" />

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search vehicle or token..." className={styles.searchInput} />
          </div>

          <div className={styles.headerActions}>
            <button className={styles.iconBtn}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className={styles.iconBtn}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className={`${styles.iconBtn} ${styles.iconBtnRed}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.2 9H21L15.3 13.5L17.5 21L12 16.5L6.5 21L8.7 13.5L3 9H9.8L12 2Z" />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {/* Top Cards */}
          <div className={styles.topCards}>
            <div className={`${styles.card} ${styles.queueOverview}`}>
              <h2 className={styles.queueOverviewTitle}>Queue Overview</h2>
              <p className={styles.queueOverviewSub}>Real-time station monitoring</p>
              <div className={styles.queueActions}>
                <button className={styles.callBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5V19L19 12L8 5Z" />
                  </svg>
                  Call Next Vehicle
                </button>
                <div className={styles.liveBadge}>
                  <div className={styles.liveDot}></div>
                  LIVE
                </div>
              </div>
              <svg className={styles.overviewIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM19 19H5V5H7V7H17V5H19V19Z" />
                <circle cx="16" cy="16" r="4" fill="#cbd5e1" />
                <path d="M16 13V16L18 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className={styles.statCard} style={{ padding: '24px' }}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIconWrap} ${styles.blue}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`${styles.statTrend} ${styles.green}`}>+12% vs avg</span>
              </div>
              <div className={styles.statValue}>24</div>
              <div className={styles.statLabel}>Active Queue Count</div>
            </div>

            <div className={styles.statCard} style={{ padding: '24px' }}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIconWrap} ${styles.orange}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`${styles.statTrend} ${styles.red}`}>+4m delay</span>
              </div>
              <div className={styles.statValue}>18<small>min</small></div>
              <div className={styles.statLabel}>Avg Wait Time</div>
            </div>
          </div>

          {/* Table Section */}
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Vehicle Queue Sequence
              </div>
              <div className={styles.tableFilters}>
                <button className={styles.filterBtn}>Filter By Fuel</button>
                <button className={styles.filterBtn}>Today</button>
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
                {QUEUE_DATA.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.token}>{row.id}</td>
                    <td>
                      <div className={styles.identityMain}>{row.plate}</div>
                      <div className={styles.identitySub}>{row.model}</div>
                    </td>
                    <td className={styles.time}>{row.time}</td>
                    <td>
                      <span className={`${styles.status} ${
                        row.status === "SERVING" ? styles.statusServing :
                        row.status === "WAITING" ? styles.statusWaiting :
                        row.status === "COMPLETED" ? styles.statusCompleted :
                        styles.statusMissed
                      }`}>
                        {row.status === "SERVING" ? "● SERVING" : row.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {row.action === "play-primary" && (
                        <button className={styles.actionBtn}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5V19L19 12L8 5Z" />
                          </svg>
                        </button>
                      )}
                      {row.action === "play-outline" && (
                        <button className={`${styles.actionBtn} ${styles.actionBtnOutline}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5V19L19 12L8 5Z" />
                          </svg>
                        </button>
                      )}
                      {row.action === "Re-Queue" && (
                        <button className={styles.actionTextBtn}>Re-Queue</button>
                      )}
                      {typeof row.action === "string" && row.action.includes("ETH") && (
                        <span className={styles.actionTextSuccess}>{row.action}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.tableFooter}>
              <span>Showing 1-10 of 24 active entries</span>
              <div className={styles.pagination}>
                <button className={styles.pageBtn}>&lsaquo;</button>
                <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>&rsaquo;</button>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className={styles.bottomCards}>
            <div className={styles.warningCard}>
              <h3 className={styles.warningTitle}>Upcoming Peak Hour Warning</h3>
              <p className={styles.warningText}>
                Historical data suggests a 40% increase in vehicle arrivals starting<br />
                at 12:00 PM. Recommend opening Lane 3.
              </p>
              <a href="#" className={styles.warningLink}>
                Review Predictive Schedule
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div className={styles.fuelCard}>
              <div className={styles.fuelHeader}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <svg className={styles.fuelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="5" width="10" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 8h2a2 2 0 012 2v2a2 2 0 002 2h0V9l-3-4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <div className={styles.fuelLabel}>Station Fuel Level</div>
                  </div>
                </div>
                <div className={styles.fuelBadge}>LANE 1 & 2 ACTIVE</div>
              </div>
              <div className={styles.fuelValue}>82.5% Available</div>
              <div className={styles.fuelTrack}>
                <div className={styles.fuelFill}></div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
