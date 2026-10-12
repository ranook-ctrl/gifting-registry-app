import type { CSSProperties, ReactNode } from 'react';
import { colour, space, radius, typography } from '../field-ds';

// Decorative birthday-scene art (raster + vector), sourced 1:1 from Figma
// (Gifting Registry / node 1455:1413779 "Action sheets").
import bgBirthday from './assets/share-sheet/bg_birthday.svg';
import imgEllipse from './assets/share-sheet/ellipse.svg';
import imgGift from './assets/share-sheet/obj_hat_small.png'; // purple gift box (centre)
import imgHat from './assets/share-sheet/obj_blur1.png'; // party hat (right)
import imgRibbon from './assets/share-sheet/obj_blur2.png'; // ribbon swirl (far right)
import imgCollage from './assets/share-sheet/obj_cake.png'; // cake collage (left crop)
import imgConfetti from './assets/share-sheet/obj_confetti.png';
import imgStreamer from './assets/share-sheet/streamer.svg';
import imgSpark1 from './assets/share-sheet/spark1.svg';
import imgSpark2 from './assets/share-sheet/spark2.svg';

// Social channel icons.
import icCopyLink from './assets/share-sheet/ic_copylink.svg';
import icMessage from './assets/share-sheet/ic_message.svg';
import icWhatsapp from './assets/share-sheet/ic_whatsapp.svg';
import icInstagram from './assets/share-sheet/ic_instagram.svg';
import icMore from './assets/share-sheet/ic_more.svg';
import icX from './assets/share-sheet/ic_x.svg';
import instaBg from './assets/share-sheet/insta_bg.png';
import icMessenger from './assets/share-sheet/messenger.png';
import icTiktok from './assets/share-sheet/tiktok.png';

export type ShareChannel =
  | 'copy-link'
  | 'message'
  | 'whatsapp'
  | 'instagram'
  | 'messenger'
  | 'tiktok'
  | 'x'
  | 'more';

export interface ShareSheetProps {
  /** Registry / collection title shown over the hero. */
  title?: string;
  /** Item count shown under the title (e.g. 13 → "13 Items"). */
  itemCount?: number;
  /** Fired when a share channel chip is pressed. */
  onShare?: (channel: ShareChannel) => void;
  className?: string;
  style?: CSSProperties;
}

const ff = (family: string) => `${family}, 'SF Pro Text', system-ui, sans-serif`;

// Body/B14/Medium — item count.
const b14Medium: CSSProperties = {
  fontFamily: ff('Noontree-Medium'),
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: -0.1,
};

// Body/B12/Regular — chip labels.
const b12Regular: CSSProperties = {
  fontFamily: ff('Noontree-Regular'),
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
};

// H28/Bold — hero title.
const h28Bold: CSSProperties = {
  fontFamily: ff('Noontree-Bold'),
  fontWeight: 700,
  fontSize: typography.H28_Bold.fontSize,
  lineHeight: `${typography.H28_Bold.lineHeight}px`,
  letterSpacing: typography.H28_Bold.letterSpacing,
};

/* ---------- Birthday hero scene ---------- */

interface SceneObjProps {
  src: string;
  /** Centre point (unrotated), in the 319×353.877 scene coordinate space. */
  cx: number;
  cy: number;
  /** Unrotated size. */
  w: number;
  h: number;
  rot?: number;
  blur?: number;
  flipX?: boolean;
  blend?: CSSProperties['mixBlendMode'];
}

function SceneObj({ src, cx, cy, w, h, rot = 0, blur = 0, flipX = false, blend }: SceneObjProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        transform: `rotate(${rot}deg)${flipX ? ' scaleX(-1)' : ''}`,
        transformOrigin: 'center',
        filter: blur ? `blur(${blur}px)` : undefined,
        mixBlendMode: blend,
        pointerEvents: 'none',
      }}
    />
  );
}

const SCENE_W = 319;
const SCENE_H = 353.877;

function BirthdayScene() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: SCENE_W,
        height: SCENE_H,
        overflow: 'hidden',
      }}
    >
      {/* Base radial gradient (#6624F5 → #BF57E6 → #FFCFC0). */}
      <img
        src={bgBirthday}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Soft blue glow, overlay blend. */}
      <img
        src={imgEllipse}
        alt=""
        style={{
          position: 'absolute',
          left: -169.185,
          top: -205.719,
          width: 657.565,
          height: 658.416,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Cake collage (left), cropped to the cake region. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 19,
          width: 90.895,
          height: 122,
          overflow: 'hidden',
          filter: 'blur(3px)',
        }}
      >
        <img
          src={imgCollage}
          alt=""
          style={{
            position: 'absolute',
            width: '197.41%',
            height: '220.62%',
            left: 0,
            top: '-106.23%',
            maxWidth: 'none',
          }}
        />
      </div>

      {/* Ribbon swirl (far right). */}
      <SceneObj src={imgRibbon} cx={345.5} cy={1.06} w={52} h={50} rot={71.2} blur={2.977} />

      {/* Party hat (right). */}
      <div style={{ position: 'absolute', left: 264, top: 18, width: 68, height: 91, overflow: 'hidden', filter: 'blur(3.5px)' }}>
        <img src={imgHat} alt="" style={{ position: 'absolute', width: '98.31%', height: '99.44%', left: '0.75%', top: '0.26%', maxWidth: 'none' }} />
      </div>

      {/* Confetti + sparkles + streamer. */}
      <SceneObj src={imgStreamer} cx={217.89} cy={12.57} w={73.644} h={53.203} rot={27.14} />
      <SceneObj src={imgSpark2} cx={230.83} cy={63.34} w={24.107} h={24.107} rot={2.1} blend="screen" />
      <SceneObj src={imgSpark1} cx={252.87} cy={55.68} w={10.284} h={10.284} blend="screen" />
      <SceneObj src={imgConfetti} cx={275.66} cy={134.55} w={16} h={14.67} rot={73.41} blur={1.701} />
      <SceneObj src={imgConfetti} cx={78.74} cy={85.08} w={19} h={17.42} rot={146} flipX blur={0} />
      <SceneObj src={imgConfetti} cx={67} cy={147.53} w={13.5} h={12.375} rot={-58.5} flipX blur={1.701} />
      <SceneObj src={imgConfetti} cx={6.98} cy={185.89} w={13.5} h={12.375} rot={-58.5} flipX blur={2.977} />

      {/* Gift box (centre). */}
      <SceneObj src={imgGift} cx={159.76} cy={100.26} w={68.941} h={71.924} rot={-21.93} blur={1} />
    </div>
  );
}

/* ---------- Social chip ---------- */

interface SocialDef {
  channel: ShareChannel;
  label: string;
  /** Circle background. Either a colour token or an image url used as cover fill. */
  bg: string;
  bgImage?: string;
  border?: string;
  icon: string;
  /** Icon render size within the 24px slot. */
  iconW: number;
  iconH: number;
  /** Tiktok crops a larger raster inside the 24px slot. */
  iconScale?: number;
}

const SOCIALS: SocialDef[][] = [
  [
    { channel: 'copy-link', label: 'Copy Link', bg: colour.surface.tertiary, border: colour.border.primary, icon: icCopyLink, iconW: 20.45, iconH: 20.45 },
    { channel: 'message', label: 'Message', bg: colour.surface.tertiary, border: colour.border.primary, icon: icMessage, iconW: 24, iconH: 24 },
    { channel: 'whatsapp', label: 'Whatsapp', bg: '#25d366', icon: icWhatsapp, iconW: 20, iconH: 20 },
    { channel: 'instagram', label: 'Instagram', bg: 'transparent', bgImage: instaBg, icon: icInstagram, iconW: 20, iconH: 20 },
  ],
  [
    { channel: 'messenger', label: 'Messenger', bg: colour.surface.tertiary, border: colour.border.primary, icon: icMessenger, iconW: 24, iconH: 24 },
    { channel: 'tiktok', label: 'Tiktok', bg: '#000000', icon: icTiktok, iconW: 24, iconH: 24, iconScale: 2.1667 },
    { channel: 'x', label: 'X', bg: '#000000', icon: icX, iconW: 19.775, iconH: 17.875 },
    { channel: 'more', label: 'More', bg: colour.surface.tertiary, border: colour.border.primary, icon: icMore, iconW: 16.81, iconH: 16.74 },
  ],
];

function SocialChip({ def, onPress }: { def: SocialDef; onPress?: () => void }) {
  const iconNode: ReactNode = def.iconScale ? (
    <span style={{ width: 24, height: 24, overflow: 'hidden', display: 'block', position: 'relative' }}>
      <img
        src={def.icon}
        alt=""
        style={{
          position: 'absolute',
          width: `${def.iconScale * 100}%`,
          height: `${def.iconScale * 100}%`,
          left: `${-(def.iconScale - 1) * 50}%`,
          top: `${-(def.iconScale - 1) * 50}%`,
          maxWidth: 'none',
        }}
      />
    </span>
  ) : (
    <img src={def.icon} alt="" style={{ width: def.iconW, height: def.iconH, display: 'block' }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[8], width: 64 }}>
      <button
        type="button"
        onClick={onPress}
        aria-label={def.label}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          padding: space[16],
          borderRadius: radius[40],
          backgroundColor: def.bg,
          border: def.border ? `1px solid ${def.border}` : 'none',
          cursor: onPress ? 'pointer' : 'default',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {def.bgImage ? (
          <img
            src={def.bgImage}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: radius[40] }}
          />
        ) : null}
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
          {iconNode}
        </span>
      </button>
      <span
        style={{
          ...b12Regular,
          width: 77.5,
          textAlign: 'center',
          color: colour['text-n-icon'].primary,
          wordBreak: 'break-word',
        }}
      >
        {def.label}
      </span>
    </div>
  );
}

/* ---------- ShareSheet ---------- */

export function ShareSheet({
  title = 'Prasanna’s Birthday',
  itemCount = 13,
  onShare,
  className,
  style,
}: ShareSheetProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: space[8],
        width: 351,
        padding: space[16],
        boxSizing: 'border-box',
        backgroundColor: colour.surface.primary,
        border: `1px solid ${colour.border.subtle}`,
        borderRadius: radius[16],
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          width: 319,
          paddingTop: space[24],
          paddingBottom: space[20],
          borderRadius: radius[12],
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <BirthdayScene />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: space[32],
            width: '100%',
          }}
        >
          {/* Hidden master-swatch spacer (opacity 0 in design). */}
          <div aria-hidden style={{ width: 126, height: 86, opacity: 0 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: space[4], width: '100%', textAlign: 'center' }}>
            <p style={{ ...h28Bold, margin: 0, color: colour['text-n-icon'].primary }}>{title}</p>
            <p style={{ ...b14Medium, margin: 0, color: colour['text-n-icon'].secondary }}>{itemCount} Items</p>
          </div>
        </div>
      </div>

      {/* Social chips */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space[20],
          width: 319,
          padding: space[16],
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {SOCIALS.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: space[20], alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {row.map((def) => (
              <SocialChip key={def.channel} def={def} onPress={onShare ? () => onShare(def.channel) : undefined} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
