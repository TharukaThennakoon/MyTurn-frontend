"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, PartyPopper, Info, MapPin, Navigation, AlertCircle, Check } from "lucide-react";
import styles from "./page.module.css";
import stationAdminService from "@/services/stationAdminService";

const SL_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle",
];

type FormData = {
  // Step 1 — Personal
  fullName: string;
  email: string;
  nic: string;
  // Step 2 — Station
  stationName: string;
  stationAddress: string;
  stationCity: string;
  stationDistrict: string;
  stationContact: string;
  openingTime: string;
  closingTime: string;
  latitude: number | null;
  longitude: number | null;
  // Step 3 — Security
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

const initial: FormData = {
  fullName: "", email: "", nic: "",
  stationName: "", stationAddress: "", stationCity: "", stationDistrict: "",
  stationContact: "", openingTime: "06:00", closingTime: "20:00",
  latitude: null, longitude: null,
  password: "", confirmPassword: "", agreeTerms: false,
};

declare global {
  interface Window {
    L: any;
    _mapInitialized?: boolean;
  }
}

export default function AdminRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedStationName, setSubmittedStationName] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const set = (field: keyof FormData, value: string | boolean | number | null) =>
    setForm((p) => ({ ...p, [field]: value }));

  // ── Leaflet map setup (Step 2) ───────────────────────────────────
  const initMap = useCallback(() => {
    if (typeof window === "undefined" || !window.L || !mapRef.current) return;
    if (leafletMapRef.current) return; // already initialised

    const map = window.L.map(mapRef.current, {
      center: [7.8731, 80.7718], // Sri Lanka centre
      zoom: 8,
      zoomControl: true,
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Custom marker icon
    const icon = window.L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      const roundedLat = Math.round(lat * 1000000) / 1000000;
      const roundedLng = Math.round(lng * 1000000) / 1000000;

      if (markerRef.current) {
        markerRef.current.setLatLng([roundedLat, roundedLng]);
      } else {
        markerRef.current = window.L.marker([roundedLat, roundedLng], { icon })
          .addTo(map)
          .bindPopup(`📍 Station Location<br/>Lat: ${roundedLat}<br/>Lng: ${roundedLng}`)
          .openPopup();
      }
      markerRef.current.setPopupContent(
        `📍 Station Location<br/>Lat: ${roundedLat}<br/>Lng: ${roundedLng}`
      );
      setForm((p) => ({ ...p, latitude: roundedLat, longitude: roundedLng }));
    });

    leafletMapRef.current = map;

    // If coordinates already set, place marker
    if (form.latitude && form.longitude) {
      markerRef.current = window.L.marker([form.latitude, form.longitude], { icon })
        .addTo(map)
        .bindPopup(`📍 Station Location`)
        .openPopup();
      map.setView([form.latitude, form.longitude], 14);
    }
  }, [form.latitude, form.longitude]);

  // Load Leaflet CSS + JS dynamically
  useEffect(() => {
    if (step !== 2) return;

    // Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Leaflet JS
    if (window.L) {
      setTimeout(initMap, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setTimeout(initMap, 100);
    document.body.appendChild(script);

    return () => {
      // Cleanup map when leaving step 2
    };
  }, [step, initMap]);

  // Re-invalidate map size after mounting (fixes grey tiles)
  useEffect(() => {
    if (step === 2 && leafletMapRef.current) {
      setTimeout(() => {
        leafletMapRef.current?.invalidateSize();
      }, 300);
    }
  }, [step]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setForm((p) => ({ ...p, latitude, longitude }));
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([latitude, longitude], 16);
        const icon = window.L?.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41], iconAnchor: [12, 41],
        });
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        } else if (window.L) {
          markerRef.current = window.L.marker([latitude, longitude], { icon })
            .addTo(leafletMapRef.current)
            .bindPopup("📍 Your Location").openPopup();
        }
      }
    });
  };

  // ── Validation ───────────────────────────────────────────────────
  const validate = (currentStep: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (currentStep === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required.";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email.";
      if (!form.nic.match(/^(\d{9}[VvXx]|\d{12})$/)) e.nic = "Enter a valid NIC (9+V/X or 12 digits).";
    }
    if (currentStep === 2) {
      if (!form.stationName.trim()) e.stationName = "Station name is required.";
      if (!form.stationAddress.trim()) e.stationAddress = "Station address is required.";
      if (!form.stationCity.trim()) e.stationCity = "Station city is required.";
      if (!form.stationDistrict) e.stationDistrict = "District is required.";
      if (!form.stationContact.match(/^0\d{9}$/)) e.stationContact = "Enter a valid contact number.";
      if (!form.openingTime) e.openingTime = "Opening time is required.";
      if (!form.closingTime) e.closingTime = "Closing time is required.";
      if (!form.latitude || !form.longitude) e.latitude = "Please click on the map to set the station location.";
    }
    if (currentStep === 3) {
      if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
      if (!form.agreeTerms) e.agreeTerms = "You must agree to the terms.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!validate(3)) return;
    setLoading(true);
    setApiError("");

    try {
      // Step A: Create the station
      const stationRes = await stationAdminService.createStation({
        stationName: form.stationName,
        address: form.stationAddress,
        city: form.stationCity,
        district: form.stationDistrict,
        contactNumber: form.stationContact,
        latitude: form.latitude!,
        longitude: form.longitude!,
        openingTime: `${form.openingTime}:00`,
        closingTime: `${form.closingTime}:00`,
        maxVehiclesPerSlot: 10,
        avgServiceTimeMinutes: 5,
        slotDurationMinutes: 10,
      });

      if (!stationRes.success || !stationRes.data) {
        throw new Error(stationRes.message || "Failed to create station.");
      }

      const stationId = stationRes.data.id;

      // Step B: Register the admin
      const adminRes = await stationAdminService.adminRegister({
        name: form.fullName,
        email: form.email,
        password: form.password,
        stationId,
      });

      if (!adminRes.success) {
        throw new Error(adminRes.message || "Admin registration failed.");
      }

      setSubmittedStationName(form.stationName);
      setSubmitted(true);
    } catch (err: any) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successBox}>
            <span className={styles.successIcon}><PartyPopper size={48} color="#2563eb" /></span>
            <h2 className={styles.successTitle}>Registration Successful!</h2>
            <p className={styles.successText}>
              Your admin account and station <strong>{submittedStationName}</strong> have been created.
              Please check <strong>{form.email}</strong> for a verification email before logging in.
            </p>
            <Link href="/adminlogin?role=admin" className={styles.successBtn}>
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const strengthLevel =
    form.password.length >= 12 &&
      /[A-Z]/.test(form.password) &&
      /\d/.test(form.password) &&
      /[^A-Za-z0-9]/.test(form.password)
      ? "strong"
      : form.password.length >= 8
        ? "medium"
        : "weak";

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Admin Registration</span>
          <h1 className={styles.title}>
            Create your <em>Admin Account</em>
          </h1>
          <p className={styles.subtitle}>
            Register as a Station Admin to manage queues, monitor analytics, and keep your station running smoothly.
          </p>
        </div>
      </section>

      {/* Form Card */}
      <section className={styles.section}>
        <div className={styles.card}>

          {/* Step Indicator */}
          <div className={styles.stepper}>
            {["Personal Details", "Station Info", "Security"].map((label, i) => (
              <div key={label} className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : ""}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`${styles.stepLabel} ${step === i + 1 ? styles.stepLabelActive : ""}`}>{label}</span>
                {i < 2 && <div className={`${styles.stepLine} ${step > i + 1 ? styles.stepLineDone : ""}`} />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Personal Details ── */}
          {step === 1 && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionHeading}>Personal Details</h2>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                  placeholder="e.g. Kamal Perera" value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)} />
                {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Email Address <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  type="email" placeholder="kamal@station.lk" value={form.email}
                  onChange={(e) => set("email", e.target.value)} />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>NIC Number <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.nic ? styles.inputError : ""}`}
                  placeholder="e.g. 199012345678 or 901234567V" value={form.nic}
                  onChange={(e) => set("nic", e.target.value)} />
                {errors.nic && <p className={styles.error}>{errors.nic}</p>}
              </div>

              <div className={styles.infoNote}>
                <span className={styles.infoNoteIcon}><Info size={16} color="#2563eb" /></span>
                <p>Your station contact number and address will be collected in the next step as part of your station information.</p>
              </div>
            </div>
          )}

          {/* ── STEP 2: Station Info + Map ── */}
          {step === 2 && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionHeading}>Station Information</h2>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Station Name <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.stationName ? styles.inputError : ""}`}
                  placeholder="e.g. Colombo 3 Fuel Station" value={form.stationName}
                  onChange={(e) => set("stationName", e.target.value)} />
                {errors.stationName && <p className={styles.error}>{errors.stationName}</p>}
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Station Address <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.stationAddress ? styles.inputError : ""}`}
                  placeholder="e.g. No. 12, Galle Road, Colombo 03" value={form.stationAddress}
                  onChange={(e) => set("stationAddress", e.target.value)} />
                {errors.stationAddress && <p className={styles.error}>{errors.stationAddress}</p>}
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Station City <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.stationCity ? styles.inputError : ""}`}
                    placeholder="e.g. Colombo" value={form.stationCity}
                    onChange={(e) => set("stationCity", e.target.value)} />
                  {errors.stationCity && <p className={styles.error}>{errors.stationCity}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>District <span className={styles.req}>*</span></label>
                  <select className={`${styles.select} ${errors.stationDistrict ? styles.inputError : ""}`}
                    value={form.stationDistrict} onChange={(e) => set("stationDistrict", e.target.value)}>
                    <option value="">Select district…</option>
                    {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.stationDistrict && <p className={styles.error}>{errors.stationDistrict}</p>}
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Contact Number <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.stationContact ? styles.inputError : ""}`}
                    type="tel" placeholder="07XXXXXXXX" value={form.stationContact}
                    onChange={(e) => set("stationContact", e.target.value)} />
                  {errors.stationContact && <p className={styles.error}>{errors.stationContact}</p>}
                </div>
                <div className={styles.field}></div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Opening Time <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.openingTime ? styles.inputError : ""}`}
                    type="time" value={form.openingTime}
                    onChange={(e) => set("openingTime", e.target.value)} />
                  {errors.openingTime && <p className={styles.error}>{errors.openingTime}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Closing Time <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.closingTime ? styles.inputError : ""}`}
                    type="time" value={form.closingTime}
                    onChange={(e) => set("closingTime", e.target.value)} />
                  {errors.closingTime && <p className={styles.error}>{errors.closingTime}</p>}
                </div>
              </div>

              {/* Map Picker */}
              <div style={{ marginTop: 20 }}>
                <label className={styles.label}>
                  Station Location on Map <span className={styles.req}>*</span>
                  <span className={styles.optional} style={{ marginLeft: 8 }}>— click to place pin</span>
                </label>

                {/* Coordinates display */}
                <div style={{
                  display: "flex", gap: 12, marginBottom: 10, alignItems: "center", flexWrap: "wrap"
                }}>
                  <div style={{
                    background: form.latitude ? "#f0fdf4" : "#f8fafc",
                    border: `1px solid ${form.latitude ? "#86efac" : "#e2e8f0"}`,
                    borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600,
                    color: form.latitude ? "#15803d" : "#64748b", minWidth: 160,
                    display: "flex", alignItems: "center", gap: 6
                  }}>
                    <MapPin size={13} /> Lat: {form.latitude !== null ? form.latitude.toFixed(6) : "—"}
                  </div>
                  <div style={{
                    background: form.longitude ? "#f0fdf4" : "#f8fafc",
                    border: `1px solid ${form.longitude ? "#86efac" : "#e2e8f0"}`,
                    borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600,
                    color: form.longitude ? "#15803d" : "#64748b", minWidth: 160,
                    display: "flex", alignItems: "center", gap: 6
                  }}>
                    <MapPin size={13} /> Lng: {form.longitude !== null ? form.longitude.toFixed(6) : "—"}
                  </div>
                  <button type="button" onClick={useMyLocation}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", background: "#eff6ff", border: "1px solid #bfdbfe",
                      borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#1d4ed8",
                      cursor: "pointer", transition: "background 0.2s"
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#dbeafe"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; }}>
                    <Navigation size={14} /> Use My Location
                  </button>
                </div>

                {/* Leaflet Map Container */}
                <div
                  ref={mapRef}
                  style={{
                    width: "100%", height: 380, borderRadius: 12,
                    border: errors.latitude ? "2px solid #ef4444" : "2px solid #e2e8f0",
                    overflow: "hidden", background: "#f1f5f9",
                    position: "relative", zIndex: 0
                  }}
                />
                {errors.latitude && (
                  <p className={styles.error} style={{ marginTop: 6 }}>{errors.latitude}</p>
                )}
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                  🗺️ Click anywhere on the map to set the station location. The map shows Sri Lanka — zoom in to find your exact location.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Security ── */}
          {step === 3 && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionHeading}>Set Your Password</h2>

              {apiError && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
                  padding: "12px 16px", marginBottom: 16, color: "#991b1b", fontSize: 14,
                  display: "flex", alignItems: "center", gap: 8
                }}>
                  <AlertCircle size={16} color="#ef4444" /> {apiError}
                </div>
              )}

              <div className={styles.fieldFull}>
                <label className={styles.label}>Password <span className={styles.req}>*</span></label>
                <div className={styles.passwordWrap}>
                  <input
                    className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters" value={form.password}
                    onChange={(e) => set("password", e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className={styles.error}>{errors.password}</p>}
                {form.password && (
                  <div className={styles.strengthBar}>
                    <div className={`${styles.strengthFill} ${strengthLevel === "strong" ? styles.strengthStrong
                        : strengthLevel === "medium" ? styles.strengthMed
                          : styles.strengthWeak
                      }`} />
                    <span className={styles.strengthLabel}>
                      {strengthLevel === "strong" ? "Strong" : strengthLevel === "medium" ? "Medium" : "Weak"}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Confirm Password <span className={styles.req}>*</span></label>
                <div className={styles.passwordWrap}>
                  <input
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password" value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm((v) => !v)}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
              </div>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.agreeTerms}
                  onChange={(e) => set("agreeTerms", e.target.checked)} className={styles.checkbox} />
                <span>
                  I agree to the{" "}
                  <Link href="/terms-of-service" className={styles.link}>Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeTerms && <p className={styles.error}>{errors.agreeTerms}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className={styles.formActions}>
            <div>
              {step > 1 && (
                <button className={styles.backBtn} onClick={back}>← Back</button>
              )}
            </div>
            <div className={styles.formActionsRight}>
              <Link href="/choose-role" className={styles.cancelLink}>Cancel</Link>
              {step < 3 ? (
                <button className={styles.nextBtn} onClick={next}>Continue →</button>
              ) : (
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Creating Account…" : "Create Admin Account"}
                </button>
              )}
            </div>
          </div>

          <p className={styles.loginHint}>
            Already have an account?{" "}
            <Link href="/adminlogin?role=admin" className={styles.link}>Sign in here</Link>
          </p>
        </div>
      </section>
    </div>
  );
}