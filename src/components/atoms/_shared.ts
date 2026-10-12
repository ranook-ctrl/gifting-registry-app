// Shared type ramp for the atom ports. Mirrors the RN `typography` presets
// (font/heading|body/action) resolved to web CSS, riding on the Noontree faces
// with a system sans fallback.
export const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const fam = (f: string) => `${f}, ${SANS}`;

export const font = {
  light: fam('Noontree-Light'),
  regular: fam('Noontree-Regular'),
  medium: fam('Noontree-Medium'),
  semibold: fam('Noontree-SemiBold'),
  bold: fam('Noontree-Bold'),
  extrabold: fam('Noontree-ExtraBold'),
  black: fam('Noontree-Black'),
} as const;

// Map a numeric CSS weight to the matching per-weight Noontree face. The shipped
// faces are single-weight, so the family name — not `fontWeight` — selects the
// cut. Keep both in sync via this helper: `fontFamily: weightFont(700)`.
export function weightFont(weight: number): string {
  if (weight <= 300) return font.light;
  if (weight <= 400) return font.regular;
  if (weight <= 500) return font.medium;
  if (weight <= 600) return font.semibold;
  if (weight <= 700) return font.bold;
  if (weight <= 800) return font.extrabold;
  return font.black;
}

export const type = {
  h28Bold: { fontFamily: font.bold, fontWeight: 700, fontSize: 28, lineHeight: '36px', letterSpacing: -0.25 },
  h16Bold: { fontFamily: font.bold, fontWeight: 700, fontSize: 16, lineHeight: '20px', letterSpacing: -0.15 },
  b16Medium: { fontFamily: font.medium, fontWeight: 500, fontSize: 16, lineHeight: '20px', letterSpacing: -0.15 },
  b14Medium: { fontFamily: font.medium, fontWeight: 500, fontSize: 14, lineHeight: '18px', letterSpacing: -0.1 },
  b12Medium: { fontFamily: font.medium, fontWeight: 500, fontSize: 12, lineHeight: '16px', letterSpacing: -0.1 },
  b12Regular: { fontFamily: font.regular, fontWeight: 400, fontSize: 12, lineHeight: '16px', letterSpacing: -0.1 },
  b11SemiBold: { fontFamily: font.semibold, fontWeight: 600, fontSize: 11, lineHeight: '14px', letterSpacing: -0.1 },
} as const;

// Semantic colours, aliased into the RN token shape so the atom ports read 1:1
// against the react-native source. Resolves to the same hex as the web field-ds.
import { colour, radius } from '../../field-ds/tokens';

export const colors = {
  text: {
    primary: colour['text-n-icon'].primary,
    action: colour['text-n-icon'].action,
    secondary: colour['text-n-icon'].secondary,
    tertiary: colour['text-n-icon'].tertiary,
    muted: colour['text-n-icon'].muted,
    success: colour['text-n-icon'].success,
    warning: colour['text-n-icon'].warning,
    error: colour['text-n-icon'].error,
    onSurfaceBold: colour['text-n-icon']['on-surface-bold'],
  },
  surface: {
    primary: colour.surface.primary,
    secondary: colour.surface.secondary,
    tertiary: colour.surface.tertiary,
    actionBold: colour.surface['action-bold'],
    actionExtrabold: colour.surface['action-extrabold'],
    brandPrimary: colour.surface['brand-primary'],
  },
  border: {
    subtle: colour.border.subtle,
  },
} as const;

export { radius };

// Product image assets copied from the RN source, served from public/.
export const PRODUCT = '/gift-registry/atoms';
