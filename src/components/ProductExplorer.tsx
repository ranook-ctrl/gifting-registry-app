import { useEffect, useRef, useState } from 'react';
import { colour, radius } from '../field-ds';
import { ExplorableCard } from './ExplorableCard';
import type { GifterHomeProduct } from './GifterHome';

/**
 * Product Explorer — the "Multiple added to cart" carousel overlay (Figma node
 * 1653:227596). Tapping a product on GifterHome opens this over a dimmed
 * backdrop: a horizontally-swipeable strip of {@link ExplorableCard}s (active
 * card centred, neighbours peeking) with a thumbnail rail below. Each card is
 * filled from the tapped gift-list product; swiping / tapping a thumbnail moves
 * between products.
 */
export interface ProductExplorerProps {
  products: GifterHomeProduct[];
  /** Index of the product that was tapped — the carousel opens centred on it. */
  index: number;
  /** Ids already in the gift bag (drives the card's Add / qty state). */
  inBag?: Record<string, number>;
  /** Ids marked purchased. */
  purchased?: Record<string, true>;
  onAddToBag?: (id: string) => void;
  /** Tapping the primary CTA when the item is already in the bag ("View Gift Bag"). */
  onViewGiftBag?: (id: string) => void;
  onTogglePurchased?: (id: string) => void;
  onClose: () => void;
}

const CARD_W = 335;
const CARD_H = 640;
const GAP = 8;
// Phone frame is 375 wide; centring a 335 card leaves a 20px peek each side.
const SIDE = (375 - CARD_W) / 2;

export function ProductExplorer({
  products,
  index,
  inBag = {},
  purchased = {},
  onAddToBag,
  onViewGiftBag,
  onTogglePurchased,
  onClose,
}: ProductExplorerProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(index);

  // Jump to the tapped card on open (no smooth scroll — it should already be
  // there when the overlay finishes animating in).
  useEffect(() => {
    const el = railRef.current;
    if (el) el.scrollLeft = index * (CARD_W + GAP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the active thumbnail centred in its rail as the selection changes.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (strip && thumb) {
      strip.scrollTo({
        left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
        behavior: 'smooth',
      });
    }
  }, [active]);

  const onRailScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const child = c as HTMLElement;
      const cc = child.offsetLeft + child.clientWidth / 2;
      const d = Math.abs(cc - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (best !== active) setActive(best);
  };

  const goTo = (i: number) => {
    railRef.current?.scrollTo({ left: i * (CARD_W + GAP), behavior: 'smooth' });
  };

  return (
    <div style={overlay} onClick={onClose}>
      <style>{KEYFRAMES}</style>
      {/* Carousel — swipeable rail of explorable cards */}
      <div
        ref={railRef}
        style={rail}
        onScroll={onRailScroll}
        onClick={(e) => e.stopPropagation()}
      >
        {products.map((p, i) => (
          <div
            key={p.id}
            style={cardSlot}
            // A tap on a peeking neighbour brings it to centre; the active card
            // lets its own controls (back / add / purchased) handle the tap.
            onClick={i !== active ? () => goTo(i) : undefined}
          >
            <ExplorableCard
              productName={p.name}
              rating={p.rating ?? 4.3}
              reviewCount={p.reviewCount ?? 128}
              price={p.price}
              wasPrice={p.wasPrice}
              discount={p.discount ? `${p.discount} OFF` : undefined}
              imageUrl={p.imageUrl}
              brandName="noon"
              tagLabel=""
              quantity={inBag[p.id] ?? 1}
              inBag={(inBag[p.id] ?? 0) > 0}
              purchased={!!purchased[p.id]}
              onBack={onClose}
              onAddToGiftCart={() => onAddToBag?.(p.id)}
              onViewGiftBag={() => onViewGiftBag?.(p.id)}
              onTogglePurchased={() => onTogglePurchased?.(p.id)}
            />
          </div>
        ))}
      </div>

      {/* Thumbnail rail — active enlarged (80) with selection ring, rest 56 */}
      <div ref={thumbsRef} style={thumbs} onClick={(e) => e.stopPropagation()}>
        {products.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.id}
              type="button"
              aria-label={p.name}
              aria-current={on}
              onClick={() => goTo(i)}
              style={{ ...thumbBtn, width: on ? 80 : 56, height: on ? 80 : 56 }}
            >
              <span style={{ ...thumbInner, ...(on ? thumbInnerActive : null) }}>
                <img src={p.imageUrl} alt="" style={thumbImg} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const KEYFRAMES = `
@keyframes pe-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes pe-rise-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }`;

const overlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 375,
  height: '100%',
  minHeight: '100vh',
  zIndex: 40,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
  backgroundColor: 'rgba(16, 22, 40, 0.55)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  animation: 'pe-fade-in 200ms ease both',
};

const rail: React.CSSProperties = {
  width: '100%',
  height: CARD_H,
  display: 'flex',
  gap: GAP,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollSnapType: 'x mandatory',
  paddingInline: SIDE,
  boxSizing: 'border-box',
  scrollbarWidth: 'none',
  animation: 'pe-rise-in 280ms cubic-bezier(0.16,1,0.3,1) both',
};

const cardSlot: React.CSSProperties = {
  flex: `0 0 ${CARD_W}px`,
  width: CARD_W,
  height: CARD_H,
  scrollSnapAlign: 'center',
};

const thumbs: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  // Pin the rail to the active thumbnail's size (80) so it never reflows: as one
  // thumb grows 56→80 and its neighbour shrinks 80→56 mid-transition the row
  // height would otherwise dip and jump. Fixed height keeps it rock-steady.
  height: 80,
  maxWidth: '100%',
  paddingInline: 20,
  overflowX: 'auto',
  boxSizing: 'border-box',
  scrollbarWidth: 'none',
};

const thumbBtn: React.CSSProperties = {
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  transition: 'width 200ms ease, height 200ms ease',
};

const thumbInner: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: radius[12],
  overflow: 'hidden',
  backgroundColor: colour.surface.primary,
  boxSizing: 'border-box',
  display: 'block',
};

const thumbInnerActive: React.CSSProperties = {
  // Field DS action-bold blue (#0f61ff) for the in-focus selection ring — the
  // plain `border.action` token is a pale tint and reads as barely-there.
  border: `2px solid ${colour.border['action-bold']}`,
  padding: 6,
};

const thumbImg: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: radius[8],
  display: 'block',
};
