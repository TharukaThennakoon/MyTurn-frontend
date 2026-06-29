export default function VehicleDetails() {
  return (
    <div style={styles.wrapper}>
      {/* Section header */}
      <div style={styles.header}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ color: "#1d4ed8" }}>
          <rect x="2" y="8" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M5 8V6a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="6" cy="16" r="2" fill="currentColor"/>
          <circle cx="14" cy="16" r="2" fill="currentColor"/>
        </svg>
        <span style={styles.headerText}>Vehicle Details</span>
      </div>

      {/* Fields */}
      <div style={styles.fields}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Vehicle Number</label>
          <input
            type="text"
            placeholder="ABC-1234"
            style={styles.input}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#1d4ed8"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Vehicle Type</label>
          <div style={{ position: "relative" }}>
            <select
              style={styles.select}
              defaultValue=""
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1d4ed8"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
            >
              <option value="" disabled>Select Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
            </select>
            <svg style={styles.chevron} viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    borderTop: "1px solid #e8edf5",
    paddingTop: 14,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
    color: "#1d4ed8",
  },
  headerText: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1d4ed8",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  fields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "#374151",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  input: {
    height: 44,
    padding: "0 12px",
    border: "1.5px solid transparent",
    borderRadius: 8,
    fontSize: 14,
    color: "#0f172a",
    background: "#f4f7fb",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  },
  select: {
    height: 44,
    width: "100%",
    padding: "0 32px 0 12px",
    border: "1.5px solid transparent",
    borderRadius: 8,
    fontSize: 14,
    color: "#0f172a",
    background: "#f4f7fb",
    outline: "none",
    appearance: "none" as const,
    cursor: "pointer",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  },
  chevron: {
    position: "absolute" as const,
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    width: 16,
    height: 16,
    pointerEvents: "none" as const,
  },
};