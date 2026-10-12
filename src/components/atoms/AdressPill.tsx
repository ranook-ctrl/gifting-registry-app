import React from 'react';
import { colors, font } from './_shared';
import { LocationBaseIcon, ChevronBottomBoldIcon } from './icons';
import { palette } from '../../field-ds/tokens';

// Glass fill: white → grey/200, both at 40% (Figma tokens
// `--neutral/white` = rgba(255,255,255,0.4), `--grey/200` = rgba(242,243,247,0.4)).
// The pill floats over imagery, so the translucency is intentional.
const hexToRgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const GLASS = `linear-gradient(180deg, ${hexToRgba(palette.neutral.white, 0.4)} 0%, ${hexToRgba(
  palette.grey[200],
  0.4,
)} 100%)`;

export interface AdressPillProps {
  /** Bold recipient name after the prefix. */
  name?: string;
  /** Leading regular-weight copy. */
  prefix?: string;
  /**
   * 0 → full pill; 1 → text collapsed right-to-left leaving just the icon circle.
   * Values in between animate the collapse (scroll-linked).
   */
  collapse?: number;
  onPress?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * "Adress Pill" (Figma name kept verbatim) — a floating delivery-address pill:
 * translucent white→grey glass fill, soft shadow, a location glyph in a matching
 * glass circle, and a "Delivering to <name>" label with a chevron.
 */
export function AdressPill({
  name = 'Prasanna',
  prefix = 'Delivering to',
  collapse = 0,
  onPress,
  style,
  className,
}: AdressPillProps) {
  const interactive = !!onPress;
  const c = Math.min(1, Math.max(0, collapse));
  // As it compresses, the translucent glass morphs into the solid-white icon
  // button of the minimised state (Figma 7267:166945). The outer pill fill ramps
  // to opaque white; the inner icon circle's own glass/border/shadow fade out so
  // only the location glyph sits on the white circle.
  const gnum = parseInt(palette.grey[200].slice(1), 16);
  const gR = (gnum >> 16) & 255, gG = (gnum >> 8) & 255, gB = gnum & 255;
  const a = 0.4 + 0.6 * c; // fill opacity 0.4 → 1
  const bR = Math.round(gR + (255 - gR) * c);
  const bG = Math.round(gG + (255 - gG) * c);
  const bB = Math.round(gB + (255 - gB) * c);
  const pillFill = `linear-gradient(180deg, rgba(255,255,255,${a}) 0%, rgba(${bR},${bG},${bB},${a}) 100%)`;
  const icoFade = 1 - c;
  const iconCircleStyle: React.CSSProperties = {
    ...iconCircle,
    background: `linear-gradient(180deg, rgba(255,255,255,${0.4 * icoFade}) 0%, rgba(${gR},${gG},${gB},${0.4 * icoFade}) 100%)`,
    border: `${0.769 * icoFade}px solid #FFFFFF`,
    boxShadow: `0px 6px 32px 0px rgba(0, 0, 0, ${0.08 * icoFade})`,
  };
  return (
    <div
      role={interactive ? 'button' : undefined}
      onClick={onPress}
      className={className}
      style={{
        ...pill,
        cursor: interactive ? 'pointer' : 'default',
        // Collapse to a symmetric circle around the icon as the text disappears.
        gap: 6 * (1 - c),
        paddingInlineEnd: 4 + 8 * (1 - c),
        background: pillFill,
        ...style,
      }}
    >
      <div style={iconCircleStyle}>
        <LocationBaseIcon size={16} />
      </div>
      {/* Text collapses right-to-left: max-width shrinks to 0 clipping from the
          right, so "Delivering to <name> ⌄" wipes away and only the icon stays. */}
      <div style={{ ...textRow, maxWidth: `${(1 - c) * 240}px`, opacity: 1 - c, overflow: 'hidden' }}>
        <span style={label}>{prefix}</span>
        <span style={nameStyle}>{name}</span>
        <ChevronBottomBoldIcon size={14} />
      </div>
    </div>
  );
}

const SHADOW = '0px 6px 32px 0px rgba(0, 0, 0, 0.08)';
const HAIRLINE = '0.769px solid #FFFFFF';

const pill: React.CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingBlock: 4,
  paddingInlineStart: 4,
  paddingInlineEnd: 12,
  borderRadius: 40,
  border: HAIRLINE,
  background: GLASS,
  boxShadow: SHADOW,
  boxSizing: 'border-box',
  userSelect: 'none',
  width: 'fit-content',
};

const iconCircle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
  borderRadius: 40,
  border: HAIRLINE,
  background: GLASS,
  boxShadow: SHADOW,
  flexShrink: 0,
  boxSizing: 'border-box',
};

const textRow: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
};

const b13: React.CSSProperties = {
  fontSize: 13,
  lineHeight: '20px',
  letterSpacing: -0.1,
  color: colors.text.primary,
  whiteSpace: 'nowrap',
};
const label: React.CSSProperties = { ...b13, fontFamily: font.regular, fontWeight: 400 };
const nameStyle: React.CSSProperties = { ...b13, fontFamily: font.semibold, fontWeight: 600 };
