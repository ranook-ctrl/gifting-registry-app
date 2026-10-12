import React from "react";
import type { Fixture } from "./FifaFixtures";
import { groups, type StandingRow } from "./PointsTable";

const ChevronLeft: React.FC = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const Flag: React.FC<{ glyph: string; label: string; size?: number }> = ({
  glyph,
  label,
  size = 64,
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
      fontSize: size - 12,
      lineHeight: 1,
      borderRadius: "var(--radius-full)",
      background: "var(--color-surface-subtle)",
      border: "1px solid var(--color-border-subtle)",
      flexShrink: 0,
    }}
  >
    {glyph}
  </span>
);

const DetailHeader: React.FC<{ onBack: () => void; title: string; subtitle: string }> = ({
  onBack,
  title,
  subtitle,
}) => (
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
        background:
          "linear-gradient(90deg, #E5093F 0%, #FFFFFF 33%, #1A1A1A 66%, #FEEE00 100%)",
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
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.6,
            color: "var(--color-text-tertiary)",
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  </header>
);

const StatusBadge: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
  if (fixture.status === "live") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-xs)",
          padding: "var(--space-xs) var(--space-md)",
          background: "var(--color-semantic-live-bg)",
          color: "var(--color-semantic-live)",
          borderRadius: "var(--radius-full)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "var(--radius-full)",
            background: "var(--color-semantic-live)",
            animation: "fdsPulse 1.4s ease-in-out infinite",
          }}
        />
        LIVE · {fixture.minute}'
      </span>
    );
  }
  if (fixture.status === "completed") {
    return (
      <span
        style={{
          padding: "var(--space-xs) var(--space-md)",
          background: "var(--color-surface-subtle)",
          color: "var(--color-text-secondary)",
          borderRadius: "var(--radius-full)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        Full Time
      </span>
    );
  }
  return (
    <span
      style={{
        padding: "var(--space-xs) var(--space-md)",
        background: "var(--color-surface-subtle)",
        color: "var(--color-text-primary)",
        borderRadius: "var(--radius-full)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
      }}
    >
      Kicks off {fixture.kickoff}
    </span>
  );
};

const Hero: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
  const showScore = fixture.status === "live" || fixture.status === "completed";
  return (
    <section
      style={{
        padding: "var(--space-2xl) var(--space-lg) var(--space-xl)",
        background: "var(--color-surface-canvas)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-lg)" }}>
        <StatusBadge fixture={fixture} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "var(--space-md)",
        }}
      >
        {/* home */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-md)" }}>
          <Flag glyph={fixture.home.flag} label={fixture.home.name} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              textAlign: "center",
            }}
          >
            {fixture.home.name}
          </span>
        </div>

        {/* score / vs */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {showScore ? (
            <span
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: -1,
                color: "var(--color-text-primary)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {fixture.score?.home} <span style={{ color: "var(--color-text-tertiary)", margin: "0 var(--space-sm)" }}>–</span> {fixture.score?.away}
            </span>
          ) : (
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--color-text-tertiary)",
                letterSpacing: -0.4,
              }}
            >
              vs
            </span>
          )}
          <span
            style={{
              marginTop: "var(--space-sm)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.4,
              color: "var(--color-text-tertiary)",
              textTransform: "uppercase",
            }}
          >
            {fixture.group ?? fixture.stage} · Match {fixture.matchNo}
          </span>
        </div>

        {/* away */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-md)" }}>
          <Flag glyph={fixture.away.flag} label={fixture.away.name} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              textAlign: "center",
            }}
          >
            {fixture.away.name}
          </span>
        </div>
      </div>
    </section>
  );
};

const MetaRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "var(--space-md) 0",
      borderBottom: "1px solid var(--color-border-subtle)",
    }}
  >
    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", letterSpacing: 0.4, textTransform: "uppercase" }}>
      {label}
    </span>
    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
      {value}
    </span>
  </div>
);

const MatchInfo: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
  const dateLabel = new Date(fixture.date + "T00:00").toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <section
      style={{
        margin: "var(--space-lg)",
        padding: "var(--space-md) var(--space-lg)",
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <h3
        style={{
          margin: "var(--space-md) 0",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--color-text-primary)",
        }}
      >
        Match info
      </h3>
      <MetaRow label="Date" value={dateLabel} />
      <MetaRow label="Kickoff" value={`${fixture.kickoff} local`} />
      <MetaRow label="Stadium" value={fixture.stadium} />
      <MetaRow label="City" value={fixture.city} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-md) 0" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", letterSpacing: 0.4, textTransform: "uppercase" }}>
          Stage
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
          {fixture.stage}
        </span>
      </div>
    </section>
  );
};

type Event = { minute: number; team: "home" | "away"; type: "goal" | "yellow"; player: string };
const sampleEventsForFixture = (fixture: Fixture): Event[] => {
  if (fixture.status === "upcoming") return [];
  if (fixture.id === "m12") {
    return [
      { minute: 14, team: "home", type: "goal", player: "L. Messi" },
      { minute: 32, team: "away", type: "yellow", player: "E. Álvarez" },
      { minute: 48, team: "away", type: "goal", player: "R. Jiménez" },
      { minute: 61, team: "home", type: "goal", player: "J. Álvarez" },
    ];
  }
  if (fixture.id === "m10") {
    return [
      { minute: 18, team: "home", type: "goal", player: "Vinícius Jr." },
      { minute: 44, team: "home", type: "goal", player: "Rodrygo" },
      { minute: 79, team: "home", type: "goal", player: "Endrick" },
    ];
  }
  if (fixture.id === "m11") {
    return [
      { minute: 22, team: "home", type: "goal", player: "K. Mbappé" },
      { minute: 35, team: "away", type: "goal", player: "M. Duke" },
      { minute: 67, team: "home", type: "goal", player: "A. Griezmann" },
      { minute: 88, team: "away", type: "goal", player: "C. Goodwin" },
    ];
  }
  return [];
};

const EventDot: React.FC<{ kind: Event["type"] }> = ({ kind }) => (
  <span
    style={{
      width: 18,
      height: 18,
      borderRadius: "var(--radius-full)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      fontWeight: 800,
      background:
        kind === "goal"
          ? "var(--color-semantic-success-bg)"
          : "var(--color-surface-subtle)",
      color:
        kind === "goal"
          ? "var(--color-semantic-success)"
          : "var(--color-text-secondary)",
      flexShrink: 0,
    }}
    aria-label={kind}
  >
    {kind === "goal" ? "⚽" : "▮"}
  </span>
);

const EventsTimeline: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
  const events = sampleEventsForFixture(fixture);
  if (events.length === 0) return null;
  return (
    <section
      style={{
        margin: "0 var(--space-lg) var(--space-lg)",
        padding: "var(--space-lg)",
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <h3
        style={{
          margin: "0 0 var(--space-md)",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--color-text-primary)",
        }}
      >
        Match events
      </h3>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {events.map((e, i) => {
          const team = e.team === "home" ? fixture.home : fixture.away;
          const align = e.team === "home" ? "flex-start" : "flex-end";
          return (
            <li key={i} style={{ display: "flex", alignItems: "center", justifyContent: align, gap: "var(--space-sm)" }}>
              {e.team === "home" && (
                <>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums", width: 28 }}>
                    {e.minute}'
                  </span>
                  <EventDot kind={e.type} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                    {e.player}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>· {team.short}</span>
                </>
              )}
              {e.team === "away" && (
                <>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{team.short} ·</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                    {e.player}
                  </span>
                  <EventDot kind={e.type} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums", width: 28, textAlign: "right" }}>
                    {e.minute}'
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

const sortStandings = (rows: StandingRow[]) =>
  [...rows].sort((a, b) => {
    const pa = a.W * 3 + a.D, pb = b.W * 3 + b.D;
    if (pa !== pb) return pb - pa;
    const da = a.GF - a.GA, db = b.GF - b.GA;
    if (da !== db) return db - da;
    return b.GF - a.GF;
  });

const GroupContext: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
  if (!fixture.group) return null;
  const groupId = fixture.group.replace("Group ", "");
  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;
  const sorted = sortStandings(group.rows);
  return (
    <section
      style={{
        margin: "0 var(--space-lg) var(--space-lg)",
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
        {fixture.group} standings
      </h3>
      {sorted.map((r, i) => {
        const pts = r.W * 3 + r.D;
        const isFixtureTeam =
          r.team.short === fixture.home.short || r.team.short === fixture.away.short;
        const qualifies = i < 2;
        return (
          <div
            key={r.team.short}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-md)",
              padding: "var(--space-md) var(--space-lg)",
              borderTop: "1px solid var(--color-border-subtle)",
              borderLeft: qualifies ? "3px solid var(--color-semantic-success)" : "3px solid transparent",
              background: isFixtureTeam ? "var(--color-surface-subtle)" : "transparent",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "var(--radius-full)",
                background: qualifies ? "var(--color-semantic-success-bg)" : "transparent",
                color: qualifies ? "var(--color-semantic-success)" : "var(--color-text-secondary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: 18 }}>{r.team.flag}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
              {r.team.name}
            </span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {r.P} GP
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "var(--color-text-primary)",
                fontVariantNumeric: "tabular-nums",
                width: 24,
                textAlign: "right",
              }}
            >
              {pts}
            </span>
          </div>
        );
      })}
    </section>
  );
};

const ActionBar: React.FC<{ fixture: Fixture }> = ({ fixture }) => (
  <div
    style={{
      display: "flex",
      gap: "var(--space-md)",
      padding: "var(--space-lg)",
    }}
  >
    <button
      style={{
        all: "unset",
        cursor: "pointer",
        flex: 1,
        textAlign: "center",
        padding: "var(--space-md)",
        background: "var(--color-brand-primary)",
        color: "var(--color-brand-on-primary)",
        borderRadius: "var(--radius-md)",
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {fixture.status === "upcoming" ? "Set reminder" : "Watch highlights"}
    </button>
    <button
      style={{
        all: "unset",
        cursor: "pointer",
        flex: 1,
        textAlign: "center",
        padding: "var(--space-md)",
        background: "var(--color-surface-subtle)",
        color: "var(--color-text-primary)",
        borderRadius: "var(--radius-md)",
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      Share
    </button>
  </div>
);

const MatchDetail: React.FC<{ fixture: Fixture; onBack: () => void }> = ({
  fixture,
  onBack,
}) => (
  <div style={{ background: "var(--color-surface-subtle)", minHeight: "100vh" }}>
    <DetailHeader
      onBack={onBack}
      title={`${fixture.home.short} vs ${fixture.away.short}`}
      subtitle={`${fixture.group ?? fixture.stage} · Match ${fixture.matchNo}`}
    />
    <Hero fixture={fixture} />
    <MatchInfo fixture={fixture} />
    <EventsTimeline fixture={fixture} />
    <GroupContext fixture={fixture} />
    <ActionBar fixture={fixture} />
  </div>
);

export default MatchDetail;
