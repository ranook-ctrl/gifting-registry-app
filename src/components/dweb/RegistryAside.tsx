import type { CSSProperties } from 'react';
import { colour, space, radius, type, font, ASIDE_W, CHROME_H, DIRHAM } from './_shared';
import { GiftIcon, ShieldIcon, TruckIcon, CheckIcon } from './icons';

/** Availability facets — the gifter's primary question is "can I still buy this?". */
export type AvailabilityFilter = 'all' | 'available' | 'gifted';

export interface PriceBand {
  id: string;
  label: string;
  /** Inclusive lower bound. */
  min: number;
  /** Exclusive upper bound; omit for "and above". */
  max?: number;
}

export const PRICE_BANDS: PriceBand[] = [
  { id: 'u100', label: `Under ${DIRHAM} 100`, min: 0, max: 100 },
  { id: '100-500', label: `${DIRHAM} 100 – ${DIRHAM} 500`, min: 100, max: 500 },
  { id: '500-1000', label: `${DIRHAM} 500 – ${DIRHAM} 1,000`, min: 500, max: 1000 },
  { id: '1000+', label: `${DIRHAM} 1,000 & above`, min: 1000 },
];

export interface RegistryAsideProps {
  hostName: string;
  /** Where the gifts are shipping — the registry address, masked. */
  deliveryHint?: string;
  itemCount: number;
  giftedCount: number;
  availability: AvailabilityFilter;
  onChangeAvailability: (next: AvailabilityFilter) => void;
  /** Selected price band ids. */
  priceBands: string[];
  onTogglePriceBand: (id: string) => void;
  onClearFilters?: () => void;
}

/**
 * Gifter flow · dWeb left rail.
 *
 * Sized to noon's PLP sidebar (250px) and sticky under the 104px chrome. It
 * carries the two things a gifter filters on — availability and budget — plus a
 * short "how gifting works" note. The mobile flow has no equivalent: on a phone
 * the registry facts live in the hero and there's no room for a persistent rail.
 */
export function RegistryAside({
  hostName,
  deliveryHint,
  itemCount,
  giftedCount,
  availability,
  onChangeAvailability,
  priceBands,
  onTogglePriceBand,
  onClearFilters,
}: RegistryAsideProps) {
  const remaining = itemCount - giftedCount;
  const hasFilters = availability !== 'all' || priceBands.length > 0;

  return (
    <aside style={root} aria-label="Registry details and filters">
      {/* ---------- Progress ---------- */}
      <section style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space[8] }}>
          <GiftIcon size={20} color={colour['text-n-icon'].action} />
          <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>Gift list progress</span>
        </div>

        <div style={progressTrack}>
          <div
            style={{
              ...progressFill,
              width: itemCount > 0 ? `${Math.round((giftedCount / itemCount) * 100)}%` : '0%',
            }}
          />
        </div>

        <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>
          <strong style={{ fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon'].primary }}>
            {giftedCount} of {itemCount}
          </strong>{' '}
          gifted &middot; {remaining} still available
        </span>
      </section>

      {/* ---------- Availability ---------- */}
      <FilterGroup title="Availability">
        {(
          [
            { id: 'all', label: 'All gifts' },
            { id: 'available', label: 'Still available' },
            { id: 'gifted', label: 'Already gifted' },
          ] as { id: AvailabilityFilter; label: string }[]
        ).map((opt) => (
          <label key={opt.id} style={row}>
            <span style={{ ...radioOuter, borderColor: availability === opt.id ? colour.border['action-bold'] : colour.border.medium }}>
              {availability === opt.id && <span style={radioInner} />}
            </span>
            <input
              type="radio"
              name="availability"
              checked={availability === opt.id}
              onChange={() => onChangeAvailability(opt.id)}
              style={srOnly}
            />
            <span style={{ ...type.b14, color: colour['text-n-icon'].primary }}>{opt.label}</span>
          </label>
        ))}
      </FilterGroup>

      {/* ---------- Price ---------- */}
      <FilterGroup title="Budget">
        {PRICE_BANDS.map((band) => {
          const on = priceBands.includes(band.id);
          return (
            <label key={band.id} style={row}>
              <span
                style={{
                  ...checkbox,
                  backgroundColor: on ? colour.surface['action-extrabold'] : colour.surface.primary,
                  borderColor: on ? colour.border['action-bold'] : colour.border.medium,
                }}
              >
                {on && <CheckIcon size={14} color={colour['text-n-icon']['on-surface-bold']} />}
              </span>
              <input type="checkbox" checked={on} onChange={() => onTogglePriceBand(band.id)} style={srOnly} />
              <span style={{ ...type.b14, color: colour['text-n-icon'].primary }}>{band.label}</span>
            </label>
          );
        })}
      </FilterGroup>

      {hasFilters && (
        <button type="button" onClick={onClearFilters} style={clearBtn}>
          Clear all filters
        </button>
      )}

      {/* ---------- Reassurance ---------- */}
      <section style={{ ...card, gap: space[12] }}>
        <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>How gifting works</span>

        <Note icon={<TruckIcon size={18} color={colour['text-n-icon'].secondary} />}>
          Gifts ship straight to {hostName}
          {deliveryHint ? ` — ${deliveryHint}` : ''}.
        </Note>
        <Note icon={<ShieldIcon size={18} color={colour['text-n-icon'].action} />}>
          Their full address stays private. You only pay and pick the date.
        </Note>
        <Note icon={<CheckIcon size={18} color={colour['text-n-icon'].success} />}>
          Anything already gifted is marked, so nobody doubles up.
        </Note>
      </section>
    </aside>
  );
}

/* ------------------------------------------------------------------- pieces */

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={group}>
      <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{title}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[10] }}>{children}</div>
    </section>
  );
}

function Note({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: space[8] }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const root: CSSProperties = {
  width: ASIDE_W,
  flexShrink: 0,
  position: 'sticky',
  // Clears the sticky masthead + category nav.
  top: CHROME_H + 16,
  alignSelf: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
};

const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[10],
  padding: space[16],
  borderRadius: radius[12],
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  boxSizing: 'border-box',
};

const group: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  paddingBottom: space[16],
  borderBottom: `1px solid ${colour.border.primary}`,
};

const progressTrack: CSSProperties = {
  width: '100%',
  height: 6,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.tertiary,
  overflow: 'hidden',
};

const progressFill: CSSProperties = {
  height: '100%',
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['success-bold'],
};

const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  cursor: 'pointer',
};

const radioOuter: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: radius.rounded,
  border: '1.5px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
};

const radioInner: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['action-extrabold'],
};

const checkbox: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: radius[4],
  border: '1.5px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
};

/** Visually hidden but still focusable, so the real input drives the label. */
const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: 'none',
};

const clearBtn: CSSProperties = {
  alignSelf: 'flex-start',
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  ...type.b14Semi,
  color: colour['text-n-icon'].action,
};
