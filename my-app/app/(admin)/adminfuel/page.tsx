"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminFuel() {
  const [petrolStatus, setPetrolStatus] = useState("AVAILABLE");
  const [dieselStatus, setDieselStatus] = useState("LIMITED");

  return (
    <div className={styles.container}>
      <AdminSidebar activeNav="Fuel" />

      <main className={styles.main}>
        <AdminHeader searchPlaceholder="Search station data..." />

        <div className={styles.content}>
          <div className={styles.topSection}>
            <h1 className={styles.pageTitle}>Fuel Availability & Station Info</h1>
            <p className={styles.pageSubtitle}>
              Manage real-time fuel status updates and station metadata. All changes made here are
              instantly synchronized with the citizen-facing mobile application.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            {/* Left Card: Fuel Availability */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.iconWrapBlue}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <path d="M12 14c-1.5 0-3 1.5-3 3 0 1.5 1.5 3 3 3s3-1.5 3-3c0-1.5-1.5-3-3-3z"></path>
                    </svg>
                  </div>
                  <h2 className={styles.cardTitle}>Fuel Availability</h2>
                </div>
                <span className={styles.badgeLiveSync}>LIVE SYNC</span>
              </div>
              <p className={styles.cardDesc}>
                Updates citizen app in real-time. Select the current status for each fuel type to inform
                waiting drivers.
              </p>

              <div className={styles.fuelSection}>
                <h3 className={styles.fuelTypeTitle}>
                  <span className={styles.dotBlue}></span> Petrol (95 Octane)
                </h3>
                <div className={styles.statusButtons}>
                  <button
                    className={`${styles.statusBtn} ${petrolStatus === "AVAILABLE" ? styles.activeAvailable : ""}`}
                    onClick={() => setPetrolStatus("AVAILABLE")}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.statusIcon}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                    AVAILABLE
                  </button>
                  <button
                    className={`${styles.statusBtn} ${petrolStatus === "LIMITED" ? styles.activeLimited : ""}`}
                    onClick={() => setPetrolStatus("LIMITED")}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.statusIcon}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    LIMITED
                  </button>
                  <button
                    className={`${styles.statusBtn} ${petrolStatus === "NONE" ? styles.activeNone : ""}`}
                    onClick={() => setPetrolStatus("NONE")}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.statusIcon}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    NONE
                  </button>
                </div>
              </div>

              <div className={styles.fuelSection}>
                <h3 className={styles.fuelTypeTitle}>
                  <span className={styles.dotBlue}></span> Diesel (Auto Grade)
                </h3>
                <div className={styles.statusButtons}>
                  <button
                    className={`${styles.statusBtn} ${dieselStatus === "AVAILABLE" ? styles.activeAvailable : ""}`}
                    onClick={() => setDieselStatus("AVAILABLE")}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.statusIcon}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                    AVAILABLE
                  </button>
                  <button
                    className={`${styles.statusBtn} ${dieselStatus === "LIMITED" ? styles.activeLimited : ""}`}
                    onClick={() => setDieselStatus("LIMITED")}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.statusIcon}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    LIMITED
                  </button>
                  <button
                    className={`${styles.statusBtn} ${dieselStatus === "NONE" ? styles.activeNone : ""}`}
                    onClick={() => setDieselStatus("NONE")}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.statusIcon}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    NONE
                  </button>
                </div>
              </div>

              <div className={styles.liveBroadcast}>
                <span className={styles.dotGreen}></span> Broadcasting live status to 1,240 nearby users
              </div>
            </div>

            {/* Right Card: Station Info Management */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.iconWrapBlue}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16M4 12h16M4 18h7" />
                      <circle cx="18" cy="17" r="3" />
                    </svg>
                  </div>
                  <h2 className={styles.cardTitle}>Station Info Management</h2>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>STATION NAME</label>
                  <input type="text" className={styles.formInput} defaultValue="City Center Apex Station #402" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>OPERATING HOURS</label>
                  <input type="text" className={styles.formInput} defaultValue="06:00 AM - 11:00 PM (Daily)" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>FULL ADDRESS</label>
                <input type="text" className={styles.formInput} defaultValue="882 Commercial Parkway, District 4, Metro City" />
              </div>

              <div className={styles.mapSection}>
                <div className={styles.mapLeft}>
                  <label className={styles.formLabel}>MAP LOCATION (COORDINATES)</label>
                  <div className={styles.coordsRow}>
                    <input type="text" className={styles.formInput} defaultValue="40.7128° N" />
                    <input type="text" className={styles.formInput} defaultValue="74.0060° W" />
                  </div>
                  <div className={styles.infoAlert}>
                    <div className={styles.infoAlertTitle}>PUBLIC DISPLAY INFO</div>
                    <div className={styles.infoAlertDesc}>
                      Ensure coordinates are accurate to help navigation systems guide drivers correctly to your entrance.
                    </div>
                  </div>
                </div>
                
                <div className={styles.mapRight}>
                  <label className={styles.formLabel}>MAP PREVIEW</label>
                  <div className={styles.mapPreview}>
                    <div className={styles.mapPin}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <button className={styles.mapBtn}>Expand Map</button>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnGhost}>Discard Changes</button>
                <button className={styles.btnPrimary}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
