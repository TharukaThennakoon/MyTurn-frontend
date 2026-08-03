"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Settings,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  ChevronDown,
  Building2,
} from "lucide-react";
import styles from "./AdminHeader.module.css";

interface AdminHeaderProps {
  title?: string;
  searchPlaceholder?: string;
}

interface AdminUser {
  name: string;
  email: string;
  phone: string;
  stationId: number | null;
  stationName: string;
  role: string;
}

export default function AdminHeader({
  title = "MyTurn Dashboard",
  searchPlaceholder = "Search tokens...",
}: AdminHeaderProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const [adminUser, setAdminUser] = useState<AdminUser>({
    name: "Admin User",
    email: "admin@myturn.lk",
    phone: "+94 77 123 4567",
    stationId: null,
    stationName: "Station",
    role: "ROLE_ADMIN",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAdminUser({
          name: parsed.name || parsed.fullName || "Admin User",
          email: parsed.email || "admin@myturn.lk",
          phone: parsed.phone || "Not specified",
          stationId: parsed.stationId || null,
          stationName: parsed.stationName || "Fuel Station",
          role: parsed.role || "ROLE_ADMIN",
        });
      }
    } catch (e) {
      console.error("Error reading admin user data:", e);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    } catch (e) {
      console.error("Error clearing admin session:", e);
    }
    setShowProfileMenu(false);
    router.push("/adminlogin");
  };

  const getInitial = (name: string) => {
    return name && name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : "A";
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        {adminUser.stationName && adminUser.stationName !== "Station"
          ? `${adminUser.stationName} — Dashboard`
          : title}
      </div>

      <div className={styles.rightSection}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder={searchPlaceholder} className={styles.searchInput} />
        </div>

        <div className={styles.headerActions}>
          {/* Notification Button & Popover */}
          <div className={styles.dropdownWrapper}>
            <button
              className={styles.iconBtn}
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowProfileMenu(false);
              }}
              title="Notifications"
            >
              <Bell size={18} />
              <span className={styles.notifBadge} />
            </button>

            {showNotifMenu && (
              <>
                <div
                  className={styles.dropdownBackdrop}
                  onClick={() => setShowNotifMenu(false)}
                />
                <div className={styles.notifDropdown}>
                  <div className={styles.dropdownHeader}>
                    <Bell size={16} />
                    <span>Admin Alerts & Notifications</span>
                  </div>
                  <div className={styles.notifList}>
                    <div className={styles.notifItem}>
                      <span className={styles.notifIconActive}>⛽</span>
                      <div>
                        <p className={styles.notifTitle}>Fuel Inventory Updated</p>
                        <p className={styles.notifDesc}>Petrol 92 stock updated to 4,500 L.</p>
                        <span className={styles.notifTime}>10 mins ago</span>
                      </div>
                    </div>
                    <div className={styles.notifItem}>
                      <span className={styles.notifIconInfo}>📋</span>
                      <div>
                        <p className={styles.notifTitle}>New Queue Token Issue</p>
                        <p className={styles.notifDesc}>Token #104 checked in for Slot 09:00 AM.</p>
                        <span className={styles.notifTime}>35 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Profile Trigger & Dropdown */}
          <div className={styles.dropdownWrapper}>
            <button
              className={styles.profileTrigger}
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifMenu(false);
              }}
              aria-label="Admin Profile Menu"
            >
              <div className={styles.avatarBadge}>
                {getInitial(adminUser.name)}
              </div>
              <div className={styles.profileMeta}>
                <span className={styles.adminNameText}>{adminUser.name}</span>
                <span className={styles.adminRoleSub}>
                  {adminUser.stationId ? `Station #${adminUser.stationId}` : "Station Admin"}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`${styles.chevronIcon} ${showProfileMenu ? styles.chevronRotated : ""}`}
              />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className={styles.dropdownBackdrop}
                  onClick={() => setShowProfileMenu(false)}
                />

                <div className={styles.profileDropdown}>
                  {/* Top Profile Card */}
                  <div className={styles.profileHeaderCard}>
                    <div className={styles.largeAvatar}>
                      {getInitial(adminUser.name)}
                    </div>
                    <div className={styles.profileHeaderDetails}>
                      <h4 className={styles.profileHeaderName}>{adminUser.name}</h4>
                      <span className={styles.profileHeaderRole}>
                        <Shield size={12} style={{ marginRight: 4 }} />
                        Station Administrator
                      </span>
                    </div>
                  </div>

                  {/* Admin Details Section */}
                  <div className={styles.detailsGroup}>
                    <div className={styles.detailRow}>
                      <Building2 className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Station:</span>
                      <span className={styles.detailValue}>{adminUser.stationName}</span>
                    </div>

                    {adminUser.stationId && (
                      <div className={styles.detailRow}>
                        <MapPin className={styles.detailIcon} />
                        <span className={styles.detailLabel}>Station ID:</span>
                        <span className={styles.detailValue}>#{adminUser.stationId}</span>
                      </div>
                    )}

                    <div className={styles.detailRow}>
                      <Mail className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Email:</span>
                      <span className={styles.detailValue}>{adminUser.email}</span>
                    </div>

                    <div className={styles.detailRow}>
                      <Phone className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Phone:</span>
                      <span className={styles.detailValue}>{adminUser.phone}</span>
                    </div>
                  </div>

                  <div className={styles.dropdownDivider} />

                  {/* Quick Action Links & Logout */}
                  <div className={styles.dropdownActions}>
                    <button
                      className={styles.settingsBtn}
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push("/adminsettings");
                      }}
                    >
                      <Settings size={16} />
                      Admin Settings
                    </button>

                    <button
                      className={styles.logoutBtn}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

