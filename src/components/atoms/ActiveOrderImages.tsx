import React from 'react';
import { colors, radius, font, PRODUCT } from './_shared';
import { InstallationIcon } from './icons';

const A = {
  airpods: `${PRODUCT}/airpods-box.png`,
  perfumeBlack: `${PRODUCT}/perfume-black.png`,
  perfumeBlue: `${PRODUCT}/perfume-blue.png`,
  fridge: `${PRODUCT}/fridge.png`,
  washer: `${PRODUCT}/washing-machine.png`,
  prodA: `${PRODUCT}/prod-a.png`,
  prodB: `${PRODUCT}/prod-b.png`,
};

export type ActiveOrderVariant = '1' | '2' | '3' | '4' | '4+' | 'Multi count' | 'Installation';

const WASH = 'rgba(0,40,136,0.03)';

function Cell({
  src,
  mode = 'contain',
  style,
  cellRadius = 4,
}: {
  src?: string;
  mode?: 'contain' | 'cover';
  style?: React.CSSProperties;
  cellRadius?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: cellRadius,
        backgroundColor: colors.surface.secondary,
        overflow: 'hidden',
        ...style,
      }}
    >
      {src && <img src={src} style={{ width: '100%', height: '100%', objectFit: mode }} alt="" />}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: WASH }} />
    </div>
  );
}

/**
 * "ActiveOrderImages" — a 57×76 order thumbnail with layouts for 1–4+ products,
 * a multi-count chip, and an installation card pair.
 *
 * `images` (optional) supplies the actual product photos to show — e.g. the
 * items the gifter just checked out. When omitted, the sample assets are used.
 * The count in `images` also decides the `4+` overflow badge number.
 */
export function ActiveOrderImages({
  variant = '1',
  images,
}: {
  variant?: ActiveOrderVariant;
  images?: string[];
}) {
  return <div style={tile}>{renderVariant(variant, images)}</div>;
}

function renderVariant(variant: ActiveOrderVariant, images?: string[]) {
  // Prefer a supplied product photo at slot `i`, falling back to the sample art.
  const at = (i: number, fallback: string) => (images && images[i]) || fallback;

  switch (variant) {
    case '1':
      return (
        <>
          <img src={at(0, A.airpods)} style={coverFill} alt="" />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: WASH }} />
        </>
      );

    case 'Multi count':
      return (
        <>
          <img src={at(0, A.airpods)} style={coverFill} alt="" />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: WASH }} />
          <div style={qty}>x2</div>
        </>
      );

    case '2':
      return (
        <div style={stack2}>
          <Cell src={at(0, A.perfumeBlack)} style={{ ...cell53, position: 'relative', top: undefined, left: undefined }} cellRadius={6} />
          <Cell src={at(1, A.fridge)} style={{ ...cell53, position: 'relative', top: undefined, left: undefined }} cellRadius={6} />
        </div>
      );

    case '3':
      return (
        <>
          <Cell src={at(0, A.perfumeBlack)} style={{ ...cell25, left: 3, top: 4 }} />
          <Cell src={at(1, A.perfumeBlue)} mode="cover" style={{ ...cell25, left: 3, top: 39 }} />
          <Cell src={at(2, A.prodA)} style={{ ...cell25, left: 29, top: 4 }} />
        </>
      );

    case '4':
      return (
        <>
          <Cell src={at(0, A.perfumeBlack)} style={{ ...cell25, left: 3, top: 4 }} />
          <Cell src={at(1, A.perfumeBlue)} mode="cover" style={{ ...cell25, left: 3, top: 39 }} />
          <Cell src={at(2, A.prodA)} style={{ ...cell25, left: 29, top: 4 }} />
          <Cell src={at(3, A.prodB)} mode="cover" style={{ ...cell25, left: 29, top: 39 }} />
        </>
      );

    case '4+':
      return (
        <>
          <Cell src={at(0, A.perfumeBlack)} style={{ ...cell25, left: 3, top: 4 }} />
          <Cell src={at(1, A.perfumeBlue)} mode="cover" style={{ ...cell25, left: 3, top: 39 }} />
          <Cell src={at(2, A.prodA)} style={{ ...cell25, left: 29, top: 4 }} />
          <div style={{ ...cell25, ...moreCell, left: 29, top: 39 }}>+{images ? Math.max(images.length - 3, 1) : 4}</div>
        </>
      );

    case 'Installation':
      return (
        <>
          <img src={at(0, A.washer)} style={containFill} alt="" />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: WASH }} />
          <div style={installTag}>
            <InstallationIcon size={12} />
          </div>
        </>
      );
  }
}

const tile: React.CSSProperties = {
  position: 'relative',
  width: 57,
  height: 76,
  borderRadius: radius[8],
  backgroundColor: colors.surface.secondary,
  overflow: 'hidden',
};
const coverFill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const containFill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain' };
const stack2: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: 2,
  gap: 2,
  boxSizing: 'border-box',
};
const cell53: React.CSSProperties = { width: 53, height: 35 };
const cell25: React.CSSProperties = { position: 'absolute', width: 25, height: 33 };
const moreCell: React.CSSProperties = {
  backgroundColor: colors.surface.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4.52,
  fontFamily: font.semibold,
  fontSize: 11,
  lineHeight: '14px',
  letterSpacing: -0.1,
  fontWeight: 600,
  color: '#343D54',
};
const qty: React.CSSProperties = {
  position: 'absolute',
  right: 4,
  bottom: 4,
  minWidth: 18,
  height: 19,
  borderRadius: 5,
  backgroundColor: colors.surface.secondary,
  border: `1px solid ${colors.border.subtle}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 2,
  paddingBottom: 3,
  paddingLeft: 3,
  paddingRight: 3,
  boxSizing: 'border-box',
  fontFamily: font.semibold,
  fontSize: 11,
  lineHeight: '14px',
  letterSpacing: -0.1,
  fontWeight: 600,
  color: '#343D54',
};
const installTag: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 20,
  height: 20,
  backgroundColor: colors.surface.actionBold,
  borderTopLeftRadius: 8,
  borderBottomRightRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
