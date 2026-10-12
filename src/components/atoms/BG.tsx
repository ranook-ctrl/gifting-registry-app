import React from 'react';
import { font } from './_shared';
import { RadialGradientFill, type GradientStop } from './Gradient';

const CATEGORY_GRADIENT: GradientStop[] = [
  { offset: 0, color: '#FFB59E' },
  { offset: 0.71, color: '#A357E5' },
  { offset: 1, color: '#6624F5', opacity: 0.6 },
];

/**
 * "BG" — an 88×120 category background tile: a peach→purple radial gradient with
 * a centred category label near the top.
 */
export function BG({ label = 'Perfumes' }: { label?: string }) {
  return (
    <div style={tile}>
      <RadialGradientFill stops={CATEGORY_GRADIENT} cx="50%" cy="-30%" r="170%" />
      <span style={labelStyle}>{label}</span>
    </div>
  );
}

const tile: React.CSSProperties = { position: 'relative', width: 88, height: 120, overflow: 'hidden' };
const labelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  left: 6,
  right: 6,
  textAlign: 'center',
  fontFamily: font.semibold,
  fontSize: 14,
  lineHeight: '16px',
  letterSpacing: -0.1,
  fontWeight: 600,
  color: '#FFFFFF',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
