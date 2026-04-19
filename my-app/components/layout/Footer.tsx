"use client";

export default function Footer() {
  const links = ["Privacy Policy", "Terms of Service", "Station Partners", "Contact"];

  return (
    <footer style={{ background: "#fff", borderTop: "1px solid #f1f5f9", padding: "32px 24px" }}>
      <div
        className="footer-inner"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1a56db" }}>My</span>Turn
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, lineHeight: 1.65 }}>
            © 2024 MyTurn Digital Queueing. Part of the FuelPass
            <br />
            Velocity Framework.
          </p>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: 13,
                color: "#64748b",
                textDecoration: "none",
                padding: "4px 10px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              {l}
            </a>
          ))}
        </nav>

        {/* Icon buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {/* Clock icon */}
          <button
            aria-label="Accessibility"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#94a3b8";
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
              (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </button>

          {/* Settings icon */}
          <button
            aria-label="Settings"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#94a3b8";
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
              (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
