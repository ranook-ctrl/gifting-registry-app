import React from 'react';
import { colour, radius, space } from '../field-ds';
import { font } from './atoms/_shared';

const A = '/gift-registry/creator';

interface Tile {
  label: string;
  /** Full designed tile (gradient + label + product baked in), 264×360 → 88×120. */
  img: string;
}

const TILES: Tile[] = [
  { label: 'Perfumes', img: `${A}/tile-full-perfumes.png` },
  { label: 'Beauty', img: `${A}/tile-full-beauty.png` },
  { label: 'Books', img: `${A}/tile-full-books.png` },
  { label: 'Electronics', img: `${A}/tile-full-electronics.png` },
  { label: 'Games & Toys', img: `${A}/tile-full-games.png` },
];

export interface ExploreCuratedGiftsProps {
  heading?: string;
  onSelectCategory?: (label: string) => void;
}

/**
 * "Explore curated gifts" — star-flare-flanked heading over a horizontal rail of
 * category tiles (peach→purple gradient + product cut-out). Figma node 1480:1442337.
 */
export function ExploreCuratedGifts({ heading = 'Explore curated gifts', onSelectCategory }: ExploreCuratedGiftsProps) {
  return (
    <div style={outer}>
      <div style={inner}>
        <div style={headingRow}>
          <Flare />
          <span style={headingText}>{heading}</span>
          <Flare flip />
        </div>

        <div style={rail}>
          {TILES.map((t) => (
            <img
              key={t.label}
              src={t.img}
              alt={t.label}
              role={onSelectCategory ? 'button' : undefined}
              onClick={() => onSelectCategory?.(t.label)}
              style={tile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Star-flare ornament flanking the heading — a pink gradient line fading into a
 * soft-glow sparkle (Figma "Group 1948759503", exported to PNG). The right-hand
 * flare mirrors the left. Rendered slightly larger than its box so the glow
 * bleeds past the edges (Figma inset -26.57% -6.88% -27.53% 0).
 */
function Flare({ flip = false }: { flip?: boolean }) {
  return (
    <div style={{ position: 'relative', width: 77.516, height: 19.371, flexShrink: 0, transform: flip ? 'scaleX(-1)' : undefined }}>
      <img
        src={`${A}/flare.png`}
        alt=""
        aria-hidden
        style={{ position: 'absolute', left: 0, top: -5.147, width: 82.849, height: 29.851, display: 'block' }}
      />
    </div>
  );
}

const outer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  alignSelf: 'stretch',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  // This rail is the page footer — pad the top only, no padding below it.
  paddingTop: space[20],
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const inner: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[20],
  alignItems: 'stretch',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
};

// Heading stays centred (with its star flares); the tile rail below is left-aligned.
const headingRow: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18, paddingInline: space[12] };
const headingText: React.CSSProperties = {
  fontFamily: font.bold,
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '20px',
  letterSpacing: -0.15,
  color: colour['text-n-icon'].primary,
  whiteSpace: 'nowrap',
};

// Left-aligned, horizontally scrollable rail. `minWidth: 0` lets the flex
// ancestors shrink so the overflow scrolls here instead of widening the section.
const rail: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: space[12],
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  WebkitOverflowScrolling: 'touch',
  paddingInline: space[12],
  boxSizing: 'border-box',
};

const tile: React.CSSProperties = {
  width: 88,
  height: 120,
  flexShrink: 0,
  borderRadius: radius[12],
  objectFit: 'cover',
  display: 'block',
  cursor: 'pointer',
};
