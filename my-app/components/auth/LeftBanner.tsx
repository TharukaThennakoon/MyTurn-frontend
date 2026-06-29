export default function LeftBanner() {
  return (
    <div style={styles.wrapper}>
      {/* Background station image */}
      <div style={styles.bgImage} />
      {/* Blue overlay */}
      <div style={styles.overlay} />
      {/* Decorative circles */}
      <div style={{ ...styles.circle, width: 300, height: 300, right: -80, top: -80, opacity: 0.08 }} />
      <div style={{ ...styles.circle, width: 200, height: 200, right: -40, bottom: 60, opacity: 0.06 }} />

      {/* Content */}
      <div style={styles.content}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="14" height="16" rx="2" stroke="white" strokeWidth="1.8"/>
              <path d="M16 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2" stroke="white" strokeWidth="1.8"/>
              <path d="M7 8h4M7 12h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={styles.brandName}>MyTurn</span>
        </div>

        {/* Headline */}
        <div style={styles.headlineBlock}>
          <h1 style={styles.headline}>
            Fuel Access, Without the Wait.
          </h1>
          <p style={styles.description}>
            Join the FuelPass Velocity framework and skip the chaos.
            Digital queueing designed for the modern driver.
          </p>
        </div>

        {/* Features */}
        <div style={styles.features}>
          <div style={styles.featureRow}>
            <div style={styles.featureIcon}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.8"/>
                <path d="M10 6v4l2.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={styles.featureText}>Real-time status updates at your fingertips</span>
          </div>
          <div style={styles.featureRow}>
            <div style={styles.featureIcon}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <path d="M10 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L10 14.3l-4.8 2.3.9-5.3L2.3 7.6l5.3-.8z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.featureText}>Priority booking for verified premium members</span>
          </div>
        </div>

        {/* Speedometer */}
        <div style={styles.speedometer}>
          <svg viewBox="0 0 140 90" fill="none" style={{ width: "100%", height: "100%" }}>
            <path d="M15 80 A55 55 0 0 1 125 80" stroke="rgba(255,255,255,0.2)" strokeWidth="10" strokeLinecap="round"/>
            <path d="M15 80 A55 55 0 0 1 85 28" stroke="rgba(255,255,255,0.5)" strokeWidth="10" strokeLinecap="round"/>
            <circle cx="70" cy="80" r="6" fill="rgba(255,255,255,0.7)"/>
            <line x1="70" y1="80" x2="85" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    background: "#1151d1",
  },
  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/images/landing.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(160deg, rgba(14, 80, 220, 0.88) 0%, rgba(8, 55, 180, 0.82) 100%)",
    zIndex: 1,
  },
  circle: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(255,255,255,1)",
    zIndex: 2,
  },
  content: {
    position: "relative",
    zIndex: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "40px 36px",
    color: "#fff",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: "auto",
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 20,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.3px",
    fontFamily: '"Inter", sans-serif',
  },
  headlineBlock: {
    marginBottom: 28,
  },
  headline: {
    fontSize: 30,
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
    margin: "0 0 14px",
  },
  description: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.65,
    margin: 0,
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 24,
  },
  featureRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: "10px 14px",
  },
  featureIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    fontSize: 12.5,
    color: "rgba(255,255,255,0.88)",
  },
  speedometer: {
    height: 72,
    marginTop: "auto",
    opacity: 0.7,
  },
};