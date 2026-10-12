import { useState, type CSSProperties, type ReactNode } from 'react';
import { colour, space, radius, type, font, SITE_WIDTH, SITE_GUTTER, EASE } from './_shared';
import { RegistryHeroArt, HERO_ART_H } from './RegistryHeroArt';
import { CalendarIcon, PinIcon, ChevronIcon, LinkIcon, CheckIcon } from './icons';

export interface RegistryHeroProps {
  /** Occasion title, e.g. "Prasanna's Birthday". */
  title: string;
  /** Formatted occasion date, e.g. "14th June". */
  occasionDate?: string;
  /** Countdown label, e.g. "20 days to go!". */
  countdown?: string;
  /** Name shown in the "Delivering to" pill. */
  deliveryTo?: string;
  /** Host's display name, used for the avatar initial and the sub-line. */
  hostName?: string;
  /** How many gifters have already bought from this list. */
  giftedCount?: number;
  /** Total items on the list. */
  itemCount?: number;
  /**
   * Post-checkout tracker card. Rendered in a light card that overlaps the
   * bottom of the band, mirroring where the mobile hero reveals it.
   */
  statusSlot?: ReactNode;
  onChangeAddress?: () => void;
  /** Copy-link affordance; the hero handles its own "Copied" feedback. */
  shareUrl?: string;
}

/**
 * Gifter flow · dWeb registry hero.
 *
 * A full-bleed occasion band (the art bleeds edge to edge, the content sits in
 * the 1440px site container) carrying the title, date + countdown, the host, and
 * the "Delivering to <name>" control. This is the desktop counterpart of
 * ../PageHeaderHero.tsx `variant="gifter"` — same information, but laid out
 * horizontally with the copy left and the registry facts right, instead of the
 * mobile centre-stacked column.
 */
export function RegistryHero({
  title,
  occasionDate,
  countdown,
  deliveryTo,
  hostName,
  giftedCount,
  itemCount,
  statusSlot,
  onChangeAddress,
  shareUrl,
}: RegistryHeroProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    // navigator.clipboard needs a secure context; fall through silently to the
    // "Copied" affordance either way so the prototype always demos.
    if (shareUrl) void navigator.clipboard?.writeText(shareUrl).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section style={band} aria-label={title}>
      {/* Full-bleed backdrop */}
      <div style={artLayer}>
        <RegistryHeroArt />
      </div>

      <div style={inner}>
        <div style={copyCol}>
          {/* Host line */}
          {hostName && (
            <div style={hostRow}>
              <span style={avatar}>{hostName.trim().charAt(0).toUpperCase()}</span>
              <span style={{ ...type.b14, color: 'rgba(16,22,40,0.72)' }}>
                {hostName}&rsquo;s gift list
              </span>
            </div>
          )}

          <h1 style={titleStyle}>{title}</h1>

          {(occasionDate || countdown) && (
            <div style={dateRow}>
              <CalendarIcon size={20} color={colour['text-n-icon'].primary} />
              {occasionDate && (
                <span style={{ ...type.b16, color: colour['text-n-icon'].primary }}>{occasionDate}</span>
              )}
              {occasionDate && countdown && <span style={dot} />}
              {countdown && (
                <span
                  style={{ ...type.b16, fontFamily: font.bold, fontWeight: 700, color: colour['text-n-icon'].primary }}
                >
                  {countdown}
                </span>
              )}
            </div>
          )}

          <div style={actionRow}>
            {/* Delivering-to pill — the frosted-glass treatment from the mobile hero. */}
            <button type="button" onClick={onChangeAddress} style={glassPill}>
              <span style={pillIcon}>
                <PinIcon size={18} color={colour['text-n-icon'].primary} />
              </span>
              <span style={{ ...type.b14, color: colour['text-n-icon'].primary }}>Delivering to</span>
              <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{deliveryTo}</span>
              <ChevronIcon size={18} color={colour['text-n-icon'].primary} />
            </button>

            <button type="button" onClick={copyLink} style={{ ...glassPill, paddingInline: space[16] }}>
              {copied ? (
                <CheckIcon size={18} color={colour['text-n-icon'].success_bold} />
              ) : (
                <LinkIcon size={18} color={colour['text-n-icon'].primary} />
              )}
              <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>
                {copied ? 'Link copied' : 'Copy list link'}
              </span>
            </button>
          </div>
        </div>

        {/* Registry facts — the desktop hero has room the mobile one doesn't. */}
        <div style={factsCol}>
          {itemCount != null && <Fact value={String(itemCount)} label={itemCount === 1 ? 'gift on the list' : 'gifts on the list'} />}
          {giftedCount != null && <Fact value={String(giftedCount)} label={giftedCount === 1 ? 'already gifted' : 'already gifted'} />}
        </div>
      </div>

      {/* Post-checkout tracker, overlapping the band's lower edge. */}
      {statusSlot && (
        <div style={statusWrap}>
          <div style={statusCard}>{statusSlot}</div>
        </div>
      )}
    </section>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div style={factCard}>
      <span style={{ ...type.h24, color: colour['text-n-icon'].primary }}>{value}</span>
      <span style={{ ...type.b13, color: 'rgba(16,22,40,0.66)', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const band: CSSProperties = {
  position: 'relative',
  width: '100%',
  // Matches RegistryHeroArt's viewBox height, so `slice` has nothing to crop at
  // 1440 and the 3D props sit exactly where they were composed.
  minHeight: HERO_ART_H,
  display: 'flex',
  justifyContent: 'center',
  // Square-edged full bleed, like noon's own category banners. The mobile hero
  // rounds its bottom corners because it floats on the page background; here the
  // band *is* the page width, and rounding would cut grey wedges out of it.
  overflow: 'visible',
  isolation: 'isolate',
};

const artLayer: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  zIndex: 0,
};

const inner: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  paddingBlock: space[40],
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[32],
  flexWrap: 'wrap',
};

const copyCol: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[12],
  // Keeps the title clear of the party hat on the right at 1024–1280.
  maxWidth: 620,
};

const hostRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
};

const avatar: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: radius.rounded,
  backgroundColor: 'rgba(255,255,255,0.72)',
  border: '1px solid rgba(255,255,255,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...type.b12Semi,
  color: colour['text-n-icon'].primary,
};

const titleStyle: CSSProperties = {
  margin: 0,
  ...type.h40,
  color: colour['text-n-icon'].primary,
};

const dateRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
};

const dot: CSSProperties = {
  width: 4,
  height: 4,
  borderRadius: radius.rounded,
  backgroundColor: 'rgba(16,22,40,0.45)',
};

const actionRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[10],
  flexWrap: 'wrap',
  marginTop: space[8],
};

/** Frosted-glass control, matching the mobile hero's address pill. */
const glassPill: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  height: 44,
  paddingInline: space[8],
  paddingInlineEnd: space[14],
  borderRadius: radius.rounded,
  border: '1px solid rgba(255,255,255,0.55)',
  backgroundColor: 'rgba(255,255,255,0.34)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  cursor: 'pointer',
  transition: `background-color 160ms ${EASE}`,
  boxSizing: 'border-box',
};

const pillIcon: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: radius.rounded,
  backgroundColor: 'rgba(255,255,255,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const factsCol: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
};

const factCard: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[2],
  minWidth: 132,
  padding: space[16],
  borderRadius: radius[16],
  border: '1px solid rgba(255,255,255,0.55)',
  backgroundColor: 'rgba(255,255,255,0.34)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxSizing: 'border-box',
};

const statusWrap: CSSProperties = {
  position: 'absolute',
  // Constrained to the site container so the card lines up with the facts above
  // it, and right-aligned so it never lands on the title or the pills.
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: SITE_WIDTH,
  // Overlaps the band's lower edge so the reveal reads as part of the hero.
  bottom: -28,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'flex-end',
  paddingInline: SITE_GUTTER,
  boxSizing: 'border-box',
  pointerEvents: 'none',
};

const statusCard: CSSProperties = {
  width: '100%',
  maxWidth: 480,
  pointerEvents: 'auto',
  borderRadius: radius[16],
  backgroundColor: colour.surface.primary,
  boxShadow: '0 12px 32px rgba(16, 22, 40, 0.18)',
  overflow: 'hidden',
};
