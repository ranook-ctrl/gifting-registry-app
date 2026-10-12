import type { CSSProperties } from 'react';
import { colour, space, radius } from '../../field-ds';
import { type, font } from './_shared';
import { WebDialog } from './WebDialog';
import { CheckIcon, GiftIcon, CloseIcon } from './icons';

/** Same variants the mobile ../ConfirmationBottomsheet.tsx exposes to the gifter. */
export type ConfirmVariant = 'mark-purchased' | 'marked-mistake';

export interface ConfirmDialogProps {
  open: boolean;
  variant: ConfirmVariant;
  /** Thumbnail of the gift being marked; falls back to an illustration. */
  imageUrl?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const COPY: Record<
  ConfirmVariant,
  { title: string; body: string; cta: string; tone: 'success' | 'neutral' }
> = {
  'mark-purchased': {
    title: 'Mark as purchased?',
    body: 'Let the other gifters know it’s already been taken, so nobody buys it twice.',
    cta: 'Yes, mark it',
    tone: 'success',
  },
  'marked-mistake': {
    title: 'Marked by mistake?',
    body: 'This will put the gift back on the list and let others know it’s still up for grabs.',
    cta: 'Yes, put it back',
    tone: 'neutral',
  },
};

/**
 * Gifter flow · dWeb confirmation dialog.
 *
 * Desktop counterpart of ../ConfirmationBottomsheet.tsx, whose decorative
 * backdrop is geometry-locked to the 351px sheet width. Same two gifter variants
 * and the same copy; a centred card with the gift thumbnail as the visual anchor.
 */
export function ConfirmDialog({ open, variant, imageUrl, onConfirm, onCancel }: ConfirmDialogProps) {
  const copy = COPY[variant];
  const success = copy.tone === 'success';

  return (
    <WebDialog open={open} onClose={onCancel} width={440} hideClose label={copy.title}>
      <div style={body}>
        {/* Gift thumbnail with the state badge overlaid — the mobile sheet's
            polaroid tile, reduced to what actually carries meaning. */}
        <div style={media}>
          <div style={tile}>
            {imageUrl ? (
              <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <GiftIcon size={36} color={colour['text-n-icon'].tertiary} />
            )}
          </div>
          {/* Stroke-only glyphs here: the badge already *is* the coloured disc, so
              a self-filling VerifiedIcon would paint a white disc over it. */}
          <span style={{ ...badge, backgroundColor: success ? colour.surface['success-bold'] : colour.surface['tertiary-inverted'] }}>
            {success ? (
              <CheckIcon size={20} color={colour['text-n-icon']['on-surface-bold']} />
            ) : (
              <CloseIcon size={18} color={colour['text-n-icon']['on-surface-bold']} />
            )}
          </span>
        </div>

        <h2 style={{ margin: 0, ...type.h20, color: colour['text-n-icon'].primary, textAlign: 'center' }}>
          {copy.title}
        </h2>
        <p style={{ margin: 0, ...type.b14, color: colour['text-n-icon'].secondary, textAlign: 'center' }}>
          {copy.body}
        </p>

        <div style={actions}>
          <button type="button" onClick={onCancel} style={cancelBtn}>
            <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>Cancel</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              ...confirmBtn,
              backgroundColor: success ? colour.surface['success-bold'] : colour.surface['action-extrabold'],
            }}
          >
            <span
              style={{
                ...type.b14,
                fontFamily: font.semibold,
                fontWeight: 600,
                color: colour['text-n-icon']['on-surface-bold'],
              }}
            >
              {copy.cta}
            </span>
          </button>
        </div>
      </div>
    </WebDialog>
  );
}

/* ------------------------------------------------------------------ styles */

const body: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space[12],
  padding: space[28],
  boxSizing: 'border-box',
};

const media: CSSProperties = {
  position: 'relative',
  marginBottom: space[4],
};

const tile: CSSProperties = {
  width: 104,
  height: 104,
  borderRadius: radius[16],
  overflow: 'hidden',
  backgroundColor: colour.surface.tertiary,
  border: `4px solid ${colour.surface.primary}`,
  boxShadow: '0 6px 18px rgba(16, 22, 40, 0.14)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
};

const badge: CSSProperties = {
  position: 'absolute',
  bottom: -6,
  insetInlineEnd: -6,
  width: 36,
  height: 36,
  borderRadius: radius.rounded,
  border: `3px solid ${colour.surface.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
};

const actions: CSSProperties = {
  display: 'flex',
  gap: space[10],
  width: '100%',
  marginTop: space[8],
};

const btnBase: CSSProperties = {
  flex: '1 1 0',
  height: 48,
  borderRadius: radius[10],
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const cancelBtn: CSSProperties = {
  ...btnBase,
  border: `1px solid ${colour.border.primary}`,
  backgroundColor: colour.surface.primary,
};

const confirmBtn: CSSProperties = {
  ...btnBase,
  border: 'none',
};
