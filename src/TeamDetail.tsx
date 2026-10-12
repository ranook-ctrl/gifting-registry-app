import React from "react";
import { fixtures, type Fixture } from "./FifaFixtures";
import { groups, type StandingRow } from "./PointsTable";

const ChevronLeft: React.FC = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const findTeamContext = (short: string) => {
  for (const g of groups) {
    const idx = g.rows.findIndex((r) => r.team.short === short);
    if (idx >= 0) {
      const sorted = [...g.rows].sort((a, b) => {
        const pa = a.W * 3 + a.D, pb = b.W * 3 + b.D;
        if (pa !== pb) return pb - pa;
        const da = a.GF - a.GA, db = b.GF - b.GA;
        if (da !== db) return db - da;
        return b.GF - a.GF;
      });
      const rank = sorted.findIndex((r) => r.team.short === short) + 1;
      return { row: g.rows[idx], group: g, rank };
    }
  }
  return null;
};

const teamFixtures = (short: string): Fixture[] =>
  fixtures
    .filter((f) => f.home.short === short || f.away.short === short)
    .sort((a, b) => (a.date + a.kickoff).localeCompare(b.date + b.kickoff));

const StatCell: React.FC<{ label: string; value: string | number; emphasis?: boolean }> = ({
  label,
  value,
  emphasis,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
    <span
      style={{
        fontSize: emphasis ? 24 : 18,
        fontWeight: emphasis ? 800 : 700,
        color: "var(--color-text-primary)",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -0.4,
      }}
    >
      {value}
    </span>
    <span
      style={{
        marginTop: 2,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.4,
        color: "var(--color-text-tertiary)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  </div>
);

const StatusPill: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
  if (fixture.status === "live") {
    return (
      <span
        style={{
          padding: "var(--space-xxs) var(--space-sm)",
          background: "var(--color-semantic-live-bg)",
          color: "var(--color-semantic-live)",
          borderRadius: "var(--radius-full)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        LIVE
      </span>
    );
  }
  if (fixture.status === "completed") {
    return (
      <span
        style={{
          padding: "var(--space-xxs) var(--space-sm)",
          background: "var(--color-surface-subtle)",
          color: "var(--color-text-secondary)",
          borderRadius: "var(--radius-full)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        FT
      </span>
    );
  }
  return (
    <span
      style={{
        padding: "var(--space-xxs) var(--space-sm)",
        background: "var(--color-surface-subtle)",
        color: "var(--color-text-primary)",
        borderRadius: "var(--radius-full)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
      }}
    >
      {fixture.kickoff}
    </span>
  );
};

const FixtureRow: React.FC<{
  fixture: Fixture;
  selfShort: string;
  onOpen: (id: string) => void;
}> = ({ fixture, selfShort, onOpen }) => {
  const opp = fixture.home.short === selfShort ? fixture.away : fixture.home;
  const isHome = fixture.home.short === selfShort;
  const showScore = fixture.status === "live" || fixture.status === "completed";
  const myScore = isHome ? fixture.score?.home : fixture.score?.away;
  const oppScore = isHome ? fixture.score?.away : fixture.score?.home;

  return (
    <button
      onClick={() => onOpen(fixture.id)}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-md)",
        width: "100%",
        boxSizing: "border-box",
        padding: "var(--space-md) var(--space-lg)",
        borderTop: "1px solid var(--color-border-subtle)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-text-tertiary)",
          width: 36,
        }}
      >
        {isHome ? "H" : "A"}
      </span>
      <span style={{ fontSize: 22 }}>{opp.flag}</span>
      <span style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          vs {opp.name}
        </span>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
          {new Date(fixture.date + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {fixture.stadium}
        </span>
      </span>
      {showScore && (
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "var(--color-text-primary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {myScore}–{oppScore}
        </span>
      )}
      <StatusPill fixture={fixture} />
      <ChevronRight />
    </button>
  );
};

const TeamDetail: React.FC<{
  short: string;
  onBack: () => void;
  onOpenFixture: (id: string) => void;
}> = ({ short, onBack, onOpenFixture }) => {
  const ctx = findTeamContext(short);
  if (!ctx) {
    return (
      <div style={{ padding: "var(--space-2xl)" }}>
        Team not found.{" "}
        <button onClick={onBack} style={{ color: "var(--color-text-primary)" }}>
          Go back
        </button>
      </div>
    );
  }
  const { row, group, rank } = ctx;
  const pts = row.W * 3 + row.D;
  const gd = row.GF - row.GA;
  const matches = teamFixtures(short);

  return (
    <div style={{ background: "var(--color-surface-subtle)", minHeight: "100vh" }}>
      <header
        style={{
          background: "var(--color-surface-canvas)",
          borderBottom: "1px solid var(--color-border-subtle)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          aria-hidden
          style={{
            height: 4,
            background: "linear-gradient(90deg, #E5093F 0%, #FFFFFF 33%, #1A1A1A 66%, #FEEE00 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-md)",
            padding: "var(--space-lg)",
          }}
        >
          <button
            onClick={onBack}
            aria-label="Back"
            style={{
              all: "unset",
              cursor: "pointer",
              width: 36,
              height: 36,
              borderRadius: "var(--radius-full)",
              background: "var(--color-surface-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-primary)",
              flexShrink: 0,
            }}
          >
            <ChevronLeft />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <span style={{ fontSize: 24 }}>{row.team.flag}</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
                Group {group.id} · #{rank}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)" }}>
                {row.team.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section
        style={{
          background: "var(--color-surface-canvas)",
          padding: "var(--space-xl) var(--space-lg)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <StatCell label="Pts" value={pts} emphasis />
          <StatCell label="P" value={row.P} />
          <StatCell label="W" value={row.W} />
          <StatCell label="D" value={row.D} />
          <StatCell label="L" value={row.L} />
          <StatCell label="GD" value={gd > 0 ? `+${gd}` : gd} />
        </div>
        <div
          style={{
            marginTop: "var(--space-lg)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              color: "var(--color-text-tertiary)",
            }}
          >
            Form
          </span>
          {row.form.map((r, idx) => {
            const palette =
              r === "W"
                ? { bg: "var(--color-semantic-success-bg)", fg: "var(--color-semantic-success)" }
                : r === "L"
                ? { bg: "var(--color-semantic-live-bg)", fg: "var(--color-semantic-live)" }
                : { bg: "var(--color-surface-subtle)", fg: "var(--color-text-secondary)" };
            return (
              <span
                key={idx}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "var(--radius-full)",
                  background: palette.bg,
                  color: palette.fg,
                  fontSize: 10,
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {r}
              </span>
            );
          })}
        </div>
      </section>

      <section
        style={{
          margin: "var(--space-lg)",
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-xs)",
          overflow: "hidden",
        }}
      >
        <h3
          style={{
            margin: 0,
            padding: "var(--space-lg) var(--space-lg) var(--space-md)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-text-primary)",
          }}
        >
          Fixtures
        </h3>
        {matches.length === 0 && (
          <div style={{ padding: "var(--space-lg)", color: "var(--color-text-secondary)", fontSize: 13 }}>
            No matches available for this team yet.
          </div>
        )}
        {matches.map((f) => (
          <FixtureRow key={f.id} fixture={f} selfShort={short} onOpen={onOpenFixture} />
        ))}
      </section>
    </div>
  );
};

export default TeamDetail;
