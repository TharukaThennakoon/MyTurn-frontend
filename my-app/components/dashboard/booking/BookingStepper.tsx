"use client";

import React from "react";

export type BookingStep = 1 | 2 | 3 | 4;

interface BookingStepperProps {
  activeStep: BookingStep;
  completedStep: number;
}

const STEPS: { id: BookingStep; label: string }[] = [
  { id: 1, label: "STATION" },
  { id: 2, label: "FUEL" },
  { id: 3, label: "TIME" },
  { id: 4, label: "CONFIRM" },
];

export default function BookingStepper({
  activeStep,
  completedStep,
}: BookingStepperProps) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.track}>
        {STEPS.map((step, index) => {
          const isCompleted = step.id <= completedStep;
          const isActive = step.id === activeStep;
          const isPending = step.id > completedStep && !isActive;
          const connectorFilled =
            index < STEPS.length - 1 && step.id < activeStep;

          return (
            <React.Fragment key={step.id}>
              <div style={styles.step}>
                <div
                  style={{
                    ...styles.circle,
                    ...(isCompleted || isActive ? styles.circleDone : {}),
                    ...(isPending ? styles.circlePending : {}),
                  }}
                >
                  {step.id}
                </div>
                <span
                  style={{
                    ...styles.label,
                    ...(isCompleted || isActive ? styles.labelDone : {}),
                    ...(isPending ? styles.labelPending : {}),
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  style={{
                    ...styles.connector,
                    ...(connectorFilled || step.id <= completedStep
                      ? styles.connectorDone
                      : {}),
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    padding: "20px 0 28px",
    display: "flex",
    justifyContent: "center",
  },
  track: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    maxWidth: 520,
    width: "100%",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    transition: "all 0.25s ease",
  },
  circleDone: {
    background: "#2563eb",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
  },
  circlePending: {
    background: "#e2e8f0",
    color: "#94a3b8",
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    transition: "color 0.25s ease",
  },
  labelDone: {
    color: "#2563eb",
  },
  labelPending: {
    color: "#94a3b8",
  },
  connector: {
    flex: 1,
    height: 3,
    background: "#e2e8f0",
    margin: "0 4px",
    marginBottom: 22,
    borderRadius: 2,
    transition: "background 0.25s ease",
    minWidth: 40,
  },
  connectorDone: {
    background: "#2563eb",
  },
};
