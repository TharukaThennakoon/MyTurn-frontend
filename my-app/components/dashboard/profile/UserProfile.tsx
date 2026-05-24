"use client";

import React from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

export default function UserProfile() {
  return (
    <div style={styles.shell}>
      <DashboardTopbar />

      <main style={styles.main}>
        {/* Hero */}
        <section style={styles.hero} className="profile-hero">
          <div style={styles.avatarCard}>
            <div style={styles.avatarIllustration}>
              <span style={styles.avatarFace}>🧑</span>
            </div>
            <button type="button" style={styles.editAvatarBtn} aria-label="Edit photo">
              ✎
            </button>
          </div>
          <div style={styles.heroInfo}>
            <h1 style={styles.heroName}>Adrian Thorne</h1>
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
              <button type="button" style={styles.linkBtn}>
                Edit Info
              </button>
            </div>
            <div style={styles.detailGrid}>
              <DetailField label="FULL NAME" value="Adrian Thorne" />
              <DetailField label="PHONE NUMBER" value="+1 (555) 012-3456" />
            </div>
            <DetailField label="EMAIL ADDRESS" value="adrian.thorne@myturn.com" full />
            <DetailField
              label="PRIMARY RESIDENCE"
              value="742 Evergreen Terrace, Springfield"
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

        {/* Vehicle registration */}
        <section style={styles.vehicleCard}>
          <div style={styles.cardHeaderRow}>
            <h2 style={styles.cardTitle}>Vehicle Registration</h2>
            <button type="button" style={styles.addVehicleBtn}>
              + Add New Vehicle
            </button>
          </div>
          <div style={styles.vehicleRow}>
            <div style={styles.vehicleImageWrap}>
              <div style={styles.vehicleImagePlaceholder}>
                <span style={styles.vehicleEmoji}>🚗</span>
              </div>
            </div>
            <div style={styles.vehicleMeta}>
              <VehicleTag icon="🔢" label="VLT-7729" />
              <VehicleTag icon="⚡" label="Electric SUV" />
              <VehicleTag icon="🚙" label="Tesla Model Y" />
            </div>
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
          />
          <SettingsCard
            icon="🛡"
            iconBg="#fff7ed"
            title="Security & Privacy"
            sub="Two-factor authentication active"
          />
        </div>
      </main>

      <DashboardBottomNav active="profile" />
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
}: {
  icon: string;
  iconBg: string;
  title: string;
  sub: string;
}) {
  return (
    <button type="button" style={styles.settingsCard}>
      <span style={{ ...styles.settingsIcon, background: iconBg }}>{icon}</span>
      <div style={styles.settingsText}>
        <p style={styles.settingsTitle}>{title}</p>
        <p style={styles.settingsSub}>{sub}</p>
      </div>
      <span style={styles.chevron}>›</span>
    </button>
  );
}

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
    padding: "20px 20px 12px",
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
  avatarFace: { fontSize: 56 },
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
    fontSize: 28,
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  heroSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    margin: "0 0 14px",
  },
  badges: { display: "flex", flexWrap: "wrap", gap: 10 },
  badgeVerified: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "6px 12px",
    borderRadius: 20,
    background: "#22c55e",
    color: "#fff",
  },
  badgeRating: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "6px 12px",
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
    padding: "20px 22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  usageCard: {
    background: "#eff6ff",
    borderRadius: 14,
    padding: "20px 22px",
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
    fontSize: 16,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: 13,
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
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: "0 0 6px",
  },
  detailValue: {
    fontSize: 14,
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
    fontSize: 12,
    color: "#64748b",
    margin: "0 0 4px",
    fontWeight: 500,
  },
  usageRefuels: {
    fontSize: 32,
    fontWeight: 800,
    color: "#2563eb",
    margin: 0,
    lineHeight: 1,
  },
  usageHours: {
    fontSize: 32,
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
    width: 40,
    height: 40,
    background: "#f0fdf4",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  carbonLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    margin: "0 0 2px",
  },
  carbonValue: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  vehicleCard: {
    position: "relative",
    background: "#fff",
    borderRadius: 14,
    padding: "20px 22px",
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
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  vehicleRow: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
  },
  vehicleImageWrap: { flexShrink: 0 },
  vehicleImagePlaceholder: {
    width: 160,
    height: 90,
    borderRadius: 10,
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleEmoji: { fontSize: 40 },
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
  vehicleTagIcon: { fontSize: 14 },
  vehicleTagText: {
    fontSize: 13,
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
    fontSize: 16,
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
    padding: "16px 18px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "box-shadow 0.15s",
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  settingsText: { flex: 1, minWidth: 0 },
  settingsTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  settingsSub: {
    fontSize: 12,
    color: "#64748b",
    margin: 0,
  },
  chevron: {
    fontSize: 22,
    color: "#cbd5e1",
    fontWeight: 300,
  },
};
