"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminSidebar.module.css";

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

// ─── Component ────────────────────────────────────────────────────────────────
interface AdminSidebarProps {
  activeNav: string;
}

export default function AdminSidebar({ activeNav }: AdminSidebarProps) {
  const router = useRouter();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Online");

  const NAV_ITEMS = [
    { label: "Overview", icon: OverviewIcon, path: "/admindashboard" },
    { label: "Queue", icon: QueueIcon, path: "/adminqueue" },
    { label: "Slots", icon: SlotsIcon, path: "/adminslots" },
    { label: "Fuel", icon: FuelIcon, path: "/adminfuel" },
    { label: "Analytics", icon: AnalyticsIcon, path: "/adminanalytics" },
    { label: "Settings", icon: SettingsIcon, path: "#" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <h1 className={styles.brandName}>MyTurn Admin</h1>
        <div className={styles.brandSub}>Station #402</div>
      </div>

      <nav className={styles.navSection}>
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => {
              if (path !== "#") {
                router.push(path);
              }
            }}
            className={`${styles.navItem} ${activeNav === label ? styles.navItemActive : ""}`}
          >
            <Icon className={styles.navIcon} />
            {label}
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.statusWrapper}>
          <button 
            className={styles.updateBtn}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            Update Status
          </button>
          
          {showStatusMenu && (
            <div className={styles.statusMenu}>
              <div className={styles.statusMenuHeader}>Set Station Status</div>
              <button 
                className={`${styles.statusMenuItem} ${currentStatus === "Online" ? styles.activeStatus : ""}`}
                onClick={() => { setCurrentStatus("Online"); setShowStatusMenu(false); }}
              >
                <span className={styles.dotGreen}></span> Online
              </button>
              <button 
                className={`${styles.statusMenuItem} ${currentStatus === "Maintenance" ? styles.activeStatus : ""}`}
                onClick={() => { setCurrentStatus("Maintenance"); setShowStatusMenu(false); }}
              >
                <span className={styles.dotYellow}></span> Maintenance
              </button>
              <button 
                className={`${styles.statusMenuItem} ${currentStatus === "Offline" ? styles.activeStatus : ""}`}
                onClick={() => { setCurrentStatus("Offline"); setShowStatusMenu(false); }}
              >
                <span className={styles.dotRed}></span> Offline
              </button>
            </div>
          )}
        </div>

        <div className={styles.profile}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#e2e8f0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="15" r="7" fill="#94a3b8" />
              <path d="M7 36C7 28.8203 12.8203 23 20 23C27.1797 23 33 28.8203 33 36V40H7V36Z" fill="#94a3b8" />
            </svg>
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Station Manager</span>
            <span 
              className={styles.profileStatus}
              style={{
                color: currentStatus === "Online" ? "#16a34a" : currentStatus === "Maintenance" ? "#f59e0b" : "#ef4444"
              }}
            >
              {currentStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
