"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["How it Works", "Stations", "Support"];

  return (
    <nav
      style={{
        position: "fixed",
        top: scrolled ? 16 : 12,
        left: 0,
        right: 0,
        width: scrolled ? "min(680px, calc(100% - 32px))" : "calc(100% - 32px)",
        maxWidth: 1200,
        margin: "0 auto",
        zIndex: 50,
        height: 64,
        background: scrolled ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(14px) saturate(180%)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        borderRadius: scrolled ? 999 : 16,
        boxShadow: scrolled ? "0 10px 30px rgba(0, 0, 0, 0.08)" : "0 4px 20px rgba(0, 0, 0, 0.03)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/images/logo.svg" alt="MyTurn Logo" style={{ height: "32px", width: "auto" }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: "#1a56db", letterSpacing: "-0.5px" }}>My</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: "-0.5px" }}>Turn</span>
        </Link>

        {/* Desktop nav links */}
        <div className="desktop-only" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              style={{ fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="desktop-only" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link
            href="/login"
            style={{ fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none" }}
          >
            Login
          </Link>
          <Link
            href="/get-started"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              background: "#1a56db",
              borderRadius: 10,
              padding: "10px 20px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1341b0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a56db")}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="4" x2="4" y2="18" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="11" x2="19" y2="11" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="16" x2="19" y2="16" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #f1f5f9",
            padding: "12px 24px 20px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "10px 0",
                fontSize: 14,
                fontWeight: 500,
                color: "#475569",
                textDecoration: "none",
              }}
            >
              {link}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12, marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none" }}>
              Login
            </Link>
            <Link
              href="/get-started"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                background: "#1a56db",
                borderRadius: 10,
                padding: "12px 20px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
