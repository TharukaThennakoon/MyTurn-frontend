"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./layout.module.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={styles.wrapper}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMy}>My</span>Turn
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav}>
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${styles.navLink} ${pathname === "/about" ? styles.active : ""}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`${styles.navLink} ${pathname === "/contact" ? styles.active : ""}`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className={styles.actions}>
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>
            <Link href="/choose-role" className={styles.getStartedBtn}>
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className={styles.mobileMenu}>
            <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Contact</Link>
            <hr className={styles.mobileDivider} />
            <Link href="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="/choose-role" className={`${styles.mobileLink} ${styles.mobileGetStarted}`} onClick={() => setMenuOpen(false)}>Get Started</Link>
          </nav>
        )}
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className={styles.main}>{children}</main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          {/* Left: logo + copyright */}
          <div className={styles.footerLeft}>
            <Link href="/" className={styles.footerLogo}>
              <span className={styles.logoMy}>My</span>Turn
            </Link>
            <p className={styles.footerCopy}>
              © {new Date().getFullYear()} MyTurn Digital Queueing. Part of the
              FuelPass Velocity Framework.
            </p>
          </div>

          {/* Center: links */}
          <nav className={styles.footerNav}>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
            <Link href="/station-partners" className={styles.footerLink}>Station Partners</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
          </nav>

          {/* Right: theme / time icons (decorative, matching image) */}
          <div className={styles.footerIcons}>
            <button className={styles.iconBtn} aria-label="Time">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Light mode">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}