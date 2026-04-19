"use client";

export default function SocialProof() {
  const avatarColors = ["#6366f1", "#f59e0b", "#10b981"];

  return (
    <section style={{ padding: "40px 24px", background: "#f8fafc" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
          border: "1px solid #f1f5f9",
          padding: "28px 40px",
        }}
      >
        <div
          className="social-proof-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          {/* Stat */}
          <div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-1.5px",
                lineHeight: 1,
              }}
            >
              10,000+
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginTop: 5 }}>
              Happy Commuters
            </div>
          </div>

          {/* Vertical divider */}
          <div
            className="social-divider"
            style={{ width: 1, height: 52, background: "#e2e8f0", flexShrink: 0 }}
          />

          {/* Avatars */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {avatarColors.map((color, i) => (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: color,
                  border: "2.5px solid #fff",
                  marginLeft: i > 0 ? -12 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3 - i,
                  position: "relative",
                }}
              >
                {/* Generic person silhouette */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
            ))}
            {/* +9 badge */}
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#1a56db",
                border: "2.5px solid #fff",
                marginLeft: -12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 0,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>+9</span>
            </div>
          </div>

          {/* Vertical divider */}
          <div
            className="social-divider"
            style={{ width: 1, height: 52, background: "#e2e8f0", flexShrink: 0 }}
          />

          {/* Testimonial quote */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.65,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              &ldquo;The only way I fill up now. MyTurn saved me over 15 hours of waiting
              last month.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
