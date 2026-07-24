"use client";

import React, { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

export default function UserProfile() {
  // Profile state details — loaded from localStorage after login
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Vehicles state details
  const [vehicles, setVehicles] = useState<
    { tag: string; type: string; model: string; img: string }[]
  >([]);

  // Load real user data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({
          name: parsed.name || parsed.fullName || "Driver",
          phone: parsed.phone || "",
          email: parsed.email || "",
          address: "",
        });
        if (parsed.vehicleNumber) {
          setVehicles([
            {
              tag: parsed.vehicleNumber,
              type: "Registered Vehicle",
              model: "Primary Vehicle",
              img: "/images/car.png",
            },
          ]);
        }
      }
    } catch (e) {}
  }, []);

  // Modal display states
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);

  // Temporary draft states for forms
  const [tempInfo, setTempInfo] = useState({ ...profile });
  const [tempVehicle, setTempVehicle] = useState({ tag: "", type: "Electric SUV", model: "" });

  const handleEditInfoClick = () => {
    setTempInfo({ ...profile });
    setShowEditInfo(true);
  };

  const handleSaveInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Also persist updated name back to localStorage
    try {
      const stored = localStorage.getItem("user");
      const existing = stored ? JSON.parse(stored) : {};
      localStorage.setItem("user", JSON.stringify({ ...existing, ...tempInfo }));
    } catch (e) {}
    setProfile({ ...tempInfo });
    setShowEditInfo(false);
  };

  const handleAddVehicleClick = () => {
    setTempVehicle({ tag: "", type: "Electric SUV", model: "" });
    setShowAddVehicle(true);
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicles([
      ...vehicles,
      { tag: tempVehicle.tag, type: tempVehicle.type, model: tempVehicle.model, img: "/images/car.png" }
    ]);
    setShowAddVehicle(false);
  };

  return (
    <div style={styles.shell}>
      <DashboardTopbar userName={profile.name.split(" ")[0]} />

      <main style={styles.main}>
        {/* Hero */}
        <section style={styles.hero} className="profile-hero">
          <div style={styles.avatarCard}>
            <div style={styles.avatarIllustration}>
              <img
                src="/images/profile-avatar.png"
                alt={profile.name}
                style={styles.avatarImage}
              />
            </div>
            <button
              type="button"
              style={styles.editAvatarBtn}
              aria-label="Edit photo"
            >
              ✎
            </button>
          </div>
          <div style={styles.heroInfo}>
            <h1 style={styles.heroName}>{profile.name}</h1>
            <p style={styles.heroSub}>Elite Member since Jan 2023</p>
            <div style={styles.badges}>
              <span style={styles.badgeVerified}>✓ VERIFIED DRIVER</span>
              <span style={styles.badgeRating}>★ 4.9 RATING</span>
            </div>
          </div>
        </section>

        {/* Personal details + Usage flow */}
        <div style={styles.twoCol} className="profile-two-col">
          <section style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Personal Details</h2>
              <button type="button" style={styles.linkBtn} onClick={handleEditInfoClick}>
                Edit Info
              </button>
            </div>
            <div style={styles.detailGrid}>
              <DetailField label="FULL NAME" value={profile.name} />
              <DetailField label="PHONE NUMBER" value={profile.phone} />
            </div>
            <DetailField
              label="EMAIL ADDRESS"
              value={profile.email}
              full
            />
            <DetailField
              label="PRIMARY RESIDENCE"
              value={profile.address}
              full
              last
            />
          </section>

          <section style={styles.usageCard}>
            <h2 style={styles.cardTitle}>Usage Flow</h2>
            <div style={styles.usageStats}>
              <div>
                <p style={styles.usageLabel}>Refuels</p>
                <p style={styles.usageRefuels}>48</p>
              </div>
              <div>
                <p style={styles.usageLabel}>Hours Saved</p>
                <p style={styles.usageHours}>12.5</p>
              </div>
            </div>
            <div style={styles.carbonRow}>
              <div style={styles.carbonIcon}>🌿</div>
              <div>
                <p style={styles.carbonLabel}>CARBON OFFSET</p>
                <p style={styles.carbonValue}>2.4 Tons</p>
              </div>
            </div>
          </section>
        </div>

        {/* Vehicle registration list */}
        <section style={styles.vehicleCard}>
          <div style={styles.cardHeaderRow}>
            <h2 style={styles.cardTitle}>Vehicle Registration</h2>
            <button type="button" style={styles.addVehicleBtn} onClick={handleAddVehicleClick}>
              + Add New Vehicle
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {vehicles.map((veh, i) => (
              <div key={i} style={styles.vehicleRow}>
                <div style={styles.vehicleImageWrap}>
                  <div style={styles.vehicleImagePlaceholder}>
                    <img
                      src={veh.img}
                      alt={veh.model}
                      style={styles.vehicleImage}
                    />
                  </div>
                </div>
                <div style={styles.vehicleMeta}>
                  <VehicleTag icon="🔢" label={veh.tag} />
                  <VehicleTag icon="⚡" label={veh.type} />
                  <VehicleTag icon="🚙" label={veh.model} />
                </div>
              </div>
            ))}
          </div>
          <span style={styles.vehicleWatermark} aria-hidden>
            🚗
          </span>
        </section>

        {/* Account settings */}
        <h2 style={styles.sectionTitle}>Account Settings</h2>
        <div style={styles.settingsGrid} className="profile-settings-grid">
          <SettingsCard
            icon="💳"
            iconBg="#eff6ff"
            title="Payment Methods"
            sub="Visa ending in .... 4492"
            onClick={() => setShowPaymentSettings(true)}
          />
          <SettingsCard
            icon="🛡"
            iconBg="#fff7ed"
            title="Security & Privacy"
            sub="Two-factor authentication active"
            onClick={() => setShowSecuritySettings(true)}
          />
        </div>
      </main>

      <DashboardBottomNav active="profile" />

      {/* ── Edit Info Modal Overlay ── */}
      {showEditInfo && (
        <div style={modalOverlayStyle} onClick={() => setShowEditInfo(false)}>
          <div style={modalCardStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Edit Personal Details</h3>
              <button style={modalCloseBtnStyle} onClick={() => setShowEditInfo(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveInfoSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={tempInfo.name}
                  onChange={e => setTempInfo({ ...tempInfo, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={tempInfo.phone}
                  onChange={e => setTempInfo({ ...tempInfo, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  style={inputStyle}
                  value={tempInfo.email}
                  onChange={e => setTempInfo({ ...tempInfo, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Primary Residence</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={tempInfo.address}
                  onChange={e => setTempInfo({ ...tempInfo, address: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" style={secondaryBtnStyle} onClick={() => setShowEditInfo(false)}>Cancel</button>
                <button type="submit" style={primaryBtnStyle}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Vehicle Modal Overlay ── */}
      {showAddVehicle && (
        <div style={modalOverlayStyle} onClick={() => setShowAddVehicle(false)}>
          <div style={modalCardStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Register New Vehicle</h3>
              <button style={modalCloseBtnStyle} onClick={() => setShowAddVehicle(false)}>✕</button>
            </div>
            <form onSubmit={handleAddVehicleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>License Plate Tag</label>
                <input
                  type="text"
                  placeholder="e.g. VLT-8849"
                  style={inputStyle}
                  value={tempVehicle.tag}
                  onChange={e => setTempVehicle({ ...tempVehicle, tag: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Vehicle Type / Power source</label>
                <select
                  style={inputStyle}
                  value={tempVehicle.type}
                  onChange={e => setTempVehicle({ ...tempVehicle, type: e.target.value })}
                  required
                >
                  <option value="Electric SUV">Electric SUV</option>
                  <option value="Petrol Sedan">Petrol Sedan</option>
                  <option value="Diesel Pickup">Diesel Pickup</option>
                  <option value="Hybrid Hatchback">Hybrid Hatchback</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Vehicle Model</label>
                <input
                  type="text"
                  placeholder="e.g. Tesla Model 3"
                  style={inputStyle}
                  value={tempVehicle.model}
                  onChange={e => setTempVehicle({ ...tempVehicle, model: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" style={secondaryBtnStyle} onClick={() => setShowAddVehicle(false)}>Cancel</button>
                <button type="submit" style={primaryBtnStyle}>Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Payment Settings Modal Overlay ── */}
      {showPaymentSettings && (
        <div style={modalOverlayStyle} onClick={() => setShowPaymentSettings(false)}>
          <div style={modalCardStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Payment Methods</h3>
              <button style={modalCloseBtnStyle} onClick={() => setShowPaymentSettings(false)}>✕</button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}>
                <span style={{ fontSize: 24 }}>💳</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", margin: 0 }}>Visa ending in 4492</p>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Expires 12/28 · Primary</p>
                </div>
                <button style={{ background: "none", border: "none", color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Delete</button>
              </div>
              <button style={{ ...primaryBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span>+</span> Add Credit Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Security Settings Modal Overlay ── */}
      {showSecuritySettings && (
        <div style={modalOverlayStyle} onClick={() => setShowSecuritySettings(false)}>
          <div style={modalCardStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Security & Privacy</h3>
              <button style={modalCloseBtnStyle} onClick={() => setShowSecuritySettings(false)}>✕</button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", margin: 0 }}>Two-Factor Auth</p>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Secure account with TOTP tokens</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 18, height: 18 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", margin: 0 }}>Biometric Sign In</p>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Use FaceID or Fingerprint scan</p>
                </div>
                <input type="checkbox" style={{ width: 18, height: 18 }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailField({
  label,
  value,
  full,
  last,
}: {
  label: string;
  value: string;
  full?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.detailField,
        ...(full ? styles.detailFieldFull : {}),
        ...(last ? { borderBottom: "none", paddingBottom: 0 } : {}),
      }}
    >
      <p style={styles.detailLabel}>{label}</p>
      <p style={styles.detailValue}>{value}</p>
    </div>
  );
}

function VehicleTag({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={styles.vehicleTag}>
      <span style={styles.vehicleTagIcon}>{icon}</span>
      <span style={styles.vehicleTagText}>{label}</span>
    </div>
  );
}

function SettingsCard({
  icon,
  iconBg,
  title,
  sub,
  onClick,
}: {
  icon: string;
  iconBg: string;
  title: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button type="button" style={styles.settingsCard} onClick={onClick}>
      <span style={{ ...styles.settingsIcon, background: iconBg }}>{icon}</span>
      <div style={styles.settingsText}>
        <p style={styles.settingsTitle}>{title}</p>
        <p style={styles.settingsSub}>{sub}</p>
      </div>
      <span style={styles.chevron}>›</span>
    </button>
  );
}

// ─── Shared Popover Styles ───────────────────────────────────────────────────
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.65)",
  backdropFilter: "blur(4px)",
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const modalCardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 18,
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  overflow: "hidden",
};

const modalHeaderStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const modalCloseBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  border: "1.5px solid rgba(255,255,255,0.3)",
  color: "#fff",
  borderRadius: 6,
  width: 30,
  height: 30,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  color: "#64748b",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "#f8fafc",
  border: "1.5px solid #e2e8f0",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  color: "#0f172a",
  fontFamily: "inherit",
  outline: "none",
};

const primaryBtnStyle: React.CSSProperties = {
  flex: 1,
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "12px",
  fontSize: 13.5,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
};

const secondaryBtnStyle: React.CSSProperties = {
  background: "#f1f5f9",
  color: "#475569",
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  padding: "12px 18px",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 20px 120px",
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 20,
    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.25)",
  },
  avatarCard: {
    position: "relative",
    flexShrink: 0,
  },
  avatarIllustration: {
    width: 120,
    height: 120,
    background: "#fff",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 14,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    border: "3px solid #fff",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  heroInfo: { flex: 1, minWidth: 0 },
  heroName: {
    fontSize: 32,
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  heroSub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    margin: "0 0 14px",
  },
  badges: { display: "flex", flexWrap: "wrap", gap: 10 },
  badgeVerified: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "8px 14px",
    borderRadius: 20,
    background: "#22c55e",
    color: "#fff",
  },
  badgeRating: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "8px 14px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.25)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.35)",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "24px 26px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  usageCard: {
    background: "#eff6ff",
    borderRadius: 14,
    padding: "24px 26px",
    border: "1px solid #dbeafe",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: 14.5,
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 20px",
  },
  detailField: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: "1px solid #f1f5f9",
  },
  detailFieldFull: {
    gridColumn: "1 / -1",
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: "0 0 6px",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  usageStats: {
    display: "flex",
    gap: 40,
    marginBottom: 20,
  },
  usageLabel: {
    fontSize: 14,
    color: "#64748b",
    margin: "0 0 4px",
    fontWeight: 500,
  },
  usageRefuels: {
    fontSize: 38,
    fontWeight: 800,
    color: "#2563eb",
    margin: 0,
    lineHeight: 1,
  },
  usageHours: {
    fontSize: 38,
    fontWeight: 800,
    color: "#16a34a",
    margin: 0,
    lineHeight: 1,
  },
  carbonRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    borderRadius: 10,
    padding: "12px 14px",
  },
  carbonIcon: {
    width: 44,
    height: 44,
    background: "#f0fdf4",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },
  carbonLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: "0 0 2px",
  },
  carbonValue: {
    fontSize: 17,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  vehicleCard: {
    position: "relative",
    background: "#fff",
    borderRadius: 14,
    padding: "24px 26px",
    border: "1px solid #e2e8f0",
    marginBottom: 24,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  addVehicleBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  vehicleRow: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: 16,
  },
  vehicleImageWrap: { flexShrink: 0 },
  vehicleImagePlaceholder: {
    width: 170,
    height: 95,
    borderRadius: 10,
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "8px",
  },
  vehicleMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    flex: 1,
  },
  vehicleTag: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#eff6ff",
    borderRadius: 8,
    padding: "10px 14px",
    border: "1px solid #dbeafe",
  },
  vehicleTagIcon: { fontSize: 16 },
  vehicleTagText: {
    fontSize: 14.5,
    fontWeight: 700,
    color: "#1e40af",
  },
  vehicleWatermark: {
    position: "absolute",
    right: 24,
    bottom: 10,
    fontSize: 80,
    opacity: 0.06,
    pointerEvents: "none",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 14px",
  },
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 8,
  },
  settingsCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "18px 20px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "box-shadow 0.15s",
  },
  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0,
  },
  settingsText: { flex: 1, minWidth: 0 },
  settingsTitle: {
    fontSize: 15.5,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  settingsSub: {
    fontSize: 13.5,
    color: "#64748b",
    margin: 0,
  },
  chevron: {
    fontSize: 24,
    color: "#cbd5e1",
    fontWeight: 300,
  },
};
