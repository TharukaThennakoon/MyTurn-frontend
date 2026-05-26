"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function QueueIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 5h14M3 10h14M3 15h8" strokeLinecap="round" />
    </svg>
  );
}

function SlotsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FuelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="4" width="9" height="13" rx="1.5" />
      <path d="M12 7h2a1 1 0 011 1v2a1 1 0 001 1h0V8.5L14 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 15l4-5 4 2 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminQueue() {
  const [activeNav, setActiveNav] = useState("Queue");
  const router = useRouter();

  const NAV_ITEMS = [
    { label: "Overview", icon: OverviewIcon },
    { label: "Queue", icon: QueueIcon },
    { label: "Slots", icon: SlotsIcon },
    { label: "Fuel", icon: FuelIcon },
    { label: "Analytics", icon: AnalyticsIcon },
    { label: "Settings", icon: SettingsIcon },
  ];

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
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h1 className={styles.brandTitle}>MyTurn Admin</h1>
          <p className={styles.brandSub}>Station #402</p>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveNav(label);
                if (label === "Queue") {
                  router.push("/adminqueue");
                } else if (label === "Overview") {
                  router.push("/admindashboard");
                }
              }}
              className={`${styles.navItem} ${activeNav === label ? styles.active : ""}`}
            >
              <div className={styles.navIcon}>
                <Icon />
              </div>
              {label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <button className={styles.updateBtn}>Update Status</button>
          <div className={styles.profile}>
            <div style={{width: 40, height: 40, backgroundColor: "#e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="15" r="7" fill="#94a3b8"/>
                <path d="M7 36C7 28.8203 12.8203 23 20 23C27.1797 23 33 28.8203 33 36V40H7V36Z" fill="#94a3b8"/>
              </svg>
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>Station Manager</span>
              <span className={styles.profileStatus}>ONLINE</span>
            </div>
          </div>
        </div>
      </aside>

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
