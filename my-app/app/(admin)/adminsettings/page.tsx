"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

interface Station {
  id: string;
  name: string;
  address: string;
  fuels: string[];
}

export default function AdminSettings() {
  // Preloaded stations list
  const [stations, setStations] = useState<Station[]>([
    {
      id: "1",
      name: "Velocity Central Hub",
      address: "124 Commercial Dr, Downtown",
      fuels: ["Premium Petrol", "Ultra Diesel"],
    },
    {
      id: "2",
      name: "Metro North Point",
      address: "88 Expressway Ave, Uptown",
      fuels: ["Premium Petrol", "Ultra Diesel", "EV Charging"],
    },
  ]);

  // Form states for adding station
  const [stationName, setStationName] = useState("");
  const [stationAddress, setStationAddress] = useState("");
  const [selectedFuels, setSelectedFuels] = useState<string[]>(["Premium Petrol"]);

  // Global settings state
  const [queueWindow, setQueueWindow] = useState("10");
  const [maxLeadTime, setMaxLeadTime] = useState("7");
  const [autoServe, setAutoServe] = useState(true);
  const [allowCancellations, setAllowCancellations] = useState(true);
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  const toggleFuel = (fuel: string) => {
    if (selectedFuels.includes(fuel)) {
      setSelectedFuels(selectedFuels.filter((f) => f !== fuel));
    } else {
      setSelectedFuels([...selectedFuels, fuel]);
    }
  };

  const handleAddStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationName.trim() || !stationAddress.trim()) return;

    const newStation: Station = {
      id: Date.now().toString(),
      name: stationName,
      address: stationAddress,
      fuels: selectedFuels,
    };

    setStations([...stations, newStation]);
    setStationName("");
    setStationAddress("");
    setSelectedFuels(["Premium Petrol"]);
  };

  const handleDeleteStation = (id: string) => {
    setStations(stations.filter((s) => s.id !== id));
  };

  const handleSaveSettings = () => {
    setNotificationSuccess(true);
    setTimeout(() => {
      setNotificationSuccess(false);
    }, 3000);
  };

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <AdminSidebar activeNav="Settings" />

      {/* Main Container */}
      <div className={styles.main}>
        {/* Topbar */}
        <AdminHeader title="Admin Settings" searchPlaceholder="Search settings..." />

        {/* Scrollable body */}
        <div className={styles.body}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 4px" }}>Admin Settings</h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Manage system configuration, stations list, and scheduling thresholds.
            </p>
          </div>

          {notificationSuccess && (
            <div
              style={{
                background: "#dcfce7",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ✓ Admin configurations saved successfully!
            </div>
          )}

          <div className={styles.grid}>
            {/* Left: Station Management */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Form to Add Station */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Add New Station</h2>
                <form onSubmit={handleAddStation} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Station Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Velocity East Boulevard"
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Address</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. 45 Landmark Rd, East District"
                      value={stationAddress}
                      onChange={(e) => setStationAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Supported Fuel & Services</label>
                    <div className={styles.checkboxGroup}>
                      {["Premium Petrol", "Ultra Diesel", "EV Charging", "CNG Gas"].map((fuel) => {
                        const active = selectedFuels.includes(fuel);
                        return (
                          <label
                            key={fuel}
                            className={`${styles.checkboxLabel} ${active ? styles.checkboxActive : ""}`}
                          >
                            <input
                              type="checkbox"
                              className={styles.checkboxHidden}
                              checked={active}
                              onChange={() => toggleFuel(fuel)}
                            />
                            <span>{active ? "✓" : "+"}</span> {fuel}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" className={styles.btn}>
                    Add Station
                  </button>
                </form>
              </div>

              {/* Stations List */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Active Stations List</h2>
                <div className={styles.stationsList}>
                  {stations.map((s) => (
                    <div key={s.id} className={styles.stationItem}>
                      <div className={styles.stationInfo}>
                        <h3 className={styles.stationNameText}>{s.name}</h3>
                        <p className={styles.stationDetailsText}>{s.address}</p>
                        <div className={styles.stationFuelTags}>
                          {s.fuels.map((fuel) => (
                            <span key={fuel} className={styles.fuelTag}>
                              {fuel}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteStation(s.id)}
                        className={styles.deleteBtn}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {stations.length === 0 && (
                    <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", margin: "16px 0" }}>
                      No active stations. Use the form above to add a new station.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Global Settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Station Settings & Rules</h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Queue Arrival Grace Window (Mins)</label>
                  <input
                    type="number"
                    className={styles.input}
                    min="1"
                    max="60"
                    value={queueWindow}
                    onChange={(e) => setQueueWindow(e.target.value)}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Duration in minutes a driver has to check in before the ticket is auto-released.
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Max Booking Lead Time (Days)</label>
                  <select
                    className={styles.input}
                    value={maxLeadTime}
                    onChange={(e) => setMaxLeadTime(e.target.value)}
                  >
                    <option value="3">3 Days Ahead</option>
                    <option value="7">7 Days Ahead</option>
                    <option value="14">14 Days Ahead</option>
                    <option value="30">30 Days Ahead</option>
                  </select>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <div className={styles.toggleRow}>
                    <div className={styles.toggleText}>
                      <span className={styles.toggleLabel}>Automatic Queue Progression</span>
                      <span className={styles.toggleSub}>
                        Let the system advance turns automatically based on average fill times.
                      </span>
                    </div>
                    <label className={styles.checkboxLabel} style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        className={styles.checkboxHidden}
                        checked={autoServe}
                        onChange={() => setAutoServe(!autoServe)}
                      />
                      <span
                        style={{
                          width: "36px",
                          height: "20px",
                          background: autoServe ? "#2563eb" : "#cbd5e1",
                          borderRadius: "10px",
                          display: "inline-block",
                          position: "relative",
                          transition: "background 0.2s",
                        }}
                      >
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            background: "white",
                            borderRadius: "50%",
                            position: "absolute",
                            top: "3px",
                            left: autoServe ? "19px" : "3px",
                            transition: "left 0.2s",
                          }}
                        />
                      </span>
                    </label>
                  </div>

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleText}>
                      <span className={styles.toggleLabel}>Allow In-App Cancellations</span>
                      <span className={styles.toggleSub}>
                        Drivers can cancel their slots without penalty up to 30 mins prior.
                      </span>
                    </div>
                    <label className={styles.checkboxLabel} style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        className={styles.checkboxHidden}
                        checked={allowCancellations}
                        onChange={() => setAllowCancellations(!allowCancellations)}
                      />
                      <span
                        style={{
                          width: "36px",
                          height: "20px",
                          background: allowCancellations ? "#2563eb" : "#cbd5e1",
                          borderRadius: "10px",
                          display: "inline-block",
                          position: "relative",
                          transition: "background 0.2s",
                        }}
                      >
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            background: "white",
                            borderRadius: "50%",
                            position: "absolute",
                            top: "3px",
                            left: allowCancellations ? "19px" : "3px",
                            transition: "left 0.2s",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>

                <div className={styles.buttonRow}>
                  <button type="button" onClick={handleSaveSettings} className={styles.btn}>
                    Save Configurations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
