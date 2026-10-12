import { useEffect, useRef, useState, type AnimationEvent as ReactAnimationEvent } from 'react';
import { colour, space, radius } from '../field-ds';
import { GifterCard, type GifterCardState } from './GifterCard';
import { PageHeaderHero } from './PageHeaderHero';
import type { ActiveOrderCardProps } from './ActiveOrderCard';
import type { ActiveOrderVariant } from './atoms';
import { FloatingCart } from './atoms/FloatingCart';
import { AddressSheet } from './AddressSheet';
import { ProductExplorer } from './ProductExplorer';
import { ConfirmationBottomsheet } from './ConfirmationBottomsheet';
import { BottomSheet } from './BottomSheet';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';

const ASSETS = '/gift-registry';

export interface GifterHomeProduct {
  id: string;
  imageUrl: string;
  name: string;
  price: string;
  wasPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  /** Non-interactive availability states keep their fixed look. */
  fixedState?: Extract<GifterCardState, 'purchased' | 'out-of-order' | 'list-closed'>;
}

// Default catalogue — a curated occasion grid built from the product imagery
// shipped in public/gift-registry. Mirrors the Figma "List" screen ordering.
const DEFAULT_PRODUCTS: GifterHomeProduct[] = [
  { id: 'airpods', imageUrl: `${ASSETS}/atoms/airpods.jpg`, name: 'Apple Airpods Pro 2 Wireless Earbuds', price: '899', wasPrice: '1399', discount: '33%' },
  { id: 'mat-1', imageUrl: `${ASSETS}/mat.png`, name: 'Roseate Birch Super Soft (40x60 cm) Microfiber Bath Mat', price: '24', wasPrice: '99', discount: '33%' },
  { id: 'perfume-blue', imageUrl: `${ASSETS}/atoms/perfume-blue.png`, name: 'Blue Eau de Toilette for Men, 100ml', price: '499', wasPrice: '899', discount: '33%' },
  { id: 'perfume-black', imageUrl: `${ASSETS}/atoms/perfume-black.png`, name: 'Compatible with Versace Pour Homme EDT 100ml', price: '799', wasPrice: '999', discount: '11%' },
  { id: 'lamp', imageUrl: `${ASSETS}/lamp.png`, name: 'Nordic Ambient LED Table Lamp, Warm White', price: '149', wasPrice: '299', discount: '50%' },
  { id: 'perfume', imageUrl: `${ASSETS}/perfume.png`, name: 'Signature Oud Eau de Parfum Unisex, 75ml', price: '349', wasPrice: '599', discount: '41%' },
  { id: 'prod-a', imageUrl: `${ASSETS}/atoms/prod-a.png`, name: 'Premium Home Essentials Gift Set', price: '199', wasPrice: '349', discount: '43%' },
  { id: 'prod-b', imageUrl: `${ASSETS}/atoms/prod-b.png`, name: 'Everyday Comfort Collection Bundle', price: '129', wasPrice: '249', discount: '48%' },
  { id: 'washing-machine', imageUrl: `${ASSETS}/atoms/washing-machine.png`, name: '7kg Front Load Fully Automatic Washing Machine', price: '1199', wasPrice: '1699', discount: '29%' },
  { id: 'fridge', imageUrl: `${ASSETS}/atoms/fridge.png`, name: 'Double Door Frost-Free Refrigerator 340L', price: '1499', wasPrice: '1999', discount: '25%' },
];

export interface GifterHomeProps {
  /** Registry owner name — drives the title, address pill and greeting. */
  ownerName?: string;
  /** Occasion title, e.g. "Prasanna’s Birthday". */
  title?: string;
  /** Formatted occasion date, e.g. "14th June". */
  occasionDate?: string;
  /** Countdown label, e.g. "20 days to go!". */
  countdown?: string;
  /** Products rendered in the grid. Defaults to the sample catalogue. */
  products?: GifterHomeProduct[];
  onBack?: () => void;
  /** Tapping the floating cart pill. */
  onViewBag?: () => void;
  /**
   * Distance (px) of the floating cart pill from the bottom. Defaults to 24;
   * raise it when hosted above a bottom bar (e.g. the app shell's tab nav).
   */
  floatingCartBottom?: number;
  /** Tapping the "Delivering to <name>" pill in the header. */
  onChangeAddress?: () => void;
  /**
   * When set, a "You have sent a gift" order card renders in the header hero —
   * the post-checkout state shown after placing an order.
   */
  statusOrder?: ActiveOrderCardProps;
}

/**
 * Gifter flow · Home — the shared registry a gifter browses. The PageHeader
 * (gifter variant) birthday hero — title, countdown and "Delivering to <name>"
 * pill — sits above a two-column product grid; adding items surfaces the
 * floating gift-bag pill.
 */
export function GifterHome({
  ownerName = 'Prasanna',
  title = 'Prasanna’s Birthday',
  occasionDate = '14th June',
  countdown = '20 days to go!',
  products = DEFAULT_PRODUCTS,
  onBack,
  onViewBag,
  floatingCartBottom = 24,
  onChangeAddress,
  statusOrder,
}: GifterHomeProps) {
  // Bag state: productId → quantity. Starts empty — every card renders in its
  // Default (Add to bag) state; the floating pill appears once an item is added.
  const [bag, setBag] = useState<Record<string, number>>({});
  // Products the gifter has marked purchased via the card overflow menu, or that
  // were bought through checkout — both render in the "Purchased" state.
  const [purchased, setPurchased] = useState<Record<string, true>>({});
  const markPurchased = (id: string) => setPurchased((p) => ({ ...p, [id]: true }));
  const unmarkPurchased = (id: string) =>
    setPurchased((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });

  const addToBag = (id: string) => setBag((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
  const increment = (id: string) => setBag((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
  const decrement = (id: string) =>
    setBag((b) => ({ ...b, [id]: Math.max(1, (b[id] ?? 1) - 1) }));
  const remove = (id: string) =>
    setBag((b) => {
      const next = { ...b };
      delete next[id];
      return next;
    });

  const bagIds = Object.keys(bag);
  const totalCount = bagIds.reduce((sum, id) => sum + bag[id], 0);
  const bagThumbs = bagIds
    .map((id) => products.find((p) => p.id === id)?.imageUrl)
    .filter((src): src is string => Boolean(src));

  // Floating pill mount controller: keep it mounted through its exit animation
  // (driven by `cartClosing` + onAnimationEnd) so the slide-out can play before
  // unmount. Freeze the last non-empty content so it doesn't flash "0 items".
  const cartVisible = totalCount > 0;
  const [cartMounted, setCartMounted] = useState(cartVisible);
  const [cartClosing, setCartClosing] = useState(false);
  const lastCart = useRef({ count: totalCount, thumbs: bagThumbs });
  if (cartVisible) lastCart.current = { count: totalCount, thumbs: bagThumbs };

  useEffect(() => {
    if (cartVisible) {
      setCartMounted(true);
      setCartClosing(false);
    } else {
      setCartMounted((was) => {
        if (was) setCartClosing(true);
        return was;
      });
    }
  }, [cartVisible]);

  const onCartAnimEnd = (e: ReactAnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (cartClosing) {
      setCartMounted(false);
      setCartClosing(false);
    }
  };

  // Address bottom-sheet (gifter variant) — tapping the "Delivering to <name>"
  // pill slides it up from below. The shared <BottomSheet> owns the
  // mount-through-exit lifecycle, so this is a plain open/closed flag.
  const [addressOpen, setAddressOpen] = useState(false);
  // Selected delivery address — lifted up here so the choice persists across
  // sheet close/reopen (AddressSheet is controlled via `selectedId`). The pill
  // name follows the pick: the registry (giftbox) address keeps the owner's
  // name; any real address shows its own title (e.g. "Home").
  const [selectedAddressId, setSelectedAddressId] = useState('registry');
  const [deliverToName, setDeliverToName] = useState(ownerName);

  const openAddressSheet = () => {
    setAddressOpen(true);
    onChangeAddress?.();
  };

  // Product explorer carousel — tapping a product card opens the explorable-card
  // carousel centred on that product (null = closed).
  const [explorerIndex, setExplorerIndex] = useState<number | null>(null);

  // Confirmation sheet — a shared ConfirmationBottomsheet drives two flows:
  //  • mark   → "Mark as purchased?"  (from a card's overflow menu)
  //  • unmark → "Marked by mistake?"  (tapping the card's Purchased pill)
  // Only the Yes CTA commits; Cancel / scrim tap dismiss. Presented through the
  // shared <BottomSheet> so it gets the same grabber handle, iOS home indicator
  // and slide-in-with-bounce chrome as every other sheet. `lastConfirm` freezes
  // the variant so the copy doesn't flip while the sheet is sliding away.
  const [confirm, setConfirm] = useState<{ id: string; mode: 'mark' | 'unmark' } | null>(null);
  const lastConfirm = useRef<{ id: string; mode: 'mark' | 'unmark' }>({ id: '', mode: 'mark' });
  if (confirm) lastConfirm.current = confirm;

  const commitConfirm = () => {
    if (confirm) {
      if (confirm.mode === 'mark') markPurchased(confirm.id);
      else unmarkPurchased(confirm.id);
    }
    setConfirm(null);
  };

  // Cart page — tapping the floating gift-bag pill opens the full Cart screen
  // as an overlay above the registry (comment: "open the Cart page").
  const [cartPageOpen, setCartPageOpen] = useState(false);

  // Checkout page — the Cart's Checkout CTA opens the full Checkout screen as a
  // further overlay above the cart (comment: "open the checkout page").
  const [checkoutPageOpen, setCheckoutPageOpen] = useState(false);

  // Order-placed state — submitting the checkout (ENTER CVV) shows a brief
  // skeleton, then returns to the gifter home with a "You have sent a gift"
  // status card built from the actual items just bought.
  const [placedOrder, setPlacedOrder] = useState<ActiveOrderCardProps | null>(null);
  const [placing, setPlacing] = useState(false); // skeleton-loader phase
  const heroStatusOrder = placedOrder ?? statusOrder;

  // Reset to the top of the page after placing an order so the hero reveal plays
  // from the top. Handles both standalone (window scrolls) and the tabbed landing
  // (an ancestor container scrolls instead of the window).
  const screenRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0 });
    let el = screenRef.current?.parentElement;
    while (el) {
      if (el.scrollHeight > el.clientHeight) el.scrollTop = 0;
      el = el.parentElement;
    }
  };

  const placeOrder = () => {
    setCheckoutPageOpen(false);
    setCartPageOpen(false);

    // Snapshot the bought products before clearing the bag: the status card's
    // image well and count follow what was actually checked out.
    const boughtIds = Object.keys(bag);
    const boughtProducts = boughtIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is GifterHomeProduct => p != null);
    const totalItems = boughtIds.reduce((sum, id) => sum + bag[id], 0);
    const images = boughtProducts.map((p) => p.imageUrl);
    const count = images.length;
    const imagesVariant: ActiveOrderVariant =
      count <= 1 ? '1' : count === 2 ? '2' : count === 3 ? '3' : count === 4 ? '4' : '4+';
    const status: ActiveOrderCardProps = {
      senderName: 'You',
      senderSuffix: 'have sent a gift',
      arrivingLabel: 'May 19 - 24',
      itemsLabel: `${totalItems} item${totalItems === 1 ? '' : 's'}`,
      statusLabel: 'Processing',
      deliveryTag: 'On time',
      express: true,
      imagesVariant,
      images,
    };

    // Bought items switch to the "Purchased" state in the grid; then empty the
    // bag (they've been bought, so no floating cart / in-bag state should linger).
    setPurchased((prev) => {
      const next = { ...prev };
      boughtIds.forEach((id) => (next[id] = true));
      return next;
    });
    setBag({});

    // Skeleton loader first, then reveal the placed-order state (the hero expands
    // to show the status card — see PageHeaderHero's reveal animation). Reset the
    // scroll to the top so the reveal starts from the hero, not wherever the user
    // had scrolled to while browsing.
    scrollToTop();
    setPlacing(true);
    window.setTimeout(() => {
      scrollToTop();
      setPlacedOrder(status);
      setPlacing(false);
    }, 900);
  };

  // Lock the background from scrolling while any overlay (address sheet,
  // confirmation sheet, product explorer, cart or checkout page) is on screen.
  const overlayActive =
    addressOpen ||
    confirm !== null ||
    explorerIndex !== null ||
    cartPageOpen ||
    checkoutPageOpen;
  useEffect(() => {
    if (!overlayActive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [overlayActive]);

  // Purchased cards are deranked to the bottom of the grid (stable sort keeps the
  // original order within each group). Carry each product's original index so the
  // explorer still opens the right item; use the display index for menu alignment.
  const isPurchasedCard = (p: GifterHomeProduct) =>
    p.fixedState === 'purchased' || (!p.fixedState && !!purchased[p.id]);
  const displayProducts = products
    .map((p, i) => ({ p, i }))
    .sort((a, b) => Number(isPurchasedCard(a.p)) - Number(isPurchasedCard(b.p)));

  return (
    <div ref={screenRef} style={screen}>
      {/* ---------- Header hero (PageHeader · gifter variant) ---------- */}
      <PageHeaderHero
        variant="gifter"
        title={title}
        occasionDate={occasionDate}
        countdown={countdown}
        ownerName={deliverToName}
        deliveryTo={deliverToName}
        onBack={onBack}
        onChangeAddress={openAddressSheet}
        statusOrder={heroStatusOrder}
      />

      {/* ---------- Product grid ---------- */}
      <div style={grid}>
        {displayProducts.map(({ p, i }, displayIdx) => {
          const qty = bag[p.id];
          const inBag = qty != null;
          const state: GifterCardState =
            p.fixedState ?? (purchased[p.id] ? 'purchased' : inBag ? 'in-bag' : 'default');
          return (
            <GifterCard
              key={p.id}
              imageUrl={p.imageUrl}
              name={p.name}
              price={p.price}
              wasPrice={p.wasPrice}
              discount={p.discount}
              rating={p.rating ?? 4.3}
              reviewCount={p.reviewCount ?? 128}
              state={state}
              width="100%"
              quantity={qty ?? 1}
              menuAlign={displayIdx % 2 === 0 ? 'left' : 'right'}
              onOpen={() => setExplorerIndex(i)}
              onMarkPurchased={() => setConfirm({ id: p.id, mode: 'mark' })}
              onUnmarkPurchased={() => setConfirm({ id: p.id, mode: 'unmark' })}
              onAddToBag={() => addToBag(p.id)}
              onIncrement={() => increment(p.id)}
              onDecrement={() => decrement(p.id)}
              onRemove={() => remove(p.id)}
            />
          );
        })}
      </div>

      {/* ---------- Floating gift bag ---------- */}
      {cartMounted && (
        <>
          <style>{FLOATING_CART_KEYFRAMES}</style>
          <div
            style={{
              ...floatingWrap,
              bottom: floatingCartBottom,
              animation: cartClosing
                ? 'gh-cart-out 240ms cubic-bezier(0,0,0.2,1) both'
                : 'gh-cart-in 380ms cubic-bezier(0.6,0,0.4,1) both',
            }}
            onAnimationEnd={onCartAnimEnd}
            onClick={() => {
              onViewBag?.();
              setCartPageOpen(true);
            }}
          >
            <FloatingCart
              variant={lastCart.current.count === 1 ? 'Single Item' : 'Default'}
              count={lastCart.current.count}
              images={lastCart.current.thumbs}
            />
          </div>
        </>
      )}

      {/* ---------- Address bottom-sheet (gifter variant) ----------
          Presented via the shared <BottomSheet> so it carries the same grabber
          handle, iOS home indicator and slide-in-with-bounce motion as every
          other sheet (Retune). It also gives the card a full-height, definite
          containing block, which is what lets AddressSheet cap itself at a
          percentage of the screen. zIndex 21 keeps it above the hero chrome. */}
      <BottomSheet open={addressOpen} onClose={() => setAddressOpen(false)} fixed zIndex={21}>
        <AddressSheet
          variant="gifter"
          selectedId={selectedAddressId}
          onSelect={(id, item) => {
            // Persist the pick and reflect it in the pill: the registry
            // (giftbox) row keeps the owner's name; a real address shows
            // its own title. Delay the exit by 1s so the selected state is
            // visible before the sheet slides away (Retune).
            setSelectedAddressId(id);
            setDeliverToName(item.icon === 'giftbox' ? ownerName : item.title);
            window.setTimeout(() => setAddressOpen(false), 1000);
          }}
          onAddAddress={() => setAddressOpen(false)}
        />
      </BottomSheet>

      {/* ---------- Product explorer carousel ---------- */}
      {explorerIndex !== null && (
        <ProductExplorer
          products={products}
          index={explorerIndex}
          inBag={bag}
          purchased={purchased}
          onAddToBag={addToBag}
          // Once in the bag the card's CTA reads "View Gift Bag" — tapping it
          // closes the explorer and opens the full cart.
          onViewGiftBag={() => {
            setExplorerIndex(null);
            setCartPageOpen(true);
          }}
          // Tapping "Purchased" in the explorer opens the "Mark as purchased?"
          // confirmation (mode 'mark') rather than toggling directly — the sheet
          // is elevated above this overlay so it commits only on confirm.
          onTogglePurchased={(id) => setConfirm({ id, mode: 'mark' })}
          onClose={() => setExplorerIndex(null)}
        />
      )}

      {/* ---------- Confirmation sheet (mark purchased / marked by mistake) ----------
          Presented via the shared <BottomSheet> for the standard grabber handle,
          iOS home indicator and slide-in-with-bounce motion. zIndex 50 keeps it
          above the product-explorer carousel (zIndex 40) when opened from there. */}
      <BottomSheet open={confirm !== null} onClose={() => setConfirm(null)} fixed zIndex={50}>
        <ConfirmationBottomsheet
          variant={lastConfirm.current.mode === 'unmark' ? 'marked-mistake' : 'mark-purchased'}
          onConfirm={commitConfirm}
          onCancel={() => setConfirm(null)}
        />
      </BottomSheet>

      {/* ---------- Cart page overlay (opened from the floating gift bag) ---------- */}
      {cartPageOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: colour.surface.tertiary,
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'auto',
          }}
        >
          <CartPage
            onBack={() => setCartPageOpen(false)}
            onCheckout={() => setCheckoutPageOpen(true)}
          />
        </div>
      )}

      {/* ---------- Checkout page overlay (opened from the Cart's Checkout CTA) ----------
          Opens full-bleed (edge-to-edge, no device frame) above the cart
          (zIndex 45) so Back returns to the cart, not home. */}
      {checkoutPageOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 45,
            backgroundColor: colour.surface.tertiary,
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'auto',
          }}
        >
          <CheckoutPage framed={false} onBack={() => setCheckoutPageOpen(false)} onSubmit={placeOrder} />
        </div>
      )}

      {/* ---------- Post-checkout skeleton loader ----------
          Shown briefly after placing the order, before the hero reveals the
          "sent a gift" status card. Mirrors the page structure (hero + grid). */}
      {placing && <OrderSkeleton />}
    </div>
  );
}

/**
 * Loading skeleton for the gifter home shown between checkout submit and the
 * order-placed reveal. A shimmering stand-in for the hero and the product grid.
 */
function OrderSkeleton() {
  return (
    <div style={skeletonOverlay} aria-hidden>
      <style>{SKELETON_KEYFRAMES}</style>
      {/* Hero block */}
      <div style={skHero}>
        <div style={{ ...shimmer, width: 40, height: 40, borderRadius: 20, marginTop: 8 }} />
        <div style={{ ...shimmer, width: 200, height: 26, borderRadius: 8, marginTop: 20 }} />
        <div style={{ ...shimmer, width: 130, height: 16, borderRadius: 8, marginTop: 12 }} />
        <div style={{ ...shimmer, width: 190, height: 44, borderRadius: 22, marginTop: 20 }} />
      </div>
      {/* Product grid */}
      <div style={skGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={skCard}>
            <div style={{ ...shimmer, width: '100%', height: 150, borderRadius: 10 }} />
            <div style={{ ...shimmer, width: '90%', height: 14, borderRadius: 6, marginTop: 12 }} />
            <div style={{ ...shimmer, width: '55%', height: 14, borderRadius: 6, marginTop: 8 }} />
            <div style={{ ...shimmer, width: '100%', height: 36, borderRadius: 8, marginTop: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Slide up from below, ease-in-out with a small overshoot/settle bounce on
// enter; slide straight back down with a smooth ease-out on exit. Centering
// (translateX -50%) is baked into every keyframe so it holds through the anim.
const FLOATING_CART_KEYFRAMES = `
@keyframes gh-cart-in {
  0% { transform: translate(-50%, 160%); opacity: 0; }
  70% { transform: translate(-50%, -8%); opacity: 1; }
  100% { transform: translate(-50%, 0); opacity: 1; }
}
@keyframes gh-cart-out {
  0% { transform: translate(-50%, 0); opacity: 1; }
  100% { transform: translate(-50%, 160%); opacity: 0; }
}
`;

const screen: React.CSSProperties = {
  position: 'relative',
  width: 375,
  minHeight: 812,
  backgroundColor: colour.surface.tertiary,
  // NB: horizontal clipping only. `overflow: hidden` (both axes) would make this
  // the scroll container for the sticky hero header, pinning it to this box
  // (which scrolls away) instead of the viewport — so keep overflow-y visible.
  overflowX: 'clip',
  // The sticky hero shrinks as it collapses, which reduces content height above
  // the fold; without this the browser's scroll anchoring yanks scrollTop back to
  // compensate, fighting the collapse into an oscillation. Opt out so the collapse
  // tracks the scroll cleanly.
  overflowAnchor: 'none',
};

// Left-to-right shimmer sweep for the loading skeleton.
const SKELETON_KEYFRAMES = `
@keyframes gh-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
`;

const skeletonOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 375,
  zIndex: 60,
  backgroundColor: colour.surface.tertiary,
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const skHero: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  paddingTop: 54,
  paddingBottom: space[24],
  backgroundColor: '#efeaf7',
  borderBottomLeftRadius: 28,
  borderBottomRightRadius: 28,
  boxSizing: 'border-box',
};

const skGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: space[12],
  padding: space[12],
  boxSizing: 'border-box',
};

const skCard: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: space[8],
  borderRadius: radius[12],
  backgroundColor: colour.surface.primary,
  boxSizing: 'border-box',
};

const shimmer: React.CSSProperties = {
  backgroundColor: '#e3e6ee',
  backgroundImage: 'linear-gradient(90deg, #e3e6ee 0px, #f2f4f8 60px, #e3e6ee 120px)',
  backgroundSize: '200px 100%',
  backgroundRepeat: 'no-repeat',
  animation: 'gh-shimmer 1.2s ease-in-out infinite',
};

const grid: React.CSSProperties = {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'flex-start',
  columnGap: space[12],
  rowGap: space[12],
  paddingInline: space[12],
  paddingTop: space[12],
  paddingBottom: space[40],
  boxSizing: 'border-box',
  width: 375,
};

const floatingWrap: React.CSSProperties = {
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  cursor: 'pointer',
};

