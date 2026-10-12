import React from 'react';
import { colour, radius, space } from '../field-ds';
import { font } from './atoms/_shared';
import { PhoneHeader } from './atoms';
import { ChevronLeftIcon, PreferencesIcon, CalendarIcon } from './atoms/icons';

const A = '/gift-registry/creator';

/** One decorative confetti / party object floating in the pink header backdrop. */
interface Deco {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  blur?: number;
  flipX?: boolean;
  blend?: React.CSSProperties['mixBlendMode'];
}

// Positions/rotations lifted from Figma (node 1409:487768 · BG - Birthday). The
// container-query hypot transforms are approximated with plain rotate + blur.
const DECOS: Deco[] = [
  { src: `${A}/hdr-streamer.svg`, left: 70.32, top: -12.62, width: 67.59, height: 57.17, rotate: 27.14 },
  { src: `${A}/hdr-spark-lg.svg`, left: 258.84, top: 62.77, width: 23.37, height: 23.37, rotate: 2.1, blend: 'screen' },
  { src: `${A}/hdr-spark-sm.svg`, left: 291.0, top: 60.0, width: 15.67, height: 15.67, blend: 'screen' },
  { src: `${A}/hdr-object1.png`, left: -19.2, top: 118.58, width: 81.85, height: 84.56, rotate: 7.33, blur: 6 },
  { src: `${A}/hdr-object3.png`, left: 345.46, top: 84.49, width: 67.83, height: 68.63, rotate: 71.2, blur: 3.5 },
  { src: `${A}/hdr-object2.png`, left: 329.0, top: 143.0, width: 88.19, height: 117.79, blur: 4 },
  { src: `${A}/hdr-object.png`, left: 301.31, top: 148.86, width: 18.04, height: 18.61, rotate: 73.41, blur: 2 },
  { src: `${A}/hdr-object.png`, left: 74.27, top: 69.5, width: 20.57, height: 20.34, rotate: 146, flipX: true },
  { src: `${A}/hdr-object.png`, left: 65.67, top: 166.0, width: 14.66, height: 14.85, rotate: -58.5, blur: 2, flipX: true },
];

export interface CreatorHeaderProps {
  title?: string;
  date?: string;
  countdown?: string;
  onBack?: () => void;
  onPreferences?: () => void;
}

/**
 * "Header" — the birthday pink hero (Figma node 1409:487768). A coral→rose
 * gradient backdrop dusted with confetti, a soft radial glow, a glass status +
 * page header, and the centred occasion title with its date/countdown row.
 */
export function CreatorHeader({
  title = 'Prasanna’s Birthday',
  date = '14th June',
  countdown = '20 days to go!',
  onBack,
  onPreferences,
}: CreatorHeaderProps) {
  return (
    <div style={shell}>
      {/* Gradient backdrop + decorations (clipped to the header). */}
      <div style={bg}>
        <img
          src={`${A}/hdr-glow.svg`}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            width: 773,
            height: 774,
            left: '50%',
            top: -241.83,
            transform: 'translateX(-50%)',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />
        {DECOS.map((d, i) => (
          <img
            key={i}
            src={d.src}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              left: d.left,
              top: d.top,
              width: d.width,
              height: d.height,
              transform: `${d.flipX ? 'scaleX(-1) ' : ''}${d.rotate ? `rotate(${d.rotate}deg)` : ''}`.trim() || undefined,
              filter: d.blur ? `blur(${d.blur}px)` : undefined,
              mixBlendMode: d.blend,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>

      {/* Status bar + glass page header. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[6], width: '100%', position: 'relative', zIndex: 1 }}>
        <PhoneHeader />
        <div style={pageHeader}>
          <div role={onBack ? 'button' : undefined} aria-label="Back" onClick={onBack} style={{ ...glass, cursor: onBack ? 'pointer' : 'default' }}>
            <ChevronLeftIcon size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }} />
          <div role={onPreferences ? 'button' : undefined} aria-label="Preferences" onClick={onPreferences} style={{ ...glass, cursor: onPreferences ? 'pointer' : 'default' }}>
            <PreferencesIcon size={20} />
          </div>
        </div>
      </div>

      {/* Occasion title + date. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[4], width: 250, position: 'relative', zIndex: 1 }}>
        <span style={titleStyle}>{title}</span>
        <div style={dateRow}>
          <CalendarIcon size={16} />
          <div style={{ display: 'flex', alignItems: 'center', gap: space[4] }}>
            <span style={dateText}>{date}</span>
            <span style={dot} />
            <span style={{ ...dateText, fontFamily: font.bold, fontWeight: 700 }}>{countdown}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const shell: React.CSSProperties = {
  position: 'relative',
  width: 375,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space[12],
  paddingBottom: space[32],
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const bg: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 375,
  height: 416,
  overflow: 'hidden',
  background: 'linear-gradient(to bottom, #ffbeac 16.05%, #ff7373 123.98%)',
};

const pageHeader: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[4],
  height: 56,
  paddingInline: space[16],
  paddingBlock: space[8],
  boxSizing: 'border-box',
};

const glass: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 20,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.8) 119.04%)',
  border: `1px solid ${colour.border.white}`,
  boxSizing: 'border-box',
};

const titleStyle: React.CSSProperties = {
  fontFamily: font.bold,
  fontWeight: 700,
  fontSize: 28,
  lineHeight: '36px',
  letterSpacing: -0.25,
  color: colour['text-n-icon'].primary,
  textAlign: 'center',
  width: '100%',
};

const dateRow: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2] };
const dateText: React.CSSProperties = { fontFamily: font.medium, fontWeight: 500, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1, color: colour['text-n-icon'].primary };
const dot: React.CSSProperties = { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colour['text-n-icon'].primary };
