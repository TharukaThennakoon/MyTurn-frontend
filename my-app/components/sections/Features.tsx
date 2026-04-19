"use client";

const features = [
  {
    title: "Real-time Pulse",
    desc: "Live station status and predictive wait times powered by AI.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Fraud Protection",
    desc: "Secure encrypted tokens prevent slot jumping and unauthorized access.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Predictive Analytics",
    desc: "Historical data helps you find the best times to visit your favorites.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

// Phone mockup built entirely with SVG — no image required
function PhoneMockup() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 280 }}>
        {/* Glow behind phone */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,86,219,0.25)",
            borderRadius: "50%",
            filter: "blur(60px)",
            transform: "scale(0.85) translateY(40px)",
          }}
        />

        {/* Phone shell */}
        <div
          style={{
            position: "relative",
            background: "#111827",
            borderRadius: 40,
            padding: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 18,
              background: "#111827",
              borderRadius: 10,
              zIndex: 10,
            }}
          />

          {/* Screen */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: 28,
              overflow: "hidden",
              aspectRatio: "9 / 19",
            }}
          >
            {/* App top bar */}
            <div
              style={{
                background: "#fff",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{ width: 28, height: 28, borderRadius: 6, background: "#1a56db" }}
              />
              <div>
                <div
                  style={{ height: 8, width: 80, background: "#e2e8f0", borderRadius: 4 }}
                />
                <div
                  style={{
                    height: 6,
                    width: 56,
                    background: "#f1f5f9",
                    borderRadius: 3,
                    marginTop: 5,
                  }}
                />
              </div>
            </div>

            {/* Map SVG */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 256 460"
              style={{ display: "block" }}
            >
              {/* Map background */}
              <rect width="256" height="460" fill="#e8edf2" />

              {/* Horizontal roads */}
              <rect x="0" y="80"  width="256" height="18" fill="#d1d9e0" />
              <rect x="0" y="190" width="256" height="18" fill="#d1d9e0" />
              <rect x="0" y="300" width="256" height="18" fill="#d1d9e0" />

              {/* Vertical roads */}
              <rect x="50"  y="0" width="18" height="460" fill="#d1d9e0" />
              <rect x="150" y="0" width="18" height="460" fill="#d1d9e0" />
              <rect x="210" y="0" width="18" height="460" fill="#d1d9e0" />

              {/* Route line */}
              <path
                d="M128 420 L128 300 L159 300 L159 80 L128 80 L128 22"
                stroke="#22c55e"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Destination pin */}
              <circle cx="128" cy="22" r="10" fill="#1a56db" />
              <circle cx="128" cy="22" r="5"  fill="#fff" />

              {/* Current location dot */}
              <circle cx="128" cy="416" r="12" fill="#1a56db" opacity="0.2" />
              <circle cx="128" cy="416" r="7"  fill="#1a56db" />

              {/* Bottom card */}
              <rect x="0" y="380" width="256" height="80" fill="#fff" />
              <rect x="12" y="390" width="90" height="8" fill="#e2e8f0" rx="4" />
              <rect x="12" y="405" width="60" height="6" fill="#f1f5f9" rx="3" />
              <rect x="12" y="420" width="232" height="30" fill="#1a56db" rx="8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      style={{ background: "#0d1b3e", padding: "80px 24px" }}
    >
      <div
        className="features-layout"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left — text */}
        <div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-1px",
              lineHeight: 1.1,
              margin: "0 0 40px",
            }}
          >
            Modern Queueing for
            <br />
            Modern Living.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {features.map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* Icon circle */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(26,86,219,0.18)",
                    border: "1px solid rgba(26,86,219,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {f.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 5px" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — phone */}
        <PhoneMockup />
      </div>
    </section>
  );
}
