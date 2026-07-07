"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Contact Us</span>
          <h1 className={styles.title}>
            We&apos;d love to <em>hear from you</em>
          </h1>
          <p className={styles.subtitle}>
            Have a question, feedback, or need support? Reach out and our team
            will get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className={styles.section}>
        <div className={styles.layout}>

          {/* Left: contact info */}
          <div className={styles.infoCol}>
            <h2 className={styles.infoTitle}>Get in touch</h2>
            <p className={styles.infoText}>
              Whether you&apos;re a citizen needing help with your queue or a
              station admin with a technical question — we&apos;re here.
            </p>

            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <div>
                  <p className={styles.contactLabel}>Email</p>
                  <p className={styles.contactValue}>support@myturn.lk</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <div>
                  <p className={styles.contactLabel}>Phone</p>
                  <p className={styles.contactValue}>+94 11 234 5678</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🕐</span>
                <div>
                  <p className={styles.contactLabel}>Support Hours</p>
                  <p className={styles.contactValue}>Mon – Fri, 8 AM – 6 PM</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <div>
                  <p className={styles.contactLabel}>Office</p>
                  <p className={styles.contactValue}>Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.successBox}>
                <span className={styles.successIcon}>✅</span>
                <h3 className={styles.successTitle}>Message sent!</h3>
                <p className={styles.successText}>
                  Thanks for reaching out, {form.name}. We&apos;ll be in touch
                  at <strong>{form.email}</strong> shortly.
                </p>
                <button
                  className={styles.resetBtn}
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className={styles.form}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">Full Name <span className={styles.required}>*</span></label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={styles.input}
                      placeholder="John Silva"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Email <span className={styles.required}>*</span></label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={styles.input}
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className={styles.select}
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic…</option>
                    <option value="queue-help">Queue Help</option>
                    <option value="account">Account Issue</option>
                    <option value="station-admin">Station Admin Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="message">Message <span className={styles.required}>*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    className={styles.textarea}
                    placeholder="Tell us how we can help…"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.message}
                >
                  Send Message →
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}