import { useId, type CSSProperties } from 'react';
import { colour, palette, space, radius, fontFamily } from '../field-ds';
import imgConfetti from './assets/gift-list-card/obj_confetti.png';
import imgGift from './assets/gift-list-card/obj_gift.png';
import imgHat from './assets/gift-list-card/obj_hat.png';
import imgOrnament from './assets/gift-list-card/obj_ornament.png';

export type GiftListCardVariant = 'active' | 'inactive';

export interface GiftListCardProduct {
  src: string;
  alt?: string;
  /** How the photo fills the 42×56 tile. 'cover' (default) crops to fill; 'contain' letterboxes. */
  fit?: 'cover' | 'contain';
  /** Extra inset around the photo as a % of the tile (e.g. 16), for products shot loose in the frame. */
  inset?: number;
  /** 'darken' merges a white photo background into the white tile. */
  blend?: 'normal' | 'darken';
}

export interface GiftListCardProps {
  /** 'active' = live list on the occasion art; 'inactive' = closed list, art desaturated. */
  variant?: GiftListCardVariant;
  /** Occasion title, e.g. "Prasanna’s Birthday". */
  title: string;
  /** Meta line under the title, e.g. "19 July’26 • 9 Items". */
  subtitle: string;
  /** Pill label on the active variant, e.g. "2 new gifts". Omit to hide the pill. */
  newGiftsLabel?: string;
  /** Received-gift count on the inactive chip, e.g. 5. Omit (with statusLabel) to hide the chip. */
  giftCount?: number | string;
  /** Status suffix on the inactive chip. */
  statusLabel?: string;
  /** Up to four product thumbnails; first renders at the bottom of the overlap stack. */
  products?: GiftListCardProduct[];
  /** Tapping the floating arrow button. */
  onOpen?: () => void;
  /** Accessible label for the arrow button. */
  openLabel?: string;
  /** Card width. The artwork is authored at the design's 343×156; height stays content-driven. */
  width?: number | string;
  className?: string;
  style?: CSSProperties;
}

/* ------------------------------------------------------------------ */
/* Birthday occasion art (Gifting Registry / node 1672:261887).       */
/* 343×380.5 frame, clipped by the card. Geometry (boxes, unrotated   */
/* sizes, rotations, blurs, blends) transcribed 1:1 from Figma; the   */
/* 3D objects are the original raster fills exported as PNG.          */
/* ------------------------------------------------------------------ */

interface ArtObject {
  box: { left: number; top: number; width: number; height: number };
  /** CSS transform for the unrotated content box (rotation/flip about its centre). */
  transform?: string;
  /** Unrotated content size; defaults to the box size. */
  content?: { width: number; height: number };
  blur?: number;
  blend?: CSSProperties['mixBlendMode'];
  img: { src: string; left: string; top: string; width: string; height: string };
}

const CONFETTI_IMG = { src: imgConfetti, left: '3.09%', top: '3.3%', width: '96.61%', height: '93.79%' };

// Figma's layer-blur value is a diameter (σ = value/2); CSS blur() takes σ.
// Halve the Figma values or the art renders twice as soft as the design.
const ART_OBJECTS: ArtObject[] = [
  { // confetti bit, right of the gift
    box: { left: 275.6, top: 167.7, width: 16.5, height: 17.023 },
    transform: 'rotate(73.41deg)', content: { width: 13.863, height: 13.088 },
    blur: 1.829 / 2, img: CONFETTI_IMG,
  },
  { // 3D gift box
    box: { left: 197, top: 140, width: 74.858, height: 77.346 },
    transform: 'rotate(7.33deg)', content: { width: 66.546, height: 69.419 },
    blur: 5.488 / 2,
    img: { src: imgGift, left: '0.38%', top: '0.77%', width: '98.84%', height: '98.85%' },
  },
  { // party hat, lower right
    box: { left: 300.93, top: 162.34, width: 85.62, height: 114.353 },
    blur: 3.659 / 2,
    img: { src: imgHat, left: '0.75%', top: '0.26%', width: '98.31%', height: '99.44%' },
  },
  { // confetti bit, mirrored, upper left
    box: { left: 67.93, top: 63.57, width: 18.82, height: 18.611 },
    transform: 'rotate(146deg) scaleX(-1)', content: { width: 13.868, height: 13.095 },
    img: CONFETTI_IMG,
  },
  { // confetti bit, mirrored, mid left
    box: { left: 60.07, top: 151.83, width: 13.4, height: 13.586 },
    transform: 'rotate(-58.5deg) scaleX(-1)', content: { width: 10.094, height: 9.531 },
    blur: 1.829 / 2, img: CONFETTI_IMG,
  },
  { // confetti bit, mirrored, far left edge
    box: { left: -4.47, top: 193.08, width: 13.4, height: 13.586 },
    transform: 'rotate(-58.5deg) scaleX(-1)', content: { width: 10.094, height: 9.531 },
    blur: 3.201 / 2, img: CONFETTI_IMG,
  },
  { // 3D ornament, off the right edge
    box: { left: 315.98, top: 77.28, width: 62.04, height: 62.776 },
    transform: 'rotate(71.2deg)', content: { width: 49.772, height: 48.596 },
    blur: 3.201 / 2,
    img: { src: imgOrnament, left: '0.19%', top: '1.33%', width: '99.36%', height: '98.27%' },
  },
];

function ArtObjectLayer({ spec }: { spec: ArtObject }) {
  const content = spec.content ?? { width: spec.box.width, height: spec.box.height };
  return (
    <div
      style={{
        position: 'absolute',
        ...spec.box,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mixBlendMode: spec.blend,
      }}
    >
      <div style={{ flex: 'none', ...content, transform: spec.transform }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', filter: spec.blur ? `blur(${spec.blur}px)` : undefined }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <img alt="" src={spec.img.src} style={{ position: 'absolute', left: spec.img.left, top: spec.img.top, width: spec.img.width, height: spec.img.height, maxWidth: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BirthdayArt({ uid }: { uid: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: -97,
        width: 343,
        height: 380.501,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFBEAC 16.047%, #FF7373 123.98%)',
      }}
    >
      {/* Base radial gradient (rotated ellipse — not expressible as a CSS gradient) */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 343 380.501"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      >
        <path d="M0 0H343V380.501H0V0Z" fill={`url(#${uid}-bg)`} />
        <defs>
          <radialGradient
            id={`${uid}-bg`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(19.5 99.5) rotate(25.4762) scale(576.562 718.534)"
          >
            <stop offset="0.134615" stopColor="#F7DCEF" />
            <stop offset="0.711761" stopColor="#BF57E6" />
            <stop offset="1" stopColor="#6624F5" />
          </radialGradient>
        </defs>
      </svg>

      {/* Soft-light glow ellipse */}
      <div
        style={{
          position: 'absolute',
          left: -181.95,
          top: -221.2,
          width: 707.037,
          height: 707.952,
          borderRadius: '50%',
          background: '#3DA3FF',
          mixBlendMode: 'soft-light',
        }}
      />

      {/* confetti (right) + gift box — painted under the streamer/sparks */}
      <ArtObjectLayer spec={ART_OBJECTS[0]} />
      <ArtObjectLayer spec={ART_OBJECTS[1]} />

      {/* Confetti streamer swirl, top */}
      <div style={{ position: 'absolute', left: 64.32, top: -11.54, width: 61.83, height: 52.293, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 'none', width: 53.381, height: 31.401, transform: 'rotate(27.14deg)' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg
              viewBox="0 0 58.8669 36.888"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', left: '-5.14%', top: '-8.74%', width: '110.28%', height: '117.48%', display: 'block' }}
            >
              <g filter={`url(#${uid}-streamer)`}>
                <path d="M26.617 4.79334C33.642 6.04486 30.3781 31.2201 46.8002 34.144L35.6939 32.1665C20.1275 29.3963 23.0105 4.15199 15.5107 2.81584L26.617 4.79334Z" fill="#F7B04D" />
                <path d="M26.6171 4.79327C16.8794 3.37473 7.40384 21.1767 16.3888 26.2229L6.04187 24.3812C-2.86025 17.7829 8.29764 1.53307 15.5107 2.81577L26.6171 4.79327Z" fill="#FDE5BC" />
                <path d="M54.6181 9.77917C58.0969 19.297 55.5656 33.8877 46.8001 34.1438L35.6938 32.1663C45.6039 32.6162 47.4229 15.4533 44.3652 7.9531L54.6158 9.77917H54.6181Z" fill="#FDE5BC" />
              </g>
              <defs>
                <filter id={`${uid}-streamer`} x="0" y="0" width="58.8669" height="36.888" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation="1.372" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Sparkle, small */}
      <div style={{ position: 'absolute', left: 268.2, top: 56.17, width: 7.4, height: 7.4, mixBlendMode: 'screen' }}>
        <svg
          viewBox="0 0 11.0581 11.058"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: '-24.72%', width: '149.44%', height: '149.44%', display: 'block' }}
        >
          <g filter={`url(#${uid}-spark-s)`}>
            <path d="M9.22873 5.52901C5.89494 5.73229 5.73231 5.89491 5.52903 9.22869C5.32575 5.89491 5.16313 5.73229 1.82933 5.52901C5.16313 5.32573 5.32575 5.16311 5.52903 1.82933C5.73231 5.16311 5.89494 5.32573 9.22873 5.52901Z" fill="#FBFBFC" />
          </g>
          <defs>
            <filter id={`${uid}-spark-s`} x="0" y="0" width="11.0581" height="11.058" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="0.914667" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Sparkle, large */}
      <div style={{ position: 'absolute', left: 236.75, top: 57.42, width: 21.38, height: 21.38, display: 'flex', alignItems: 'center', justifyContent: 'center', mixBlendMode: 'screen' }}>
        <div style={{ flex: 'none', width: 20.639, height: 20.639, transform: 'rotate(2.1deg)' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg
              viewBox="0 0 25.9208 25.9207"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', inset: '-12.8%', width: '125.6%', height: '125.6%', display: 'block' }}
            >
              <g filter={`url(#${uid}-spark-l)`}>
                <path d="M23.2794 12.9604C13.981 13.5273 13.5274 13.9809 12.9604 23.2792C12.3934 13.9809 11.9399 13.5273 2.64149 12.9604C11.9399 12.3934 12.3934 11.9398 12.9604 2.64149C13.5274 11.9398 13.981 12.3934 23.2794 12.9604Z" fill="#FBFBFC" />
              </g>
              <defs>
                <filter id={`${uid}-spark-l`} x="0" y="0" width="25.9208" height="25.9207" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation="1.32074" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* hat, mirrored confetti ×3, ornament */}
      <ArtObjectLayer spec={ART_OBJECTS[2]} />
      <ArtObjectLayer spec={ART_OBJECTS[3]} />
      <ArtObjectLayer spec={ART_OBJECTS[4]} />
      <ArtObjectLayer spec={ART_OBJECTS[5]} />
      <ArtObjectLayer spec={ART_OBJECTS[6]} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Field DS icons (M-Icon system icons), inlined for web.             */
/* ------------------------------------------------------------------ */

function CurvedArrowRightIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ display: 'block', flex: 'none' }}>
      <g transform="translate(5.25 5.25)">
        <path
          d="M7.10632 0.365121C7.31895 0.00966015 7.77954 -0.106156 8.13501 0.106454L8.79749 0.502694L8.79785 0.502938C10.7803 1.69031 12.4587 3.32386 13.7 5.2732L13.7521 5.35841C14.2735 6.24576 14.2561 7.35387 13.7001 8.22657L13.7002 8.22669C12.459 10.176 10.7818 11.8099 8.79773 12.9974L8.79749 12.9976L8.13501 13.3938C7.77953 13.6064 7.31894 13.4906 7.10632 13.1351C6.89372 12.7797 7.00952 12.3191 7.36499 12.1065L8.02747 11.7102C9.78381 10.6589 11.2727 9.21825 12.3837 7.50013H0.75C0.335786 7.50013 0 7.16434 0 6.75013C8.24634e-06 6.33592 0.335792 6.00013 0.75 6.00013H12.3835C11.2726 4.28225 9.78277 2.84144 8.02747 1.79005L7.36499 1.39381C7.00952 1.18118 6.89371 0.720596 7.10632 0.365121Z"
          fill={color}
        />
      </g>
    </svg>
  );
}

function GiftBoxFilledIcon({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ display: 'block', flex: 'none' }}>
      <g transform="translate(0.5833 0.875)" fill={color}>
        <path d="M11.5938 0C11.3816 0.574583 10.9288 1.0274 10.3542 1.23958C10.9288 1.45177 11.3816 1.90458 11.5938 2.47917C11.8059 1.90458 12.2588 1.45177 12.8333 1.23958C12.2588 1.0274 11.8059 0.574583 11.5938 0Z" />
        <path d="M1.16667 9.91667C0.966875 10.457 0.540313 10.8835 0 11.0833C0.540313 11.2831 0.966875 11.7097 1.16667 12.25C1.36646 11.7097 1.79302 11.2831 2.33333 11.0833C1.79302 10.8835 1.36646 10.457 1.16667 9.91667Z" />
        <path d="M10.2761 5.73198C10.5211 5.73198 10.7523 5.63354 10.9273 5.45562C11.1059 5.27333 11.2015 5.03417 11.2007 4.78333C11.1825 4.65135 11.1635 4.5201 11.1417 4.38885C10.9929 3.49635 10.3221 2.8 9.44854 2.61187C9.65052 2.34354 9.7701 2.01031 9.7701 1.64937C9.7701 0.764896 9.05042 0.045208 8.16594 0.045208C7.45135 0.045208 6.81552 0.390104 6.41594 0.921666C6.07323 0.465208 5.55625 0.146562 4.96489 0.0656246C3.99364 -0.0678129 3.08365 0.632916 3.06177 1.61219C3.05302 1.98698 3.17406 2.33406 3.3826 2.61115C2.50979 2.8 1.83823 3.49635 1.68948 4.38813C1.6676 4.51938 1.64792 4.65135 1.63042 4.78333C1.63042 5.03417 1.72521 5.27333 1.90385 5.45562C2.07885 5.63427 2.31 5.73198 2.555 5.73198H10.2761ZM6.85417 2.23198C6.85417 1.53781 7.39594 0.967604 8.07844 0.922396C8.44885 0.897604 8.82437 1.15792 8.88562 1.52469C8.96146 1.98115 8.60927 2.37781 8.16667 2.37781H6.85417V2.23198ZM4.66667 0.919479C5.39146 0.919479 5.97917 1.50719 5.97917 2.23198V2.37781H4.69C4.32542 2.37781 3.99875 2.11969 3.94552 1.75875C3.87917 1.30812 4.22844 0.919479 4.66667 0.919479Z" />
        <path d="M10.2769 6.60698H6.85417V11.0104C7.66938 10.9929 8.48385 10.9266 9.29396 10.8114C10.2419 10.6757 10.9849 9.95021 11.1424 9.00521C11.2919 8.10906 11.3531 7.20562 11.3276 6.30364C11.0192 6.50125 10.6582 6.60698 10.2769 6.60698Z" />
        <path d="M2.55646 6.60698C2.17511 6.60698 1.81417 6.50052 1.50573 6.30364C1.48021 7.20562 1.54146 8.10906 1.69094 9.00521C1.84844 9.95021 2.59146 10.6757 3.53938 10.8114C4.34948 10.9273 5.16396 10.9929 5.97917 11.0104V6.60698H2.55646Z" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

/** Occasion-brand pill gradient — design-specified, outside the Field DS palette. */
const NEW_GIFTS_GRADIENT = 'linear-gradient(180deg, #D988E6 38.462%, #7C42DD 100%)';

function NewGiftsPill({ label, uid }: { label: string; uid: string }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[2],
        paddingBlock: space[4],
        paddingInlineStart: space[4],
        paddingInlineEnd: space[6],
        borderRadius: radius[6],
        background: NEW_GIFTS_GRADIENT,
        // Figma strokes sit inside the box — inset shadow keeps the 22px height exact.
        boxShadow: `inset 0 0 0 1px ${palette.alphaLight[16]}, 0 6px 16px rgba(0, 0, 0, 0.08)`,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: 'flex',
          padding: space[4],
          borderRadius: radius[20],
          background: 'radial-gradient(closest-side, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        }}
      >
        <span style={{ position: 'relative', width: 6, height: 6, display: 'block' }}>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: '-66.67%', width: 14, height: 14, display: 'block' }}>
            <g filter={`url(#${uid}-dot)`}>
              <circle cx="7" cy="7" r="3" fill={palette.neutral.white} />
            </g>
            <circle cx="7" cy="7" r="3" fill={palette.neutral.white} />
            <defs>
              <filter id={`${uid}-dot`} x="0" y="0" width="14" height="14" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
          </svg>
        </span>
      </span>
      <span
        style={{
          fontFamily: 'Noontree-SemiBold', // Label4/Semibold (Field DS type ramp)
          fontSize: 12,
          lineHeight: '14px',
          letterSpacing: -0.12,
          color: colour['text-n-icon']['on-surface-bold'],
          whiteSpace: 'nowrap',
          textAlign: 'center',
          fontFeatureSettings: '"case"',
        }}
      >
        {label}
      </span>
    </span>
  );
}

function ClosedChip({ count, statusLabel }: { count: number | string; statusLabel: string }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[4],
        paddingBlock: space[4],
        paddingInlineStart: space[4],
        paddingInlineEnd: space[6],
        borderRadius: radius[6],
        background: `linear-gradient(180deg, ${palette.neutral.white} 0%, ${palette.grey[200]} 100%)`,
        boxShadow: `inset 0 0 0 1px ${colour.border.white}, 0 6px 16px rgba(0, 0, 0, 0.08)`,
        flexShrink: 0,
      }}
    >
      <GiftBoxFilledIcon size={14} color={colour['text-n-icon'].muted} />
      <span
        style={{
          fontSize: 12,
          lineHeight: '14px',
          letterSpacing: -0.12,
          color: colour['text-n-icon'].muted,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          fontFeatureSettings: '"case"',
        }}
      >
        <span style={{ fontFamily: 'Noontree-SemiBold' }}>{count} </span>
        <span style={{ fontFamily: fontFamily.medium.fontFamily }}>• {statusLabel}</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

const TILE_W = 42;
const TILE_H = 56;

function ProductTile({ product, last }: { product: GiftListCardProduct; last: boolean }) {
  const fit = product.fit ?? 'cover';
  return (
    <span
      style={{
        position: 'relative',
        width: TILE_W,
        height: TILE_H,
        borderRadius: 4.667,
        overflow: 'hidden',
        background: colour.surface.primary,
        boxShadow: `inset 0 0 0 2px ${colour.surface.tertiary}`,
        marginInlineEnd: last ? undefined : space['-12'],
        flexShrink: 0,
        display: 'block',
      }}
    >
      <img
        alt={product.alt ?? ''}
        src={product.src}
        style={{
          position: 'absolute',
          left: `${product.inset ?? 0}%`,
          top: `${product.inset ?? 0}%`,
          width: `${100 - 2 * (product.inset ?? 0)}%`,
          height: `${100 - 2 * (product.inset ?? 0)}%`,
          objectFit: fit,
          pointerEvents: 'none',
          mixBlendMode: product.blend === 'darken' ? 'darken' : undefined,
        }}
      />
    </span>
  );
}

/**
 * Gift List card — Gifting Registry (Figma node 1672:261973, "Gift list states").
 * A creator's gift list entry: occasion art, title + meta, product stack and a
 * floating open button. `variant="inactive"` desaturates the art (hue-blend
 * overlay, as designed) and swaps the new-gifts pill for the closed chip.
 */
export function GiftListCard({
  variant = 'active',
  title,
  subtitle,
  newGiftsLabel,
  giftCount,
  statusLabel = 'Closed',
  products = [],
  onOpen,
  openLabel = 'Open gift list',
  width = 343,
  className,
  style,
}: GiftListCardProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: space[24],
        padding: space[16],
        borderRadius: radius[12],
        overflow: 'hidden',
        isolation: 'isolate',
        background: `linear-gradient(90deg, ${colour.surface.secondary} 0%, ${colour.surface.tertiary} 100%)`,
        boxShadow: `inset 0 0 0 1px ${colour.border.subtle}`,
        ...style,
      }}
    >
      <BirthdayArt uid={uid} />

      {/* Header: title + meta on the left, status on the right */}
      <div style={{ position: 'relative', display: 'flex', gap: space[20], alignItems: 'flex-start', height: 44, width: '100%', flexShrink: 0 }}>
        <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[4], alignItems: 'flex-start', maxWidth: '100%' }}>
            <div
              style={{
                ...fontFamily.bold, // Label2/Bold
                fontSize: 16,
                lineHeight: '20px',
                letterSpacing: -0.16,
                color: colour['text-n-icon'].primary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                fontFeatureSettings: '"case"',
              }}
            >
              {title}
            </div>
            <div
              style={{
                ...fontFamily.medium, // B13/Medium
                fontSize: 13,
                lineHeight: '20px',
                letterSpacing: -0.1,
                color: colour['text-n-icon'].secondary,
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
        {variant === 'active' && newGiftsLabel ? <NewGiftsPill label={newGiftsLabel} uid={uid} /> : null}
        {variant === 'inactive' && giftCount != null ? <ClosedChip count={giftCount} statusLabel={statusLabel} /> : null}
      </div>

      {/* Inactive: hue-blend overlay desaturates the art + header beneath it */}
      {variant === 'inactive' ? (
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#D9D9D9', mixBlendMode: 'hue', margin: 0 }} />
      ) : null}

      {/* Overlapping product stack */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: space[8], flexShrink: 0 }}>
        {products.slice(0, 4).map((product, i, arr) => (
          <ProductTile key={i} product={product} last={i === arr.length - 1} />
        ))}
      </div>

      {/* Floating open button — M-IconButton H36 / Ghost-on-glass */}
      <button
        type="button"
        aria-label={openLabel}
        onClick={onOpen}
        style={{
          position: 'absolute',
          bottom: space[16],
          insetInlineEnd: space[16],
          width: 36,
          height: 36,
          padding: space[8],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.rounded,
          border: 'none',
          background: palette.alphaLight[64],
          boxShadow: `inset 0 0 0 1px ${palette.alphaLight[24]}`,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          cursor: onOpen ? 'pointer' : 'default',
        }}
      >
        <CurvedArrowRightIcon size={20} color={colour['text-n-icon'].primary} />
      </button>
    </div>
  );
}
