import React, { type ReactNode } from 'react';
import { colour } from './tokens';
import { radius as radiusToken, space } from './tokens';

// Noontree SemiBold face with system fallback (matches the atom type ramp).
const SEMIBOLD_FAMILY =
  'Noontree-SemiBold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * Field DS Button family (@field-ds Buttons). All variants share the same
 * `RectButton` core; only the fill/foreground differ. Sizes are height tokens
 * `H28 | H32 | H36 | H40 | H48 | H56` (default `H56`). See CATALOG.md › Buttons.
 *
 * Variants:
 *  - `primary`          — filled action, bg #0f61ff, fg #fff.
 *  - `secondary`        — action-tinted outline.
 *  - `secondary-neutral`— neutral outline CTA (Figma M-SecondaryNeutralButton):
 *                         white bg, border.primary hairline, on-surface primary
 *                         text. Pair it left of a primary CTA (e.g. "Cancel").
 *  - `neutral`          — dark-inverted CTA (#101628) for light surfaces
 *                         (the Figma "M-NeutralButton", e.g. "Search gifts").
 *  - `text`             — text-only, no fill.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'secondary-neutral' | 'neutral' | 'text';
export type ButtonSize = 'H28' | 'H32' | 'H36' | 'H40' | 'H48' | 'H56';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon element (web adaptation of Field DS `iconLeft: IconName`). */
  iconLeft?: ReactNode;
  /** Trailing icon element (web adaptation of Field DS `iconRight: IconName`). */
  iconRight?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

interface SizeSpec {
  gap: number;
  px: number;
  h: number;
  radius: number;
  label: React.CSSProperties;
}

// Height-token metrics, extracted from the Field DS button presets.
const SIZES: Record<ButtonSize, SizeSpec> = {
  H28: { gap: space[4], px: space[12], h: 28, radius: radiusToken[8], label: { fontSize: 12, lineHeight: '16px' } },
  H32: { gap: space[4], px: space[12], h: 32, radius: radiusToken[8], label: { fontSize: 12, lineHeight: '16px' } },
  H36: { gap: space[6], px: space[16], h: 36, radius: radiusToken[10], label: { fontSize: 14, lineHeight: '20px' } },
  H40: { gap: space[6], px: space[16], h: 40, radius: radiusToken[10], label: { fontSize: 14, lineHeight: '20px' } },
  H48: { gap: space[6], px: space[24], h: 48, radius: radiusToken[10], label: { fontSize: 14, lineHeight: '20px' } },
  H56: { gap: space[8], px: space[20], h: 56, radius: radiusToken[12], label: { fontSize: 16, lineHeight: '24px' } },
};

interface VariantSpec {
  bg: string;
  fg: string;
  border?: string;
}

const VARIANTS: Record<ButtonVariant, VariantSpec> = {
  primary: { bg: colour.surface['action-extrabold'], fg: colour['text-n-icon']['on-surface-bold'] },
  secondary: { bg: colour.surface.primary, fg: colour['text-n-icon'].action, border: colour.border.action },
  'secondary-neutral': { bg: colour.surface.primary, fg: colour['text-n-icon'].primary, border: colour.border.primary },
  neutral: { bg: colour.surface['primary-inverted'], fg: colour['text-n-icon']['on-surface-bold'] },
  text: { bg: 'transparent', fg: colour['text-n-icon'].action },
};

export function Button({
  label,
  variant = 'primary',
  size = 'H56',
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  style,
  className,
}: ButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  const interactive = !!onPress && !disabled && !loading;

  return (
    <div
      role="button"
      aria-disabled={disabled || loading || undefined}
      onClick={interactive ? onPress : undefined}
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        paddingInline: s.px,
        minHeight: s.h,
        maxHeight: s.h,
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        backgroundColor: v.bg,
        border: v.border ? `1px solid ${v.border}` : 'none',
        borderRadius: s.radius,
        opacity: disabled ? 0.4 : 1,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      {loading ? (
        <Spinner color={v.fg} />
      ) : (
        <>
          {iconLeft}
          <span
            style={{
              fontFamily: SEMIBOLD_FAMILY,
              fontWeight: 600,
              letterSpacing: 0,
              color: v.fg,
              whiteSpace: 'nowrap',
              ...s.label,
            }}
          >
            {label}
          </span>
          {iconRight}
        </>
      )}
    </div>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        display: 'inline-block',
        animation: 'field-ds-spin 0.7s linear infinite',
      }}
    />
  );
}
