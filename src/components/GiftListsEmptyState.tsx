import type { CSSProperties } from 'react';
import { colour, palette, radius, space, fontFamily } from '../field-ds';

/**
 * GiftListsEmptyState — the Gift Lists landing / empty state shown when the
 * wishlist header M-Switch is toggled to "Gift lists" (Figma 1599:915021,
 * "Items nudge as stories" → Empty State + Subtler BG).
 *
 * Hero product collage → H4 headline → "how it works" steps panel →
 * primary Create CTA, over a muted tile grid that fades up into white.
 * Fills the area below the page header (parent provides width/height).
 */

export interface GiftListsEmptyStateStep {
  title: string;
  subtitle: string;
}

export interface GiftListsEmptyStateProps {
  /** H4 headline under the hero collage. */
  title?: string;
  /** The "how it works" rows (design shows three). */
  steps?: GiftListsEmptyStateStep[];
  /** Primary CTA label. */
  createLabel?: string;
  onCreate?: () => void;
  /** Base URL for the hero collage imagery. */
  assetsBase?: string;
}

const DEFAULT_STEPS: GiftListsEmptyStateStep[] = [
  { title: 'Create your gift list', subtitle: 'Tap the heart on products you like!' },
  { title: 'Share it with your family & friends', subtitle: 'One link to tell everyone what you want.' },
  { title: 'Track your gifts as they come', subtitle: 'Get gifts you want, no duplicates.' },
];

/* Noontree faces beyond the field-ds fontFamily map (declared in src/fonts.css). */
const SEMIBOLD_FAMILY = 'Noontree-SemiBold, ui-sans-serif, system-ui, sans-serif';

/* ---- Icon vectors (M-Icon/System-Icon, exported from Figma) ---- */

function HeartFilledIcon({ size = 12.32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * (11.5987 / 12.3154)}
      viewBox="0 0 12.3154 11.5987"
      fill="none"
      aria-hidden
      style={{ display: 'block' }}
    >
      <path
        d="M6.15791 11.5987C6.11486 11.5987 6.07092 11.5934 6.02875 11.5828C5.90663 11.5521 3.00294 10.7842 0.824082 7.12496C-0.43755 5.00584 -0.230208 2.36309 1.30642 0.978458C2.23243 0.142934 3.31923 -0.172474 4.36737 0.0902194C5.0878 0.271206 5.70808 0.708735 6.15791 1.33604C6.60774 0.708735 7.22801 0.271206 7.94844 0.0902194C8.9957 -0.172474 10.0825 0.142934 11.0094 0.978458C12.546 2.36397 12.7525 5.00672 11.4917 7.12496C9.31375 10.7842 6.41005 11.5521 6.28705 11.5828C6.24488 11.5934 6.20183 11.5987 6.15791 11.5987Z"
        fill={colour['text-n-icon']['on-surface-bold']}
      />
    </svg>
  );
}

function GiftBoxFilledIcon({ width, fill }: { width: number; fill: string }) {
  return (
    <svg
      width={width}
      height={width * (10.611 / 11.1163)}
      viewBox="0 0 11.1163 10.611"
      fill="none"
      aria-hidden
      style={{ display: 'block' }}
    >
      <path d="M10.0426 0C9.8588 0.497708 9.46657 0.889938 8.96886 1.07374C9.46657 1.25753 9.8588 1.64976 10.0426 2.14747C10.2264 1.64976 10.6186 1.25753 11.1163 1.07374C10.6186 0.889938 10.2264 0.497708 10.0426 0Z" fill={fill} />
      <path d="M1.01058 8.58989C0.837514 9.05791 0.468023 9.42741 0 9.60047C0.468023 9.77353 0.837514 10.143 1.01058 10.611C1.18364 10.143 1.55313 9.77353 2.02115 9.60047C1.55313 9.42741 1.18364 9.05791 1.01058 8.58989Z" fill={fill} />
      <path d="M8.90127 4.96508C9.1135 4.96508 9.31372 4.87982 9.4653 4.7257C9.62005 4.5678 9.70279 4.36063 9.70216 4.14336C9.68637 4.02904 9.66994 3.91535 9.651 3.80166C9.52215 3.02857 8.94107 2.42538 8.1844 2.26243C8.35935 2.02999 8.46294 1.74135 8.46294 1.4287C8.46294 0.662558 7.83954 0.0391595 7.0734 0.0391595C6.45442 0.0391595 5.90365 0.337911 5.55753 0.798354C5.26068 0.402967 4.81286 0.126953 4.30063 0.0568446C3.45933 -0.05874 2.67108 0.548237 2.65213 1.39649C2.64455 1.72114 2.7494 2.02178 2.93004 2.26179C2.174 2.42538 1.59229 3.02857 1.46344 3.80103C1.44449 3.91472 1.42744 4.02904 1.41228 4.14336C1.41228 4.36063 1.49439 4.5678 1.64913 4.7257C1.80072 4.88045 2.00094 4.96508 2.21316 4.96508H8.90127ZM5.93713 1.93336C5.93713 1.33206 6.40642 0.838146 6.9976 0.798986C7.31846 0.777511 7.64374 1.003 7.69679 1.3207C7.76248 1.71608 7.45741 2.05968 7.07403 2.05968H5.93713V1.93336ZM4.0423 0.79646C4.67012 0.79646 5.1792 1.30554 5.1792 1.93336V2.05968H4.06251C3.74671 2.05968 3.46375 1.83609 3.41764 1.52344C3.36016 1.13311 3.6627 0.79646 4.0423 0.79646Z" fill={fill} />
      <path d="M8.90191 5.72301H5.93713V9.5373C6.64327 9.52215 7.34878 9.46467 8.0505 9.36487C8.87159 9.2474 9.5152 8.61894 9.65163 7.80038C9.78111 7.02413 9.83416 6.24156 9.81206 5.46026C9.54489 5.63143 9.23224 5.72301 8.90191 5.72301Z" fill={fill} />
      <path d="M2.21442 5.72301C1.88409 5.72301 1.57145 5.6308 1.30428 5.46026C1.28217 6.24156 1.33522 7.02413 1.4647 7.80038C1.60113 8.61894 2.24474 9.2474 3.06583 9.36487C3.76755 9.4653 4.47306 9.52215 5.1792 9.5373V5.72301H2.21442Z" fill={fill} />
    </svg>
  );
}

/* Rail gift icon (Figma export) — brand-blue vertical gradient fills. */
function GiftBoxGradientIcon() {
  const from = palette.brandBlue[400];
  const to = palette.brandBlue[700];
  return (
    <svg width={12.83} height={12.25} viewBox="0 0 12.8333 12.25" fill="none" aria-hidden style={{ display: 'block' }}>
      <defs>
        <linearGradient id="gle-gift-grad" x1="6.41667" y1="0" x2="6.41667" y2="12.25" gradientUnits="userSpaceOnUse">
          <stop stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d="M11.5938 0C11.3816 0.574583 10.9288 1.0274 10.3542 1.23958C10.9288 1.45177 11.3816 1.90458 11.5938 2.47917C11.8059 1.90458 12.2588 1.45177 12.8333 1.23958C12.2588 1.0274 11.8059 0.574583 11.5938 0Z" fill="url(#gle-gift-grad)" />
      <path d="M1.16667 9.91667C0.966875 10.457 0.540313 10.8835 0 11.0833C0.540313 11.2831 0.966875 11.7097 1.16667 12.25C1.36646 11.7097 1.79302 11.2831 2.33333 11.0833C1.79302 10.8835 1.36646 10.457 1.16667 9.91667Z" fill="url(#gle-gift-grad)" />
      <path d="M10.2761 5.73198C10.5211 5.73198 10.7523 5.63354 10.9273 5.45562C11.1059 5.27333 11.2015 5.03417 11.2007 4.78333C11.1825 4.65135 11.1635 4.5201 11.1417 4.38885C10.9929 3.49635 10.3221 2.8 9.44854 2.61187C9.65052 2.34354 9.7701 2.01031 9.7701 1.64937C9.7701 0.764896 9.05042 0.045208 8.16594 0.045208C7.45135 0.045208 6.81552 0.390104 6.41594 0.921666C6.07323 0.465208 5.55625 0.146562 4.96489 0.0656246C3.99364 -0.0678129 3.08365 0.632916 3.06177 1.61219C3.05302 1.98698 3.17406 2.33406 3.3826 2.61115C2.50979 2.8 1.83823 3.49635 1.68948 4.38813C1.6676 4.51938 1.64792 4.65135 1.63042 4.78333C1.63042 5.03417 1.72521 5.27333 1.90385 5.45562C2.07885 5.63427 2.31 5.73198 2.555 5.73198H10.2761ZM6.85417 2.23198C6.85417 1.53781 7.39594 0.967604 8.07844 0.922396C8.44885 0.897604 8.82437 1.15792 8.88562 1.52469C8.96146 1.98115 8.60927 2.37781 8.16667 2.37781H6.85417V2.23198ZM4.66667 0.919479C5.39146 0.919479 5.97917 1.50719 5.97917 2.23198V2.37781H4.69C4.32542 2.37781 3.99875 2.11969 3.94552 1.75875C3.87917 1.30812 4.22844 0.919479 4.66667 0.919479Z" fill="url(#gle-gift-grad)" />
      <path d="M10.2769 6.60698H6.85417V11.0104C7.66938 10.9929 8.48385 10.9266 9.29396 10.8114C10.2419 10.6757 10.9849 9.95021 11.1424 9.00521C11.2919 8.10906 11.3531 7.20562 11.3276 6.30364C11.0192 6.50125 10.6582 6.60698 10.2769 6.60698Z" fill="url(#gle-gift-grad)" />
      <path d="M2.55646 6.60698C2.17511 6.60698 1.81417 6.50052 1.50573 6.30364C1.48021 7.20562 1.54146 8.10906 1.69094 9.00521C1.84844 9.95021 2.59146 10.6757 3.53938 10.8114C4.34948 10.9273 5.16396 10.9929 5.97917 11.0104V6.60698H2.55646Z" fill="url(#gle-gift-grad)" />
    </svg>
  );
}

function MiniChevronDown() {
  return (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        opacity: 0.45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <svg width={8} height={4.6} viewBox="0 0 8 4.6" fill="none" style={{ display: 'block' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.175736 0.175736C0.410051 -0.0585787 0.78995 -0.0585786 1.02426 0.175736L4 3.15147L6.97574 0.175736C7.21005 -0.0585781 7.58995 -0.058578 7.82426 0.175737C8.05858 0.410051 8.05858 0.78995 7.82426 1.02426L4.42426 4.42426C4.31174 4.53679 4.15913 4.6 4 4.6C3.84087 4.6 3.68826 4.53679 3.57574 4.42426L0.175736 1.02426C-0.0585787 0.789949 -0.0585786 0.41005 0.175736 0.175736Z"
          fill={colour['text-n-icon'].muted}
        />
      </svg>
    </span>
  );
}

function PlusCircleIcon() {
  const fill = colour['text-n-icon']['on-surface-bold'];
  return (
    <span aria-hidden style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <svg width={16.25} height={16.25} viewBox="0 0 16.25 16.25" fill="none" style={{ display: 'block' }}>
        <path d="M11.4583 7.5H8.75V4.79167C8.75 4.44687 8.46979 4.16667 8.125 4.16667C7.78021 4.16667 7.5 4.44687 7.5 4.79167V7.5H4.79167C4.44687 7.5 4.16667 7.78021 4.16667 8.125C4.16667 8.46979 4.44687 8.75 4.79167 8.75H7.5V11.4583C7.5 11.8031 7.78021 12.0833 8.125 12.0833C8.46979 12.0833 8.75 11.8031 8.75 11.4583V8.75H11.4583C11.8031 8.75 12.0833 8.46979 12.0833 8.125C12.0833 7.78021 11.8031 7.5 11.4583 7.5Z" fill={fill} />
        <path d="M8.125 0C3.64479 0 0 3.64479 0 8.125C0 12.6052 3.64479 16.25 8.125 16.25C12.6052 16.25 16.25 12.6052 16.25 8.125C16.25 3.64479 12.6052 0 8.125 0ZM8.125 15C4.33437 15 1.25 11.9156 1.25 8.125C1.25 4.33437 4.33437 1.25 8.125 1.25C11.9156 1.25 15 4.33437 15 8.125C15 11.9156 11.9156 15 8.125 15Z" fill={fill} />
      </svg>
    </span>
  );
}

/* ---- Subtler BG: muted tile grid fading up into white (Figma "Subtler BG") ---- */

const BG_TILE = 46.875; // 8 tiles across 375
const BG_ROWS = 11;
const BG_HEIGHT = 516;

function SubtlerBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        insetInline: 0,
        bottom: 0,
        height: BG_HEIGHT,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {Array.from({ length: BG_ROWS * 8 }, (_, i) => (
          <span
            key={i}
            style={{
              width: BG_TILE,
              height: BG_TILE,
              flex: 'none',
              boxSizing: 'border-box',
              backgroundColor: colour.surface.muted,
              border: `0.3px solid ${colour.border.white}`,
              borderRadius: 6.392,
            }}
          />
        ))}
      </div>
      {/* Radial white veil — tiles peak at bottom centre, fully white by mid-screen. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(216.65px 298.11px at 187.5px 423.5px, rgba(255,255,255,0.6) 0%, ${colour.surface.primary} 100%)`,
        }}
      />
    </div>
  );
}

/* ---- Hero collage (Figma Group 2147227196, 150 × 109.34) ---- */

function HeroCollage({ assetsBase }: { assetsBase: string }) {
  const cardBase: CSSProperties = {
    position: 'absolute',
    backgroundColor: colour.surface.primary,
    overflow: 'hidden',
  };
  const imgBase: CSSProperties = {
    position: 'absolute',
    objectFit: 'cover',
    pointerEvents: 'none',
  };
  const bubbleBase: CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ position: 'relative', width: 150, height: 109.336 }}>
      {/* Right card — fridge */}
      <div
        style={{
          ...cardBase,
          left: 105.27,
          top: 41.76,
          width: 44.731,
          height: 59.642,
          borderRadius: 7.534,
          boxShadow: '0px 1.176px 11.759px 0px rgba(255,255,255,0.6)',
        }}
      >
        <img src={`${assetsBase}/hero-fridge.png`} alt="" style={{ ...imgBase, left: -1.78, top: 0, width: 50.67, height: 76.005 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: colour.surface.primary, opacity: 0.1 }} />
      </div>

      {/* Centre card — AirPods */}
      <div
        style={{
          ...cardBase,
          left: 47.86,
          top: 20.14,
          width: 66.895,
          height: 89.194,
          borderRadius: 11.267,
          boxShadow: '1.024px 2.325px 11.267px 0px rgba(0,0,0,0.06)',
        }}
      >
        <img src={`${assetsBase}/hero-airpods.png`} alt="" style={{ ...imgBase, left: -13.02, top: -5.04, width: 99.071, height: 123.839 }} />
      </div>

      {/* Left card — fashion */}
      <div
        style={{
          ...cardBase,
          left: 22.2,
          top: 4.14,
          width: 37.12,
          height: 49.493,
          borderRadius: 6.252,
          boxShadow: '0px 1.186px 11.857px 0px rgba(255,255,255,0.6)',
        }}
      >
        <img src={`${assetsBase}/hero-model.png`} alt="" style={{ ...imgBase, left: -11.61, top: -19.29, width: 60.334, height: 105.584 }} />
      </div>

      {/* Heart bubble — grey chat bubble, tail bottom-right */}
      <div
        style={{
          ...bubbleBase,
          left: 0,
          top: 58.95,
          width: 28.918,
          height: 28.918,
          borderRadius: '42.637px 42.637px 3.553px 42.637px',
          background: `linear-gradient(161.431deg, ${palette.grey[200]} 10.812%, ${palette.grey[400]} 116.31%)`,
        }}
      >
        <HeartFilledIcon />
      </div>

      {/* Gift bubble */}
      <div
        style={{
          ...bubbleBase,
          left: 115.73,
          top: 0,
          width: 20.104,
          height: 20.104,
          borderRadius: radius.rounded,
          background: `linear-gradient(153.161deg, ${palette.grey[200]} 21.126%, ${palette.grey[400]} 97.901%)`,
        }}
      >
        <GiftBoxFilledIcon width={11.12} fill={colour['text-n-icon']['on-surface-bold']} />
      </div>
    </div>
  );
}

/* ---- Steps panel (Figma "Landing Page widgets", 319 × 248) ---- */

function DottedSeparator() {
  return (
    <svg width="100%" height="1" aria-hidden style={{ display: 'block', flex: 'none' }}>
      <line
        x1="0.5"
        y1="0.5"
        x2="99.8%"
        y2="0.5"
        stroke={colour.border.medium}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.5 3"
      />
    </svg>
  );
}

function RailNumber({ value }: { value: string }) {
  return (
    <span
      style={{
        width: 24,
        height: 24,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.rounded,
        backgroundColor: colour.surface['action-subtle'],
        fontFamily: `${fontFamily.heavy.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
        fontSize: 9,
        lineHeight: '13.912px',
        letterSpacing: -0.18,
        color: palette.grey[800],
      }}
    >
      {value}
    </span>
  );
}

function StepsRail() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', alignSelf: 'stretch', paddingBottom: 18, flex: 'none' }}>
      <div
        style={{
          height: '100%',
          backgroundColor: colour.surface.primary,
          borderRadius: radius[32],
          padding: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            height: '100%',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <RailNumber value="1" />
          <MiniChevronDown />
          <MiniChevronDown />
          <MiniChevronDown />
          <RailNumber value="2" />
          <MiniChevronDown />
          <MiniChevronDown />
          <MiniChevronDown />
          <span
            style={{
              width: 24,
              height: 24,
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.rounded,
              background: `linear-gradient(to bottom, ${palette.brandBlue[50]}, ${palette.brandBlue[200]})`,
            }}
          >
            <span style={{ transform: 'translate(0.3px, -0.2px)', display: 'flex' }}>
              <GiftBoxGradientIcon />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function StepRow({ step, height }: { step: GiftListsEmptyStateStep; height?: number }) {
  return (
    <div style={{ width: '100%', height, display: 'flex', alignItems: 'center', flex: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[6], minWidth: 0, flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontFamily: SEMIBOLD_FAMILY,
            fontWeight: 600,
            fontSize: 16,
            lineHeight: '22px',
            letterSpacing: -0.15,
            color: colour['text-n-icon'].primary,
            wordBreak: 'break-word',
          }}
        >
          {step.title}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: `${fontFamily.regular.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
            fontSize: 13,
            lineHeight: '20px',
            letterSpacing: -0.1,
            color: colour['text-n-icon'].tertiary,
            wordBreak: 'break-word',
          }}
        >
          {step.subtitle}
        </p>
      </div>
    </div>
  );
}

function StepsPanel({ steps }: { steps: GiftListsEmptyStateStep[] }) {
  return (
    <div
      style={{
        width: 319,
        height: 248,
        backgroundColor: colour.surface.primary,
        borderRadius: radius[24],
        padding: space[4],
        overflow: 'hidden',
        boxSizing: 'border-box',
        flex: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 240,
          borderRadius: radius[24],
          background: `linear-gradient(to bottom, ${palette.brandBlue[50]}, ${palette.brandBlue[100]})`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: space[14],
          paddingBlock: space[20],
          paddingInline: space[12],
          boxSizing: 'border-box',
        }}
      >
        <StepsRail />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: space[16] }}>
          {steps.map((step, i) => {
            const last = i === steps.length - 1;
            return (
              <div key={step.title} style={{ display: 'contents' }}>
                <StepRow step={step} height={last ? 40 : 48} />
                {!last && <DottedSeparator />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---- Component ---- */

export function GiftListsEmptyState({
  title = 'Celebrate a milestone!',
  steps = DEFAULT_STEPS,
  createLabel = 'Create',
  onCreate,
  assetsBase = '/gift-registry/gift-lists',
}: GiftListsEmptyStateProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: colour.surface.primary,
      }}
    >
      <SubtlerBackground />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: space[32],
          paddingTop: 68.33,
          boxSizing: 'border-box',
        }}
      >
        {/* Hero collage + headline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[16] }}>
          <HeroCollage assetsBase={assetsBase} />
          <h2
            style={{
              margin: 0,
              width: 311,
              textAlign: 'center',
              fontFamily: `${fontFamily.bold.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
              fontWeight: 400,
              fontSize: 20,
              lineHeight: '24px',
              letterSpacing: -0.2,
              color: palette.grey[1000],
              fontFeatureSettings: '"case"',
            }}
          >
            {title}
          </h2>
        </div>

        <StepsPanel steps={steps} />

        {/* Primary CTA — Figma Button (H48, action-bold, B16/SemiBold). Metrics
            follow the design node, which differs from the field-ds Button H48
            preset (px-24, r-10, 14px label), so it's built from tokens here. */}
        <button
          type="button"
          onClick={onCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: space[8],
            height: 48,
            paddingInline: space[20],
            backgroundColor: colour.surface['action-bold'],
            border: 'none',
            borderRadius: radius[12],
            cursor: onCreate ? 'pointer' : 'default',
            flex: 'none',
          }}
        >
          <PlusCircleIcon />
          <span
            style={{
              fontFamily: SEMIBOLD_FAMILY,
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '20px',
              letterSpacing: -0.15,
              color: colour['text-n-icon']['on-surface-bold'],
              whiteSpace: 'nowrap',
            }}
          >
            {createLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
