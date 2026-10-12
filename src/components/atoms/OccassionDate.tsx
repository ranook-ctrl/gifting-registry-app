import React from 'react';
import { colors, type, font } from './_shared';
import { CalendarIcon } from './icons';

export interface OccassionDateProps {
  /** Formatted date, e.g. "14th June". */
  date?: string;
  /** Countdown label, e.g. "20 days to go!". */
  countdown?: string;
  /**
   * Text colour role. Default "secondary" matches the muted list contexts;
   * "primary" matches the birthday hero header (Figma M-PageHeader / Page Title).
   */
  tone?: 'primary' | 'secondary';
}

/**
 * "Occassion Date" (Figma name kept verbatim) — calendar glyph + date • countdown.
 */
export function OccassionDate({
  date = '14th June',
  countdown = '20 days to go!',
  tone = 'secondary',
}: OccassionDateProps) {
  const ink = tone === 'primary' ? colors.text.primary : colors.text.secondary;
  return (
    <div style={row}>
      <CalendarIcon size={16} />
      <div style={text}>
        <span style={{ ...dateStyle, color: ink }}>{date}</span>
        <span style={{ ...dot, backgroundColor: ink }} />
        <span style={{ ...countdownStyle, color: ink }}>{countdown}</span>
      </div>
    </div>
  );
}

const row: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 };
const text: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 };
const dateStyle: React.CSSProperties = { ...type.b14Medium };
const dot: React.CSSProperties = { width: 3, height: 3, borderRadius: 1.5 };
const countdownStyle: React.CSSProperties = { ...type.b14Medium, fontFamily: font.bold, fontWeight: 700 };
