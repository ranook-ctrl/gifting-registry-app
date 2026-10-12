import React from 'react';
import { colors, font } from './_shared';
import { InstallationIcon } from './icons';

/** Bottom-right "×N" quantity chip used on order tiles. */
export function QuantityBadge({ count = 2 }: { count?: number }) {
  return <div style={qty}>x{count}</div>;
}

/** Top-left blue installation tag with the wrench glyph. */
export function InstallationTag() {
  return (
    <div style={tag}>
      <InstallationIcon size={12} />
    </div>
  );
}

const qty: React.CSSProperties = {
  position: 'absolute',
  right: 4,
  bottom: 4,
  minWidth: 18,
  height: 19,
  borderRadius: 4,
  backgroundColor: colors.surface.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 2,
  paddingBottom: 3,
  paddingLeft: 3,
  paddingRight: 3,
  boxSizing: 'border-box',
  boxShadow: '0 2px 4px rgba(14,14,14,0.08)',
  fontFamily: font.semibold,
  fontSize: 11,
  lineHeight: '14px',
  letterSpacing: -0.1,
  fontWeight: 600,
  color: colors.text.primary,
};

const tag: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 20,
  height: 20,
  backgroundColor: colors.surface.actionBold,
  borderTopLeftRadius: 8,
  borderBottomRightRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
