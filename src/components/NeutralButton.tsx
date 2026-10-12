import React, { type ReactNode } from 'react';
import { colour, radius, space } from '../field-ds';
import { font } from './atoms/_shared';

export interface NeutralButtonProps {
  label: string;
  /** Icon element (typically an <img>/svg). Sized by the caller. */
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  /** H48 — inline CTA (A14, rounded-10). H52 — full-width CTA (A16, rounded-12). */
  size?: 'H48' | 'H52';
  fullWidth?: boolean;
  onPress?: () => void;
  className?: string;
}

/**
 * "M-NeutralButton" — dark-inverted (#101628) CTA for light surfaces. Two of the
 * five Figma sizes are covered: H48 (inline, e.g. "Search gifts") and H52
 * (full-width, e.g. "Share Gift List"). 1:1 with Figma node 369:122703.
 */
export function NeutralButton({
  label,
  icon,
  iconPosition = 'left',
  size = 'H48',
  fullWidth = false,
  onPress,
  className,
}: NeutralButtonProps) {
  const preset = size === 'H52' ? H52 : H48;
  return (
    <div
      role="button"
      onClick={onPress}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: preset.gap,
        paddingInline: preset.px,
        paddingBlock: space[14],
        minHeight: preset.h,
        maxHeight: preset.h,
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        backgroundColor: colour.surface['primary-inverted'],
        borderRadius: preset.radius,
        cursor: onPress ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {icon && iconPosition === 'left' && icon}
      <span style={{ ...preset.label, color: colour['text-n-icon']['on-surface-bold'], whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {icon && iconPosition === 'right' && icon}
    </div>
  );
}

// A14/SemiBold — 14/20, 0 tracking.
const H48 = {
  gap: space[6],
  px: space[24],
  h: 48,
  radius: radius[10],
  label: { fontFamily: font.semibold, fontWeight: 600, fontSize: 14, lineHeight: '20px', letterSpacing: 0 },
} as const;

// A16/SemiBold — 16/24, 0 tracking.
const H52 = {
  gap: space[8],
  px: space[20],
  h: 52,
  radius: radius[12],
  label: { fontFamily: font.semibold, fontWeight: 600, fontSize: 16, lineHeight: '24px', letterSpacing: 0 },
} as const;
