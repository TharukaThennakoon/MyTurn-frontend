"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const PROVINCES = [
  "Western", "Central", "Southern", "Northern", "Eastern",
  "North Western", "North Central", "Uva", "Sabaragamuwa",
];

const ROLES = ["Station Manager", "Fuel Attendant Supervisor", "Operations Officer", "IT Administrator"];

type FormData = {
  fullName: string;
  email: string;
  mobile: string;
  nic: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  stationRegId: string;
  stationType: string;
  stationName: string;
  role: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

const initial: FormData = {
  fullName: "", email: "", mobile: "", nic: "",
  addressLine1: "", addressLine2: "", city: "", province: "", postalCode: "",
  stationRegId: "", stationType: "", stationName: "",
  role: "", password: "", confirmPassword: "", agreeTerms: false,
};

export default function AdminRegisterPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1); // 1 = Personal, 2 = Station, 3 = Security

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const validate = (currentStep: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (currentStep === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required.";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email.";
      if (!form.mobile.match(/^0\d{9}$/)) e.mobile = "Enter a valid Sri Lankan mobile number.";
      if (!form.nic.match(/^(\d{9}[VvXx]|\d{12})$/)) e.nic = "Enter a valid NIC (9+V/X or 12 digits).";
      if (!form.addressLine1.trim()) e.addressLine1 = "Address is required.";
      if (!form.city.trim()) e.city = "City is required.";
      if (!form.province) e.province = "Province is required.";
    }

    if (currentStep === 2) {
      if (!form.stationRegId.trim()) e.stationRegId = "Station Registration ID is required.";
      if (!form.stationName.trim()) e.stationName = "Station name is required.";
      if (!form.stationType) e.stationType = "Station type is required.";
      if (!form.role) e.role = "Role is required.";
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
  const handleSubmit = () => { if (validate(3)) setSubmitted(true); };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successBox}>
            <span className={styles.successIcon}>🎉</span>
            <h2 className={styles.successTitle}>Registration Submitted</h2>
            <p className={styles.successText}>
              Your admin account for <strong>{form.stationName}</strong> has been submitted for review.
              We&apos;ll verify your Station Registration ID and notify you at <strong>{form.email}</strong>.
            </p>
            <Link href="/choose-role" className={styles.successBtn}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Admin Registration</span>
          <h1 className={styles.title}>Create your <em>Admin Account</em></h1>
          <p className={styles.subtitle}>
            Register as a Station Admin to manage queues, monitor analytics, and keep your station running smoothly.
          </p>
        </div>
      </section>

      {/* Form card */}
      <section className={styles.section}>
        <div className={styles.card}>

          {/* Step indicator */}
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

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    type="email" placeholder="kamal@station.lk" value={form.email}
                    onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Mobile Number <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.mobile ? styles.inputError : ""}`}
                    type="tel" placeholder="07XXXXXXXX" value={form.mobile}
                    onChange={(e) => set("mobile", e.target.value)} />
                  {errors.mobile && <p className={styles.error}>{errors.mobile}</p>}
                </div>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>NIC Number <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.nic ? styles.inputError : ""}`}
                  placeholder="e.g. 199012345678 or 901234567V" value={form.nic}
                  onChange={(e) => set("nic", e.target.value)} />
                {errors.nic && <p className={styles.error}>{errors.nic}</p>}
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Address Line 1 <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.addressLine1 ? styles.inputError : ""}`}
                  placeholder="No. 45, Main Street" value={form.addressLine1}
                  onChange={(e) => set("addressLine1", e.target.value)} />
                {errors.addressLine1 && <p className={styles.error}>{errors.addressLine1}</p>}
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Address Line 2 <span className={styles.optional}>(Optional)</span></label>
                <input className={styles.input}
                  placeholder="Apartment, suite, etc." value={form.addressLine2}
                  onChange={(e) => set("addressLine2", e.target.value)} />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>City <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
                    placeholder="e.g. Colombo" value={form.city}
                    onChange={(e) => set("city", e.target.value)} />
                  {errors.city && <p className={styles.error}>{errors.city}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Province <span className={styles.req}>*</span></label>
                  <select className={`${styles.select} ${errors.province ? styles.inputError : ""}`}
                    value={form.province} onChange={(e) => set("province", e.target.value)}>
                    <option value="">Select province…</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className={styles.error}>{errors.province}</p>}
                </div>
              </div>

              <div className={styles.fieldHalf}>
                <label className={styles.label}>Postal Code <span className={styles.optional}>(Optional)</span></label>
                <input className={styles.input}
                  placeholder="e.g. 10100" value={form.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Station Info ── */}
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

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Station Registration ID <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.stationRegId ? styles.inputError : ""}`}
                    placeholder="e.g. STA-2024-00123" value={form.stationRegId}
                    onChange={(e) => set("stationRegId", e.target.value)} />
                  {errors.stationRegId && <p className={styles.error}>{errors.stationRegId}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Station Type <span className={styles.req}>*</span></label>
                  <select className={`${styles.select} ${errors.stationType ? styles.inputError : ""}`}
                    value={form.stationType} onChange={(e) => set("stationType", e.target.value)}>
                    <option value="">Select type…</option>
                    <option value="ceypetco">Ceypetco</option>
                    <option value="ioc">IOC</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.stationType && <p className={styles.error}>{errors.stationType}</p>}
                </div>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Your Role at Station <span className={styles.req}>*</span></label>
                <select className={`${styles.select} ${errors.role ? styles.inputError : ""}`}
                  value={form.role} onChange={(e) => set("role", e.target.value)}>
                  <option value="">Select your role…</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.role && <p className={styles.error}>{errors.role}</p>}
              </div>

              <div className={styles.infoNote}>
                <span className={styles.infoNoteIcon}>ℹ️</span>
                <p>Your Station Registration ID will be verified against the FuelPass registry before your account is activated.</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Security ── */}
          {step === 3 && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionHeading}>Set Your Password</h2>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Password <span className={styles.req}>*</span></label>
                <div className={styles.passwordWrap}>
                  <input
                    className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters" value={form.password}
                    onChange={(e) => set("password", e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <p className={styles.error}>{errors.password}</p>}
                {form.password && (
                  <div className={styles.strengthBar}>
                    <div className={`${styles.strengthFill} ${
                      form.password.length >= 12 && /[A-Z]/.test(form.password) && /\d/.test(form.password) && /[^A-Za-z0-9]/.test(form.password)
                        ? styles.strengthStrong
                        : form.password.length >= 8
                        ? styles.strengthMed
                        : styles.strengthWeak
                    }`} />
                    <span className={styles.strengthLabel}>
                      {form.password.length >= 12 && /[A-Z]/.test(form.password) && /\d/.test(form.password) && /[^A-Za-z0-9]/.test(form.password)
                        ? "Strong" : form.password.length >= 8 ? "Medium" : "Weak"}
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
                    {showConfirm ? "🙈" : "👁️"}
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

          {/* Navigation buttons */}
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
                <button className={styles.submitBtn} onClick={handleSubmit}>Create Admin Account</button>
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