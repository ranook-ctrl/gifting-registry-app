import React from "react";
import { colour, radius, space } from "../src/field-ds/tokens";
import product from "./assets/product.png";
import verifiedFilled from "./assets/verified-filled.svg";
import chevronRight from "./assets/chevron-right.svg";
import expressPill from "./assets/express-pill.svg";

/**
 * noon Kids — §6.1 Hero priority queue, all 8 hero states.
 * #1 (Approval takeover) is implemented from Figma node 2094:4775 (ActiveOrderCard).
 * #2–#8 are wireframes composed in the same card language: header status strip,
 * media slot, title + meta rows, status tag, trailing chevron / CTA pills.
 * Grey dashed blocks are image/icon placeholders pending design.
 */

/** noon dirham symbol — Noontree private-use glyph. */
const DHM = "";

const noontree = (weight: string): React.CSSProperties => ({
  fontFamily: `'Noontree-${weight}', 'Noontree', sans-serif`,
});

const t = {
  b16Bold: { ...noontree("Bold"), fontSize: 16, lineHeight: "22px", letterSpacing: "-0.0094em" },
  b13Bold: { ...noontree("Bold"), fontSize: 13, lineHeight: "20px", letterSpacing: "-0.0077em" },
  b13Medium: { ...noontree("Medium"), fontSize: 13, lineHeight: "20px", letterSpacing: "-0.0077em" },
  b13Regular: { ...noontree("Regular"), fontSize: 13, lineHeight: "20px", letterSpacing: "-0.0077em" },
} as const;

/* ---------- shared card anatomy ---------- */

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 353,
        boxSizing: "border-box",
        background: colour.surface.primary,
        border: `3px solid ${colour.surface.secondary}`,
        borderRadius: radius[16],
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

function HeaderStrip({
  icon,
  label,
  labelColor,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  labelColor: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 10px 10px",
        background: colour.surface.secondary,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: space[6] }}>
        {icon}
        <span style={{ ...t.b13Bold, color: labelColor }}>{label}</span>
      </div>
      {right}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: space[12], padding: space[10] }}>
      {children}
    </div>
  );
}

function ChevronButton() {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colour.surface.primary,
        border: `1px solid ${colour.border.subtle}`,
        borderRadius: radius.rounded,
      }}
    >
      <img src={chevronRight} alt="" style={{ width: 20, height: 20, display: "block" }} />
    </div>
  );
}

function StatusTag({ label, color, bg }: { label: string; color: string; bg?: string }) {
  return (
    <span
      style={{
        ...t.b13Bold,
        alignSelf: "flex-start",
        color,
        background: bg ?? "transparent",
        borderRadius: radius[6],
        padding: bg ? "0 6px" : 0,
      }}
    >
      {label}
    </span>
  );
}

function PillButton({ label, variant = "primary" }: { label: string; variant?: "primary" | "secondary" }) {
  const primary = variant === "primary";
  return (
    <button
      type="button"
      style={{
        ...t.b13Bold,
        padding: "6px 14px",
        borderRadius: radius.rounded,
        border: primary ? "none" : `1px solid ${colour.border.medium}`,
        background: primary ? colour.surface["action-bold"] : colour.surface.primary,
        color: primary ? colour["text-n-icon"]["on-surface-bold"] : colour["text-n-icon"].primary,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

/** Wireframe placeholder for media/icons not yet designed. */
function Placeholder({
  width,
  height,
  label,
  round,
  style,
}: {
  width: number;
  height: number;
  label?: string;
  round?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colour.surface.tertiary,
        border: `1.5px dashed ${colour.border.medium}`,
        borderRadius: round ? radius.rounded : radius[10],
        boxSizing: "border-box",
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            ...noontree("Medium"),
            fontSize: 9,
            lineHeight: "11px",
            textAlign: "center",
            color: colour["text-n-icon"].muted,
            padding: 2,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

const HeaderDot = () => <Placeholder width={18} height={18} round />;

function TitleBlock({
  title,
  meta,
  tag,
  children,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  tag?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: space[10], minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: space[4] }}>
        <span style={{ ...t.b16Bold, color: colour["text-n-icon"].primary }}>{title}</span>
        {meta && (
          <span style={{ ...t.b13Regular, color: colour["text-n-icon"].tertiary }}>{meta}</span>
        )}
      </div>
      {tag}
      {children}
    </div>
  );
}

/* ---------- 1 · Approval takeover (from Figma) ---------- */

function ApprovalTakeover() {
  return (
    <CardShell>
      <HeaderStrip
        icon={<img src={verifiedFilled} alt="" style={{ width: 18, height: 18, display: "block" }} />}
        label="Approved by mom"
        labelColor={colour["text-n-icon"].action}
        right={<img src={expressPill} alt="express" style={{ width: 54, height: 16, display: "block" }} />}
      />
      <Body>
        <div
          style={{
            width: 57,
            height: 76,
            flexShrink: 0,
            background: colour.surface.secondary,
            borderRadius: radius[10],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={product} alt="" style={{ width: 57, height: 76, objectFit: "contain", display: "block" }} />
        </div>
        <TitleBlock
          title="Arriving May 19 - 24"
          meta={
            <span style={{ display: "inline-flex", alignItems: "center", gap: space[6] }}>
              2 items
              <span style={{ width: 2, height: 2, borderRadius: 1, background: colour["text-n-icon"].muted }} />
              Processing
            </span>
          }
          tag={<StatusTag label="On time" color={colour["text-n-icon"].success} />}
        />
        <ChevronButton />
      </Body>
    </CardShell>
  );
}

/* ---------- 2 · Task reward takeover ---------- */

function TaskRewardTakeover() {
  return (
    <CardShell>
      <HeaderStrip
        icon={<img src={verifiedFilled} alt="" style={{ width: 18, height: 18, display: "block" }} />}
        label="Task verified by mom"
        labelColor={colour["text-n-icon"].success}
      />
      <Body>
        <Placeholder width={57} height={76} label="reward reveal art" />
        <TitleBlock
          title={`+${DHM}5 in your balance!`}
          meta={"“Great job on your room!” — mom"}
        >
          <div style={{ display: "flex", gap: space[8] }}>
            <PillButton label="Spend it" />
            <PillButton label="Save it" variant="secondary" />
          </div>
        </TitleBlock>
      </Body>
    </CardShell>
  );
}

/* ---------- 3 · Give celebration ---------- */

function GiveCelebration() {
  return (
    <CardShell>
      <HeaderStrip icon={<HeaderDot />} label="You gave it" labelColor="#e01854" />
      <Body>
        <div style={{ display: "flex", flexShrink: 0 }}>
          <Placeholder width={44} height={60} label="the toy" />
          <Placeholder width={44} height={60} label="charity logo" style={{ marginLeft: -10 }} />
        </div>
        <TitleBlock
          title="Rex the Dino found a new home"
          meta="Collected yesterday by Little Wings"
          tag={<StatusTag label="Lifetime gives: 3 ↗" color={colour["text-n-icon"].success} />}
        />
        <ChevronButton />
      </Body>
    </CardShell>
  );
}

/* ---------- 4 · Live tracking ---------- */

function LiveTracking() {
  return (
    <CardShell>
      <HeaderStrip
        icon={<HeaderDot />}
        label="Out for delivery"
        labelColor={colour["text-n-icon"].action}
        right={<img src={expressPill} alt="express" style={{ width: 54, height: 16, display: "block" }} />}
      />
      <Body>
        <Placeholder width={57} height={76} label="item image" />
        <TitleBlock
          title="Arriving today, 2–4pm"
          meta="Mystery accessory unlocks on arrival"
          tag={<StatusTag label="On time" color={colour["text-n-icon"].success} />}
        >
          <PillButton label="View order" variant="secondary" />
        </TitleBlock>
        <ChevronButton />
      </Body>
    </CardShell>
  );
}

/* ---------- 5 · Affordability ping ---------- */

function AffordabilityPing() {
  return (
    <CardShell>
      <HeaderStrip icon={<HeaderDot />} label="You earned these" labelColor={colour["text-n-icon"].success} />
      <Body>
        <div style={{ display: "flex", flexShrink: 0 }}>
          <Placeholder width={48} height={64} label="item 1" />
          <Placeholder width={48} height={64} label="item 2" style={{ marginLeft: -28 }} />
          <Placeholder width={48} height={64} label="item 3" style={{ marginLeft: -28 }} />
        </div>
        <TitleBlock
          title="3 wishlist items you can afford"
          meta={`Balance ${DHM}45 · wishlist since last visit`}
        >
          <PillButton label="See wishlist" />
        </TitleBlock>
      </Body>
    </CardShell>
  );
}

/* ---------- 6 · Streak save ---------- */

function StreakSave() {
  return (
    <CardShell>
      <HeaderStrip icon={<HeaderDot />} label="Streak on the line" labelColor={colour["text-n-icon"].warning} />
      <Body>
        <Placeholder width={57} height={76} label="puzzle preview" />
        <TitleBlock
          title="5-day streak — keep it alive"
          meta="Today's puzzle is still waiting"
          tag={<StatusTag label="Ends at midnight" color={colour["text-n-icon"].warning} />}
        >
          <PillButton label="Play before midnight" />
        </TitleBlock>
      </Body>
    </CardShell>
  );
}

/* ---------- 7 · Fresh task ---------- */

function FreshTask() {
  return (
    <CardShell>
      <HeaderStrip icon={<HeaderDot />} label="New task from mom" labelColor={colour["text-n-icon"].action} />
      <Body>
        <Placeholder width={57} height={76} label="task icon" />
        <TitleBlock
          title="Water the plants"
          meta={"“Before dinner please” — mom"}
          tag={<StatusTag label={`Earn +${DHM}5`} color={colour["text-n-icon"].success} />}
        >
          <PillButton label="Start" />
        </TitleBlock>
        <ChevronButton />
      </Body>
    </CardShell>
  );
}

/* ---------- 8 · Default earn-first ---------- */

function DefaultEarnFirst() {
  return (
    <CardShell>
      <HeaderStrip icon={<HeaderDot />} label="Your balance" labelColor={colour["text-n-icon"].primary} />
      <Body>
        <TitleBlock
          title={
            <span style={{ ...noontree("ExtraBold"), fontSize: 28, lineHeight: "36px", letterSpacing: "-0.25px" }}>
              {`${DHM}45`}
            </span>
          }
          meta={`+${DHM}5 earned today`}
        >
          <PillButton label="Browse worlds" />
        </TitleBlock>
        <div style={{ display: "flex", flexShrink: 0, alignItems: "center" }}>
          <Placeholder width={40} height={40} round label="world" />
          <Placeholder width={40} height={40} round label="world" style={{ marginLeft: -10 }} />
          <Placeholder width={40} height={40} round label="world" style={{ marginLeft: -10 }} />
        </div>
      </Body>
    </CardShell>
  );
}

/* ---------- gallery ---------- */

const VARIANTS: Array<{ rank: number; name: string; trigger: string; figma?: boolean; card: React.ReactNode }> = [
  { rank: 1, name: "Approval takeover", trigger: "Order approved and created in last 24h, child has not opened since", figma: true, card: <ApprovalTakeover /> },
  { rank: 2, name: "Task reward takeover", trigger: "Task verified in last 24h, child has not opened since", card: <TaskRewardTakeover /> },
  { rank: 3, name: "Give celebration", trigger: "Give collected in last 24h, child has not opened since", card: <GiveCelebration /> },
  { rank: 4, name: "Live tracking", trigger: "Order out for delivery or arriving within 24h", card: <LiveTracking /> },
  { rank: 5, name: "Affordability ping", trigger: "Wishlist item became affordable since last open", card: <AffordabilityPing /> },
  { rank: 6, name: "Streak save", trigger: "Streak 3+ days, puzzle not played today, after 5pm", card: <StreakSave /> },
  { rank: 7, name: "Fresh task", trigger: "Task assigned in last 12h, not started", card: <FreshTask /> },
  { rank: 8, name: "Default earn-first", trigger: "None of the above", card: <DefaultEarnFirst /> },
];

export default function HeroCardsDemo() {
  return (
    <div style={{ minHeight: "100vh", background: colour.surface.muted, padding: "48px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ ...noontree("ExtraBold"), margin: 0, fontSize: 24, lineHeight: "32px", color: colour["text-n-icon"].primary }}>
          noon Kids — Hero priority queue (§6.1)
        </h1>
        <p style={{ ...t.b13Regular, margin: "6px 0 32px", color: colour["text-n-icon"].tertiary }}>
          One hero only, highest rank wins. #1 implemented from Figma; #2–#8 wireframes in the same card language.
          Dashed blocks are media placeholders pending design.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 353px)", gap: 32, justifyContent: "center" }}>
          {VARIANTS.map((v) => (
            <div key={v.rank} style={{ display: "flex", flexDirection: "column", gap: space[8] }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ ...t.b13Bold, color: colour["text-n-icon"].primary }}>
                  {v.rank} · {v.name}
                  {v.figma && (
                    <span style={{ ...t.b13Medium, color: colour["text-n-icon"].action }}> — from Figma</span>
                  )}
                </span>
                <span style={{ ...t.b13Regular, fontSize: 11, lineHeight: "14px", color: colour["text-n-icon"].muted }}>
                  {v.trigger}
                </span>
              </div>
              {v.card}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
