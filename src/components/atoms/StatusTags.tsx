import React from 'react';
import { colors, type, font } from './_shared';

export type StatusTagVariant = 'On time' | 'Delayed' | 'Cancellation' | 'On hold';

const VARIANTS: Record<StatusTagVariant, { label: string; color: string }> = {
  'On time': { label: 'On time', color: colors.text.success },
  Delayed: { label: 'Delayed', color: colors.text.warning },
  Cancellation: { label: 'Cancellation pending', color: colors.text.tertiary },
  'On hold': { label: 'On hold', color: colors.text.error },
};

/** "StatusTags" — a bold 12/18 status label coloured by delivery state. */
export function StatusTags({ status = 'On time' }: { status?: StatusTagVariant }) {
  const v = VARIANTS[status];
  return <span style={{ ...type.b12Medium, fontFamily: font.bold, fontWeight: 700, color: v.color }}>{v.label}</span>;
}
