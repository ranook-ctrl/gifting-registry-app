import React from "react";
import { colour, radius, space } from "../src/field-ds/tokens";
import statusBar from "./assets/status-bar.svg";
import keyboard from "./assets/keyboard.png";
import eyeSlash from "./assets/eye-slash.svg";
import checkCircle from "./assets/check-circle.svg";
import warningTriangle from "./assets/warning-triangle.svg";

/**
 * noon Kids — "Let's get started" login screen.
 * Figma: noon Kids (nano) · node 2074:95090
 * Toast rendered in the Success variant of M-Toast (per request);
 * flip TOAST to the error preset to get the original state.
 */

type ToastType = "success" | "error";

const TOAST_PRESETS: Record<ToastType, { fill: string; icon: string; title: string }> = {
  success: {
    fill: colour.surface["success-bold"], // #0f8857
    icon: checkCircle,
    title: "Credentials verified successfully",
  },
  error: {
    fill: colour.surface["error-bold"], // #d92626
    icon: warningTriangle,
    title: "Wrong credentials, please check it again",
  },
};

const TOAST = TOAST_PRESETS.success;

const noontree = (weight: string): React.CSSProperties => ({
  fontFamily: `'Noontree-${weight}', 'Noontree', sans-serif`,
});

function ToastCard() {
  return (
    <div
      style={{
        position: "absolute",
        left: 33,
        top: 53,
        display: "inline-flex",
        alignItems: "center",
        background: TOAST.fill,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: radius[14],
        boxShadow: "0px 12px 28px 0px rgba(11, 12, 14, 0.1)",
        zIndex: 3,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: space[8], padding: space[12] }}>
        <img src={TOAST.icon} alt="" style={{ width: 24, height: 24, display: "block" }} />
        <span
          style={{
            ...noontree("SemiBold"),
            fontSize: 14,
            lineHeight: "20px",
            letterSpacing: "-0.0071em",
            color: colour["text-n-icon"]["on-surface-bold"],
            whiteSpace: "nowrap",
          }}
        >
          {TOAST.title}
        </span>
      </div>
    </div>
  );
}

function InputBox({
  label,
  labelAsteriskColor,
  children,
  trailing,
}: {
  label: string;
  labelAsteriskColor: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: space[10],
        height: 56,
        padding: `0 ${space[12]}px`,
        boxSizing: "border-box",
        background: colour.surface.secondary,
        border: `1px solid ${colour.border.subtle}`,
        borderRadius: radius[12],
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: space[4] }}>
        <span
          style={{
            ...noontree("Regular"),
            fontSize: 11,
            lineHeight: "12px",
            letterSpacing: "-0.0109em",
            color: colour["text-n-icon"].tertiary,
          }}
        >
          {label}
          <span style={{ color: labelAsteriskColor }}>*</span>
        </span>
        <div
          style={{
            ...noontree("Bold"),
            display: "flex",
            alignItems: "center",
            gap: space[8],
            fontSize: 14,
            lineHeight: "20px",
            letterSpacing: "-0.0071em",
            color: colour["text-n-icon"].primary,
          }}
        >
          {children}
        </div>
      </div>
      {trailing}
    </div>
  );
}

export default function KidsLoginDemo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colour.surface.muted,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 375,
          height: 812,
          background: colour.surface.primary,
          borderRadius: radius[24],
          overflow: "hidden",
          boxShadow: "0px 24px 64px rgba(11, 12, 14, 0.18)",
        }}
      >
        {/* Status bar */}
        <img
          src={statusBar}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: 375, height: 45, display: "block" }}
        />

        <ToastCard />

        {/* Heading + fields */}
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 119,
            width: 343,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: space[48],
          }}
        >
          <div
            style={{
              width: 269,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: space[24],
            }}
          >
            <h1
              style={{
                ...noontree("ExtraBold"),
                margin: 0,
                fontSize: 32,
                lineHeight: "40px",
                letterSpacing: "-0.0078em",
                textAlign: "center",
                color: colour["text-n-icon"].primary,
              }}
            >
              Let&rsquo;s get started
            </h1>
            <p
              style={{
                ...noontree("Medium"),
                margin: 0,
                width: 215,
                fontSize: 16,
                lineHeight: "22px",
                letterSpacing: "-0.0094em",
                textAlign: "center",
                color: colour["text-n-icon"].muted,
              }}
            >
              Ask your parent for the Username and Password
            </p>
          </div>

          <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: space[24] }}>
            <InputBox
              label="Username"
              labelAsteriskColor="#f04242"
              trailing={
                <img
                  src={checkCircle}
                  alt=""
                  style={{ width: 24, height: 24, display: "block", opacity: 0 }}
                />
              }
            >
              <span>Ranook9087</span>
              <span style={{ color: colour["text-n-icon"].action, marginLeft: -6 }}>|</span>
            </InputBox>

            <InputBox
              label="Password"
              labelAsteriskColor={colour["text-n-icon"].error}
              trailing={
                <img src={eyeSlash} alt="" style={{ width: 20, height: 20, display: "block" }} />
              }
            >
              <span>*****************</span>
            </InputBox>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          style={{
            ...noontree("SemiBold"),
            position: "absolute",
            left: 16,
            top: 443,
            width: 343,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: space[8],
            padding: `${space[16]}px ${space[24]}px`,
            background: colour.surface["action-bold"],
            border: "none",
            borderRadius: radius[12],
            fontSize: 17,
            lineHeight: "24px",
            letterSpacing: "-0.0147em",
            color: colour["text-n-icon"]["on-surface-bold"],
            cursor: "pointer",
          }}
        >
          Verify &amp; continue
        </button>

        {/* iOS keyboard */}
        <img
          src={keyboard}
          alt=""
          style={{ position: "absolute", left: 0, bottom: 0, width: 375, display: "block" }}
        />
      </div>
    </div>
  );
}
