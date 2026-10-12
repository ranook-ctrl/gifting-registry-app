import React from 'react';
import { colour } from '../../field-ds';

/**
 * "Subtler BG" — decorative screen backdrop (375×516). A quilt of muted rounded
 * tiles under a radial gradient that fades from a soft white centre-top to
 * surface/tertiary, giving the top of the screen its faint shimmer.
 */
export function SubtlerBg({ width = 375, height = 516 }: SubtlerBgProps) {
  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden' }} aria-hidden>
      {/* Tile quilt — 8 cols × 11 rows of 46.875px squares */}
      <div style={tileLayer}>
        {Array.from({ length: TILE_COUNT }).map((_, i) => (
          <div key={i} style={tile} />
        ))}
      </div>
      {/* Radial gradient veil, matching the Figma fill exactly. */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRADIENT }} />
    </div>
  );
}

export interface SubtlerBgProps {
  width?: number;
  height?: number;
}

const TILE = 46.875;
const TILE_COUNT = 88;

const tileLayer: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 375,
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
  backgroundColor: colour.surface.primary,
};

const tile: React.CSSProperties = {
  width: TILE,
  height: TILE,
  flexShrink: 0,
  backgroundColor: colour.surface.muted,
  border: `0.3px solid ${colour.border.white}`,
  borderRadius: 6.392,
  boxSizing: 'border-box',
};

const GRADIENT =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 375 516' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-1.3607e-14 29.811 -21.665 -3.3834e-14 187.5 92.5)'><stop stop-color='rgba(255,255,255,0.6)' offset='0'/><stop stop-color='rgba(242,243,247,1)' offset='1'/></radialGradient></defs></svg>\")";
