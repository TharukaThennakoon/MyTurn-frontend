"use client";

const steps = [
  {
    num: "1",
    title: "Register",
    desc: "Create your premium account in seconds using just your phone number.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="8" r="4" />
        <path d="M2 20c0-4 3.6-7 8-7" />
        <path d="M19 8v6M22 11h-6" stroke="#1a56db" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Book Slot",
    desc: "Select your preferred station and time window that fits your schedule.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Receive Token",
    desc: "Get a secure digital token and live updates on your position in queue.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    num: "4",
    title: "Get Service",
    desc: "Drive straight to the pump. No lines, no stress, just pure efficiency.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19V8a2 2 0 012-2h8l4 4v9" />
        <path d="M3 19h12" />
        <path d="M15 7h3a2 2 0 012 2v4" />
        <circle cx="19" cy="17" r="2" />
        <path d="M17 8h2v3h-2z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "80px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Heading */}
        <h2
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.5px",
            margin: "0 0 8px",
          }}
        >
          How it Works
        </h2>
        <div
          style={{
            width: 40,
            height: 4,
            background: "#1a56db",
            borderRadius: 2,
            marginBottom: 48,
          }}
        />

        {/* Cards */}
        <div
          className="grid-4col"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "28px 24px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)";
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = "0 1px 8px rgba(0,0,0,0.04)";
                el.style.transform = "none";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 8px",
                }}
              >
                {step.num}. {step.title}
              </h3>

              {/* Description */}
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
