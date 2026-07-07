"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  "/images/LandingStation.png",
  "/images/LandingStation1.png",
  "/images/LandingStation2.png",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
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



      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "linear-gradient(to bottom, rgba(10,20,50,0.55) 0%, rgba(10,20,50,0.3) 50%, rgba(10,20,50,0.65) 100%)",
        }}
      />

      {/* Content Container with Grid Layout */}
      <div
        className="hero-grid"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
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
              href="/choose-role"
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
              href="/viewStation"
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

        {/* Right side: LandingStation Photo (Fixed size container to prevent left side shifts, with absolute crossfade transition) */}
        <div
          className="hero-image-wrap"
          style={{
            width: "100%",
            maxWidth: "880px",
            height: "440px",
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 24px 50px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="MyTurn Landing Station"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: index === i ? 1 : 0,
                transition: "opacity 1.5s ease-in-out",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
