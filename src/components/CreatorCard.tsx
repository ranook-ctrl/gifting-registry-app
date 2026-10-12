import { useState, useRef, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { colour, palette, space, radius } from '../field-ds';

/**
 * Creator Card — the product card used in a gifting registry list.
 * 1:1 with Figma "Creator Cards" (node 1547:587290). Six variants:
 * available (with QTY badge), inline stepper, locked stepper, and the three
 * gift-state cards (ordered / out of stock / purchased) that dim the card.
 */
export type CreatorCardVariant =
  | 'default'
  | 'stepper'
  | 'stepperLocked'
  | 'ordered'
  | 'outOfStock'
  | 'purchased';

export interface CreatorCardProps {
  variant?: CreatorCardVariant;
  imageUrl: string;
  name: string;
  /** Selling price digits only, e.g. "899". Currency mark is prepended. */
  sellingPrice: string;
  /** Struck-through list price digits, e.g. "1399". */
  listedPrice: string;
  /** Discount label, e.g. "33%". */
  discount: string;
  /** Currency mark rendered before the selling price. Defaults to the dirham mark. */
  currency?: ReactNode;
  quantity?: number;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  /** Tapping the QTY badge (default variant only). */
  onQtyPress?: () => void;
  onPress?: () => void;
  /**
   * Image-only preview: render just the product image (with its favorite heart),
   * hiding the QTY badge, carousel dots and the name/price details. Used for the
   * empty-state "gifts you might like" fan (Figma 1450:1411992).
   */
  imageOnly?: boolean;
}

const DIMMED: CreatorCardVariant[] = ['ordered', 'outOfStock', 'purchased'];
const STEPPERS: CreatorCardVariant[] = ['stepper', 'stepperLocked'];

const FONT_STACK =
  '"Noontree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// Entrance used when the QTY badge and inline stepper swap places, so the
// change reads as a smooth reveal rather than an abrupt cut.
const SWAP_ANIM = 'creatorcard-swap 300ms ease-in-out';
const SWAP_ANIM_STYLE_ID = 'creatorcard-swap-keyframes';

function ensureSwapKeyframes() {
  if (typeof document === 'undefined' || document.getElementById(SWAP_ANIM_STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = SWAP_ANIM_STYLE_ID;
  el.textContent =
    '@keyframes creatorcard-swap{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}';
  document.head.appendChild(el);
}

function font(weight: number, size: number, lineHeight: number, letterSpacing = -0.1): CSSProperties {
  return {
    fontFamily: FONT_STACK,
    fontWeight: weight,
    fontSize: size,
    lineHeight: `${lineHeight}px`,
    letterSpacing: `${letterSpacing}px`,
  };
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M14 5.5C14 3.84315 12.6009 2.5 10.875 2.5C9.58459 2.5 8.47685 3.25085 8 4.32228C7.52315 3.25085 6.41541 2.5 5.125 2.5C3.39911 2.5 2 3.84315 2 5.5C2 10.3137 8 13.5 8 13.5C8 13.5 14 10.3137 14 5.5Z"
        fill={palette.pink[600]}
      />
      <path
        d="M13.5 5.5C13.5 4.13833 12.3442 3 10.875 3C9.78026 3 8.85286 3.63628 8.45703 4.52539C8.37673 4.70583 8.1975 4.82227 8 4.82227C7.8025 4.82227 7.62327 4.70583 7.54297 4.52539C7.14714 3.63628 6.21974 3 5.125 3C3.65582 3 2.5 4.13833 2.5 5.5C2.5 7.69696 3.87469 9.57273 5.34082 10.9395C6.06565 11.6151 6.79243 12.1475 7.33887 12.5107C7.61162 12.6921 7.83894 12.8304 7.99609 12.9229C7.99735 12.9236 7.99875 12.9241 8 12.9248C8.00125 12.9241 8.00265 12.9236 8.00391 12.9229C8.16106 12.8304 8.38838 12.6921 8.66113 12.5107C9.20757 12.1475 9.93435 11.6151 10.6592 10.9395C12.1253 9.57273 13.5 7.69696 13.5 5.5ZM14.5 5.5C14.5 8.11673 12.8747 10.2411 11.3408 11.6709C10.5658 12.3934 9.79239 12.9592 9.21387 13.3438C8.9246 13.536 8.68257 13.6837 8.51172 13.7842C8.4262 13.8345 8.35765 13.8731 8.31055 13.8994C8.28708 13.9125 8.26869 13.9227 8.25586 13.9297C8.24948 13.9332 8.24481 13.9365 8.24121 13.9385C8.23941 13.9394 8.23741 13.9398 8.23633 13.9404L8.23535 13.9414H8.23438C8.08775 14.0193 7.91225 14.0193 7.76562 13.9414H7.76465L7.76367 13.9404C7.76259 13.9398 7.76059 13.9394 7.75879 13.9385C7.75519 13.9365 7.75052 13.9332 7.74414 13.9297C7.73131 13.9227 7.71292 13.9125 7.68945 13.8994C7.64235 13.8731 7.5738 13.8345 7.48828 13.7842C7.31743 13.6837 7.0754 13.536 6.78613 13.3438C6.20761 12.9592 5.43424 12.3934 4.65918 11.6709C3.12532 10.2411 1.5 8.11673 1.5 5.5C1.5 3.54796 3.1424 2 5.125 2C6.29188 2 7.33496 2.53491 8 3.37109C8.66504 2.53491 9.70812 2 10.875 2C12.8576 2 14.5 3.54796 14.5 5.5Z"
        fill={palette.pink[600]}
      />
    </svg>
  );
}

function VerifiedBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 11.9601 11.9601" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.7856 0.243784C7.82736 -0.353289 9.15167 0.195787 9.46668 1.35381L9.68502 2.15728L9.68526 2.15801C9.70037 2.21391 9.74419 2.25887 9.80278 2.27503L10.6062 2.49338C11.7468 2.80269 12.2959 4.09206 11.7435 5.12554L11.7163 5.17453L11.3022 5.89702C11.2733 5.94745 11.2727 6.01067 11.3022 6.06304L11.7163 6.78553C12.3134 7.82727 11.7643 9.15166 10.6063 9.46668H10.6062L9.80286 9.68503L9.80204 9.68527C9.74599 9.70042 9.70099 9.74444 9.68494 9.80327L9.46676 10.6058L9.46684 10.6058C9.15275 11.7647 7.82699 12.3132 6.7856 11.7164L6.06303 11.3022C6.01237 11.2732 5.94878 11.2727 5.89628 11.3026L5.17452 11.7164C4.13278 12.3134 2.80848 11.7643 2.49345 10.6063L2.49337 10.6062L2.27502 9.80287L2.27486 9.80205C2.25972 9.74602 2.21567 9.70101 2.15686 9.68495L1.35429 9.46677C0.195394 9.15268 -0.353108 7.82693 0.243774 6.78553L0.657918 6.06304C0.686802 6.01262 0.687443 5.94938 0.657918 5.89702L0.243774 5.17453C-0.353318 4.13277 0.195773 2.80847 1.3538 2.49346L1.35388 2.49338L2.15727 2.27503L2.158 2.27487C2.21391 2.25976 2.25887 2.21589 2.27502 2.15728L2.49337 1.35389C2.80272 0.213348 4.09207 -0.335807 5.12553 0.216603L5.17452 0.243784L5.89701 0.657928C5.94743 0.686809 6.01067 0.687448 6.06303 0.657928L6.7856 0.243784ZM8.33687 4.29652C8.14161 4.10126 7.82511 4.10126 7.62984 4.29652L5.31669 6.60967L4.67021 5.96319C4.47495 5.76792 4.15844 5.76793 3.96318 5.96319C3.76791 6.15845 3.76791 6.47495 3.96318 6.67022L4.96318 7.67022C5.15844 7.86547 5.47495 7.86548 5.67021 7.67022L8.33687 5.00355C8.53213 4.80829 8.53213 4.49178 8.33687 4.29652Z"
        fill="url(#creatorcard-verified)"
      />
      <defs>
        <radialGradient
          id="creatorcard-verified"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0.958822 2.66228) rotate(34.9456) scale(14.9052 12.6897)"
        >
          <stop stopColor="#0B623F" />
          <stop offset="0.670145" stopColor="#44AF84" />
          <stop offset="1" stopColor="#0B623F" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13C2.91015 13 0 10.0899 0 6.5C0 2.91015 2.91015 0 6.5 0ZM9.18685 4.47982C8.99159 4.28456 8.67508 4.28456 8.47982 4.47982L5.5 7.45964L4.52018 6.47982C4.32492 6.28456 4.00841 6.28456 3.81315 6.47982C3.61789 6.67508 3.61789 6.99159 3.81315 7.18685L5.14648 8.52018C5.34175 8.71544 5.65825 8.71544 5.85352 8.52018L9.18685 5.18685C9.38211 4.99159 9.38211 4.67508 9.18685 4.47982Z"
        fill="url(#creatorcard-check)"
      />
      <defs>
        <radialGradient
          id="creatorcard-check"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(1.04219 2.89375) rotate(34.9457) scale(16.2011 13.7931)"
        >
          <stop stopColor="#0F61FF" />
          <stop offset="0.670145" stopColor="#3392FF" />
          <stop offset="1" stopColor="#0F61FF" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function MinusIcon({ color }: { color: string }) {
  return (
    <span style={{ position: 'relative', width: 20, height: 20, flexShrink: 0, overflow: 'hidden' }}>
      <span style={{ position: 'absolute', inset: '46.88% 21.88%' }}>
        <svg width="100%" height="100%" viewBox="0 0 11.25 1.25" preserveAspectRatio="none" fill="none" style={{ display: 'block' }} aria-hidden>
          <path
            d="M10.625 0C10.9702 0 11.25 0.279822 11.25 0.625C11.25 0.970178 10.9702 1.25 10.625 1.25H0.625C0.279822 1.25 0 0.970178 0 0.625C0 0.279822 0.279822 0 0.625 0H10.625Z"
            fill={color}
          />
        </svg>
      </span>
    </span>
  );
}

function PlusIcon({ color }: { color: string }) {
  return (
    <span style={{ position: 'relative', width: 20, height: 20, flexShrink: 0, overflow: 'hidden' }}>
      <span style={{ position: 'absolute', inset: '19.79%' }}>
        <svg width="100%" height="100%" viewBox="0 0 12.0833 12.0833" preserveAspectRatio="none" fill="none" style={{ display: 'block' }} aria-hidden>
          <path
            d="M11.4583 5.41667H6.66667V0.625C6.66667 0.280208 6.38646 0 6.04167 0C5.69687 0 5.41667 0.280208 5.41667 0.625V5.41667H0.625C0.280208 5.41667 0 5.69687 0 6.04167C0 6.38646 0.280208 6.66667 0.625 6.66667H5.41667V11.4583C5.41667 11.8031 5.69687 12.0833 6.04167 12.0833C6.38646 12.0833 6.66667 11.8031 6.66667 11.4583V6.66667H11.4583C11.8031 6.66667 12.0833 6.38646 12.0833 6.04167C12.0833 5.69687 11.8031 5.41667 11.4583 5.41667Z"
            fill={color}
          />
        </svg>
      </span>
    </span>
  );
}

function PageDots({ dimmed }: { dimmed: boolean }) {
  const subtle = colour.surface['overlay-subtle'];
  const dot = (size: number, bg: string, key: number) => (
    <span key={key} style={{ width: size, height: size, borderRadius: radius.rounded, backgroundColor: bg, flexShrink: 0 }} />
  );
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 6.33,
        left: 'calc(50% + 0.25px)',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingInline: 4,
        paddingBlock: 2,
        borderRadius: radius.rounded,
        backgroundColor: palette.alphaDark[4],
        overflow: 'hidden',
        opacity: dimmed ? 0.5 : 1,
      }}
    >
      {dot(4, colour.surface['primary-inverted'], 1)}
      {dot(3, subtle, 2)}
      {dot(2, subtle, 3)}
      {dot(1, subtle, 4)}
    </div>
  );
}

function Heart({ onToggle }: { onToggle?: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      aria-label="Toggle favorite"
      style={{
        position: 'absolute',
        insetInlineStart: 134,
        top: 6,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderRadius: radius.rounded,
        backgroundColor: palette.alphaLight[16],
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <HeartIcon />
    </button>
  );
}

function QtyBadge({
  quantity,
  dimmed,
  atStart,
  onPress,
}: {
  quantity: number;
  dimmed: boolean;
  atStart: boolean;
  onPress?: () => void;
}) {
  const boxStyle: CSSProperties = {
    position: 'absolute',
    ...(atStart ? { insetInlineStart: 116 } : { insetInlineEnd: 8 }),
    top: 160,
    width: 42,
    height: 42,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: space[12],
    paddingBottom: 11,
    paddingInline: space[14],
    borderRadius: radius[10],
    backgroundColor: colour.surface.primary,
    border: `0.893px solid ${colour.border.primary}`,
    opacity: dimmed ? 0.5 : 1,
  };
  const content = (
    <>
      <span style={{ ...font(500, 11, 14), color: colour['text-n-icon'].muted, whiteSpace: 'nowrap' }}>QTY</span>
      <span style={{ ...font(700, 14, 18), color: colour['text-n-icon'].secondary, whiteSpace: 'nowrap' }}>{quantity}</span>
    </>
  );
  if (onPress) {
    ensureSwapKeyframes();
    return (
      <button
        type="button"
        aria-label="Edit quantity"
        onClick={(e) => {
          e.stopPropagation();
          onPress();
        }}
        style={{ ...boxStyle, cursor: 'pointer', animation: SWAP_ANIM }}
      >
        {content}
      </button>
    );
  }
  return <div style={boxStyle}>{content}</div>;
}

function Stepper({
  quantity,
  locked,
  onIncrement,
  onDecrement,
}: {
  quantity: number;
  locked: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) {
  const minusColor = colour['text-n-icon'].muted;
  const plusColor = locked ? colour['text-n-icon'].muted : colour['text-n-icon'].primary;
  const btn: CSSProperties = { background: 'none', border: 'none', padding: 0, cursor: locked ? 'default' : 'pointer', display: 'flex' };
  ensureSwapKeyframes();
  return (
    <div
      style={{
        position: 'absolute',
        insetInlineEnd: 8,
        top: 160,
        width: 90,
        height: 42,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: space[12],
        borderRadius: radius[10],
        backgroundColor: colour.surface.primary,
        border: `1px solid ${colour.border.primary}`,
        overflow: 'hidden',
        animation: SWAP_ANIM,
      }}
    >
      <button type="button" aria-label="Decrease quantity" disabled={locked} style={btn} onClick={onDecrement}>
        <MinusIcon color={minusColor} />
      </button>
      <span style={{ ...font(600, 14, 20, 0), color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{quantity}</span>
      <button type="button" aria-label="Increase quantity" disabled={locked} style={btn} onClick={onIncrement}>
        <PlusIcon color={plusColor} />
      </button>
    </div>
  );
}

function StateBadge({ variant }: { variant: 'ordered' | 'outOfStock' | 'purchased' }) {
  const base: CSSProperties = {
    position: 'absolute',
    insetInlineStart: 0,
    top: 4,
    display: 'flex',
    gap: space[4],
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: space[10],
    paddingBlock: space[6],
    borderStartEndRadius: radius[8],
    borderEndEndRadius: radius[8],
  };

  if (variant === 'ordered') {
    return (
      <div
        style={{
          ...base,
          border: `0.8px solid ${palette.green[200]}`,
          backgroundImage:
            'linear-gradient(94.2837deg, #e3fcf2 1.0666%, #f6fefb 75.037%, #cbf6e5 99.694%)',
        }}
      >
        <VerifiedBadgeIcon />
        <span style={{ ...font(600, 12, 16, 0), color: colour['text-n-icon'].success_bold, whiteSpace: 'nowrap' }}>Ordered</span>
      </div>
    );
  }

  if (variant === 'purchased') {
    return (
      <div
        style={{
          ...base,
          border: `0.8px solid ${palette.brandBlue[200]}`,
          backgroundImage:
            'linear-gradient(94.8788deg, #d6e9ff 1.0666%, #f5faff 75.037%, #d6e9ff 99.694%)',
        }}
      >
        <CheckCircleIcon />
        <span style={{ ...font(600, 12, 16, 0), color: colour['text-n-icon'].action, whiteSpace: 'nowrap' }}>Purchased</span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...base,
        border: `0.8px solid ${colour.border.primary}`,
        backgroundColor: colour.surface.tertiary,
      }}
    >
      <span style={{ ...font(600, 12, 16, 0), color: colour['text-n-icon'].muted, whiteSpace: 'nowrap' }}>Out of stock</span>
    </div>
  );
}

function Pricing({
  sellingPrice,
  listedPrice,
  discount,
  currency,
}: {
  sellingPrice: string;
  listedPrice: string;
  discount: string;
  currency: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end', width: '100%' }}>
        <span
          style={{
            ...font(700, 14, 18),
            color: colour['text-n-icon'].primary,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          {currency}
          {sellingPrice}
        </span>
        <span
          style={{
            ...font(400, 12, 16),
            color: colour['text-n-icon'].tertiary,
            textDecoration: 'line-through',
            whiteSpace: 'nowrap',
          }}
        >
          {listedPrice}
        </span>
        <span style={{ ...font(600, 12, 16), color: colour['text-n-icon'].success, whiteSpace: 'nowrap' }}>{discount}</span>
      </div>
    </div>
  );
}

export function CreatorCard({
  variant = 'default',
  imageUrl,
  name,
  sellingPrice,
  listedPrice,
  discount,
  currency,
  quantity = 1,
  favorited: _favorited = true,
  onToggleFavorite,
  onIncrement,
  onDecrement,
  onQtyPress,
  onPress,
  imageOnly = false,
}: CreatorCardProps) {
  const dimmed = DIMMED.includes(variant);
  const isStepper = STEPPERS.includes(variant);
  const width = dimmed ? 170 : 166;

  // Default cards manage the QTY↔stepper swap themselves: tapping the QTY badge
  // reveals the inline stepper (configured at the component level), and stepping
  // the quantity back below 1 returns to the QTY badge.
  const [showStepper, setShowStepper] = useState(false);
  const [internalQty, setInternalQty] = useState(quantity);
  const cardRef = useRef<HTMLDivElement>(null);
  const handleIncrement = () => {
    setInternalQty((q) => q + 1);
    onIncrement?.();
  };
  const handleDecrement = () => {
    if (internalQty <= 1) setShowStepper(false);
    else setInternalQty((q) => q - 1);
    onDecrement?.();
  };

  // While the inline stepper is open, revert to the QTY badge (quantity retained)
  // after 3s of inactivity or when the user taps anywhere outside this card. The
  // effect re-runs on every quantity change, so each +/- resets the idle timer.
  useEffect(() => {
    if (!showStepper) return;
    const timer = setTimeout(() => setShowStepper(false), 3000);
    const onOutside = (e: Event) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowStepper(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, [showStepper, internalQty]);

  return (
    <div
      ref={cardRef}
      onClick={onPress}
      style={{
        width,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'hidden',
        borderRadius: radius[12],
        backgroundColor: colour.surface.primary,
        border: `1px solid ${colour.surface.primary}`,
        cursor: onPress ? 'pointer' : 'default',
      }}
    >
      {/* Top container / image */}
      <div
        style={{
          position: 'relative',
          height: 220,
          width: '100%',
          overflow: 'hidden',
          borderRadius: radius[12],
          backgroundColor: colour.surface.secondary,
        }}
      >
        <img
          src={imageUrl}
          alt={name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            opacity: dimmed ? 0.6 : 1,
          }}
        />

        {!imageOnly && <PageDots dimmed={dimmed} />}
        <Heart onToggle={onToggleFavorite} />

        {!imageOnly && dimmed && <StateBadge variant={variant as 'ordered' | 'outOfStock' | 'purchased'} />}

        {!imageOnly && variant === 'default' && !showStepper && (
          <QtyBadge
            quantity={internalQty}
            dimmed={false}
            atStart={false}
            onPress={() => {
              setShowStepper(true);
              onQtyPress?.();
            }}
          />
        )}
        {!imageOnly && variant === 'default' && showStepper && (
          <Stepper quantity={internalQty} locked={false} onIncrement={handleIncrement} onDecrement={handleDecrement} />
        )}
        {!imageOnly && dimmed && <QtyBadge quantity={quantity} dimmed atStart />}
        {!imageOnly && isStepper && (
          <Stepper
            quantity={quantity}
            locked={variant === 'stepperLocked'}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        )}
      </div>

      {/* Bottom container / details */}
      {!imageOnly && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          boxSizing: 'border-box',
          gap: dimmed ? 12 : 6,
          ...(dimmed
            ? { paddingInline: space[8], paddingBlock: space[6] }
            : { padding: space[6] }),
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            gap: 6,
            opacity: dimmed ? 0.6 : 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
            <span
              style={{
                ...font(500, 12, 16),
                color: colour['text-n-icon'].primary,
                flex: '1 0 0',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </span>
          </div>
          <Pricing sellingPrice={sellingPrice} listedPrice={listedPrice} discount={discount} currency={currency} />
        </div>
      </div>
      )}
    </div>
  );
}
