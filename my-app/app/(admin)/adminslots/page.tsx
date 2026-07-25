"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import timeSlotService, {
  TimeSlotResponse,
  FuelType,
  SlotStatus,
  CreateTimeSlotRequest,
  UpdateTimeSlotRequest,
} from "@/services/timeSlotService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FUEL_LABELS: Record<FuelType, string> = {
  PETROL92: "Petrol 92",
  PETROL95: "Petrol 95",
  DIESEL: "Diesel",
  SUPER_DIESEL: "Super Diesel",
};

const FUEL_COLORS: Record<FuelType, string> = {
  PETROL92: "#3b82f6",
  PETROL95: "#10b981",
  DIESEL: "#f59e0b",
  SUPER_DIESEL: "#8b5cf6",
};

function fmtTime(t: string) {
  // "HH:mm:ss" → "HH:mm"
  return t ? t.substring(0, 5) : "--:--";
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function addDays(base: string, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatDisplayDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SlotFormState {
  slotDate: string;
  startTime: string;
  endTime: string;
  fuelType: FuelType;
  totalCapacity: number;
  status: SlotStatus;
}

const emptyForm = (date: string): SlotFormState => ({
  slotDate: date,
  startTime: "08:00",
  endTime: "08:30",
  fuelType: "PETROL92",
  totalCapacity: 10,
  status: "OPEN",
});

export default function AdminSlots() {
  const [adminData, setAdminData] = useState({
    name: "Admin",
    stationId: null as number | null,
    stationName: "Your Station",
  });

  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [slots, setSlots] = useState<TimeSlotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Modal state
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlotResponse | null>(null);
  const [form, setForm] = useState<SlotFormState>(emptyForm(todayStr()));
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Load admin info ────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        const stId = parsed.stationId || null;
        setAdminData({
          name: parsed.name || parsed.fullName || "Admin",
          stationId: stId,
          stationName: parsed.stationName || "Your Station",
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // ── Fetch slots whenever stationId or date changes ─────────────────────────
  const fetchSlots = useCallback(async (stationId: number, date: string) => {
    setLoading(true);
    try {
      const res = await timeSlotService.getAllSlotsForDate(stationId, date);
      if (res.success && Array.isArray(res.data)) {
        setSlots(res.data);
      } else {
        setSlots([]);
      }
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminData.stationId) {
      fetchSlots(adminData.stationId, selectedDate);
    } else {
      setLoading(false);
    }
  }, [adminData.stationId, selectedDate, fetchSlots]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Generate slots ─────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!adminData.stationId) return;
    setGenerating(true);
    try {
      const res = await timeSlotService.generateSlotsForDate(adminData.stationId, selectedDate);
      if (res.success) {
        showToast(`Generated ${res.data?.length ?? 0} slots for ${formatDisplayDate(selectedDate)}`);
        fetchSlots(adminData.stationId, selectedDate);
      }
    } catch (e: any) {
      showToast(e?.message || "Failed to generate slots", "error");
    } finally {
      setGenerating(false);
    }
  };

  // ── Open Add modal ─────────────────────────────────────────────────────────
  const openAddModal = () => {
    setForm(emptyForm(selectedDate));
    setFormError("");
    setEditingSlot(null);
    setModalMode("add");
  };

  // ── Open Edit modal ────────────────────────────────────────────────────────
  const openEditModal = (slot: TimeSlotResponse) => {
    setForm({
      slotDate: slot.slotDate,
      startTime: fmtTime(slot.startTime),
      endTime: fmtTime(slot.endTime),
      fuelType: slot.fuelType,
      totalCapacity: slot.totalCapacity,
      status: slot.status,
    });
    setFormError("");
    setEditingSlot(slot);
    setModalMode("edit");
  };

  // ── Save (Add or Edit) ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!adminData.stationId) return;
    setFormError("");

    if (!form.startTime || !form.endTime) {
      setFormError("Start and end times are required.");
      return;
    }
    if (form.startTime >= form.endTime) {
      setFormError("End time must be after start time.");
      return;
    }
    if (form.totalCapacity < 1 || form.totalCapacity > 100) {
      setFormError("Capacity must be between 1 and 100.");
      return;
    }

    setSaving(true);
    try {
      if (modalMode === "add") {
        const payload: CreateTimeSlotRequest = {
          slotDate: form.slotDate,
          startTime: form.startTime + ":00",
          endTime: form.endTime + ":00",
          fuelType: form.fuelType,
          totalCapacity: form.totalCapacity,
        };
        const res = await timeSlotService.createSlot(adminData.stationId, payload);
        if (res.success) {
          showToast("Time slot created successfully!");
          setModalMode(null);
          fetchSlots(adminData.stationId, selectedDate);
        }
      } else if (modalMode === "edit" && editingSlot) {
        const payload: UpdateTimeSlotRequest = {
          slotDate: form.slotDate,
          startTime: form.startTime + ":00",
          endTime: form.endTime + ":00",
          fuelType: form.fuelType,
          totalCapacity: form.totalCapacity,
          status: form.status,
        };
        const res = await timeSlotService.updateSlotDetails(editingSlot.id, payload);
        if (res.success) {
          showToast("Time slot updated successfully!");
          setModalMode(null);
          fetchSlots(adminData.stationId, selectedDate);
        }
      }
    } catch (e: any) {
      setFormError(e?.message || "Failed to save slot.");
    } finally {
      setSaving(false);
    }
  };

  // ── Quick toggle block / unblock ───────────────────────────────────────────
  const handleToggleBlock = async (slot: TimeSlotResponse) => {
    const newStatus: SlotStatus = slot.status === "BLOCKED" ? "OPEN" : "BLOCKED";
    // Optimistic UI
    setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, status: newStatus } : s)));
    try {
      await timeSlotService.updateSlotStatus(slot.id, newStatus);
    } catch (e: any) {
      // Revert
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, status: slot.status } : s)));
      showToast(e?.message || "Failed to update slot status", "error");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!adminData.stationId) return;
    try {
      await timeSlotService.deleteSlot(id);
      showToast("Slot deleted.");
      setDeletingId(null);
      fetchSlots(adminData.stationId, selectedDate);
    } catch (e: any) {
      showToast(e?.message || "Cannot delete a slot with active bookings.", "error");
      setDeletingId(null);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const openSlots = slots.filter((s) => s.status === "OPEN" && s.availableCapacity > 0).length;
  const blockedSlots = slots.filter((s) => s.status === "BLOCKED" || s.status === "CLOSED").length;
  const fullSlots = slots.filter((s) => s.status === "FULL" || s.availableCapacity === 0).length;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={styles.container}>
      <AdminSidebar activeNav="Slots" />

      <main className={styles.main}>
        <AdminHeader searchPlaceholder="Search slots..." />

        <div className={styles.content}>

          {/* ── Toast ── */}
          {toast && (
            <div
              className={styles.toast}
              style={{
                backgroundColor: toast.type === "success" ? "#dcfce7" : "#fee2e2",
                color: toast.type === "success" ? "#15803d" : "#b91c1c",
              }}
            >
              {toast.type === "success" ? "✓" : "✕"} {toast.msg}
            </div>
          )}

          {/* ── Page header ── */}
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.pageTitle}>Time Slot Management</h1>
              <p className={styles.pageSubtitle}>
                Manage time slots for <strong>{adminData.stationName}</strong>
              </p>
            </div>

            <div className={styles.headerActions}>
              <button
                className={styles.btnSecondary}
                onClick={handleGenerate}
                disabled={generating || !adminData.stationId}
                title="Auto-generate slots from station hours"
              >
                {generating ? (
                  <span className={styles.spinner} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                )}
                Generate Today&apos;s Slots
              </button>
              <button
                className={styles.btnPrimary}
                onClick={openAddModal}
                disabled={!adminData.stationId}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Slot
              </button>
            </div>
          </div>

          {/* ── Stats Cards ── */}
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statGreen}`}>
              <div className={styles.statValue}>{openSlots}</div>
              <div className={styles.statLabel}>Free Slots</div>
            </div>
            <div className={`${styles.statCard} ${styles.statAmber}`}>
              <div className={styles.statValue}>{fullSlots}</div>
              <div className={styles.statLabel}>Full / Busy</div>
            </div>
            <div className={`${styles.statCard} ${styles.statRed}`}>
              <div className={styles.statValue}>{blockedSlots}</div>
              <div className={styles.statLabel}>Blocked</div>
            </div>
            <div className={`${styles.statCard} ${styles.statBlue}`}>
              <div className={styles.statValue}>{slots.length}</div>
              <div className={styles.statLabel}>Total Slots</div>
            </div>
          </div>

          {/* ── Date Picker Bar ── */}
          <div className={styles.datePicker}>
            <button
              className={styles.dateNavBtn}
              onClick={() => setSelectedDate((d) => addDays(d, -1))}
            >
              ‹
            </button>

            <div className={styles.dateGroup}>
              {[-1, 0, 1, 2, 3].map((offset) => {
                const d = addDays(todayStr(), offset);
                const isSelected = d === selectedDate;
                const isToday = d === todayStr();
                return (
                  <button
                    key={d}
                    className={`${styles.datePill} ${isSelected ? styles.datePillActive : ""}`}
                    onClick={() => setSelectedDate(d)}
                  >
                    <span className={styles.datePillDay}>
                      {isToday ? "Today" : new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className={styles.datePillDate}>
                      {new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              className={styles.dateNavBtn}
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
            >
              ›
            </button>

            <input
              type="date"
              className={styles.dateInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              title="Jump to date"
            />
          </div>

          {/* ── Slot Grid ── */}
          <div className={styles.intervalSection}>
            <div className={styles.intervalHeader}>
              <div>
                <h2 className={styles.intervalTitle}>
                  Slots for {formatDisplayDate(selectedDate)}
                </h2>
                <p className={styles.intervalSubtitle}>
                  Click Edit to change details · Block/Unblock to control availability
                </p>
              </div>
            </div>

            {loading ? (
              <div className={styles.emptyState}>
                <div className={styles.loadingSpinner} />
                <p>Loading slots…</p>
              </div>
            ) : slots.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p>No slots for {formatDisplayDate(selectedDate)}.</p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>
                  Use "Generate Today's Slots" or "Add Slot" to create them.
                </p>
              </div>
            ) : (
              <div className={styles.intervalGrid}>
                {slots.map((slot) => {
                  const isBlocked = slot.status === "BLOCKED" || slot.status === "CLOSED";
                  const isFull = slot.status === "FULL" || slot.availableCapacity === 0;
                  const percent = Math.min(
                    100,
                    Math.round(((slot.totalCapacity - slot.availableCapacity) / Math.max(1, slot.totalCapacity)) * 100)
                  );

                  const cardClass = `${styles.intervalCard} ${
                    isBlocked
                      ? styles.intervalCardBlocked
                      : isFull
                      ? styles.intervalCardFull
                      : percent >= 70
                      ? styles.intervalCardBusy
                      : ""
                  }`;

                  const statusBadge =
                    isBlocked ? (
                      <span className={`${styles.badge} ${styles.badgeBlocked}`}>BLOCKED</span>
                    ) : isFull ? (
                      <span className={`${styles.badge} ${styles.badgeFull}`}>FULL</span>
                    ) : percent >= 70 ? (
                      <span className={`${styles.badge} ${styles.badgeLimited}`}><span className={styles.badgeDot} />BUSY</span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeOptimal}`}><span className={styles.badgeDot} />OPEN</span>
                    );

                  return (
                    <div key={slot.id} className={cardClass}>
                      {/* Top row: time + status */}
                      <div className={styles.intervalCardTop}>
                        <div className={styles.intervalTimeWrap}>
                          <span className={`${styles.intervalTime} ${isBlocked ? styles.intervalTimeBlocked : ""}`}>
                            {fmtTime(slot.startTime)} – {fmtTime(slot.endTime)}
                          </span>
                          {statusBadge}
                        </div>

                        {/* Fuel type chip */}
                        <span
                          className={styles.fuelChip}
                          style={{ backgroundColor: FUEL_COLORS[slot.fuelType] + "22", color: FUEL_COLORS[slot.fuelType] }}
                        >
                          {FUEL_LABELS[slot.fuelType]}
                        </span>
                      </div>

                      {/* Capacity bar */}
                      {!isBlocked && (
                        <>
                          <div className={styles.utilRow}>
                            <span className={styles.utilLabel}>CAPACITY</span>
                            <span className={styles.utilValue}>
                              {slot.totalCapacity - slot.availableCapacity} / {slot.totalCapacity} booked
                            </span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={`${styles.progressFill} ${
                                percent >= 100
                                  ? styles.progressRed
                                  : percent >= 70
                                  ? styles.progressYellow
                                  : styles.progressBlue
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className={styles.freeCount}>
                            {slot.availableCapacity} free slot{slot.availableCapacity !== 1 ? "s" : ""}
                          </div>
                        </>
                      )}

                      {isBlocked && (
                        <div className={styles.blockedMsg}>
                          Interval manually blocked — unavailable for booking.
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className={styles.slotActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditModal(slot)}
                          title="Edit slot details"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className={`${styles.actionBtn} ${isBlocked ? styles.actionBtnUnblock : styles.actionBtnBlock}`}
                          onClick={() => handleToggleBlock(slot)}
                          title={isBlocked ? "Unblock slot" : "Block slot"}
                        >
                          {isBlocked ? (
                            <>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
                              </svg>
                              Unblock
                            </>
                          ) : (
                            <>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              Block
                            </>
                          )}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => setDeletingId(slot.id)}
                          title="Delete slot"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className={styles.legend}>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotGreen}`} />FREE</div>
                <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotYellow}`} />BUSY (&gt;70%)</div>
                <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotRed}`} />BLOCKED / FULL</div>
              </div>
              <div className={styles.syncTime}>
                Live data · {adminData.stationName}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ──────────────────── Add / Edit Modal ──────────────────────────── */}
      {modalMode && (
        <div className={styles.modalOverlay} onClick={() => setModalMode(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === "add" ? "Add New Time Slot" : "Edit Time Slot"}
              </h2>
              <button className={styles.modalClose} onClick={() => setModalMode(null)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              {formError && (
                <div className={styles.formError}>{formError}</div>
              )}

              <div className={styles.formGrid}>
                {/* Date */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={form.slotDate}
                    onChange={(e) => setForm((f) => ({ ...f, slotDate: e.target.value }))}
                    min={todayStr()}
                  />
                </div>

                {/* Fuel Type */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Fuel Type</label>
                  <select
                    className={styles.formInput}
                    value={form.fuelType}
                    onChange={(e) => setForm((f) => ({ ...f, fuelType: e.target.value as FuelType }))}
                  >
                    <option value="PETROL92">Petrol 92</option>
                    <option value="PETROL95">Petrol 95</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="SUPER_DIESEL">Super Diesel</option>
                  </select>
                </div>

                {/* Start Time */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Time</label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={form.startTime}
                    onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  />
                </div>

                {/* End Time */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Time</label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={form.endTime}
                    onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  />
                </div>

                {/* Capacity */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Total Capacity</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.totalCapacity}
                    min={1}
                    max={100}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, totalCapacity: parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>

                {/* Status (edit only) */}
                {modalMode === "edit" && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Status</label>
                    <select
                      className={styles.formInput}
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as SlotStatus }))}
                    >
                      <option value="OPEN">Open</option>
                      <option value="BLOCKED">Blocked</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnGhost} onClick={() => setModalMode(null)}>
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
                {saving ? <span className={styles.spinner} /> : null}
                {modalMode === "add" ? "Create Slot" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────── Delete Confirm Dialog ─────────────────────── */}
      {deletingId !== null && (
        <div className={styles.modalOverlay} onClick={() => setDeletingId(null)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>🗑️</div>
            <h3 className={styles.confirmTitle}>Delete Time Slot?</h3>
            <p className={styles.confirmDesc}>
              This slot will be permanently removed. Slots with active bookings cannot be deleted.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.btnGhost} onClick={() => setDeletingId(null)}>Cancel</button>
              <button
                className={styles.btnDanger}
                onClick={() => handleDelete(deletingId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
