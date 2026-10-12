import React from 'react';
import { colors, radius, PRODUCT } from './_shared';
import { QuantityBadge, InstallationTag } from './OrderTileParts';

const AIRPODS_BOX = `${PRODUCT}/airpods-box.png`;
const WASHING_MACHINE = `${PRODUCT}/washing-machine.png`;

export type OrderHistoryVariant = 'Single' | 'Multi' | 'Installation' | 'Installation_Multi' | 'Plain';

/**
 * "OrderHistoryImages" — a 57×76 product tile. Variants add a quantity chip
 * and/or a blue installation tag; installation variants show the product
 * "contained" over a faint blue wash. Pass `dimmed` for the grey darken wash.
 */
export function OrderHistoryImages({
  variant = 'Single',
  image,
  count = 2,
  dimmed = false,
}: {
  variant?: OrderHistoryVariant;
  image?: string;
  count?: number;
  dimmed?: boolean;
}) {
  const isInstall = variant === 'Installation' || variant === 'Installation_Multi';
  const hasQty = variant === 'Single' || variant === 'Multi' || variant === 'Installation_Multi';
  const src = image ?? (isInstall ? WASHING_MACHINE : AIRPODS_BOX);

  return (
    <div style={tile}>
      {isInstall && <div style={wash} />}
      <img
        src={src}
        style={{ width: '100%', height: '100%', objectFit: isInstall ? 'contain' : 'cover' }}
        alt=""
      />
      {dimmed && <div style={dim} />}
      {isInstall && <InstallationTag />}
      {hasQty && <QuantityBadge count={count} />}
    </div>
  );
}

const tile: React.CSSProperties = {
  position: 'relative',
  width: 57,
  height: 76,
  borderRadius: radius[8],
  backgroundColor: colors.surface.secondary,
  overflow: 'hidden',
};
const wash: React.CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,40,136,0.03)' };
const dim: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(242,243,247,0.5)',
  mixBlendMode: 'darken',
};
