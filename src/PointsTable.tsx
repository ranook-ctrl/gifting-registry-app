import React, { useMemo, useState } from "react";

/* Field DS additions consumed via the shared CSS vars set on FifaFixtures root.
   This file binds to the same --color-*, --space-*, --radius-* tokens. */

export type FormResult = "W" | "D" | "L";

export type StandingRow = {
  team: { name: string; short: string; flag: string };
  P: number;
  W: number;
  D: number;
  L: number;
  GF: number;
  GA: number;
  form: FormResult[]; // most recent on the right
};

export type Group = {
  id: string; // "A"
  rows: StandingRow[];
};

export const groups: Group[] = [
  {
    id: "A",
    rows: [
      { team: { name: "Mexico", short: "MEX", flag: "🇲🇽" }, P: 3, W: 2, D: 1, L: 0, GF: 5, GA: 2, form: ["W", "D", "W"] },
      { team: { name: "Canada", short: "CAN", flag: "🇨🇦" }, P: 3, W: 2, D: 0, L: 1, GF: 4, GA: 2, form: ["L", "W", "W"] },
      { team: { name: "Morocco", short: "MAR", flag: "🇲🇦" }, P: 3, W: 1, D: 1, L: 1, GF: 3, GA: 3, form: ["D", "L", "W"] },
      { team: { name: "Saudi Arabia", short: "KSA", flag: "🇸🇦" }, P: 3, W: 0, D: 0, L: 3, GF: 1, GA: 6, form: ["L", "L", "L"] },
    ],
  },
  {
    id: "B",
    rows: [
      { team: { name: "England", short: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, P: 3, W: 3, D: 0, L: 0, GF: 7, GA: 1, form: ["W", "W", "W"] },
      { team: { name: "Senegal", short: "SEN", flag: "🇸🇳" }, P: 3, W: 1, D: 1, L: 1, GF: 4, GA: 4, form: ["W", "D", "L"] },
      { team: { name: "USA", short: "USA", flag: "🇺🇸" }, P: 3, W: 1, D: 0, L: 2, GF: 3, GA: 5, form: ["L", "W", "L"] },
      { team: { name: "Iran", short: "IRN", flag: "🇮🇷" }, P: 3, W: 0, D: 1, L: 2, GF: 1, GA: 5, form: ["L", "D", "L"] },
    ],
  },
  {
    id: "C",
    rows: [
      { team: { name: "Argentina", short: "ARG", flag: "🇦🇷" }, P: 3, W: 2, D: 1, L: 0, GF: 6, GA: 2, form: ["W", "D", "W"] },
      { team: { name: "Brazil", short: "BRA", flag: "🇧🇷" }, P: 3, W: 2, D: 0, L: 1, GF: 5, GA: 2, form: ["W", "L", "W"] },
      { team: { name: "Croatia", short: "CRO", flag: "🇭🇷" }, P: 3, W: 1, D: 0, L: 2, GF: 2, GA: 5, form: ["L", "W", "L"] },
      { team: { name: "Japan", short: "JPN", flag: "🇯🇵" }, P: 3, W: 0, D: 1, L: 2, GF: 2, GA: 6, form: ["L", "L", "D"] },
    ],
  },
  {
    id: "D",
    rows: [
      { team: { name: "France", short: "FRA", flag: "🇫🇷" }, P: 3, W: 2, D: 1, L: 0, GF: 6, GA: 3, form: ["W", "W", "D"] },
      { team: { name: "Germany", short: "GER", flag: "🇩🇪" }, P: 3, W: 2, D: 0, L: 1, GF: 5, GA: 3, form: ["W", "L", "W"] },
      { team: { name: "Australia", short: "AUS", flag: "🇦🇺" }, P: 3, W: 1, D: 1, L: 1, GF: 3, GA: 4, form: ["D", "W", "L"] },
      { team: { name: "Tunisia", short: "TUN", flag: "🇹🇳" }, P: 3, W: 0, D: 0, L: 3, GF: 1, GA: 5, form: ["L", "L", "L"] },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Utilities
   ────────────────────────────────────────────────────────────────────────── */
const computePts = (r: StandingRow) => r.W * 3 + r.D;
const computeGD = (r: StandingRow) => r.GF - r.GA;

const sortStandings = (rows: StandingRow[]) =>
  [...rows].sort((a, b) => {
    const pa = computePts(a), pb = computePts(b);
    if (pa !== pb) return pb - pa;
    const da = computeGD(a), db = computeGD(b);
    if (da !== db) return db - da;
    return b.GF - a.GF;
  });

/* ──────────────────────────────────────────────────────────────────────────
   Atoms
   ────────────────────────────────────────────────────────────────────────── */
const Flag: React.FC<{ glyph: string; label: string; size?: number }> = ({
  glyph,
  label,
  size = 24,
}) => (
  <span
    aria-label={label}
    role="img"
    style={{
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size - 4,
      lineHeight: 1,
      borderRadius: "var(--radius-full)",
      background: "var(--color-surface-subtle)",
      flexShrink: 0,
    }}
  >
    {glyph}
  </span>
);

const PositionMark: React.FC<{ pos: number; qualifies: boolean }> = ({ pos, qualifies }) => (
  <span
    style={{
      width: 22,
      height: 22,
      borderRadius: "var(--radius-full)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700,
      background: qualifies ? "var(--color-semantic-success-bg)" : "transparent",
      color: qualifies ? "var(--color-semantic-success)" : "var(--color-text-secondary)",
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {pos}
  </span>
);

const FormDot: React.FC<{ r: FormResult }> = ({ r }) => {
  const palette =
    r === "W"
      ? { bg: "var(--color-semantic-success-bg)", fg: "var(--color-semantic-success)" }
      : r === "L"
      ? { bg: "var(--color-semantic-live-bg)", fg: "var(--color-semantic-live)" }
      : { bg: "var(--color-surface-subtle)", fg: "var(--color-text-secondary)" };
  return (
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: "var(--radius-full)",
        background: palette.bg,
        color: palette.fg,
        fontSize: 9,
        fontWeight: 800,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: 0,
      }}
    >
      {r}
    </span>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Group selector
   ────────────────────────────────────────────────────────────────────────── */
const GroupChips: React.FC<{ value: string; onChange: (v: string) => void }> = ({
  value,
  onChange,
}) => (
  <div
    style={{
      display: "flex",
      gap: "var(--space-sm)",
      overflowX: "auto",
      padding: "var(--space-md) var(--space-lg)",
    }}
  >
    {groups.map((g) => {
      const active = g.id === value;
      return (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          style={{
            all: "unset",
            cursor: "pointer",
            minWidth: 56,
            padding: "var(--space-sm) var(--space-lg)",
            textAlign: "center",
            borderRadius: "var(--radius-full)",
            background: active
              ? "var(--color-surface-inverse)"
              : "var(--color-surface-subtle)",
            color: active
              ? "var(--color-text-on-inverse)"
              : "var(--color-text-primary)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.4,
            flexShrink: 0,
          }}
        >
          Group {g.id}
        </button>
      );
    })}
  </div>
);

/* ──────────────────────────────────────────────────────────────────────────
   Standings table
   ────────────────────────────────────────────────────────────────────────── */
const NUMERIC_HEADERS: { key: keyof StandingRow | "GD" | "Pts"; label: string }[] = [
  { key: "P", label: "P" },
  { key: "W", label: "W" },
  { key: "D", label: "D" },
  { key: "L", label: "L" },
  { key: "GD", label: "GD" },
  { key: "Pts", label: "Pts" },
];

const numericCellStyle: React.CSSProperties = {
  width: 22,
  textAlign: "center",
  fontSize: 13,
  fontVariantNumeric: "tabular-nums",
  color: "var(--color-text-primary)",
  flexShrink: 0,
};

const headerCellStyle: React.CSSProperties = {
  ...numericCellStyle,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.4,
  color: "var(--color-text-tertiary)",
  textTransform: "uppercase",
};

const StandingsTable: React.FC<{
  group: Group;
  onOpenTeam: (short: string) => void;
}> = ({ group, onOpenTeam }) => {
  const sorted = useMemo(() => sortStandings(group.rows), [group]);

  return (
    <div
      style={{
        background: "var(--color-surface-raised)",
        margin: "0 var(--space-lg)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-xs)",
        overflow: "hidden",
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-xs)",
          padding: "var(--space-md) var(--space-md) var(--space-md) var(--space-md)",
          borderBottom: "1px solid var(--color-border-subtle)",
          background: "var(--color-surface-subtle)",
        }}
      >
        <span style={{ width: 22, ...headerCellStyle, textAlign: "left" }}>#</span>
        <span
          style={{
            flex: 1,
            ...headerCellStyle,
            textAlign: "left",
            paddingLeft: "var(--space-sm)",
          }}
        >
          Team
        </span>
        {NUMERIC_HEADERS.map((h) => (
          <span
            key={h.key}
            style={{
              ...headerCellStyle,
              fontWeight: h.key === "Pts" ? 800 : 700,
              color:
                h.key === "Pts" ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            }}
          >
            {h.label}
          </span>
        ))}
      </div>

      {/* Rows */}
      {sorted.map((row, i) => {
        const pos = i + 1;
        const qualifies = pos <= 2;
        const pts = computePts(row);
        const gd = computeGD(row);
        return (
          <button
            key={row.team.short}
            onClick={() => onOpenTeam(row.team.short)}
            style={{
              all: "unset",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-xs)",
              width: "100%",
              boxSizing: "border-box",
              padding: "var(--space-md) var(--space-md) var(--space-md) var(--space-md)",
              borderBottom:
                i < sorted.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
              borderLeft: qualifies
                ? "3px solid var(--color-semantic-success)"
                : "3px solid transparent",
            }}
          >
            <PositionMark pos={pos} qualifies={qualifies} />
            <span
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                paddingLeft: "var(--space-xxs)",
                minWidth: 0,
              }}
            >
              <Flag glyph={row.team.flag} label={row.team.name} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  whiteSpace: "nowrap",
                  letterSpacing: 0.2,
                }}
              >
                {row.team.short}
              </span>
            </span>
            <span style={numericCellStyle}>{row.P}</span>
            <span style={numericCellStyle}>{row.W}</span>
            <span style={numericCellStyle}>{row.D}</span>
            <span style={numericCellStyle}>{row.L}</span>
            <span
              style={{
                ...numericCellStyle,
                color:
                  gd > 0
                    ? "var(--color-semantic-success)"
                    : gd < 0
                    ? "var(--color-semantic-live)"
                    : "var(--color-text-secondary)",
                fontWeight: 600,
              }}
            >
              {gd > 0 ? `+${gd}` : gd}
            </span>
            <span
              style={{
                ...numericCellStyle,
                fontWeight: 800,
                color: "var(--color-text-primary)",
              }}
            >
              {pts}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Form strip
   ────────────────────────────────────────────────────────────────────────── */
const FormStrip: React.FC<{ group: Group }> = ({ group }) => {
  const sorted = useMemo(() => sortStandings(group.rows), [group]);
  return (
    <div
      style={{
        background: "var(--color-surface-raised)",
        margin: "var(--space-md) var(--space-lg) 0",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-md) var(--space-lg)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
          color: "var(--color-text-tertiary)",
          textTransform: "uppercase",
          marginBottom: "var(--space-md)",
        }}
      >
        Recent form
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {sorted.map((row) => (
          <div
            key={row.team.short}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
            }}
          >
            <Flag glyph={row.team.flag} label={row.team.name} size={20} />
            <span
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              {row.team.name}
            </span>
            <span style={{ display: "flex", gap: 4 }}>
              {row.form.map((r, idx) => (
                <FormDot key={idx} r={r} />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Legend
   ────────────────────────────────────────────────────────────────────────── */
const Legend: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-md)",
      padding: "var(--space-md) var(--space-lg)",
      color: "var(--color-text-secondary)",
      fontSize: 12,
    }}
  >
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)" }}>
      <span
        style={{
          width: 3,
          height: 14,
          background: "var(--color-semantic-success)",
          borderRadius: "var(--radius-xs)",
        }}
      />
      Qualified for Round of 16
    </span>
  </div>
);

/* ──────────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────────── */
const PointsTable: React.FC<{ onOpenTeam: (short: string) => void }> = ({
  onOpenTeam,
}) => {
  const [groupId, setGroupId] = useState("A");
  const group = groups.find((g) => g.id === groupId)!;
  return (
    <div style={{ paddingBottom: "var(--space-3xl)" }}>
      <GroupChips value={groupId} onChange={setGroupId} />
      <StandingsTable group={group} onOpenTeam={onOpenTeam} />
      <Legend />
      <FormStrip group={group} />
    </div>
  );
};

export default PointsTable;
