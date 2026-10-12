import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { colour, palette, space, radius } from '../../field-ds';
import { type, font, DIRHAM, HOVER_SHADOW, RESTING_SHADOW, EASE } from './_shared';
import { StarIcon, VerifiedIcon, BagIcon, PlusIcon, MinusIcon, TrashIcon, HeartIcon } from './icons';

/** Same state machine as the mobile ../GifterCard.tsx, so screens can share logic. */
export type ProductTileState = 'default' | 'in-bag' | 'purchased' | 'ordered' | 'out-of-order' | 'list-closed';

export interface ProductTileProps {
  imageUrl: string;
  name: string;
  /** Selling price, digits only. e.g. "899". */
  price: string;
  wasPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  state?: ProductTileState;
  /** Quantity shown in the stepper when `state` is `in-bag`. */
  quantity?: number;
  /** Express delivery flag — renders the yellow express + ETA strip. */
  express?: boolean;
  /** ETA copy inside the express strip. */
  eta?: string;
  onOpen?: () => void;
  onAddToBag?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  onMarkPurchased?: () => void;
  onUnmarkPurchased?: () => void;
  onToggleSaved?: () => void;
  saved?: boolean;
}

// Tinted-blue action fill carried over from the mobile card (Figma literal, no
// matching Field DS token) so both views' primary affordance reads identically.
const ACTION_TINT = '#ebf0fd';

/**
 * Gifter flow · dWeb product tile.
 *
 * Desktop counterpart of ../GifterCard.tsx. Same states and the same visual
 * vocabulary, rebuilt for a mouse: fills its grid column instead of the mobile
 * 166px fixed width, the title gets two lines at a readable 14px rather than one
 * truncated at 12px, and the overflow menu is replaced by hover-revealed
 * controls (a save heart and a "Mark as purchased" affordance) — a touch-only
 * ⋮ popover wastes the affordance desktop actually has.
 */
export function ProductTile({
  imageUrl,
  name,
  price,
  wasPrice,
  discount,
  rating = 4.3,
  reviewCount = 128,
  state = 'default',
  quantity = 1,
  express = true,
  eta = 'Today',
  onOpen,
  onAddToBag,
  onIncrement,
  onDecrement,
  onRemove,
  onMarkPurchased,
  onUnmarkPurchased,
  onToggleSaved,
  saved = false,
}: ProductTileProps) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const dimmed = state === 'purchased' || state === 'out-of-order';
  const canMarkPurchased = state === 'default' || state === 'in-bag';

  // Dismiss the "Mark as purchased" popover on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...card,
        boxShadow: hover ? HOVER_SHADOW : RESTING_SHADOW,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        zIndex: menuOpen ? 12 : undefined,
      }}
    >
      {/* ---------- Image well ---------- */}
      <div style={imageWell} onClick={onOpen} role={onOpen ? 'button' : undefined}>
        <img
          src={imageUrl}
          alt={name}
          style={{
            ...imageStyle,
            opacity: dimmed ? 0.55 : 1,
            transform: hover && !dimmed ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Availability ribbon — the one thing a gifter must not miss. */}
        {state === 'purchased' && <span style={{ ...ribbon, ...ribbonPurchased }}>Already gifted</span>}
        {state === 'ordered' && <span style={{ ...ribbon, ...ribbonOrdered }}>You ordered this</span>}
        {state === 'out-of-order' && <span style={{ ...ribbon, ...ribbonOut }}>Out of stock</span>}
        {state === 'list-closed' && <span style={{ ...ribbon, ...ribbonOut }}>List closed</span>}

        {/* Save heart, top-right — matches noon's PLP tile. */}
        <button
          type="button"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSaved?.();
          }}
          style={iconBubble}
        >
          <HeartIcon
            size={20}
            filled={saved}
            color={saved ? colour['text-n-icon'].error : colour['text-n-icon'].primary}
          />
        </button>
      </div>

      {/* ---------- Body ---------- */}
      <div style={body}>
        <div style={{ opacity: dimmed ? 0.6 : 1, display: 'flex', flexDirection: 'column', gap: space[6] }}>
          <p style={nameStyle} onClick={onOpen} title={name}>
            {name}
          </p>

          <div style={ratingBadge}>
            <StarIcon size={13} color={colour['text-n-icon'].success_bold} />
            <span style={{ ...type.b12Semi, color: colour['text-n-icon'].primary }}>{rating}</span>
            <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary }}>({reviewCount})</span>
          </div>

          <div style={priceRow}>
            <span style={{ ...type.h18, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
              {DIRHAM} {price}
            </span>
            {wasPrice && (
              <span style={{ ...type.b13, color: colour['text-n-icon'].tertiary, textDecoration: 'line-through' }}>
                {wasPrice}
              </span>
            )}
            {discount && (
              <span style={{ ...type.b13, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon'].success }}>
                {discount} off
              </span>
            )}
          </div>

          {express && (
            <div style={expressRow}>
              <span style={expressTag}>express</span>
              <span style={{ ...type.b12, color: colour['text-n-icon'].secondary }}>
                Get it <strong style={{ fontFamily: font.semibold, fontWeight: 600 }}>{eta}</strong>
              </span>
            </div>
          )}
        </div>

        {/* ---------- Action row ---------- */}
        <ActionRow
          state={state}
          quantity={quantity}
          onAddToBag={onAddToBag}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onRemove={onRemove}
          onUnmarkPurchased={onUnmarkPurchased}
        />

        {/* Secondary action, revealed on hover so the resting tile stays calm.
            Height is reserved either way to stop the grid reflowing on hover. */}
        <div style={{ height: 20, marginTop: space[2] }}>
          {canMarkPurchased && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onMarkPurchased?.();
              }}
              style={{
                ...markLink,
                opacity: hover ? 1 : 0,
                pointerEvents: hover ? 'auto' : 'none',
              }}
            >
              <VerifiedIcon size={14} color={colour['text-n-icon'].success} />
              <span style={{ ...type.b12Semi, color: colour['text-n-icon'].success }}>
                I&rsquo;ve bought this elsewhere
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- action row */

function ActionRow({
  state,
  quantity,
  onAddToBag,
  onIncrement,
  onDecrement,
  onRemove,
  onUnmarkPurchased,
}: {
  state: ProductTileState;
  quantity: number;
  onAddToBag?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  onUnmarkPurchased?: () => void;
}) {
  if (state === 'in-bag') {
    return (
      <div style={stepper}>
        <button
          type="button"
          aria-label={quantity <= 1 ? 'Remove from gift bag' : 'Decrease quantity'}
          onClick={quantity <= 1 ? onRemove : onDecrement}
          style={stepBtn}
        >
          {quantity <= 1 ? <TrashIcon size={18} /> : <MinusIcon size={18} />}
        </button>
        <span style={{ ...type.b16, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon'].action }}>
          {quantity}
        </span>
        <button type="button" aria-label="Increase quantity" onClick={onIncrement} style={stepBtn}>
          <PlusIcon size={18} />
        </button>
      </div>
    );
  }

  if (state === 'purchased') {
    return (
      <button type="button" onClick={onUnmarkPurchased} style={{ ...actionBase, ...purchasedPill }}>
        <VerifiedIcon size={16} color={colour['text-n-icon'].success_bold} />
        <span style={{ ...type.b14Semi, color: colour['text-n-icon'].success_bold }}>Purchased</span>
      </button>
    );
  }

  if (state === 'ordered') {
    return (
      <div style={{ ...actionBase, ...orderedPill, cursor: 'default' }}>
        <BagIcon size={16} color={colour['text-n-icon'].action} />
        <span style={{ ...type.b14Semi, color: colour['text-n-icon'].action }}>Ordered</span>
      </div>
    );
  }

  const disabled = state === 'out-of-order' || state === 'list-closed';

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onAddToBag}
      disabled={disabled}
      style={{
        ...actionBase,
        backgroundColor: disabled ? colour.surface.muted : ACTION_TINT,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <BagIcon size={16} color={disabled ? colour['text-n-icon'].muted : colour['text-n-icon'].action} />
      <span
        style={{
          ...type.b14Semi,
          color: disabled ? colour['text-n-icon'].muted : colour['text-n-icon'].action,
        }}
      >
        {state === 'out-of-order' ? 'Out of stock' : 'Add to gift bag'}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ styles */

const card: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  borderRadius: radius[12],
  overflow: 'visible',
  boxSizing: 'border-box',
  transition: `box-shadow 200ms ${EASE}, transform 200ms ${EASE}`,
};

const imageWell: CSSProperties = {
  position: 'relative',
  width: '100%',
  // 1:1 well — noon's PLP tiles are square, and it keeps the grid rows even.
  aspectRatio: '1 / 1',
  backgroundColor: colour.surface.secondary,
  borderTopLeftRadius: radius[12],
  borderTopRightRadius: radius[12],
  overflow: 'hidden',
  cursor: 'pointer',
  flexShrink: 0,
};

const imageStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: `transform 320ms ${EASE}, opacity 200ms ${EASE}`,
};

const ribbon: CSSProperties = {
  position: 'absolute',
  top: space[10],
  insetInlineStart: space[10],
  ...type.b11,
  paddingInline: space[8],
  paddingBlock: space[4],
  borderRadius: radius[6],
  whiteSpace: 'nowrap',
};

const ribbonPurchased: CSSProperties = {
  backgroundColor: colour.surface['success-bold'],
  color: colour['text-n-icon']['on-surface-bold'],
};

const ribbonOrdered: CSSProperties = {
  backgroundColor: colour.surface['action-extrabold'],
  color: colour['text-n-icon']['on-surface-bold'],
};

const ribbonOut: CSSProperties = {
  backgroundColor: colour.surface['tertiary-inverted'],
  color: colour['text-n-icon']['on-surface-bold'],
};

const iconBubble: CSSProperties = {
  position: 'absolute',
  top: space[8],
  insetInlineEnd: space[8],
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radius.rounded,
  border: 'none',
  backgroundColor: palette.alphaLight[80],
  cursor: 'pointer',
  padding: 0,
};

const body: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[10],
  padding: space[12],
  boxSizing: 'border-box',
};

const nameStyle: CSSProperties = {
  margin: 0,
  ...type.b14,
  color: colour['text-n-icon'].primary,
  cursor: 'pointer',
  // Two lines, clamped — desktop has the room and the title is how a gifter
  // tells near-identical products apart.
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  minHeight: 40,
};

const ratingBadge: CSSProperties = {
  display: 'inline-flex',
  alignSelf: 'flex-start',
  alignItems: 'center',
  gap: space[4],
  paddingInline: space[6],
  paddingBlock: space[2],
  borderRadius: radius[4],
  backgroundColor: colour.surface.tertiary,
};

const priceRow: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: space[6],
};

const expressRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[6],
};

const expressTag: CSSProperties = {
  ...type.b11,
  fontFamily: font.extrabold,
  fontWeight: 800,
  fontStyle: 'italic',
  color: colour['text-n-icon'].primary,
  backgroundColor: colour.surface['brand-primary'],
  paddingInline: space[6],
  paddingBlock: space[2],
  borderRadius: radius[4],
};

const actionBase: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[6],
  height: 40,
  width: '100%',
  border: 'none',
  borderRadius: radius[8],
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const purchasedPill: CSSProperties = {
  border: `1px solid ${palette.green[200]}`,
  backgroundImage: `linear-gradient(96deg, ${palette.green[100]} 1%, ${palette.green[50]} 75%, ${palette.green[200]} 100%)`,
};

const orderedPill: CSSProperties = {
  border: `1px solid ${colour.border.action}`,
  backgroundColor: colour.surface['action-subtle'],
};

const stepper: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: 40,
  paddingInline: space[20],
  borderRadius: radius[8],
  backgroundColor: ACTION_TINT,
  boxSizing: 'border-box',
};

const stepBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
};

const markLink: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  transition: `opacity 160ms ${EASE}`,
};
