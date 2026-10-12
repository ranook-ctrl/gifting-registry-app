// Shared primitives for the dWeb (desktop web) port of the Gifting Registry.
//
// The mobile screens in ../ are laid out against a fixed 375pt canvas. Desktop
// can't reuse that, so this folder rebuilds the *layout* while keeping the same
// Field DS tokens and Noontree type ramp — the two views should read as the same
// product, not two products.
//
// Measurements below are transcribed from noon.com's live desktop web (measured
// at a 1440px viewport) so the registry drops into real noon chrome unchanged.

import { colour, space, radius } from '../../field-ds';

export { colour, space, radius };

/* ------------------------------------------------------------------- layout */

/** noon's `.siteWidthContainer` max-width. */
export const SITE_WIDTH = 1440;
/** Horizontal gutter inside the site container (1440 → 1390 inner). */
export const SITE_GUTTER = 24;
/** Yellow masthead height. */
export const HEADER_H = 60;
/** Category nav strip height, directly under the masthead. */
export const NAV_H = 44;
/** Combined sticky chrome height — what sticky content must offset by. */
export const CHROME_H = HEADER_H + NAV_H;
/** Left filter rail width on noon PLPs. */
export const ASIDE_W = 250;
/** Gap between the rail and the grid, and between grid cells. */
export const GRID_GAP = 20;

/* --------------------------------------------------------------------- type */

export const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const fam = (f: string) => `${f}, ${SANS}`;

/** Noontree carries weight in the face name; pair both so the sans fallback matches. */
export const font = {
  regular: fam('Noontree-Regular'),
  medium: fam('Noontree-Medium'),
  semibold: fam('Noontree-SemiBold'),
  bold: fam('Noontree-Bold'),
  extrabold: fam('Noontree-ExtraBold'),
} as const;

/**
 * Desktop type ramp. Sizes step up from the mobile ramp in ../atoms/_shared.ts
 * (a 12px product title is unreadable at desktop viewing distance) while keeping
 * the same Noontree cuts and negative tracking.
 */
export const type = {
  /** Hero occasion title. */
  h40: { fontFamily: font.bold, fontWeight: 700, fontSize: 40, lineHeight: '48px', letterSpacing: -0.5 },
  /** Section headings ("Gifts on the list"). */
  h24: { fontFamily: font.bold, fontWeight: 700, fontSize: 24, lineHeight: '32px', letterSpacing: -0.25 },
  h20: { fontFamily: font.bold, fontWeight: 700, fontSize: 20, lineHeight: '28px', letterSpacing: -0.25 },
  h18: { fontFamily: font.bold, fontWeight: 700, fontSize: 18, lineHeight: '24px', letterSpacing: -0.15 },
  h16: { fontFamily: font.bold, fontWeight: 700, fontSize: 16, lineHeight: '22px', letterSpacing: -0.15 },
  /** noon's nav / utility label — 15px semibold. */
  nav: { fontFamily: font.semibold, fontWeight: 600, fontSize: 15, lineHeight: '20px', letterSpacing: -0.1 },
  b16: { fontFamily: font.medium, fontWeight: 500, fontSize: 16, lineHeight: '22px', letterSpacing: -0.15 },
  b14: { fontFamily: font.medium, fontWeight: 500, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 },
  b14Reg: { fontFamily: font.regular, fontWeight: 400, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 },
  b14Semi: { fontFamily: font.semibold, fontWeight: 600, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 },
  b13: { fontFamily: font.medium, fontWeight: 500, fontSize: 13, lineHeight: '18px', letterSpacing: -0.1 },
  b12: { fontFamily: font.medium, fontWeight: 500, fontSize: 12, lineHeight: '16px', letterSpacing: -0.1 },
  b12Semi: { fontFamily: font.semibold, fontWeight: 600, fontSize: 12, lineHeight: '16px', letterSpacing: -0.1 },
  b11: { fontFamily: font.semibold, fontWeight: 600, fontSize: 11, lineHeight: '14px', letterSpacing: -0.1 },
} as const;

/* ----------------------------------------------------------------- currency */

/**
 * The noon dirham symbol is a private-use glyph in the Noontree faces at U+E001.
 * It is invisible in most editors — inspect it with `grep … | cat -v` (expect the
 * bytes `M-nM-^@M-^A`). Import this constant rather than re-pasting the glyph.
 */
export const DIRHAM = '';

/** `1760` → "<dirham> 1,760", with thousands separators. */
export function money(value: number | string): string {
  const n = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (!Number.isFinite(n)) return `${DIRHAM} ${value}`;
  return `${DIRHAM} ${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

/* ------------------------------------------------------------------ effects */

/** Card hover lift used across the grid and rails. */
export const HOVER_SHADOW = '0 6px 20px rgba(16, 22, 40, 0.10)';
export const RESTING_SHADOW = '0 1px 2px rgba(16, 22, 40, 0.04)';
/** Elevation for dialogs and the gift-bag drawer. */
export const OVERLAY_SHADOW = '0 24px 64px rgba(16, 22, 40, 0.24)';

/** Field DS `motion.easing.standard`, pre-formatted for CSS. */
export const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** Assets served from the shared repo-root public/ folder. */
export const ASSETS = '/gift-registry';
