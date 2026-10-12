import { useEffect, useState, type CSSProperties } from 'react';
import { colour, palette, space, radius } from '../../field-ds';
import { type, font, DIRHAM, EASE } from './_shared';
import { WebDialog } from './WebDialog';
import {
  StarIcon,
  VerifiedIcon,
  BagIcon,
  PlusIcon,
  MinusIcon,
  ChevronIcon,
  ShieldIcon,
  TruckIcon,
} from './icons';

const ACTION_TINT = '#ebf0fd';

export interface QuickViewProduct {
  id: string;
  imageUrl: string;
  name: string;
  price: string;
  wasPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  fixedState?: 'purchased' | 'out-of-order' | 'list-closed';
}

export interface ProductQuickViewProps {
  products: QuickViewProduct[];
  /** Index into `products`, or null when closed. */
  index: number | null;
  /** Bag quantities by product id. */
  inBag?: Record<string, number>;
  purchased?: Record<string, true>;
  onNavigate: (index: number) => void;
  onAddToBag: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onViewGiftBag: () => void;
  onMarkPurchased: (id: string) => void;
  onClose: () => void;
  /** Host name, for the "ships to <name>" reassurance line. */
  hostName?: string;
}

/**
 * Gifter flow · dWeb quick view.
 *
 * Replaces the mobile ../ProductExplorer.tsx swipe carousel, whose peek geometry
 * is a literal function of the 375pt canvas — `(375 - 335) / 2`. On desktop the
 * same job (compare items without leaving the list) is done by a two-column
 * dialog with keyboard/arrow navigation between products: gallery on the left,
 * details and the gift actions on the right.
 */
export function ProductQuickView({
  products,
  index,
  inBag = {},
  purchased = {},
  onNavigate,
  onAddToBag,
  onIncrement,
  onDecrement,
  onViewGiftBag,
  onMarkPurchased,
  onClose,
  hostName = 'the host',
}: ProductQuickViewProps) {
  const open = index !== null;
  // Freeze the last product so the copy doesn't flash while the dialog animates out.
  const [shown, setShown] = useState<number>(index ?? 0);
  useEffect(() => {
    if (index !== null) setShown(index);
  }, [index]);

  const product = products[shown];
  const atStart = shown <= 0;
  const atEnd = shown >= products.length - 1;

  // Arrow keys page through the list — the desktop equivalent of the carousel swipe.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !atEnd) onNavigate(shown + 1);
      if (e.key === 'ArrowLeft' && !atStart) onNavigate(shown - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, shown, atStart, atEnd, onNavigate]);

  if (!product) return null;

  const qty = inBag[product.id];
  const isInBag = qty != null;
  const isPurchased = product.fixedState === 'purchased' || (!product.fixedState && !!purchased[product.id]);
  const isOut = product.fixedState === 'out-of-order';
  const isClosed = product.fixedState === 'list-closed';
  const disabled = isOut || isClosed;

  return (
    <WebDialog open={open} onClose={onClose} width={1000} label={product.name} panelStyle={{ overflow: 'visible' }}>
      <div style={grid}>
        {/* ---------- Gallery ---------- */}
        <div style={galleryCol}>
          <div style={heroImageWell}>
            <img src={product.imageUrl} alt={product.name} style={heroImage} />
            {isPurchased && <span style={{ ...ribbon, backgroundColor: colour.surface['success-bold'] }}>Already gifted</span>}
            {isOut && <span style={{ ...ribbon, backgroundColor: colour.surface['tertiary-inverted'] }}>Out of stock</span>}
          </div>

          {/* Thumbnail rail — the neighbouring gifts, so browsing continues here. */}
          <div style={thumbRail}>
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={p.name}
                aria-current={i === shown}
                onClick={() => onNavigate(i)}
                style={{
                  ...thumb,
                  borderColor: i === shown ? colour.border['action-bold'] : colour.border.primary,
                }}
              >
                <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Details ---------- */}
        <div style={detailCol}>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[6] }}>
            <span style={{ ...type.b14Semi, color: colour['text-n-icon'].action }}>{product.brand ?? 'noon'}</span>
            <VerifiedIcon size={16} color={colour['text-n-icon'].action} />
          </div>

          <h2 style={{ margin: 0, ...type.h20, color: colour['text-n-icon'].primary }}>{product.name}</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: space[8] }}>
            <span style={ratingBadge}>
              <StarIcon size={13} color={colour['text-n-icon'].success_bold} />
              <span style={{ ...type.b12Semi, color: colour['text-n-icon'].primary }}>{product.rating ?? 4.3}</span>
            </span>
            <span style={{ ...type.b13, color: colour['text-n-icon'].tertiary }}>
              {product.reviewCount ?? 128} ratings
            </span>
          </div>

          <div style={rule} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: space[10], flexWrap: 'wrap' }}>
            <span style={{ ...type.h24, color: colour['text-n-icon'].primary }}>
              {DIRHAM} {product.price}
            </span>
            {product.wasPrice && (
              <span style={{ ...type.b14, color: colour['text-n-icon'].tertiary, textDecoration: 'line-through' }}>
                {product.wasPrice}
              </span>
            )}
            {product.discount && (
              <span style={{ ...type.b14Semi, color: colour['text-n-icon'].success }}>{product.discount} off</span>
            )}
          </div>
          <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary }}>Inclusive of VAT</span>

          <div style={expressRow}>
            <span style={expressTag}>express</span>
            <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>
              Get it <strong style={{ fontFamily: font.semibold, fontWeight: 600 }}>today</strong> if you order in the
              next 4 hrs
            </span>
          </div>

          <div style={rule} />

          {/* ---------- Gift actions ---------- */}
          {isPurchased ? (
            <div style={{ ...noticeBox, borderColor: palette.green[200], backgroundColor: palette.green[50] }}>
              <VerifiedIcon size={18} color={colour['text-n-icon'].success_bold} />
              <span style={{ ...type.b14, color: colour['text-n-icon'].success_bold }}>
                Someone has already gifted this. Pick something else so {hostName} isn&rsquo;t sent a duplicate.
              </span>
            </div>
          ) : disabled ? (
            <div style={{ ...noticeBox, borderColor: colour.border.primary, backgroundColor: colour.surface.tertiary }}>
              <span style={{ ...type.b14, color: colour['text-n-icon'].secondary }}>
                {isOut ? 'This gift is out of stock right now.' : 'This gift list is closed.'}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[10] }}>
              {isInBag ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: space[10] }}>
                  <div style={stepper}>
                    <button type="button" aria-label="Decrease quantity" onClick={() => onDecrement(product.id)} style={stepBtn}>
                      <MinusIcon size={20} />
                    </button>
                    <span style={{ ...type.h18, color: colour['text-n-icon'].action, minWidth: 24, textAlign: 'center' }}>
                      {qty}
                    </span>
                    <button type="button" aria-label="Increase quantity" onClick={() => onIncrement(product.id)} style={stepBtn}>
                      <PlusIcon size={20} />
                    </button>
                  </div>
                  <button type="button" onClick={onViewGiftBag} style={primaryCta}>
                    <BagIcon size={18} color={colour['text-n-icon']['on-surface-bold']} />
                    <span style={{ ...type.b16, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon']['on-surface-bold'] }}>
                      View gift bag
                    </span>
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => onAddToBag(product.id)} style={primaryCta}>
                  <BagIcon size={18} color={colour['text-n-icon']['on-surface-bold']} />
                  <span style={{ ...type.b16, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon']['on-surface-bold'] }}>
                    Add to gift bag
                  </span>
                </button>
              )}

              <button type="button" onClick={() => onMarkPurchased(product.id)} style={secondaryCta}>
                <VerifiedIcon size={16} color={colour['text-n-icon'].success} />
                <span style={{ ...type.b14Semi, color: colour['text-n-icon'].success }}>
                  I&rsquo;ve bought this elsewhere
                </span>
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: space[8], marginTop: space[4] }}>
            <Reassure icon={<TruckIcon size={18} color={colour['text-n-icon'].secondary} />}>
              Ships directly to {hostName} — you never handle the delivery.
            </Reassure>
            <Reassure icon={<ShieldIcon size={18} color={colour['text-n-icon'].action} />}>
              Their address stays hidden from you, and the price stays hidden from them.
            </Reassure>
          </div>
        </div>
      </div>

      {/* Prev / next, straddling the dialog edges. */}
      {!atStart && (
        <button type="button" aria-label="Previous gift" onClick={() => onNavigate(shown - 1)} style={{ ...pager, insetInlineStart: -22 }}>
          <ChevronIcon dir="left" size={24} color={colour['text-n-icon'].primary} />
        </button>
      )}
      {!atEnd && (
        <button type="button" aria-label="Next gift" onClick={() => onNavigate(shown + 1)} style={{ ...pager, insetInlineEnd: -22 }}>
          <ChevronIcon dir="right" size={24} color={colour['text-n-icon'].primary} />
        </button>
      )}
    </WebDialog>
  );
}

function Reassure({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: space[8] }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: space[24],
  padding: space[24],
  // The dialog itself caps at the viewport; the details column scrolls inside.
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  boxSizing: 'border-box',
  borderRadius: radius[20],
  backgroundColor: colour.surface.primary,
};

const galleryCol: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  minWidth: 0,
};

const heroImageWell: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: radius[16],
  backgroundColor: colour.surface.secondary,
  overflow: 'hidden',
};

const heroImage: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const ribbon: CSSProperties = {
  position: 'absolute',
  top: space[12],
  insetInlineStart: space[12],
  ...type.b11,
  color: colour['text-n-icon']['on-surface-bold'],
  paddingInline: space[8],
  paddingBlock: space[4],
  borderRadius: radius[6],
};

const thumbRail: CSSProperties = {
  display: 'flex',
  gap: space[8],
  overflowX: 'auto',
  paddingBottom: space[4],
  scrollbarWidth: 'thin',
};

const thumb: CSSProperties = {
  width: 56,
  height: 56,
  flexShrink: 0,
  borderRadius: radius[8],
  border: '2px solid',
  overflow: 'hidden',
  padding: 0,
  cursor: 'pointer',
  backgroundColor: colour.surface.secondary,
};

const detailCol: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[10],
  minWidth: 0,
};

const ratingBadge: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[4],
  paddingInline: space[6],
  paddingBlock: space[2],
  borderRadius: radius[4],
  backgroundColor: colour.surface.tertiary,
};

const rule: CSSProperties = {
  height: 1,
  width: '100%',
  backgroundColor: colour.border.primary,
  marginBlock: space[4],
};

const expressRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
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

const primaryCta: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[8],
  flex: '1 1 auto',
  height: 48,
  border: 'none',
  borderRadius: radius[10],
  backgroundColor: colour.surface['action-extrabold'],
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const secondaryCta: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[6],
  height: 44,
  border: `1px solid ${palette.green[200]}`,
  borderRadius: radius[10],
  backgroundColor: palette.green[50],
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const stepper: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
  height: 48,
  paddingInline: space[14],
  borderRadius: radius[10],
  backgroundColor: ACTION_TINT,
  flexShrink: 0,
  boxSizing: 'border-box',
};

const stepBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
};

const noticeBox: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[8],
  padding: space[14],
  borderRadius: radius[10],
  border: '1px solid',
  boxSizing: 'border-box',
};

const pager: CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radius.rounded,
  border: 'none',
  backgroundColor: colour.surface.primary,
  boxShadow: '0 4px 16px rgba(16, 22, 40, 0.24)',
  cursor: 'pointer',
  padding: 0,
  transition: `transform 160ms ${EASE}`,
};
