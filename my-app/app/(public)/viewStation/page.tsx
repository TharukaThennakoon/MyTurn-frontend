"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import timeSlotService, { TimeSlotResponse } from "@/services/timeSlotService";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Fuel {
  type: string;
  status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
}

interface Station {
  id: string;
  name: string;
  address: string;
  district: string;
  status: "OPEN" | "BUSY" | "CLOSED";
  fuel: Fuel[];
  waitMin: number;
  queueCount: number;
  slots: number;
  distance: string;
  rating: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const STATIONS: Station[] = [
  {
    id: "vanguard-east",
    name: "Vanguard Station East",
    address: "42 Digital Avenue, Sector 7",
    district: "Colombo",
    status: "OPEN",
    fuel: [
      { type: "95 Octane", status: "AVAILABLE" },
      { type: "Diesel Pro", status: "LIMITED" },
      { type: "Super 98", status: "AVAILABLE" },
    ],
    waitMin: 12,
    queueCount: 8,
    slots: 4,
    distance: "2.3 km",
    rating: 4.8,
  },
  {
    id: "nexus-central",
    name: "Nexus Central Hub",
    address: "156 Commerce Plaza, Downtown",
    district: "Colombo",
    status: "OPEN",
    fuel: [
      { type: "Premium Petrol", status: "AVAILABLE" },
      { type: "Ultra Diesel", status: "AVAILABLE" },
    ],
    waitMin: 18,
    queueCount: 12,
    slots: 2,
    distance: "3.1 km",
    rating: 4.5,
  },
  {
    id: "horizon-west",
    name: "Horizon West Terminal",
    address: "789 Industrial Park, West Zone",
    district: "Gampaha",
    status: "BUSY",
    fuel: [
      { type: "95 Octane", status: "AVAILABLE" },
      { type: "Diesel Pro", status: "UNAVAILABLE" },
    ],
    waitMin: 35,
    queueCount: 22,
    slots: 1,
    distance: "4.5 km",
    rating: 4.2,
  },
  {
    id: "northgate",
    name: "Northgate Express",
    address: "11 Bypass Road, Kelaniya",
    district: "Gampaha",
    status: "OPEN",
    fuel: [
      { type: "95 Octane", status: "AVAILABLE" },
      { type: "Super 98", status: "LIMITED" },
      { type: "Diesel Pro", status: "AVAILABLE" },
    ],
    waitMin: 7,
    queueCount: 4,
    slots: 6,
    distance: "6.2 km",
    rating: 4.9,
  },
  {
    id: "southpoint",
    name: "Southpoint Fuel Centre",
    address: "33 Marine Drive, Dehiwala",
    district: "Colombo",
    status: "BUSY",
    fuel: [
      { type: "Premium Petrol", status: "LIMITED" },
      { type: "Kerosene", status: "AVAILABLE" },
    ],
    waitMin: 42,
    queueCount: 28,
    slots: 0,
    distance: "7.8 km",
    rating: 3.9,
  },
  {
    id: "ecopark",
    name: "EcoPark Station",
    address: "204 Battaramulla Ring Road",
    district: "Sri Jayawardenepura",
    status: "CLOSED",
    fuel: [
      { type: "95 Octane", status: "UNAVAILABLE" },
      { type: "Diesel Pro", status: "UNAVAILABLE" },
    ],
    waitMin: 0,
    queueCount: 0,
    slots: 0,
    distance: "9.1 km",
    rating: 4.1,
  },
];

const DISTRICTS = ["All Districts", "Colombo", "Gampaha", "Sri Jayawardenepura"];
const FUEL_TYPES = ["All Fuels", "95 Octane", "Super 98", "Premium Petrol", "Diesel Pro", "Ultra Diesel", "Kerosene"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_MAP = {
  OPEN: { label: "Open", color: "#22c55e", bg: "#dcfce7" },
  BUSY: { label: "Busy", color: "#f59e0b", bg: "#fef3c7" },
  CLOSED: { label: "Closed", color: "#ef4444", bg: "#fee2e2" },
};

const FUEL_STATUS_MAP = {
  AVAILABLE: { color: "#15803d", bg: "#dcfce7", label: "Available" },
  LIMITED: { color: "#a16207", bg: "#fef3c7", label: "Limited" },
  UNAVAILABLE: { color: "#9ca3af", bg: "#f1f5f9", label: "N/A" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: 12, color: "#f59e0b", letterSpacing: 1 }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
      <span style={{ color: "#cbd5e1" }}>
        {"★".repeat(5 - Math.ceil(rating))}
      </span>
      <span style={{ color: "#64748b", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

// ─── Station Card ─────────────────────────────────────────────────────────────
function StationCard({ station }: { station: Station }) {
  const st = STATUS_MAP[station.status];
  const isClosed = station.status === "CLOSED";

  // Real-time slots state
  const [liveSlots, setLiveSlots] = useState<TimeSlotResponse[] | null>(null);

  useEffect(() => {
    if (isClosed) return;
    const stationId = parseInt(station.id, 10);
    if (isNaN(stationId)) return; // mock IDs are strings — skip API call for mocks
    const today = new Date().toISOString().split("T")[0];
    timeSlotService
      .getAllSlotsForDate(stationId, today)
      .then((res) => { if (res.success) setLiveSlots(res.data); })
      .catch(() => {/* silently fall back to mock */ });
  }, [station.id, isClosed]);

  // Derived slot stats
  const freeCount = liveSlots?.filter((s) => s.status === "OPEN" && s.availableCapacity > 0).length ?? station.slots;
  const nextSlot = liveSlots?.find((s) => s.status === "OPEN" && s.availableCapacity > 0);

  return (
    <div style={cardStyles.card}>
      {/* Top row */}
      <div style={cardStyles.topRow}>
        <div style={cardStyles.iconWrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 22V8l9-6 9 6v14H3z" />
            <path d="M9 22V12h6v10" />
            <path d="M19 10h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={cardStyles.name}>{station.name}</p>
          <p style={cardStyles.address}>📍 {station.address}</p>
          <StarRating rating={station.rating} />
        </div>
        <span style={{ ...cardStyles.statusBadge, color: st.color, background: st.bg }}>
          {st.label}
        </span>
      </div>

      {/* Metrics */}
      <div style={cardStyles.metrics}>
        <div style={cardStyles.metric}>
          <p style={cardStyles.mLabel}>WAIT TIME</p>
          <p style={cardStyles.mValue}>{isClosed ? "—" : `${station.waitMin} min`}</p>
        </div>
        <div style={cardStyles.metricDivider} />
        <div style={cardStyles.metric}>
          <p style={cardStyles.mLabel}>QUEUE</p>
          <p style={cardStyles.mValue}>{isClosed ? "—" : `${station.queueCount} vehicles`}</p>
        </div>
        <div style={cardStyles.metricDivider} />
        <div style={cardStyles.metric}>
          <p style={cardStyles.mLabel}>FREE SLOTS</p>
          <p style={{ ...cardStyles.mValue, color: freeCount === 0 ? "#ef4444" : freeCount <= 2 ? "#f59e0b" : "#15803d" }}>
            {isClosed ? "—" : freeCount === 0 ? "Full" : freeCount}
          </p>
        </div>
        <div style={cardStyles.metricDivider} />
        <div style={cardStyles.metric}>
          <p style={cardStyles.mLabel}>DISTANCE</p>
          <p style={cardStyles.mValue}>{station.distance}</p>
        </div>
      </div>

      {/* Fuel chips */}
      <div style={cardStyles.fuelRow}>
        {station.fuel.map((f) => {
          const fs = FUEL_STATUS_MAP[f.status];
          return (
            <span key={f.type} style={{ ...cardStyles.fuelChip, color: fs.color, background: fs.bg }}>
              ⛽ {f.type} · {fs.label}
            </span>
          );
        })}
      </div>

      {/* Live Slots section — shown when real API data is available */}
      {!isClosed && liveSlots && liveSlots.length > 0 && (
        <div style={cardStyles.slotsSection}>
          <p style={cardStyles.slotsTitle}>TODAY&apos;S SLOTS</p>
          <div style={cardStyles.slotsMiniGrid}>
            {liveSlots.slice(0, 6).map((s) => {
              const isOpen = s.status === "OPEN" && s.availableCapacity > 0;
              const isBlocked = s.status === "BLOCKED" || s.status === "CLOSED";
              return (
                <span
                  key={s.id}
                  title={`${s.startTime.substring(0, 5)} – ${s.endTime.substring(0, 5)} · ${s.availableCapacity} free`}
                  style={{
                    ...cardStyles.slotChip,
                    background: isBlocked ? "#f3e8ff" : isOpen ? "#dcfce7" : "#fee2e2",
                    color: isBlocked ? "#7c3aed" : isOpen ? "#15803d" : "#b91c1c",
                  }}
                >
                  {s.startTime.substring(0, 5)}
                </span>
              );
            })}
            {liveSlots.length > 6 && (
              <span style={{ ...cardStyles.slotChip, background: "#f1f5f9", color: "#64748b" }}>
                +{liveSlots.length - 6}
              </span>
            )}
          </div>
          {nextSlot && (
            <p style={cardStyles.nextSlot}>
              ⏰ Next free: <strong>{nextSlot.startTime.substring(0, 5)}</strong>
              {" · "}{nextSlot.availableCapacity} spot{nextSlot.availableCapacity !== 1 ? "s" : ""} left
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <div style={cardStyles.footer}>
        <span style={cardStyles.districtTag}>{station.district}</span>
        {isClosed ? (
          <span style={cardStyles.closedNote}>Station currently closed</span>
        ) : (
          <Link
            href="/choose-role"
            style={{
              ...cardStyles.bookBtn,
              ...(freeCount === 0 ? cardStyles.bookBtnDisabled : {}),
            }}
          >
            {freeCount === 0 ? "Join Waitlist" : "Book Now →"}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ViewStation() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [fuel, setFuel] = useState("All Fuels");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "BUSY" | "CLOSED">("ALL");
  const [sortBy, setSortBy] = useState<"distance" | "wait" | "slots">("distance");

  const filtered = useMemo(() => {
    let list = STATIONS.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || s.district.toLowerCase().includes(q);
      const matchDistrict = district === "All Districts" || s.district === district;
      const matchFuel = fuel === "All Fuels" || s.fuel.some((f) => f.type === fuel && f.status !== "UNAVAILABLE");
      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
      return matchSearch && matchDistrict && matchFuel && matchStatus;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "wait") return a.waitMin - b.waitMin;
      if (sortBy === "slots") return b.slots - a.slots;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

    return list;
  }, [search, district, fuel, statusFilter, sortBy]);

  const openCount = STATIONS.filter((s) => s.status !== "CLOSED").length;

  return (
    <div style={pageStyles.page}>

      {/* ── HERO BANNER ── */}
      <section style={pageStyles.hero}>
        {/* Photo background */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
          backgroundImage: "url('/images/station-hero.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
          background: "linear-gradient(to bottom, rgba(10,20,50,0.6) 0%, rgba(10,20,50,0.45) 50%, rgba(10,20,50,0.72) 100%)",
        }} />

        <div style={pageStyles.heroContent}>
          {/* Live badge */}
          <div style={pageStyles.liveBadge}>
            <span style={pageStyles.liveDot} />
            <span style={pageStyles.liveText}>{openCount} STATIONS LIVE NOW</span>
          </div>

          <h1 style={pageStyles.heroTitle}>
            Find Your Nearest<br />
            <span style={{ color: "#60a5fa" }}>Fuel Station</span>
          </h1>
          <p style={pageStyles.heroSub}>
            Real-time availability, wait times, and instant booking — all in one place.
          </p>

          {/* Quick stats */}
          <div style={pageStyles.statRow}>
            {[
              { label: "Stations", value: `${STATIONS.length}` },
              { label: "Avg Wait", value: "14 min" },
              { label: "Districts", value: "12" },
            ].map((s) => (
              <div key={s.label} style={pageStyles.statItem}>
                <p style={pageStyles.statValue}>{s.value}</p>
                <p style={pageStyles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section style={pageStyles.filterBar}>
        <div style={pageStyles.filterInner}>
          {/* Search */}
          <div style={pageStyles.searchWrap}>
            <svg style={pageStyles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search stations, areas…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={pageStyles.searchInput}
            />
          </div>

          {/* District */}
          <select value={district} onChange={(e) => setDistrict(e.target.value)} style={pageStyles.select}>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>

          {/* Fuel */}
          <select value={fuel} onChange={(e) => setFuel(e.target.value)} style={pageStyles.select}>
            {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} style={pageStyles.select}>
            <option value="distance">Nearest first</option>
            <option value="wait">Shortest wait</option>
            <option value="slots">Most slots</option>
          </select>
        </div>

        {/* Status filter pills */}
        <div style={pageStyles.pillRow}>
          {(["ALL", "OPEN", "BUSY", "CLOSED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                ...pageStyles.pill,
                ...(statusFilter === s ? pageStyles.pillActive : {}),
              }}
            >
              {s === "ALL" ? "All Stations" : STATUS_MAP[s].label}
            </button>
          ))}
          <span style={pageStyles.resultCount}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </section>

      {/* ── STATION GRID ── */}
      <section style={pageStyles.grid}>
        <div style={pageStyles.gridInner}>
          {filtered.length === 0 ? (
            <div style={pageStyles.empty}>
              <span style={{ fontSize: 40 }}>🔍</span>
              <p style={pageStyles.emptyText}>No stations match your filters.</p>
              <button onClick={() => { setSearch(""); setDistrict("All Districts"); setFuel("All Fuels"); setStatusFilter("ALL"); }} style={pageStyles.clearBtn}>
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map((station) => <StationCard key={station.id} station={station} />)
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={pageStyles.ctaBanner}>
        <div style={pageStyles.ctaInner}>
          <div>
            <h2 style={pageStyles.ctaTitle}>Ready to skip the queue?</h2>
            <p style={pageStyles.ctaSub}>Create a free account and start booking your fuel slots in seconds.</p>
          </div>
          <Link href="/choose-role" style={pageStyles.ctaBtn}>
            Get Started Free →
          </Link>
        </div>
      </section>

    </div>
  );
}

// ─── Card Styles ──────────────────────────────────────────────────────────────
const cardStyles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1.5px solid #e2e8f0",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "default",
  },
  topRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  iconWrap: {
    width: 46, height: 46, borderRadius: 12,
    background: "#eff6ff", border: "1px solid #dbeafe",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  name: { fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 3px", lineHeight: 1.3 },
  address: { fontSize: 11, color: "#64748b", margin: "0 0 4px" },
  statusBadge: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
    padding: "4px 10px", borderRadius: 20, flexShrink: 0,
  },
  metrics: {
    display: "flex", background: "#f8fafc",
    borderRadius: 10, overflow: "hidden", border: "1px solid #f1f5f9",
  },
  metric: { flex: 1, padding: "10px 8px", textAlign: "center" as const },
  metricDivider: { width: 1, background: "#e2e8f0", flexShrink: 0 },
  mLabel: { fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", margin: "0 0 3px" },
  mValue: { fontSize: 13, fontWeight: 800, color: "#0f172a", margin: 0 },
  fuelRow: { display: "flex", flexWrap: "wrap" as const, gap: 6 },
  fuelChip: {
    fontSize: 10, fontWeight: 600, padding: "4px 10px",
    borderRadius: 20, letterSpacing: "0.02em",
  },
  // Live slots section
  slotsSection: {
    background: "#f8fafc", borderRadius: 10, padding: "10px 12px",
    border: "1px solid #f1f5f9",
  },
  slotsTitle: {
    fontSize: 9, fontWeight: 800, color: "#94a3b8",
    letterSpacing: "0.12em", margin: "0 0 8px",
  },
  slotsMiniGrid: { display: "flex", flexWrap: "wrap" as const, gap: 5 },
  slotChip: {
    fontSize: 10, fontWeight: 700, padding: "3px 8px",
    borderRadius: 6, letterSpacing: "0.01em",
  },
  nextSlot: {
    fontSize: 11, color: "#64748b", margin: "8px 0 0", lineHeight: 1.4,
  },
  footer: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", paddingTop: 4,
    borderTop: "1px solid #f1f5f9",
  },
  districtTag: {
    fontSize: 10, fontWeight: 700, color: "#1d4ed8",
    background: "#dbeafe", padding: "3px 10px", borderRadius: 20,
    letterSpacing: "0.05em",
  },
  bookBtn: {
    background: "#1a56db", color: "#fff",
    padding: "8px 18px", borderRadius: 8,
    fontSize: 13, fontWeight: 700, textDecoration: "none",
    transition: "background 0.15s",
  },
  bookBtnDisabled: { background: "#64748b" },
  closedNote: { fontSize: 12, color: "#94a3b8", fontStyle: "italic" },
};

// ─── Page Styles ──────────────────────────────────────────────────────────────
const pageStyles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },

  // Hero
  hero: {
    position: "relative",
    minHeight: 340,
    display: "flex",
    alignItems: "flex-end",
    paddingBottom: 48,
    overflow: "hidden",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 28px",
    width: "100%",
  },
  liveBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 999, padding: "6px 14px", marginBottom: 16,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.9)",
    display: "inline-block",
  },
  liveText: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.12em" },
  heroTitle: {
    fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900,
    color: "#fff", margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-1.5px",
  },
  heroSub: { fontSize: 15, color: "rgba(255,255,255,0.75)", margin: "0 0 28px", maxWidth: 480 },
  statRow: { display: "flex", gap: 32 },
  statItem: { textAlign: "center" as const },
  statValue: { fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1 },
  statLabel: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "4px 0 0", letterSpacing: "0.08em" },

  // Filter bar
  filterBar: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky" as const,
    top: 64,
    zIndex: 50,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  filterInner: {
    maxWidth: 1200, margin: "0 auto", padding: "14px 28px",
    display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const,
  },
  searchWrap: { position: "relative" as const, flex: "1 1 220px", minWidth: 160 },
  searchIcon: { position: "absolute" as const, left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" as const },
  searchInput: {
    width: "100%", padding: "9px 12px 9px 36px",
    border: "1.5px solid #e2e8f0", borderRadius: 8,
    fontSize: 13, color: "#0f172a", background: "#f8fafc",
    outline: "none", boxSizing: "border-box" as const,
  },
  select: {
    padding: "9px 14px", border: "1.5px solid #e2e8f0",
    borderRadius: 8, fontSize: 13, color: "#0f172a",
    background: "#f8fafc", cursor: "pointer", outline: "none",
    flex: "0 1 auto",
  },
  pillRow: {
    maxWidth: 1200, margin: "0 auto", padding: "8px 28px 10px",
    display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const,
  },
  pill: {
    padding: "5px 14px", border: "1.5px solid #e2e8f0",
    borderRadius: 20, background: "#f8fafc",
    fontSize: 12, fontWeight: 600, color: "#64748b",
    cursor: "pointer", transition: "all 0.15s",
  },
  pillActive: {
    background: "#eff6ff", borderColor: "#2563eb", color: "#1d4ed8",
  },
  resultCount: {
    marginLeft: "auto", fontSize: 12, fontWeight: 600,
    color: "#94a3b8", whiteSpace: "nowrap" as const,
  },

  // Grid
  grid: { padding: "28px 0 48px" },
  gridInner: {
    maxWidth: 1200, margin: "0 auto", padding: "0 28px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 20,
  },
  empty: {
    gridColumn: "1 / -1", textAlign: "center" as const,
    padding: "64px 24px", display: "flex",
    flexDirection: "column" as const, alignItems: "center" as const, gap: 12,
  },
  emptyText: { fontSize: 15, color: "#64748b", fontWeight: 500 },
  clearBtn: {
    padding: "10px 24px", background: "#2563eb", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 13,
    fontWeight: 700, cursor: "pointer",
  },

  // CTA banner
  ctaBanner: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)",
    padding: "40px 28px",
  },
  ctaInner: {
    maxWidth: 1200, margin: "0 auto",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const,
  },
  ctaTitle: { fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.5px" },
  ctaSub: { fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 },
  ctaBtn: {
    background: "#fff", color: "#1a56db",
    padding: "13px 28px", borderRadius: 10,
    fontSize: 14, fontWeight: 800, textDecoration: "none",
    flexShrink: 0, whiteSpace: "nowrap" as const,
    transition: "transform 0.15s",
  },
};