import type { CSSProperties, ReactNode } from 'react';
import { colour, palette, space, radius } from '../field-ds';
import { Button } from '../field-ds';

// Product art + status badges, sourced 1:1 from Figma
// (Gifting Registry / node 1642:226300 "Confirmation Bottomsheet").
import polaroidFloral from './assets/confirmation-sheet/polaroid_floral.png'; // v1 / v4 single tile
import fanLeft from './assets/confirmation-sheet/fan_left.png';
import fanRight from './assets/confirmation-sheet/fan_right.png';
import fanCenter from './assets/confirmation-sheet/fan_center.png';
import badgeCheckEllipse from './assets/confirmation-sheet/badge_check_ellipse.svg';
import badgeCheck from './assets/confirmation-sheet/badge_check.svg';
import badgeBacking from './assets/confirmation-sheet/badge_backing.svg';
import badgeCross from './assets/confirmation-sheet/badge_cross.svg';
import badgeBin from './assets/confirmation-sheet/badge_bin.svg';
import badgeRewind from './assets/confirmation-sheet/badge_rewind.svg';

export type ConfirmationVariant = 'mark-purchased' | 'deactivate' | 'delete' | 'marked-mistake';

export interface ConfirmationBottomsheetProps {
  /** Which of the four confirmation flows to render. */
  variant?: ConfirmationVariant;
  /** Fired when the primary confirm button is pressed. */
  onConfirm?: () => void;
  /** Fired when the secondary "Cancel" button is pressed (dismiss without action). */
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
}

const ff = (family: string) => `${family}, 'SF Pro Text', system-ui, sans-serif`;

// H18/Bold — sheet title.
const titleType: CSSProperties = {
  fontFamily: ff('Noontree-Bold'),
  fontWeight: 700,
  fontSize: 18,
  lineHeight: '22px',
  letterSpacing: -0.13,
};

// B14/Medium — supporting copy.
const bodyType: CSSProperties = {
  fontFamily: ff('Noontree-Medium'),
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: -0.13,
};

/* ---------- Decorative "Subtler BG" (muted tile grid + white veil) ---------- */

const GRID_W = 350.717;
const GRID_H = 482.586;
const TILE = 43.8396;

// White radial veil lifted verbatim from Figma (lighter over the art near the top,
// fading to solid white at the edges).
const VEIL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 350.72 482.59' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.044849 27.268 -19.817 -0.032594 175.81 87.006)'><stop stop-color='rgba(255,255,255,0.4)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>\")";

function SubtlerBG() {
  const tiles = Math.ceil(GRID_W / TILE) * Math.ceil(GRID_H / TILE); // 8 × 11
  return (
    <div aria-hidden style={{ position: 'absolute', left: -0.57, top: -0.73, width: GRID_W, height: GRID_H }}>
      {/* Tile grid dialled back 30% (Retune) so it reads subtler behind the copy;
          the veil above sits at full opacity. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: colour.surface.primary,
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          opacity: 0.7,
        }}
      >
        {Array.from({ length: tiles }).map((_, i) => (
          <div
            key={i}
            style={{
              width: TILE,
              height: TILE,
              flexShrink: 0,
              backgroundColor: colour.surface.muted,
              border: `0.281px solid ${colour.border.white}`,
              borderRadius: 5.978,
              boxSizing: 'border-box',
            }}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: VEIL, backgroundSize: '100% 100%' }} />
    </div>
  );
}

/* ---------- Media: single tile (v1 / v4) ---------- */

const MEDIA_W = 90.064;
const MEDIA_H = 120.086;

function SingleTile({ badge }: { badge: ReactNode }) {
  return (
    <div style={{ position: 'relative', width: MEDIA_W, height: MEDIA_H, flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: -3.08,
          top: -2.28,
          width: 96.226,
          height: 124.635,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ transform: 'rotate(-3deg)' }}>
          <div style={{ width: MEDIA_W, height: MEDIA_H, borderRadius: 12.009, overflow: 'hidden', backgroundColor: '#fff' }}>
            {/* TODO(flow-wiring): source this image from the flow that opened the
                sheet (e.g. the product being marked/reverted) rather than the
                hard-coded placeholder. */}
            <img src={polaroidFloral} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </div>
      {badge}
    </div>
  );
}

/* ---------- Media: fanned three tiles (v2 / v3) ---------- */

function FanCard({
  src,
  outerW,
  outerH,
  pad,
  masterRadius,
  imgRadius,
  rotate,
  cx,
  shadowBlur,
}: {
  src: string;
  outerW: number;
  outerH: number;
  pad: number;
  masterRadius: number;
  imgRadius: number;
  rotate: number;
  cx: number; // centre-x within the 161.053 fan box
  shadowBlur: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        backgroundColor: colour.surface.primary,
        padding: pad,
        borderRadius: 12,
        boxSizing: 'border-box',
        filter: `drop-shadow(0px 0px ${shadowBlur}px rgba(0,0,0,0.06))`,
      }}
    >
      <div
        style={{
          width: outerW - 2 * pad,
          height: outerH - 2 * pad,
          borderRadius: masterRadius,
          overflow: 'hidden',
          backgroundColor: colour.surface.tertiary,
        }}
      >
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: imgRadius, display: 'block' }} />
      </div>
    </div>
  );
}

function FannedTiles({ badge }: { badge: ReactNode }) {
  // TODO(flow-wiring): the three fanned images should come from the actual
  // products in the gift list being acted on, not the hard-coded fan_* assets.
  const FAN_W = 161.053;
  return (
    <div style={{ position: 'relative', width: MEDIA_W, height: MEDIA_H, flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: '50%', top: -2.57, width: FAN_W, height: 120, transform: 'translateX(-50%)' }}>
        {/* Back-left card (−8°) */}
        <FanCard src={fanLeft} outerW={77.552} outerH={101.053} pad={3.525} masterRadius={10} imgRadius={3.463} rotate={-8} cx={FAN_W / 2 - 26.62} shadowBlur={7.52} />
        {/* Back-right card (+8°) */}
        <FanCard src={fanRight} outerW={77.552} outerH={101.053} pad={3.525} masterRadius={10} imgRadius={3.463} rotate={8} cx={FAN_W / 2 + 26} shadowBlur={7.52} />
        {/* Front-centre card */}
        <FanCard src={fanCenter} outerW={86.699} outerH={113.493} pad={3.158} masterRadius={8} imgRadius={4.365} rotate={0} cx={FAN_W / 2 - 0.31} shadowBlur={8.574} />
      </div>
      {badge}
    </div>
  );
}

/* ---------- Status badges ---------- */

// v1 — green check seal (with soft green disc behind).
function CheckBadge() {
  return (
    <div style={{ position: 'absolute', left: 66.55, top: 90.56, width: 40.029, height: 40.029 }}>
      <img
        src={badgeCheckEllipse}
        alt=""
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 25.018, height: 25.018 }}
      />
      <img
        src={badgeCheck}
        alt=""
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 33.878, height: 33.878 }}
      />
    </div>
  );
}

// v2 — orange filled cross-circle over a light-red disc.
function CrossBadge() {
  return (
    <div style={{ position: 'absolute', left: 24.53, top: 90.56, width: 40.029, height: 40.029 }}>
      <img
        src={badgeBacking}
        alt=""
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 28, height: 28 }}
      />
      <img
        src={badgeCross}
        alt=""
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 37.878, height: 37.878 }}
      />
    </div>
  );
}

// v3 — red filled bin over a light-red disc.
function BinBadge() {
  return (
    <div style={{ position: 'absolute', left: 24.53, top: 90.56, width: 40.029, height: 40.029 }}>
      <img
        src={badgeBacking}
        alt=""
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 28, height: 28 }}
      />
      <img
        src={badgeBin}
        alt=""
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 37.153, height: 37.153 }}
      />
    </div>
  );
}

// v4 — white rewind glyph inside a red gradient ring.
const RED_RING =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.2689 2.2843 -1.9448 2.783 2.5654 7.1231)'><stop stop-color='rgba(245,29,18,1)' offset='0'/><stop stop-color='rgba(242,54,44,1)' offset='0.16754'/><stop stop-color='rgba(239,78,70,1)' offset='0.33507'/><stop stop-color='rgba(236,103,96,1)' offset='0.50261'/><stop stop-color='rgba(233,128,122,1)' offset='0.67015'/><stop stop-color='rgba(236,103,96,1)' offset='0.75261'/><stop stop-color='rgba(239,78,70,1)' offset='0.83507'/><stop stop-color='rgba(242,54,44,1)' offset='0.91754'/><stop stop-color='rgba(245,29,18,1)' offset='1'/></radialGradient></defs></svg>\")";

function RewindBadge() {
  return (
    <div style={{ position: 'absolute', left: 66.55, top: 90.56, padding: 4, display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 5.333,
          borderRadius: 35.556,
          border: `0.593px solid ${colour.border.error}`,
          backgroundImage: RED_RING,
          backgroundSize: '100% 100%',
        }}
      >
        <img src={badgeRewind} alt="" style={{ width: 16.09, height: 18.756, opacity: 0.8, display: 'block' }} />
      </div>
    </div>
  );
}

/* ---------- Variant configuration ---------- */

interface VariantConfig {
  title: string;
  body: ReactNode;
  media: (badge: ReactNode) => ReactNode;
  badge: ReactNode;
  button: { label: string; variant: 'primary' | 'neutral'; bg: string };
}

const CONFIG: Record<ConfirmationVariant, VariantConfig> = {
  'mark-purchased': {
    title: 'Mark as purchased?',
    body: "Let others know it's already been taken.",
    media: (badge) => <SingleTile badge={badge} />,
    badge: <CheckBadge />,
    button: { label: 'Yes, mark it', variant: 'primary', bg: colour.surface['action-bold'] },
  },
  deactivate: {
    title: 'Deactivate this gift list?',
    body: (
      <>
        This gift list will no longer be visible to others, and{' '}
        <span style={{ color: colour['text-n-icon'].primary }}>you won&apos;t be able to activate it again.</span>
      </>
    ),
    media: (badge) => <FannedTiles badge={badge} />,
    badge: <CrossBadge />,
    button: { label: 'Yes, close the list', variant: 'neutral', bg: colour.surface['primary-inverted'] },
  },
  delete: {
    title: 'Delete this collection?',
    body: "This action can't be undone. Your items will remain saved in All Items.",
    media: (badge) => <FannedTiles badge={badge} />,
    badge: <BinBadge />,
    button: { label: 'Yes, delete the list', variant: 'primary', bg: colour.surface['error-bold'] },
  },
  'marked-mistake': {
    title: 'Marked by mistake?',
    body: 'Let others know that it’s still up for grab!',
    media: (badge) => <SingleTile badge={badge} />,
    badge: <RewindBadge />,
    button: { label: 'Yes, revert it', variant: 'primary', bg: colour.surface['action-bold'] },
  },
};

/* ---------- ConfirmationBottomsheet ---------- */

export function ConfirmationBottomsheet({
  variant = 'mark-purchased',
  onConfirm,
  onCancel,
  className,
  style,
}: ConfirmationBottomsheetProps) {
  const cfg = CONFIG[variant];
  // Retune: the "mark-purchased" variant sits 8px tighter between the media and
  // its copy than the other confirmation flows.
  const mediaCopyGap = variant === 'mark-purchased' ? 40.291 : 48.291;

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 351, ...style }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 7.176,
          width: '100%',
          paddingTop: space[32],
          paddingBottom: space[12],
          paddingInline: 10.764,
          boxSizing: 'border-box',
          backgroundColor: palette.grey[50],
          border: `0.898px solid ${palette.grey[100]}`,
          borderRadius: 14.37,
          overflow: 'hidden',
        }}
      >
        <SubtlerBG />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10.778, alignItems: 'flex-start', width: '100%' }}>
          {/* Media + copy */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: mediaCopyGap,
              paddingBottom: space[8],
              borderRadius: radius[12],
              width: '100%',
            }}
          >
            {/* Icon row: two hidden 50px spacers flank the media (matches Figma) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div aria-hidden style={{ width: 50, height: 50, opacity: 0, flexShrink: 0 }} />
              {cfg.media(cfg.badge)}
              <div aria-hidden style={{ width: 50, height: 50, opacity: 0, flexShrink: 0 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[8], width: '100%', textAlign: 'center' }}>
              <p style={{ ...titleType, margin: 0, width: 293, color: palette.grey[800] }}>{cfg.title}</p>
              <p style={{ ...bodyType, margin: 0, width: 311, color: colour['text-n-icon'].tertiary }}>{cfg.body}</p>
            </div>
          </div>

          {/* Action row — neutral "Cancel" (Field DS secondary-neutral) beside
              the primary confirm CTA. Applies to every variant. */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: space[8], width: '100%' }}>
            <Button
              label="Cancel"
              variant="secondary-neutral"
              size="H56"
              fullWidth
              onPress={onCancel}
              style={{
                minHeight: 52,
                maxHeight: 52,
                paddingInline: space[24],
                borderRadius: radius[12],
              }}
            />
            <Button
              label={cfg.button.label}
              variant={cfg.button.variant}
              size="H56"
              fullWidth
              onPress={onConfirm}
              style={{
                backgroundColor: cfg.button.bg,
                minHeight: 52,
                maxHeight: 52,
                paddingInline: space[24],
                borderRadius: radius[12],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
