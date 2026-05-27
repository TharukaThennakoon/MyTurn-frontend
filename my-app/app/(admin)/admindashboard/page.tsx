"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

import AdminSidebar from "@/components/layout/AdminSidebar";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {

  const QUEUE_DATA = [
    { id: "883", plate: "B-4491-ZT", time: "10:15 AM" },
    { id: "884", plate: "D-1222-RT", time: "10:20 AM" },
    { id: "885", plate: "F-9031-LL", time: "10:25 AM" },
  ];

  return (
    <div className={styles.root}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <AdminSidebar activeNav="Overview" />

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>MyTurn Dashboard</div>

          <div className={styles.topbarRight}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input className={styles.searchInput} placeholder="Search tokens..." />
            </div>

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
            <div className={styles.avatar}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="15" r="7" fill="#94a3b8"/>
                <path d="M7 36C7 28.8203 12.8203 23 20 23C27.1797 23 33 28.8203 33 36V40H7V36Z" fill="#94a3b8"/>
              </svg>
            </div>
          </div>
        </header>

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
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +12%
                </span>
              </div>
              <span className={styles.statLabel}>Total Bookings Today</span>
              <span className={styles.statValue}>1,284</span>
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
              <span className={styles.statValue}>42</span>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentGreen}`} />
              <div className={styles.statHeader}>
                <svg className={`${styles.statIcon} ${styles.iconGreen}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={styles.statLabel}>Upcoming Slots (Next Hr)</span>
              <span className={styles.statValue}>156</span>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentRed}`} />
              <div className={styles.statHeader}>
                <svg className={`${styles.statIcon} ${styles.iconRed}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="5" width="10" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
                  <path d="M14 8h2a2 2 0 012 2v2a2 2 0 002 2h0V9l-3-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
                </svg>
                <span className={styles.badgeRed}>CRITICAL</span>
              </div>
              <span className={styles.statLabel}>Fuel Levels (P/D)</span>
              <span className={styles.statValue}>12% / 48%</span>
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

              <span className={styles.nowServingSubLabel}>Token Identifier</span>
              <div className={styles.nowServingTokenRow}>
                <div className={styles.tokenId}>#TK-882</div>
                <div className={styles.vehiclePlateBox}>
                  <span className={styles.vehiclePlateLabel}>VEHICLE PLATE</span>
                  <span className={styles.vehiclePlateValue}>W-7712 X</span>
                </div>
              </div>

              <div className={styles.actionRow}>
                <button className={styles.btnComplete}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Filling
                </button>
                <button className={styles.btnNoShow}>
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
                  <span className={styles.stationSub}>Station is currently OPEN</span>
                </div>
              </div>

              <div className={styles.quickActions}>
                <button className={styles.btnFuelUpdate}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={styles.btnFuelLabel}>Update Fuel Availability</span>
                </button>

                <button className={styles.btnPause}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={styles.btnPauseLabel}>Pause New Bookings</span>
                </button>
              </div>

              <button className={styles.btnTransactions}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1d4ed8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Recent Transactions
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
                <button className={styles.viewAllBtn}>View All</button>
              </div>

              <div className={styles.tableRows}>
                {QUEUE_DATA.map((item) => (
                  <div key={item.id} className={styles.tableRow}>
                    <div className={styles.rowId}>{item.id}</div>
                    <div className={styles.rowInfo}>
                      <span className={styles.rowPlate}>{item.plate}</span>
                      <span className={styles.rowTime}>Scheduled: {item.time}</span>
                    </div>
                    <button className={styles.rowMenuBtn}>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.velocityCard}>
              <span className={styles.cardTitle}>Service Velocity</span>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>AVG. SERVING TIME</span>
                    <span className={`${styles.metricValue} ${styles.metricValueBlue}`}>4.2 MINS</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div className={styles.metricFill} style={{ width: '70%', background: '#3b82f6' }} />
                  </div>
                </div>

                <div className={styles.metric}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>STATION CAPACITY</span>
                    <span className={`${styles.metricValue} ${styles.metricValueGreen}`}>88%</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div className={styles.metricFill} style={{ width: '88%', background: '#10b981' }} />
                  </div>
                </div>
              </div>

              <div className={styles.advisory}>
                <svg className={styles.advisoryIcon} width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className={styles.advisoryText}>
                  High volume detected. Suggest opening Pump 4 to maintain average serving time below 5 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}