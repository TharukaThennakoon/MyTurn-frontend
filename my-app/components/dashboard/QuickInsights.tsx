"use client";

import React from "react";

interface InsightItem {
  icon: string;
  label: string;
  value: string;
}

interface QuickInsightsProps {
  insights: InsightItem[];
}

export default function QuickInsights({ insights }: QuickInsightsProps) {
  return (
    <section style={styles.wrapper}>
      <p style={styles.sectionLabel}>QUICK INSIGHTS</p>
      <div style={styles.grid}>
        {insights.map((item, i) => (
          <div key={i} style={styles.card}>
            <span style={styles.icon}>{item.icon}</span>
            <p style={styles.label}>{item.label}</p>
            <p style={styles.value}>{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    border: "1.5px dashed #2563eb",
    borderRadius: 14,
    padding: "14px 18px 18px",
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: "#475569",
    marginBottom: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  card: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "20px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    textAlign: "center",
    transition: "box-shadow 0.18s, transform 0.18s",
  },
  icon: {
    fontSize: 28,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
};
