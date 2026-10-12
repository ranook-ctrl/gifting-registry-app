import React from 'react';
import { colors, radius, type, font, PRODUCT } from './_shared';

const AIRPODS = `${PRODUCT}/airpods.jpg`;

export type FloatingCartVariant = 'Default' | 'Single Item';

/**
 * "Floating Cart" — the blue "View Gift Bag" pill. `Default` stacks three
 * product thumbnails with a count; `Single Item` shows one thumbnail.
 */
export function FloatingCart({
  variant = 'Default',
  count,
  images,
}: {
  variant?: FloatingCartVariant;
  count?: number;
  images?: string[];
}) {
  const single = variant === 'Single Item';
  const thumbs = images ?? (single ? [AIRPODS] : [AIRPODS, AIRPODS, AIRPODS]);
  const n = count ?? (single ? 1 : 5);

  return (
    <div style={pill}>
      <style>{THUMB_KEYFRAMES}</style>
      <div style={stack}>
        {thumbs.map((src, i) => (
          <div
            key={i}
            style={{
              ...thumb,
              ...(single ? null : thumbRing),
              ...(i > 0 ? { marginLeft: -16 } : null),
              // Earlier thumbs paint on top so each newly added circle emerges
              // from *behind* the one above it as it slides into place.
              zIndex: thumbs.length - i,
              animation: 'fc-thumb-in 380ms cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          </div>
        ))}
      </div>
      <div style={labels}>
        <span style={titleStyle}>View Gift Bag</span>
        <span style={countStyle}>
          {n} {n === 1 ? 'item' : 'items'}
        </span>
      </div>
    </div>
  );
}

// A newly added thumbnail starts tucked left (fully behind the circle above it)
// and slides right into its resting overlap, fading in — a smooth reveal rather
// than an abrupt pop. React keys by index, so only the appended circle animates.
const THUMB_KEYFRAMES = `
@keyframes fc-thumb-in {
  0% { transform: translateX(-22px) scale(0.85); opacity: 0; }
  60% { opacity: 1; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}
`;

const pill: React.CSSProperties = {
  alignSelf: 'flex-start',
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  height: 48,
  paddingLeft: 8,
  paddingRight: 20,
  paddingTop: 5,
  paddingBottom: 5,
  borderRadius: radius[32],
  backgroundColor: colors.surface.actionExtrabold,
  border: '1px solid rgba(255,255,255,0.24)',
  boxSizing: 'border-box',
};
const stack: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center' };
const thumb: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: colors.surface.tertiary,
  overflow: 'hidden',
  boxSizing: 'border-box',
  flexShrink: 0,
};
const thumbRing: React.CSSProperties = { border: '2px solid #0F5FF9' };
const labels: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 };
const titleStyle: React.CSSProperties = { ...type.h16Bold, fontFamily: font.medium, fontWeight: 500, color: colors.text.onSurfaceBold };
const countStyle: React.CSSProperties = { ...type.b12Regular, color: 'rgba(255,255,255,0.80)' };
