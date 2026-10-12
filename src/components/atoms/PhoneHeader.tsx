import React from 'react';
import { SANS } from './_shared';
import { PhoneBatteryIcon, PhoneWifiIcon, PhoneCellularIcon } from './icons';

/**
 * "Phone Header" — the iOS status bar: 375×42 with the time on the left and the
 * cellular / wi-fi / battery glyphs on the right, positioned exactly per Figma.
 */
export function PhoneHeader({ time = '9:41', height }: { time?: string; height?: number }) {
  // When a fixed height is given, the whole bar is that tall with its content
  // vertically centred (icons centre via 50%/translateY); otherwise it hugs the
  // 18px time line-box and the icons sit at their exact Figma tops.
  const fixed = height != null;
  const iconBase: React.CSSProperties = fixed
    ? { position: 'absolute', top: '50%', transform: 'translateY(-50%)' }
    : icon;
  return (
    <div style={fixed ? { ...bar, height } : bar}>
      <div style={timeWrap}>
        <span style={timeStyle}>{time}</span>
      </div>
      {/* Icons centred within the status bar. */}
      <div style={{ ...iconBase, left: 294, ...(fixed ? null : { top: 3.9 }) }}>
        <PhoneCellularIcon width={17} height={10.18} />
      </div>
      <div style={{ ...iconBase, left: 316, ...(fixed ? null : { top: 3.75 }) }}>
        <PhoneWifiIcon width={15.33} height={10.5} />
      </div>
      <div style={{ ...iconBase, left: 336.3, ...(fixed ? null : { top: 3.3 }) }}>
        <PhoneBatteryIcon width={24.33} height={11.33} />
      </div>
    </div>
  );
}

// Height hugs its content (the 18px time line-box) instead of a fixed 42px bar
// (Retune). The time sits in normal flow to drive the height; the status icons
// are absolutely positioned and vertically centred against it.
const bar: React.CSSProperties = {
  position: 'relative',
  width: 375,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 21,
  boxSizing: 'border-box',
};
const timeWrap: React.CSSProperties = {
  width: 54,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const timeStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 15,
  lineHeight: '18px',
  letterSpacing: -0.3,
  fontWeight: 600,
  color: '#000000',
  textAlign: 'center',
};
const icon: React.CSSProperties = { position: 'absolute' };
