import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { colour, palette, space, radius, fontFamily } from '../field-ds';

import iconMenu from './assets/gifter-card/icon-menu.svg';
import iconStar from './assets/gifter-card/icon-star.svg';
import badgeEta from './assets/gifter-card/badge-eta.svg';
import iconDelete from './assets/gifter-card/icon-delete.svg';
import iconMinus from './assets/gifter-card/icon-minus.svg';
import iconPlus from './assets/gifter-card/icon-plus.svg';
import iconVerified from './assets/gifter-card/icon-verified.svg';
import iconBagDefault from './assets/gifter-card/icon-bag-default.svg';
import iconBagMuted from './assets/gifter-card/icon-bag-listclosed.svg';

export type GifterCardState =
  | 'default'
  | 'purchased'
  | 'ordered'
  | 'out-of-order'
  | 'in-bag'
  | 'list-closed';

export interface GifterCardProps {
  /** Product image URL (a single product photo — the carousel dots are decorative). */
  imageUrl: string;
  /** Product title; truncates to one line. */
  name: string;
  /** Selling price, digits only (optional currency glyph is prepended). e.g. "899". */
  price: string;
  /** Original price shown struck through. e.g. "1399". */
  wasPrice?: string;
  /** Discount label. e.g. "33%". */
  discount?: string;
  /** Optional currency glyph rendered before the price. Empty by default. */
  currency?: string;
  /** Rating value. e.g. 4.3. */
  rating?: number;
  /** Review count. e.g. 128. */
  reviewCount?: number;
  /** Which action row / availability state to render. */
  state?: GifterCardState;
  /**
   * Overrides the card's intrinsic width. Pass `'100%'` to let the card fill a
   * grid column; defaults to the Figma-spec fixed width otherwise.
   */
  width?: number | string;
  /** Quantity shown in the stepper when state is `in-bag`. */
  quantity?: number;
  onMenu?: () => void;
  /** Fired when "Mark as purchased" is chosen from the overflow menu. */
  onMarkPurchased?: () => void;
  /** Tapping the "Purchased" pill (purchased state) — used to revert it. */
  onUnmarkPurchased?: () => void;
  /** Tapping the card body (image or product info) — opens the product explorer. */
  onOpen?: () => void;
  /**
   * Which grid column the card sits in. Controls which side the options popover
   * opens toward — left-column cards open it rightward so it stays on screen.
   */
  menuAlign?: 'left' | 'right';
  onAddToBag?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  /** Remove from bag (stepper trash tap). */
  onRemove?: () => void;
}

// Design literal: this tinted-blue fill (#ebf0fd) is hardcoded in the Figma source
// and has no matching Field DS token — kept verbatim for a 1:1 match.
const ACTION_TINT = '#ebf0fd';

// Noontree carries weight in the face name; the sans fallback needs an explicit
// numeric weight to render faithfully where Noontree isn't installed.
const ff = (family: string) => `${family}, 'SF Pro Text', system-ui, sans-serif`;

const FONT = {
  regular: { fontFamily: ff(fontFamily.regular.fontFamily), fontWeight: 400 },
  medium: { fontFamily: ff(fontFamily.medium.fontFamily), fontWeight: 500 },
  semibold: { fontFamily: ff('Noontree-SemiBold'), fontWeight: 600 },
  bold: { fontFamily: ff(fontFamily.bold.fontFamily), fontWeight: 700 },
} as const satisfies Record<string, CSSProperties>;

// Icon glyphs sit centred in a 16px tap target; the visible artwork is sized to
// the Figma glyph dimensions (viewBox), leaving the design's padding around it.
function GlyphIcon({ src, w, h, opacity }: { src: string; w: number; h: number; opacity?: number }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        flexShrink: 0,
        overflow: 'hidden',
        opacity,
      }}
    >
      <img alt="" src={src} style={{ width: w, height: h, display: 'block' }} />
    </span>
  );
}

// Mirrors the Figma node structure exactly: a 16px clip box with the glyph
// positioned by per-edge inset percentages (matching the design's asymmetric
// padding). `nestedInset` reproduces the design's stroke-overflow wrapper.
function FigmaIcon({
  src,
  inset,
  nestedInset,
}: {
  src: string;
  inset: [number, number, number, number];
  nestedInset?: number;
}) {
  const [top, right, bottom, left] = inset;
  const img = (
    <img
      alt=""
      src={src}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        width: 16,
        height: 16,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: `${top}%`,
          right: `${right}%`,
          bottom: `${bottom}%`,
          left: `${left}%`,
        }}
      >
        {nestedInset != null ? (
          <span style={{ position: 'absolute', inset: `${nestedInset}%` }}>{img}</span>
        ) : (
          img
        )}
      </span>
    </span>
  );
}

const dimStyle: CSSProperties = { opacity: 0.6 };

export function GifterCard({
  imageUrl,
  name,
  price,
  wasPrice,
  discount,
  currency = '',
  rating = 4.3,
  reviewCount = 128,
  state = 'default',
  width,
  quantity = 1,
  onMenu,
  onMarkPurchased,
  onUnmarkPurchased,
  onOpen,
  menuAlign = 'right',
  onAddToBag,
  onIncrement,
  onDecrement,
  onRemove,
}: GifterCardProps) {
  const dimmed = state === 'purchased' || state === 'out-of-order';
  const cardWidth = width ?? (dimmed ? 170 : 166);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Dismiss the options popover on any click outside this card (or Escape),
  // returning the card to its prior state (the ⋮ button reverts from the X).
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', width: cardWidth, zIndex: menuOpen ? 30 : undefined }}
    >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        backgroundColor: palette.neutral.white,
        border: `0.75px solid ${dimmed ? colour.border.subtle : colour.surface.tertiary}`,
        borderRadius: radius[12],
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Container — image */}
      <div
        onClick={onOpen}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          width: '100%',
          height: 220,
          borderRadius: radius[12],
          overflow: 'hidden',
          cursor: onOpen ? 'pointer' : undefined,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 220,
            backgroundColor: colour.surface.secondary,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              ...(dimmed ? dimStyle : null),
            }}
          >
            <img
              alt={name}
              src={imageUrl}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Page controls (carousel dots) */}
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
              paddingInline: space[4],
              paddingBlock: space[2],
              borderRadius: radius.rounded,
              backgroundColor: palette.alphaDark[4],
              overflow: 'hidden',
            }}
          >
            <span style={{ width: 4, height: 4, borderRadius: radius.rounded, backgroundColor: colour.surface['primary-inverted'] }} />
            <span style={{ width: 3, height: 3, borderRadius: radius.rounded, backgroundColor: colour.surface['overlay-subtle'] }} />
            <span style={{ width: 2, height: 2, borderRadius: radius.rounded, backgroundColor: colour.surface['overlay-subtle'] }} />
            <span style={{ width: 1, height: 1, borderRadius: radius.rounded, backgroundColor: colour.surface['overlay-subtle'] }} />
          </div>

          {/* Overflow menu — toggles the "Mark as purchased" options popover */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'More options'}
            aria-expanded={menuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((open) => !open);
              onMenu?.();
            }}
            style={{
              position: 'absolute',
              top: 6,
              insetInlineEnd: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: space[4],
              border: 'none',
              cursor: 'pointer',
              borderRadius: radius[32],
              backgroundColor: palette.alphaLight[50],
            }}
          >
            {menuOpen ? (
              <CloseIcon opacity={dimmed ? 0.5 : 1} />
            ) : (
              <GlyphIcon src={iconMenu} w={2} h={10} opacity={dimmed ? 0.5 : 1} />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: space[12],
          padding: space[8],
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Info group */}
        <div
          onClick={onOpen}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: space[6],
            width: '100%',
            cursor: onOpen ? 'pointer' : undefined,
            ...(dimmed ? dimStyle : null),
          }}
        >
          {/* Name + rating */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: space[4], width: '100%', overflow: 'hidden' }}>
            <p
              style={{
                margin: 0,
                width: '100%',
                ...FONT.medium,
                fontSize: 12,
                lineHeight: '16px',
                letterSpacing: -0.1,
                color: colour['text-n-icon'].primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </p>

            {/* Rating badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: space[2],
                height: 18,
                paddingInline: space[4],
                paddingBlock: space[2],
                borderRadius: 4.067,
                backgroundColor: colour.surface.tertiary,
                boxSizing: 'border-box',
              }}
            >
              <img alt="" src={iconStar} style={{ width: 12, height: 11.5, display: 'block' }} />
              <span
                style={{
                  fontSize: 12.202,
                  lineHeight: '14px',
                  letterSpacing: -0.12,
                  fontFeatureSettings: '"case"',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ ...FONT.semibold, color: colour['text-n-icon'].primary }}>{`${rating} `}</span>
                <span style={{ ...FONT.regular, color: colour['text-n-icon'].tertiary }}>{`(${reviewCount})`}</span>
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', alignContent: 'flex-end', gap: space[2], width: '100%' }}>
            <span
              style={{
                ...FONT.bold,
                fontSize: 14,
                lineHeight: '18px',
                letterSpacing: -0.1,
                color: colour['text-n-icon'].primary,
                whiteSpace: 'nowrap',
              }}
            >
              {currency}
              {price}
            </span>
            {wasPrice && (
              <span
                style={{
                  ...FONT.regular,
                  fontSize: 12,
                  lineHeight: '16px',
                  letterSpacing: -0.1,
                  color: colour['text-n-icon'].tertiary,
                  textDecoration: 'line-through',
                  whiteSpace: 'nowrap',
                }}
              >
                {wasPrice}
              </span>
            )}
            {discount && (
              <span
                style={{
                  ...FONT.semibold,
                  fontSize: 12,
                  lineHeight: '16px',
                  letterSpacing: -0.1,
                  color: colour['text-n-icon'].success,
                  whiteSpace: 'nowrap',
                }}
              >
                {discount}
              </span>
            )}
          </div>

          {/* Delivery / ETA badge */}
          <div style={{ position: 'relative', width: 122, height: 18 }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: '12.07%' }}>
              <img alt="" src={badgeEta} style={{ display: 'block', width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>

        {/* Action row */}
        {state === 'in-bag' ? (
          <Stepper
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRemove={onRemove}
          />
        ) : (
          <ActionButton state={state} onPress={onAddToBag} onUnmarkPurchased={onUnmarkPurchased} />
        )}
      </div>
    </div>

      {menuOpen && (
        <OptionsPopover
          align={menuAlign}
          onMarkPurchased={() => {
            setMenuOpen(false);
            onMarkPurchased?.();
          }}
        />
      )}
    </div>
  );
}

// "Empty State/Options" popover (Figma 1379:1077521): white rounded card
// anchored to the card's top-right, extending left over the image. Padding and
// type transcribed from the node — 16/20/16 insets, radius 12, soft drop shadow.
function OptionsPopover({
  onMarkPurchased,
  align = 'right',
}: {
  onMarkPurchased?: () => void;
  /** Which side to anchor to: 'left' opens rightward (keeps left-column cards on screen). */
  align?: 'left' | 'right';
}) {
  return (
    <div
      role="menu"
      style={{
        position: 'absolute',
        top: 38,
        ...(align === 'left' ? { insetInlineStart: 6 } : { insetInlineEnd: 6 }),
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: space[32],
        paddingTop: space[16],
        paddingBottom: space[16],
        paddingInlineStart: space[16],
        paddingInlineEnd: space[20],
        borderRadius: radius[12],
        backgroundColor: colour.surface.primary,
        boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.08)',
        whiteSpace: 'nowrap',
      }}
    >
      <button
        type="button"
        role="menuitem"
        onClick={onMarkPurchased}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space[6],
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <img alt="" src={iconVerified} style={{ width: 16, height: 16, display: 'block', flexShrink: 0 }} />
        <span
          style={{
            ...FONT.medium,
            fontSize: 16,
            lineHeight: '22px',
            letterSpacing: -0.15,
            color: colour['text-n-icon'].success,
            whiteSpace: 'nowrap',
          }}
        >
          Mark as purchased
        </span>
      </button>
    </div>
  );
}

// 12px close glyph used by the overflow button while the options menu is open.
function CloseIcon({ opacity }: { opacity?: number }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        flexShrink: 0,
        opacity,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 1L9 9M9 1L1 9"
          stroke={colour['text-n-icon'].primary}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

const actionRowBase: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[4],
  minHeight: 36,
  maxHeight: 36,
  paddingInline: space[12],
  paddingBlock: space[10],
  borderRadius: radius[8],
  width: '100%',
  boxSizing: 'border-box',
};

const actionLabel: CSSProperties = {
  ...FONT.semibold,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: 0,
  whiteSpace: 'nowrap',
};

function ActionButton({
  state,
  onPress,
  onUnmarkPurchased,
}: {
  state: Exclude<GifterCardState, 'in-bag'>;
  onPress?: () => void;
  onUnmarkPurchased?: () => void;
}) {
  if (state === 'purchased') {
    // Tapping the pill re-opens the confirmation flow ("Marked by mistake?").
    return (
      <button
        type="button"
        onClick={onUnmarkPurchased}
        style={{
          ...actionRowBase,
          border: `0.8px solid ${palette.green[200]}`,
          backgroundImage: `linear-gradient(95.9558deg, ${palette.green[100]} 1.07%, ${palette.green[50]} 75.04%, ${palette.green[200]} 99.69%)`,
          cursor: onUnmarkPurchased ? 'pointer' : 'default',
        }}
      >
        <GlyphIcon src={iconVerified} w={11.96} h={11.96} />
        <span style={{ ...actionLabel, color: colour['text-n-icon'].success_bold }}>Purchased</span>
      </button>
    );
  }

  if (state === 'ordered') {
    // You've checked this item out — a settled "Ordered" pill (action-blue),
    // non-interactive since the purchase is already placed.
    return (
      <div
        style={{
          ...actionRowBase,
          border: `0.8px solid ${colour.border.action}`,
          backgroundColor: colour.surface['action-subtle'],
        }}
      >
        <FigmaIcon src={iconBagDefault} inset={[10.55, 15.65, 9.37, 15.65]} />
        <span style={{ ...actionLabel, color: colour['text-n-icon'].action }}>Ordered</span>
      </div>
    );
  }

  if (state === 'out-of-order') {
    return (
      <div
        style={{
          ...actionRowBase,
          backgroundColor: colour.surface.tertiary,
          border: `0.8px solid ${colour.border.primary}`,
        }}
      >
        <span style={{ ...actionLabel, color: colour['text-n-icon'].muted }}>Out of stock</span>
      </div>
    );
  }

  const isListClosed = state === 'list-closed';

  return (
    <button
      type="button"
      onClick={isListClosed ? undefined : onPress}
      disabled={isListClosed}
      style={{
        ...actionRowBase,
        border: 'none',
        cursor: isListClosed ? 'default' : 'pointer',
        backgroundColor: isListClosed ? colour.surface.muted : ACTION_TINT,
      }}
    >
      <FigmaIcon src={isListClosed ? iconBagMuted : iconBagDefault} inset={[10.55, 15.65, 9.37, 15.65]} />
      <span style={{ ...actionLabel, color: isListClosed ? colour['text-n-icon'].muted : colour['text-n-icon'].action }}>
        Add to bag
      </span>
    </button>
  );
}

function Stepper({
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  quantity: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}) {
  const iconBtn: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingInline: space[24],
        paddingBlock: space[6],
        borderRadius: radius[8],
        backgroundColor: ACTION_TINT,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <button
        type="button"
        aria-label={quantity <= 1 ? 'Remove from bag' : 'Decrease quantity'}
        onClick={quantity <= 1 ? onRemove : onDecrement}
        style={iconBtn}
      >
        {quantity <= 1 ? (
          <FigmaIcon src={iconDelete} inset={[9.38, 13.54, 9.38, 13.54]} />
        ) : (
          <FigmaIcon src={iconMinus} inset={[18.75, 18.75, 18.75, 18.75]} nestedInset={-5} />
        )}
      </button>
      <span
        style={{
          width: 24,
          textAlign: 'center',
          ...FONT.medium,
          // Retune: dialled the stepper quantity down from 18 so it sits
          // closer to the ± glyphs rather than dominating the control.
          fontSize: 16,
          lineHeight: '24px',
          color: colour['text-n-icon'].action,
        }}
      >
        {quantity}
      </span>
      <button type="button" aria-label="Increase quantity" onClick={onIncrement} style={iconBtn}>
        <FigmaIcon src={iconPlus} inset={[18.75, 18.75, 18.75, 18.75]} nestedInset={-5} />
      </button>
    </div>
  );
}
