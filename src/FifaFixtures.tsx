import React, { useMemo, useState } from "react";
import PointsTable from "./PointsTable";
import MatchDetail from "./MatchDetail";
import TeamDetail from "./TeamDetail";
import Predict from "./Predict";

/* ──────────────────────────────────────────────────────────────────────────
   Field Design System — scoped token pack (Scrutineer output)
   Every system-zone value below references one of these CSS custom props.
   ────────────────────────────────────────────────────────────────────────── */
const fieldDsTokens: React.CSSProperties = {
  // color
  ["--color-brand-primary" as any]: "#FEEE00",
  ["--color-brand-on-primary" as any]: "#1A1A1A",
  ["--color-surface-canvas" as any]: "#FFFFFF",
  ["--color-surface-subtle" as any]: "#F5F5F5",
  ["--color-surface-raised" as any]: "#FFFFFF",
  ["--color-surface-inverse" as any]: "#1A1A1A",
  ["--color-border-subtle" as any]: "#ECECEC",
  ["--color-border-default" as any]: "#D4D4D4",
  ["--color-text-primary" as any]: "#1A1A1A",
  ["--color-text-secondary" as any]: "#6B6B6B",
  ["--color-text-tertiary" as any]: "#999999",
  ["--color-text-on-inverse" as any]: "#FFFFFF",
  ["--color-semantic-live" as any]: "#E5093F",
  ["--color-semantic-live-bg" as any]: "#FDECEF",
  ["--color-semantic-success" as any]: "#0D8A3F",
  ["--color-semantic-success-bg" as any]: "#E8F5EE",
  // spacing
  ["--space-xxs" as any]: "2px",
  ["--space-xs" as any]: "4px",
  ["--space-sm" as any]: "8px",
  ["--space-md" as any]: "12px",
  ["--space-lg" as any]: "16px",
  ["--space-xl" as any]: "20px",
  ["--space-2xl" as any]: "24px",
  ["--space-3xl" as any]: "32px",
  // radius
  ["--radius-xs" as any]: "4px",
  ["--radius-sm" as any]: "8px",
  ["--radius-md" as any]: "12px",
  ["--radius-lg" as any]: "16px",
  ["--radius-full" as any]: "999px",
  // shadow
  ["--shadow-xs" as any]: "0 1px 2px rgba(0,0,0,0.04)",
  ["--shadow-sm" as any]: "0 2px 6px rgba(0,0,0,0.06)",
  ["--shadow-md" as any]: "0 4px 12px rgba(0,0,0,0.08)",
  // type
  ["--font-stack" as any]:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data
   ────────────────────────────────────────────────────────────────────────── */
export type MatchStatus = "live" | "upcoming" | "completed";
export type Stage = "Group Stage" | "Round of 16" | "Quarter-final" | "Semi-final" | "Final";

export type Fixture = {
  id: string;
  stage: Stage;
  group?: string;
  matchNo: number;
  home: { name: string; short: string; flag: string };
  away: { name: string; short: string; flag: string };
  kickoff: string; // "19:00"
  date: string; // ISO yyyy-mm-dd
  stadium: string;
  city: string;
  status: MatchStatus;
  minute?: number; // live
  score?: { home: number; away: number };
};

export const fixtures: Fixture[] = [
  {
    id: "m12",
    stage: "Group Stage",
    group: "Group C",
    matchNo: 12,
    home: { name: "Argentina", short: "ARG", flag: "🇦🇷" },
    away: { name: "Mexico", short: "MEX", flag: "🇲🇽" },
    kickoff: "20:00",
    date: "2026-06-15",
    stadium: "Estadio Azteca",
    city: "Mexico City",
    status: "live",
    minute: 67,
    score: { home: 2, away: 1 },
  },
  {
    id: "m13",
    stage: "Group Stage",
    group: "Group A",
    matchNo: 13,
    home: { name: "Canada", short: "CAN", flag: "🇨🇦" },
    away: { name: "Morocco", short: "MAR", flag: "🇲🇦" },
    kickoff: "22:00",
    date: "2026-06-15",
    stadium: "BMO Field",
    city: "Toronto",
    status: "upcoming",
  },
  {
    id: "m14",
    stage: "Group Stage",
    group: "Group B",
    matchNo: 14,
    home: { name: "England", short: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    away: { name: "Senegal", short: "SEN", flag: "🇸🇳" },
    kickoff: "16:00",
    date: "2026-06-16",
    stadium: "MetLife Stadium",
    city: "New York / NJ",
    status: "upcoming",
  },
  {
    id: "m15",
    stage: "Group Stage",
    group: "Group D",
    matchNo: 15,
    home: { name: "Germany", short: "GER", flag: "🇩🇪" },
    away: { name: "Japan", short: "JPN", flag: "🇯🇵" },
    kickoff: "19:30",
    date: "2026-06-16",
    stadium: "SoFi Stadium",
    city: "Los Angeles",
    status: "upcoming",
  },
  {
    id: "m10",
    stage: "Group Stage",
    group: "Group C",
    matchNo: 10,
    home: { name: "Brazil", short: "BRA", flag: "🇧🇷" },
    away: { name: "Croatia", short: "CRO", flag: "🇭🇷" },
    kickoff: "21:00",
    date: "2026-06-14",
    stadium: "Lincoln Financial Field",
    city: "Philadelphia",
    status: "completed",
    score: { home: 3, away: 0 },
  },
  {
    id: "m11",
    stage: "Group Stage",
    group: "Group E",
    matchNo: 11,
    home: { name: "France", short: "FRA", flag: "🇫🇷" },
    away: { name: "Australia", short: "AUS", flag: "🇦🇺" },
    kickoff: "18:00",
    date: "2026-06-14",
    stadium: "AT&T Stadium",
    city: "Dallas",
    status: "completed",
    score: { home: 2, away: 2 },
  },
];

const stageFilters: ("All" | Stage)[] = [
  "All",
  "Group Stage",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Final",
];

const dates = [
  { iso: "2026-06-14", dow: "SAT", day: "14" },
  { iso: "2026-06-15", dow: "SUN", day: "15" },
  { iso: "2026-06-16", dow: "MON", day: "16" },
  { iso: "2026-06-17", dow: "TUE", day: "17" },
  { iso: "2026-06-18", dow: "WED", day: "18" },
  { iso: "2026-06-19", dow: "THU", day: "19" },
  { iso: "2026-06-20", dow: "FRI", day: "20" },
];

/* ──────────────────────────────────────────────────────────────────────────
   Atoms
   ────────────────────────────────────────────────────────────────────────── */

// Visual zone — country flag glyph (brand assets, no token enforcement)
const Flag: React.FC<{ glyph: string; label: string }> = ({ glyph, label }) => (
  <span
    aria-label={label}
    role="img"
    style={{
      width: 28,
      height: 28,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      lineHeight: 1,
      borderRadius: "var(--radius-full)",
      background: "var(--color-surface-subtle)",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    {glyph}
  </span>
);

const StatusPill: React.FC<{ fixture: Fixture }> = ({ fixture }) => {
  if (fixture.status === "live") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-xs)",
          padding: "var(--space-xxs) var(--space-sm)",
          background: "var(--color-semantic-live-bg)",
          color: "var(--color-semantic-live)",
          borderRadius: "var(--radius-full)",
          fontSize: 11,
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

const TeamRow: React.FC<{
  team: Fixture["home"];
  score?: number;
  dim?: boolean;
}> = ({ team, score, dim }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-md)",
      paddingTop: "var(--space-xs)",
      paddingBottom: "var(--space-xs)",
    }}
  >
    <Flag glyph={team.flag} label={team.name} />
    <span
      style={{
        flex: 1,
        fontSize: 15,
        fontWeight: 600,
        color: dim ? "var(--color-text-secondary)" : "var(--color-text-primary)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {team.name}
    </span>
    {typeof score === "number" && (
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: -0.4,
          color: dim ? "var(--color-text-secondary)" : "var(--color-text-primary)",
          fontVariantNumeric: "tabular-nums",
          minWidth: 24,
          textAlign: "right",
        }}
      >
        {score}
      </span>
    )}
  </div>
);

const MetaIcon: React.FC<{ d: string }> = ({ d }) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const ChevronRight: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
   FixtureCard
   ────────────────────────────────────────────────────────────────────────── */
const FixtureCard: React.FC<{ fixture: Fixture; onOpen: (id: string) => void }> = ({
  fixture,
  onOpen,
}) => {
  const showScore = fixture.status === "live" || fixture.status === "completed";
  const winnerHome =
    fixture.status === "completed" &&
    fixture.score &&
    fixture.score.home > fixture.score.away;
  const winnerAway =
    fixture.status === "completed" &&
    fixture.score &&
    fixture.score.away > fixture.score.home;

  return (
    <button
      onClick={() => onOpen(fixture.id)}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "block",
        width: "100%",
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-lg)",
        boxShadow: "var(--shadow-xs)",
        boxSizing: "border-box",
      }}
    >
      {/* header row: group/match · status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-sm)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            color: "var(--color-text-tertiary)",
            textTransform: "uppercase",
          }}
        >
          {fixture.group ?? fixture.stage} · Match {fixture.matchNo}
        </span>
        <StatusPill fixture={fixture} />
      </div>

      {/* teams */}
      <div>
        <TeamRow
          team={fixture.home}
          score={showScore ? fixture.score?.home : undefined}
          dim={fixture.status === "completed" && !winnerHome && !!winnerAway}
        />
        <TeamRow
          team={fixture.away}
          score={showScore ? fixture.score?.away : undefined}
          dim={fixture.status === "completed" && !winnerAway && !!winnerHome}
        />
      </div>

      {/* footer: meta + view details */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
          marginTop: "var(--space-md)",
          paddingTop: "var(--space-md)",
          borderTop: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-secondary)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-xs)",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <MetaIcon d="M12 7v5l3 2 M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
          {fixture.kickoff}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-xs)",
            fontSize: 12,
            fontWeight: 500,
            flex: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <MetaIcon d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          {fixture.stadium}, {fixture.city}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-xxs)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          Details
          <ChevronRight />
        </span>
      </div>
    </button>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Filters
   ────────────────────────────────────────────────────────────────────────── */
const StageChips: React.FC<{
  value: string;
  onChange: (v: any) => void;
}> = ({ value, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: "var(--space-sm)",
      overflowX: "auto",
      padding: "var(--space-md) var(--space-lg)",
      scrollbarWidth: "none",
    }}
  >
    {stageFilters.map((s) => {
      const active = s === value;
      return (
        <button
          key={s}
          onClick={() => onChange(s)}
          style={{
            all: "unset",
            cursor: "pointer",
            padding: "var(--space-sm) var(--space-lg)",
            borderRadius: "var(--radius-full)",
            background: active
              ? "var(--color-surface-inverse)"
              : "var(--color-surface-subtle)",
            color: active
              ? "var(--color-text-on-inverse)"
              : "var(--color-text-primary)",
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {s}
        </button>
      );
    })}
  </div>
);

const DateScroller: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: "var(--space-sm)",
      overflowX: "auto",
      padding: "var(--space-xs) var(--space-lg) var(--space-lg)",
      scrollbarWidth: "none",
    }}
  >
    {dates.map((d) => {
      const active = d.iso === value;
      return (
        <button
          key={d.iso}
          onClick={() => onChange(d.iso)}
          style={{
            all: "unset",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 64,
            borderRadius: "var(--radius-md)",
            background: active
              ? "var(--color-brand-primary)"
              : "var(--color-surface-canvas)",
            border: active
              ? "1px solid var(--color-brand-primary)"
              : "1px solid var(--color-border-subtle)",
            color: active
              ? "var(--color-brand-on-primary)"
              : "var(--color-text-primary)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.6,
              opacity: 0.7,
            }}
          >
            {d.dow}
          </span>
          <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>
            {d.day}
          </span>
        </button>
      );
    })}
  </div>
);

/* ──────────────────────────────────────────────────────────────────────────
   Header (sticky)
   ────────────────────────────────────────────────────────────────────────── */
const Header: React.FC = () => (
  <header
    style={{
      background: "var(--color-surface-canvas)",
      borderBottom: "1px solid var(--color-border-subtle)",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}
  >
    {/* Visual zone: tournament brand strip */}
    <div
      aria-label="FIFA World Cup 2026"
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
        justifyContent: "space-between",
        padding: "var(--space-lg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        {/* Visual zone: tournament mark */}
        <div
          aria-hidden
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-sm)",
            background:
              "linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)",
            color: "#FEEE00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: -0.3,
          }}
        >
          26
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.6,
              color: "var(--color-text-tertiary)",
              textTransform: "uppercase",
            }}
          >
            FIFA World Cup
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: -0.2,
              color: "var(--color-text-primary)",
            }}
          >
            Fixtures
          </span>
        </div>
      </div>
      <button
        aria-label="Search"
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
        }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={11} cy={11} r={7} />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </div>
  </header>
);

/* ──────────────────────────────────────────────────────────────────────────
   Section header
   ────────────────────────────────────────────────────────────────────────── */
const SectionHeader: React.FC<{ title: string; count: number; live?: boolean }> = ({
  title,
  count,
  live,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--space-lg) var(--space-lg) var(--space-sm)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
      {live && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "var(--radius-full)",
            background: "var(--color-semantic-live)",
            animation: "fdsPulse 1.4s ease-in-out infinite",
          }}
        />
      )}
      <h2
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0.2,
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h2>
    </div>
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "var(--color-text-tertiary)",
      }}
    >
      {count} {count === 1 ? "match" : "matches"}
    </span>
  </div>
);

/* ──────────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────────── */
type TabId = "fixtures" | "table" | "predict";

const TopTabs: React.FC<{ value: TabId; onChange: (v: TabId) => void }> = ({
  value,
  onChange,
}) => {
  const tabs: { id: TabId; label: string }[] = [
    { id: "fixtures", label: "Fixtures" },
    { id: "table", label: "Table" },
    { id: "predict", label: "Predict" },
  ];
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: "var(--space-2xl)",
        padding: "0 var(--space-lg)",
        borderBottom: "1px solid var(--color-border-subtle)",
        background: "var(--color-surface-canvas)",
      }}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "var(--space-md) 0",
              fontSize: 14,
              fontWeight: 700,
              color: active
                ? "var(--color-text-primary)"
                : "var(--color-text-tertiary)",
              borderBottom: active
                ? "2px solid var(--color-text-primary)"
                : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

type DetailRoute =
  | { type: "match"; id: string }
  | { type: "team"; short: string }
  | null;

const FifaFixtures: React.FC = () => {
  const [view, setView] = useState<TabId>("fixtures");
  const [stage, setStage] = useState<string>("All");
  const [date, setDate] = useState<string>("2026-06-15");
  const [detail, setDetail] = useState<DetailRoute>(null);

  const filtered = useMemo(() => {
    return fixtures.filter((f) => {
      const stageOk = stage === "All" || f.stage === stage;
      const dateOk = f.date === date;
      return stageOk && dateOk;
    });
  }, [stage, date]);

  const live = filtered.filter((f) => f.status === "live");
  const upcoming = filtered.filter((f) => f.status === "upcoming");
  const completed = filtered.filter((f) => f.status === "completed");

  const onOpen = (id: string) => setDetail({ type: "match", id });
  const onOpenTeam = (short: string) => setDetail({ type: "team", short });
  const onBack = () => setDetail(null);

  return (
    <div
      style={{
        ...fieldDsTokens,
        minHeight: "100vh",
        background: "var(--color-surface-subtle)",
        fontFamily: "var(--font-stack)",
        color: "var(--color-text-primary)",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        @keyframes fdsPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Mobile frame */}
      <div
        style={{
          maxWidth: 414,
          margin: "0 auto",
          background: "var(--color-surface-canvas)",
          minHeight: "100vh",
          paddingBottom: "var(--space-3xl)",
        }}
      >
        {detail?.type === "match" && (() => {
          const f = fixtures.find((x) => x.id === detail.id);
          return f ? <MatchDetail fixture={f} onBack={onBack} /> : null;
        })()}

        {detail?.type === "team" && (
          <TeamDetail
            short={detail.short}
            onBack={onBack}
            onOpenFixture={(id) => setDetail({ type: "match", id })}
          />
        )}

        {!detail && (
          <>
            <Header />
            <TopTabs value={view} onChange={setView} />

            {view === "table" && <PointsTable onOpenTeam={onOpenTeam} />}

            {view === "predict" && <Predict />}

            {view === "fixtures" && (
              <>
                <StageChips value={stage} onChange={setStage} />
                <DateScroller value={date} onChange={setDate} />

                {filtered.length === 0 && (
                  <div
                    style={{
                      padding: "var(--space-3xl) var(--space-lg)",
                      textAlign: "center",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      No matches scheduled
                    </div>
                    <div style={{ fontSize: 13 }}>
                      Try a different date or stage filter.
                    </div>
                  </div>
                )}

                {live.length > 0 && (
                  <>
                    <SectionHeader title="Live now" count={live.length} live />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-md)",
                        padding: "0 var(--space-lg)",
                      }}
                    >
                      {live.map((f) => (
                        <FixtureCard key={f.id} fixture={f} onOpen={onOpen} />
                      ))}
                    </div>
                  </>
                )}

                {upcoming.length > 0 && (
                  <>
                    <SectionHeader title="Upcoming" count={upcoming.length} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-md)",
                        padding: "0 var(--space-lg)",
                      }}
                    >
                      {upcoming.map((f) => (
                        <FixtureCard key={f.id} fixture={f} onOpen={onOpen} />
                      ))}
                    </div>
                  </>
                )}

                {completed.length > 0 && (
                  <>
                    <SectionHeader title="Completed" count={completed.length} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-md)",
                        padding: "0 var(--space-lg)",
                      }}
                    >
                      {completed.map((f) => (
                        <FixtureCard key={f.id} fixture={f} onOpen={onOpen} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FifaFixtures;
