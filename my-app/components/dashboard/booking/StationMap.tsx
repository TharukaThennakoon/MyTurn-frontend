"use client";

import React, { useEffect, useRef, useState } from "react";
import type { StationOption } from "./BookingSelectStation";

// Station coordinates near Colombo, Sri Lanka (matching the OSM link: 6.8452/79.9654)
const STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  central: { lat: 6.8652, lng: 79.9754 },
  metro:   { lat: 6.8252, lng: 79.9554 },
};

// Fallback for unknown stations — scatter them near the center
function getCoords(id: string, index: number) {
  if (STATION_COORDS[id]) return STATION_COORDS[id];
  const offset = (index - 1) * 0.02;
  return { lat: 6.8452 + offset, lng: 79.9654 + offset };
}

interface StationMapProps {
  stations: StationOption[];
  selectedId: string | null;
  onSelect: (station: StationOption) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
    __myturnSelectStation?: (id: string) => void;
  }
}

export default function StationMap({ stations, selectedId, onSelect }: StationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [leafletReady, setLeafletReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // ── Load Leaflet CSS + JS from CDN once ─────────────────────────────────────
  useEffect(() => {
    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // JS
    if (window.L) {
      setLeafletReady(true);
      return;
    }
    if (document.getElementById("leaflet-js")) {
      // Script already added, wait for it
      const existing = document.getElementById("leaflet-js") as HTMLScriptElement;
      existing.addEventListener("load", () => setLeafletReady(true));
      existing.addEventListener("error", () => setLoadError(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletReady(true);
    script.onerror = () => setLoadError(true);
    document.head.appendChild(script);
  }, []);

  // ── Initialise map once Leaflet is ready ────────────────────────────────────
  useEffect(() => {
    if (!leafletReady || !containerRef.current) return;
    const L = window.L;

    // Fix default marker icon paths broken by bundlers
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Destroy existing map instance before re-creating
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: [6.8452, 79.9654],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // OpenStreetMap tile layer (free, no API key needed)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // Only re-create when leafletReady flips
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady]);

  // ── Add / refresh markers whenever stations or selectedId change ─────────────
  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;
    const L = window.L;
    const map = mapRef.current;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stations.forEach((station, idx) => {
      const { lat, lng } = getCoords(station.id, idx);
      const isSelected = station.id === selectedId;
      const isAvailable = station.status === "AVAILABLE";

      // Custom coloured circle-marker pin
      const pinColor = isSelected
        ? "#2563eb"
        : isAvailable
        ? "#15803d"
        : "#a16207";

      const pinHtml = `
        <div style="
          width:${isSelected ? 42 : 36}px;
          height:${isSelected ? 42 : 36}px;
          background:${pinColor};
          border: 3px solid #fff;
          border-radius:50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.2s;
          display:flex; align-items:center; justify-content:center;
        ">
          <span style="transform:rotate(45deg); font-size:14px;">⛽</span>
        </div>
      `;

      const icon = L.divIcon({
        html: pinHtml,
        className: "",
        iconSize: [isSelected ? 42 : 36, isSelected ? 42 : 36],
        iconAnchor: [isSelected ? 21 : 18, isSelected ? 42 : 36],
        popupAnchor: [0, -(isSelected ? 42 : 36)],
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;min-width:160px;padding:4px 0">
            <p style="margin:0 0 4px;font-weight:700;font-size:14px;color:#0f172a">${station.name}</p>
            <p style="margin:0 0 6px;font-size:11px;color:#64748b">${station.address}</p>
            <div style="display:flex;gap:8px;align-items:center">
              <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:4px;
                background:${isAvailable ? "#dcfce7" : "#fef3c7"};
                color:${isAvailable ? "#15803d" : "#a16207"}">
                ${station.status}
              </span>
              <span style="font-size:11px;color:#475569">⏱ ${station.waitMin} min wait</span>
            </div>
            <button
              onclick="window.__myturnSelectStation('${station.id}')"
              style="margin-top:10px;width:100%;padding:7px;background:#2563eb;color:#fff;
                border:none;border-radius:7px;font-weight:600;font-size:12px;cursor:pointer">
              Select this station
            </button>
          </div>`,
          { maxWidth: 220 }
        );

      marker.on("click", () => onSelect(station));
      markersRef.current.push(marker);

      // Auto-open popup if selected
      if (isSelected) {
        setTimeout(() => marker.openPopup(), 100);
      }
    });

    // Fit bounds to all markers
    if (stations.length > 0) {
      const coords = stations.map((s, i) => {
        const c = getCoords(s.id, i);
        return [c.lat, c.lng] as [number, number];
      });
      map.fitBounds(coords, { padding: [60, 60], maxZoom: 14 });
    }
  }, [leafletReady, stations, selectedId, onSelect]);

  // Global bridge for popup button clicks
  useEffect(() => {
    window.__myturnSelectStation = (id: string) => {
      const s = stations.find((st) => st.id === id);
      if (s) onSelect(s);
    };
    return () => { delete window.__myturnSelectStation; };
  }, [stations, onSelect]);

  if (loadError) {
    return (
      <div style={errorStyles.box}>
        <span style={{ fontSize: 28 }}>⚠️</span>
        <p style={errorStyles.text}>
          Could not load map. Check your internet connection.
        </p>
      </div>
    );
  }

  return (
    <div style={wrapStyles.wrap}>
      {/* Map container */}
      <div ref={containerRef} style={wrapStyles.map} />

      {/* Loading overlay */}
      {!leafletReady && (
        <div style={wrapStyles.overlay}>
          <div style={wrapStyles.spinner} />
          <p style={wrapStyles.loadingText}>Loading map…</p>
        </div>
      )}

      {/* Station legend strip */}
      <div style={wrapStyles.legend}>
        {stations.map((s, i) => {
          const { lat, lng } = getCoords(s.id, i);
          const isSelected = s.id === selectedId;
          const isAvailable = s.status === "AVAILABLE";
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onSelect(s);
                if (mapRef.current && leafletReady) {
                  mapRef.current.setView([lat, lng], 14, { animate: true });
                }
              }}
              style={{
                ...wrapStyles.legendBtn,
                ...(isSelected ? wrapStyles.legendBtnActive : {}),
              }}
            >
              <span
                style={{
                  ...wrapStyles.dot,
                  background: isSelected
                    ? "#2563eb"
                    : isAvailable
                    ? "#15803d"
                    : "#a16207",
                }}
              />
              <span style={wrapStyles.legendName}>{s.name}</span>
              <span
                style={{
                  ...wrapStyles.legendBadge,
                  background: isAvailable ? "#dcfce7" : "#fef3c7",
                  color: isAvailable ? "#15803d" : "#a16207",
                }}
              >
                {s.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// (Window types declared above near the top of the file)

const wrapStyles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    border: "2px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
  },
  map: {
    width: "100%",
    height: 380,
    background: "#e8f0fe",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(248,250,252,0.92)",
    backdropFilter: "blur(4px)",
    gap: 12,
    borderRadius: 14,
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "3px solid #dbeafe",
    borderTopColor: "#2563eb",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 600,
    margin: 0,
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    padding: "10px 12px",
    background: "#fff",
    borderTop: "1px solid #f1f5f9",
  },
  legendBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 20,
    background: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.18s",
    fontSize: 12,
    fontWeight: 600,
    color: "#334155",
  },
  legendBtnActive: {
    borderColor: "#2563eb",
    background: "#eff6ff",
    color: "#1d4ed8",
    boxShadow: "0 0 0 2px rgba(37,99,235,0.15)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendName: {
    maxWidth: 140,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  legendBadge: {
    fontSize: 9,
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 4,
    letterSpacing: "0.06em",
  },
};

const errorStyles: Record<string, React.CSSProperties> = {
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 220,
    background: "#fff7ed",
    borderRadius: 14,
    border: "2px dashed #fed7aa",
  },
  text: {
    fontSize: 13,
    color: "#9a3412",
    margin: 0,
    fontWeight: 600,
  },
};
