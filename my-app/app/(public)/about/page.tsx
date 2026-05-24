import Link from "next/link";
import styles from "./page.module.css";

const values = [
  {
    icon: "⏱️",
    title: "Save Time",
    desc: "Join queues digitally and arrive only when it's your turn.",
  },
  {
    icon: "🔒",
    title: "Trust & Fairness",
    desc: "First come, first served — transparent and tamper-proof.",
  },
  {
    icon: "📡",
    title: "Real-Time Updates",
    desc: "Live queue status so you're always in the know.",
  },
  {
    icon: "🤝",
    title: "Built for Everyone",
    desc: "Simple for citizens, powerful for station admins.",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>About MyTurn</span>
          <h1 className={styles.title}>
            Fuel queues, <em>solved</em>
          </h1>
          <p className={styles.subtitle}>
            MyTurn is a digital queueing platform built to eliminate long waits
            at fuel stations. Part of the FuelPass Velocity Framework, we connect
            citizens and station admins through a seamless, real-time queue
            management system.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className={styles.section}>
        <div className={styles.missionLayout}>
          {/* Left: text */}
          <div>
            <p className={styles.sectionLabel}>Our Mission</p>
            <h2 className={styles.sectionTitle}>
              Less waiting,<br />more moving.
            </h2>
            <p className={styles.text}>
              We believe waiting in line for fuel shouldn&apos;t be a daily
              struggle. Our mission is to bring transparency, fairness, and
              efficiency to every fuel station — so you spend less time waiting
              and more time moving.
            </p>
          </div>

          {/* Right: stats accent */}
          <div className={styles.missionAccent}>
            <div className={styles.statRow}>
              <div className={styles.stat}>
                <span className={styles.statNum}>0 min</span>
                <span className={styles.statDesc}>
                  wasted standing in line when you queue digitally
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statDesc}>
                  fair, first-come-first-served ordering — always
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>Live</span>
                <span className={styles.statDesc}>
                  real-time status updates pushed straight to you
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className={styles.divider}>
        <hr className={styles.dividerLine} />
      </div>

      {/* ── VALUES ── */}
      <section className={styles.section}>
        <div className={styles.valuesHeader}>
          <p className={styles.sectionLabel}>What We Stand For</p>
          <h2 className={styles.sectionTitle}>Built on four principles</h2>
        </div>
        <div className={styles.grid}>
          {values.map((v) => (
            <div key={v.title} className={styles.card}>
              <span className={styles.cardIcon}>{v.icon}</span>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardText}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to skip the queue?</h2>
          <p className={styles.ctaText}>
            Join thousands of citizens already saving time with MyTurn.
          </p>
          <Link href="/choose-role" className={styles.ctaBtn}>
            Get Started
          </Link>
        </div>
      </section>

    </div>
  );
}