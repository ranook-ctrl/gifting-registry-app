import { colour, space, radius, typography } from '../field-ds';

export type GiftStatus = 'available' | 'reserved' | 'purchased';

export interface GiftStatusBadgeProps {
  status: GiftStatus;
  /** Optional label override; defaults to a human-readable status label. */
  label?: string;
}

const STATUS_STYLE: Record<GiftStatus, { bg: string; fg: string; label: string }> = {
  available: {
    bg: colour.surface['success-subtle'],
    fg: colour['text-n-icon'].success,
    label: 'Available',
  },
  reserved: {
    bg: colour.surface['warning-subtle'],
    fg: colour['text-n-icon'].warning,
    label: 'Reserved',
  },
  purchased: {
    bg: colour.surface.tertiary,
    fg: colour['text-n-icon'].tertiary,
    label: 'Purchased',
  },
};

export function GiftStatusBadge({ status, label }: GiftStatusBadgeProps) {
  const s = STATUS_STYLE[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: s.bg,
        color: s.fg,
        paddingInline: space[8],
        paddingBlock: space[4],
        borderRadius: radius.rounded,
        fontFamily: typography.H16_Bold.fontFamily,
        fontSize: 12,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {label ?? s.label}
    </span>
  );
}
