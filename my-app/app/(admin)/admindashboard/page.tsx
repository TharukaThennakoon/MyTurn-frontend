"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface QueueItem {
  id: number;
  plate: string;
  time: string;
  status: "scheduled" | "arriving" | "delayed";
}

interface MetricItem {
  label: string;
  value: string;
  pct: number;
  color: string;
  valueClass: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const QUEUE: QueueItem[] = [
  { id: 883, plate: "B-4491-ZT", time: "10:15 AM", status: "arriving" },
  { id: 884, plate: "D-1222-RT", time: "10:20 AM", status: "scheduled" },
  { id: 885, plate: "F-9031-LL", time: "10:25 AM", status: "scheduled" },
  { id: 886, plate: "K-8823-WQ", time: "10:30 AM", status: "delayed" },
  { id: 887, plate: "M-3312-PL", time: "10:35 AM", status: "scheduled" },
];

const METRICS: MetricItem[] = [
  { label: "Avg. Serving Time", value: "4.2 Mins", pct: 70,  color: "#1A3DC4", valueClass: styles.metricValueBlue  },
  { label: "Station Capacity",  value: "88%",      pct: 88,  color: "#10b981", valueClass: styles.metricValueGreen },
  { label: "Pump Utilization",  value: "74%",      pct: 74,  color: "#f59e0b", valueClass: styles.metricValueAmber },
];

const STATUS_CLASS: Record<QueueItem["status"], string> = {
  arriving:  styles.statusArriving,
  scheduled: styles.statusScheduled,
  delayed:   styles.statusDelayed,
};

const NAV_ITEMS = [
  { label: "Overview",  icon: OverviewIcon  },
  { label: "Queue",     icon: QueueIcon,    badge: "42" },
  { label: "Slots",     icon: SlotsIcon     },
  { label: "Fuel",      icon: FuelIcon      },
  { label: "Analytics", icon: AnalyticsIcon },
  { label: "Settings",  icon: SettingsIcon  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <rect x="2"  y="2"  width="7" height="7" rx="1.5" />
      <rect x="11" y="2"  width="7" height="7" rx="1.5" />
      <rect x="2"  y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function QueueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 5h14M3 10h14M3 15h8" strokeLinecap="round" />
    </svg>
  );
}
function SlotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FuelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="9" height="13" rx="1.5" />
      <path d="M12 7h2a1 1 0 011 1v2a1 1 0 001 1h0V8.5L14 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 15l4-5 4 2 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10" cy="10" r="2.5" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2
           M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42
           M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── LiveDot ──────────────────────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className={styles.liveDot}>
      <span className={styles.liveDotRing} />
      <span className={styles.liveDotCore} />
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stationOpen,    setStationOpen]    = useState(true);
  const [bookingsPaused, setBookingsPaused] = useState(false);
  const [liveTime,       setLiveTime]       = useState("");
  const [activeNav,      setActiveNav]      = useState("Overview");

  // Live clock
  useEffect(() => {
    const tick = () =>
      setLiveTime(
        new Date().toLocaleTimeString("en-US", {
          hour:   "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.root}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L2 4v4c0 3.3 2.5 6.4 6 7.2C11.5 14.4 14 11.3 14 8V4L8 1z" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>MyTurn</span>
            <span className={styles.brandSub}>Admin</span>
          </div>
        </div>

        {/* Station badge */}
        <div className={styles.stationBadge}>
          <div>
            <span className={styles.stationBadgeLabel}>Station</span>
            <span className={styles.stationBadgeValue}>#402</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className={styles.stationBadgeLabel}>Time</span>
            <span className={styles.stationBadgeTime}>{liveTime}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className={styles.navSection}>
          <span className={styles.navHeading}>Menu</span>

          {NAV_ITEMS.map(({ label, icon: Icon, badge }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <Icon className={styles.navIcon} />
                {label}
                {badge && <span className={styles.navBadge}>{badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <button className={styles.updateBtn}>Update Status</button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div>
            <span className={styles.topbarTitle}>MyTurn Dashboard</span>
            <span className={styles.topbarSub}>Real-time operations · Station #402</span>
          </div>

          <div className={styles.topbarRight}>
            {/* Search */}
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                <circle cx="6.5" cy="6.5" r="4.5" />
                <path d="M11 11l3 3" strokeLinecap="round" />
              </svg>
              <input className={styles.searchInput} placeholder="Search tokens…" />
            </div>

            {/* Bell */}
            <button className={styles.iconBtn}>
              <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 2a6 6 0 016 6c0 2.5 1 4 1 4H3s1-1.5 1-4a6 6 0 016-6zM8.5 17a1.5 1.5 0 003 0" strokeLinecap="round" />
              </svg>
              <span className={styles.notifDot} />
            </button>

            {/* Help */}
            <button className={styles.iconBtn}>
              <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
                <circle cx="10" cy="10" r="7" />
                <path d="M10 9v5M10 7h.01" strokeLinecap="round" />
              </svg>
            </button>

            {/* Alert */}
            <button className={`${styles.iconBtn} ${styles.iconBtnAlert}`}>
              <span>✳</span>
            </button>

            {/* Avatar */}
            <div className={styles.avatar}>OP</div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className={styles.body}>

          {/* ── KPI Row ──────────────────────────────────────────────── */}
          <div className={`${styles.kpiGrid} ${styles.animateIn}`}>

            {/* Total Bookings */}
            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentBlue}`} />
              <div className={styles.statInner}>
                <div className={styles.statHeader}>
                  <div className={`${styles.statIconWrap} ${styles.iconBgBlue}`}>
                    <svg className={styles.iconBlue} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="14" height="11" rx="2" />
                      <path d="M7 5V4a1 1 0 011-1h4a1 1 0 011 1v1M10 10v3M8 11.5h4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className={styles.badgeGreen}>
                    <svg fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2">
                      <path d="M2 7l3-4 3 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    +12%
                  </span>
                </div>
                <span className={styles.statLabel}>Total Bookings Today</span>
                <span className={styles.statValue}>1,284</span>
              </div>
            </div>

            {/* Active Queue */}
            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentAmber}`} />
              <div className={styles.statInner}>
                <div className={styles.statHeader}>
                  <div className={`${styles.statIconWrap} ${styles.iconBgAmber}`}>
                    <svg className={styles.iconAmber} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="8" cy="7" r="3" />
                      <circle cx="13" cy="7" r="2" />
                      <path d="M2 17c0-3 2.7-5 6-5s6 2 6 5M17 17c0-2-1.5-3.8-4-4.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className={styles.badgeLive}>
                    <LiveDot />
                    Live
                  </span>
                </div>
                <span className={styles.statLabel}>Active Queue Count</span>
                <span className={styles.statValue}>42</span>
              </div>
            </div>

            {/* Upcoming Slots */}
            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentGreen}`} />
              <div className={styles.statInner}>
                <div className={styles.statHeader}>
                  <div className={`${styles.statIconWrap} ${styles.iconBgGreen}`}>
                    <svg className={styles.iconGreen} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="14" height="13" rx="2" />
                      <path d="M7 2v4M13 2v4M3 9h14" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <span className={styles.statLabel}>Upcoming Slots (Next Hr)</span>
                <span className={styles.statValue}>156</span>
              </div>
            </div>

            {/* Fuel Levels */}
            <div className={styles.statCard}>
              <div className={`${styles.accentBar} ${styles.accentRed}`} />
              <div className={styles.statInner}>
                <div className={styles.statHeader}>
                  <div className={`${styles.statIconWrap} ${styles.iconBgRed}`}>
                    <svg className={styles.iconRed} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="9" height="13" rx="1.5" />
                      <path d="M12 7h2a1 1 0 011 1v5M10 9h2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className={styles.badgeRed}>CRITICAL</span>
                </div>
                <span className={styles.statLabel}>Fuel Levels (P / D)</span>
                <span className={styles.statValue}>12% / 48%</span>
              </div>
            </div>
          </div>

          {/* ── Mid row ─────────────────────────────────────────────── */}
          <div className={`${styles.midGrid} ${styles.animateIn}`}>

            {/* Now Serving */}
            <div className={styles.nowServing}>
              <div className={styles.nowServingDeco1} />
              <div className={styles.nowServingDeco2} />

              {/* Header */}
              <div className={styles.nowServingHeader}>
                <span className={styles.nowServingPill}>
                  Now Serving
                  <LiveDot />
                </span>
                <span className={styles.nowServingCount}>Token #882 of 1,284</span>
              </div>

              {/* Token */}
              <span className={styles.nowServingSubLabel}>Token Identifier</span>
              <div className={styles.nowServingTokenRow}>
                <span className={styles.tokenId}>#TK–882</span>
                <div className={styles.vehiclePlateBox}>
                  <span className={styles.vehiclePlateLabel}>Vehicle Plate</span>
                  <span className={styles.vehiclePlateValue}>W-7712 X</span>
                </div>
              </div>

              {/* Progress */}
              <div className={styles.progressSection}>
                <div className={styles.progressMeta}>
                  <span>Filling progress</span>
                  <span>~3 min remaining</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} />
                </div>
              </div>

              {/* Actions */}
              <div className={styles.actionRow}>
                <button className={styles.btnComplete}>
                  <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Complete Filling
                </button>
                <button className={styles.btnNoShow}>
                  <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M6 6l4 4M10 6L6 10" strokeLinecap="round" />
                  </svg>
                  No Show
                </button>
              </div>
            </div>

            {/* Right panel */}
            <div className={styles.rightPanel}>

              {/* Station Status toggle */}
              <button
                onClick={() => setStationOpen((v) => !v)}
                className={`${styles.stationStatusBtn} ${stationOpen ? styles.stationOpen : styles.stationClosed}`}
              >
                <div className={styles.stationIconWrap}>
                  <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
                    <path d="M10 3v3M10 14v3M6 6l-2-2M14 6l2-2M6 14l-2 2M14 14l2 2M3 10H6M14 10h3" strokeLinecap="round" />
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <span className={styles.stationLabel}>Station Status</span>
                  <span className={styles.stationSub}>
                    Station is currently{" "}
                    <strong>{stationOpen ? "OPEN" : "CLOSED"}</strong>
                  </span>
                </div>
                <div className={`${styles.toggle} ${stationOpen ? styles.toggleOn : styles.toggleOff}`}>
                  <div className={styles.toggleKnob} />
                </div>
              </button>

              {/* Quick actions */}
              <div className={styles.quickActions}>
                <button className={styles.btnFuelUpdate}>
                  <div className={styles.btnFuelIconWrap}>
                    <svg fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="3" width="14" height="12" rx="2" />
                      <path d="M6 3V1M12 3V1M2 7h14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className={styles.btnFuelLabel}>Update Fuel Availability</span>
                </button>

                <button
                  onClick={() => setBookingsPaused((v) => !v)}
                  className={`${styles.btnPause} ${bookingsPaused ? styles.btnPausePaused : styles.btnPauseActive}`}
                >
                  <div className={styles.btnPauseIconWrap}>
                    {bookingsPaused ? (
                      <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                        <path d="M5 3l8 5-8 5V3z" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.2">
                        <rect x="4"   y="3" width="2.5" height="10" rx="1" />
                        <rect x="9.5" y="3" width="2.5" height="10" rx="1" />
                      </svg>
                    )}
                  </div>
                  <span className={styles.btnPauseLabel}>
                    {bookingsPaused ? "Resume Bookings" : "Pause New Bookings"}
                  </span>
                </button>
              </div>

              {/* View Transactions */}
              <button className={styles.btnTransactions}>
                <div className={styles.btnTransactionsLeft}>
                  <div className={styles.btnTransactionsIconWrap}>
                    <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="8" cy="8" r="6" />
                      <path d="M8 5v3l2 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={styles.btnTransactionsLabel}>View Recent Transactions</span>
                </div>
                <svg className={styles.arrowIcon} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                  <path d="M4 8h8M9 5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Bottom row ──────────────────────────────────────────── */}
          <div className={`${styles.bottomGrid} ${styles.animateIn}`}>

            {/* Queue table */}
            <div className={styles.queueCard}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.cardTitle}>Upcoming Queue</span>
                  <span className={styles.cardSub}>{QUEUE.length} vehicles scheduled</span>
                </div>
                <button className={styles.viewAllBtn}>
                  View All
                  <svg fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className={styles.tableHead}>
                <span>#</span>
                <span>Plate</span>
                <span>Scheduled</span>
                <span>Status</span>
                <span />
              </div>

              <div className={styles.tableRows}>
                {QUEUE.map((item) => (
                  <div key={item.id} className={styles.tableRow}>
                    <span className={styles.rowId}>{item.id}</span>
                    <span className={styles.rowPlate}>{item.plate}</span>
                    <span className={styles.rowTime}>{item.time}</span>
                    <span>
                      <span className={`${styles.statusBadge} ${STATUS_CLASS[item.status]}`}>
                        {item.status}
                      </span>
                    </span>
                    <button className={styles.rowMenuBtn}>
                      <svg fill="currentColor" viewBox="0 0 12 12">
                        <circle cx="6" cy="2"  r="1.2" />
                        <circle cx="6" cy="6"  r="1.2" />
                        <circle cx="6" cy="10" r="1.2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Velocity */}
            <div className={styles.velocityCard}>
              <span className={styles.cardTitle}>Service Velocity</span>
              <span className={styles.cardSub} style={{ marginBottom: 20 }}>Live station performance</span>

              <div className={styles.metrics}>
                {METRICS.map((m) => (
                  <div key={m.label} className={styles.metric}>
                    <div className={styles.metricHeader}>
                      <span className={styles.metricLabel}>{m.label}</span>
                      <span className={`${styles.metricValue} ${m.valueClass}`}>{m.value}</span>
                    </div>
                    <div className={styles.metricTrack}>
                      <div
                        className={styles.metricFill}
                        style={{ width: `${m.pct}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.advisory}>
                <div className={styles.advisoryIcon}>i</div>
                <p className={styles.advisoryText}>
                  High volume detected. Suggest opening Pump 4 to maintain average serving time below 5 minutes.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.footerSpacer} />
        </div>
      </div>
    </div>
  );
}