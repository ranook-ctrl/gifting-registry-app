import React, { useEffect, useMemo, useState } from "react";
import { fixtures, type Fixture } from "./FifaFixtures";

const TODAY = "2026-06-14"; // demo "now"
const HORIZON_DAYS = 3;

const dateInWindow = (iso: string) => {
  const d = new Date(iso + "T00:00").getTime();
  const start = new Date(TODAY + "T00:00").getTime();
  const end = start + HORIZON_DAYS * 86400000;
  return d >= start && d <= end;
};

type Outcome = "home" | "draw" | "away";
type Prediction = {
  outcome?: Outcome;
  homeScore?: number;
  awayScore?: number;
};
type PredictionsMap = Record<string, Prediction>;

const STORAGE_KEY = "fifa.predictions.v1";

const loadPredictions = (): PredictionsMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
const savePredictions = (p: PredictionsMap) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* noop */
  }
};

const inferOutcome = (h?: number, a?: number): Outcome | undefined => {
  if (typeof h !== "number" || typeof a !== "number") return undefined;
  if (h > a) return "home";
  if (h < a) return "away";
  return "draw";
};

/* ──────────────────────────────────────────────────────────────────────────
   Atoms
   ────────────────────────────────────────────────────────────────────────── */
const Flag: React.FC<{ glyph: string; label: string; size?: number }> = ({
  glyph,
  label,
  size = 28,
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
      fontSize: size - 6,
      lineHeight: 1,
      borderRadius: "var(--radius-full)",
      background: "var(--color-surface-subtle)",
      flexShrink: 0,
    }}
  >
    {glyph}
  </span>
);

const OutcomeChip: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}> = ({ active, onClick, label, sub }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    style={{
      all: "unset",
      cursor: "pointer",
      flex: 1,
      textAlign: "center",
      padding: "var(--space-md) var(--space-sm)",
      borderRadius: "var(--radius-sm)",
      background: active ? "var(--color-brand-primary)" : "var(--color-surface-subtle)",
      color: active ? "var(--color-brand-on-primary)" : "var(--color-text-primary)",
      border: active
        ? "1px solid var(--color-brand-primary)"
        : "1px solid var(--color-border-subtle)",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      alignItems: "center",
    }}
  >
    <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.2 }}>{label}</span>
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        opacity: active ? 0.75 : 0.6,
      }}
    >
      {sub}
    </span>
  </button>
);

const Stepper: React.FC<{
  value: number;
  onChange: (n: number) => void;
  ariaLabel: string;
}> = ({ value, onChange, ariaLabel }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      padding: "var(--space-xs) var(--space-sm)",
      background: "var(--color-surface-subtle)",
      borderRadius: "var(--radius-full)",
      border: "1px solid var(--color-border-subtle)",
    }}
    aria-label={ariaLabel}
  >
    <button
      onClick={() => onChange(Math.max(0, value - 1))}
      aria-label={`Decrease ${ariaLabel}`}
      style={{
        all: "unset",
        cursor: "pointer",
        width: 24,
        height: 24,
        borderRadius: "var(--radius-full)",
        background: "var(--color-surface-canvas)",
        color: "var(--color-text-primary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      −
    </button>
    <span
      style={{
        minWidth: 20,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 800,
        color: "var(--color-text-primary)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
    <button
      onClick={() => onChange(Math.min(15, value + 1))}
      aria-label={`Increase ${ariaLabel}`}
      style={{
        all: "unset",
        cursor: "pointer",
        width: 24,
        height: 24,
        borderRadius: "var(--radius-full)",
        background: "var(--color-surface-canvas)",
        color: "var(--color-text-primary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      +
    </button>
  </div>
);

const StatusBadge: React.FC<{ submitted: boolean; locked: boolean }> = ({
  submitted,
  locked,
}) => {
  if (locked) {
    return (
      <span
        style={{
          padding: "var(--space-xxs) var(--space-sm)",
          background: "var(--color-surface-subtle)",
          color: "var(--color-text-tertiary)",
          borderRadius: "var(--radius-full)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        LOCKED
      </span>
    );
  }
  if (submitted) {
    return (
      <span
        style={{
          padding: "var(--space-xxs) var(--space-sm)",
          background: "var(--color-semantic-success-bg)",
          color: "var(--color-semantic-success)",
          borderRadius: "var(--radius-full)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        SUBMITTED
      </span>
    );
  }
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
      OPEN
    </span>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Predict card
   ────────────────────────────────────────────────────────────────────────── */
const PredictCard: React.FC<{
  fixture: Fixture;
  prediction: Prediction;
  locked: boolean;
  onChange: (p: Prediction) => void;
  onSubmit: () => void;
}> = ({ fixture, prediction, locked, onChange, onSubmit }) => {
  const homeScore = prediction.homeScore ?? 0;
  const awayScore = prediction.awayScore ?? 0;
  const submitted =
    !!prediction.outcome &&
    typeof prediction.homeScore === "number" &&
    typeof prediction.awayScore === "number";

  const setOutcome = (o: Outcome) => {
    onChange({ ...prediction, outcome: o });
  };
  const setHome = (n: number) => {
    const next: Prediction = { ...prediction, homeScore: n };
    next.outcome = inferOutcome(n, awayScore) ?? next.outcome;
    onChange(next);
  };
  const setAway = (n: number) => {
    const next: Prediction = { ...prediction, awayScore: n };
    next.outcome = inferOutcome(homeScore, n) ?? next.outcome;
    onChange(next);
  };

  return (
    <div
      style={{
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-xs)",
        padding: "var(--space-lg)",
      }}
    >
      {/* head */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-md)",
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
        <StatusBadge submitted={submitted} locked={locked} />
      </div>

      {/* score row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "var(--space-sm)",
          marginBottom: "var(--space-lg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", minWidth: 0 }}>
          <Flag glyph={fixture.home.flag} label={fixture.home.name} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fixture.home.short}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <Stepper
            value={homeScore}
            onChange={(n) => !locked && setHome(n)}
            ariaLabel={`${fixture.home.name} score`}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-text-tertiary)",
            }}
          >
            :
          </span>
          <Stepper
            value={awayScore}
            onChange={(n) => !locked && setAway(n)}
            ariaLabel={`${fixture.away.name} score`}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            minWidth: 0,
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fixture.away.short}
          </span>
          <Flag glyph={fixture.away.flag} label={fixture.away.name} />
        </div>
      </div>

      {/* outcome chips */}
      <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
        <OutcomeChip
          label="1"
          sub={fixture.home.short}
          active={prediction.outcome === "home"}
          onClick={() => !locked && setOutcome("home")}
        />
        <OutcomeChip
          label="X"
          sub="Draw"
          active={prediction.outcome === "draw"}
          onClick={() => !locked && setOutcome("draw")}
        />
        <OutcomeChip
          label="2"
          sub={fixture.away.short}
          active={prediction.outcome === "away"}
          onClick={() => !locked && setOutcome("away")}
        />
      </div>

      {/* meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "var(--space-md)",
          borderTop: "1px solid var(--color-border-subtle)",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
          {new Date(fixture.date + "T00:00").toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}{" "}
          · {fixture.kickoff}
        </span>
        <button
          onClick={onSubmit}
          disabled={locked || !prediction.outcome}
          style={{
            all: "unset",
            cursor: locked || !prediction.outcome ? "not-allowed" : "pointer",
            padding: "var(--space-sm) var(--space-lg)",
            background:
              locked || !prediction.outcome
                ? "var(--color-surface-subtle)"
                : "var(--color-surface-inverse)",
            color:
              locked || !prediction.outcome
                ? "var(--color-text-tertiary)"
                : "var(--color-text-on-inverse)",
            borderRadius: "var(--radius-full)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {submitted ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Header summary
   ────────────────────────────────────────────────────────────────────────── */
const Summary: React.FC<{
  totalPredictable: number;
  submitted: number;
}> = ({ totalPredictable, submitted }) => (
  <section
    style={{
      margin: "var(--space-lg)",
      padding: "var(--space-lg)",
      background: "var(--color-surface-inverse)",
      color: "var(--color-text-on-inverse)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-sm)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.6,
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          Your predictions
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, marginTop: 2 }}>
          {submitted}/{totalPredictable}{" "}
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              opacity: 0.7,
              letterSpacing: 0,
            }}
          >
            submitted
          </span>
        </div>
      </div>
      <div
        style={{
          padding: "var(--space-sm) var(--space-md)",
          borderRadius: "var(--radius-full)",
          background: "var(--color-brand-primary)",
          color: "var(--color-brand-on-primary)",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.4,
        }}
      >
        NEXT 3 DAYS
      </div>
    </div>
    <div
      style={{
        marginTop: "var(--space-md)",
        height: 6,
        borderRadius: "var(--radius-full)",
        background: "rgba(255,255,255,0.12)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${totalPredictable === 0 ? 0 : (submitted / totalPredictable) * 100}%`,
          height: "100%",
          background: "var(--color-brand-primary)",
          transition: "width 200ms ease",
        }}
      />
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────────── */
const Predict: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionsMap>(() => loadPredictions());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    savePredictions(predictions);
  }, [predictions]);

  const predictable = useMemo(() => {
    return fixtures
      .filter((f) => dateInWindow(f.date))
      .sort((a, b) => (a.date + a.kickoff).localeCompare(b.date + b.kickoff));
  }, []);

  const submittedCount = predictable.filter((f) => {
    const p = predictions[f.id];
    return (
      p &&
      !!p.outcome &&
      typeof p.homeScore === "number" &&
      typeof p.awayScore === "number"
    );
  }).length;

  const grouped = useMemo(() => {
    const map: Record<string, Fixture[]> = {};
    for (const f of predictable) (map[f.date] ||= []).push(f);
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [predictable]);

  const onChangePrediction = (fixtureId: string, p: Prediction) => {
    setPredictions((prev) => ({ ...prev, [fixtureId]: p }));
  };
  const onSubmit = (fixtureId: string) => {
    const p = predictions[fixtureId] || {};
    const next: Prediction = {
      outcome: p.outcome,
      homeScore: typeof p.homeScore === "number" ? p.homeScore : 0,
      awayScore: typeof p.awayScore === "number" ? p.awayScore : 0,
    };
    setPredictions((prev) => ({ ...prev, [fixtureId]: next }));
    setToast("Prediction saved");
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <div style={{ paddingBottom: "var(--space-3xl)", position: "relative" }}>
      <Summary totalPredictable={predictable.length} submitted={submittedCount} />

      {predictable.length === 0 && (
        <div
          style={{
            padding: "var(--space-3xl) var(--space-lg)",
            textAlign: "center",
            color: "var(--color-text-secondary)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            No matches in the prediction window
          </div>
          <div style={{ fontSize: 13 }}>
            Predictions open up 3 days before each kickoff.
          </div>
        </div>
      )}

      {grouped.map(([date, dayFixtures]) => (
        <section key={date} style={{ marginBottom: "var(--space-md)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-md) var(--space-lg) var(--space-sm)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: "var(--color-text-primary)",
                textTransform: "uppercase",
              }}
            >
              {new Date(date + "T00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: "var(--color-text-tertiary)",
                textTransform: "uppercase",
              }}
            >
              {dayFixtures.length} {dayFixtures.length === 1 ? "match" : "matches"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
              padding: "0 var(--space-lg)",
            }}
          >
            {dayFixtures.map((f) => (
              <PredictCard
                key={f.id}
                fixture={f}
                prediction={predictions[f.id] || {}}
                locked={f.status !== "upcoming"}
                onChange={(p) => onChangePrediction(f.id, p)}
                onSubmit={() => onSubmit(f.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "var(--space-2xl)",
            padding: "var(--space-md) var(--space-lg)",
            background: "var(--color-surface-inverse)",
            color: "var(--color-text-on-inverse)",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-md)",
            fontSize: 13,
            fontWeight: 600,
            zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default Predict;
