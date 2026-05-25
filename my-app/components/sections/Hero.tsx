"use client";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "flex-end",
        paddingBottom: 72,
        overflow: "hidden",
        background: "#1a2744",
      }}
    >
      {/* Background image — place your photo at /public/images/station-hero.jpg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/station-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,20,50,0.55) 0%, rgba(10,20,50,0.3) 50%, rgba(10,20,50,0.65) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            padding: "6px 14px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#1a56db",
              boxShadow: "0 0 8px rgba(26,86,219,0.9)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Velocity Framework v2.0
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ margin: 0, marginBottom: 16, lineHeight: 1.05 }}>
          <span
            className="hero-title"
            style={{
              display: "block",
              fontSize: "clamp(42px, 7vw, 72px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-2px",
            }}
          >
            Skip the wait.
          </span>
          <span
            className="hero-title"
            style={{
              display: "block",
              fontSize: "clamp(42px, 7vw, 72px)",
              fontWeight: 900,
              color: "#1a56db",
              letterSpacing: "-2px",
            }}
          >
            Get your turn.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            maxWidth: 420,
            fontSize: 16,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7,
            margin: "0 0 36px",
          }}
        >
          Experience the digital concierge for high-demand services. Secure your
          spot in real-time and arrive exactly when it&apos;s your turn.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href="/get-started"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1a56db",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 28px",
              borderRadius: 12,
              textDecoration: "none",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1341b0";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(26,86,219,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a56db";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Get Your Turn
            {/* Arrow icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href="#stations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.28)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 28px",
              borderRadius: 12,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.14)")
            }
          >
            View Stations
          </a>
        </div>
      </div>
    </section>
  );
}
