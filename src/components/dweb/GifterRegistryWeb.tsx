import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { colour, space, radius } from '../../field-ds';
import { type, SITE_WIDTH, SITE_GUTTER, CHROME_H, GRID_GAP, ASSETS, EASE } from './_shared';
import { NoonHeader } from './NoonHeader';
import { NoonFooter } from './NoonFooter';
import { RegistryHero } from './RegistryHero';
import { RegistryAside, PRICE_BANDS, type AvailabilityFilter } from './RegistryAside';
import { ProductTile, type ProductTileState } from './ProductTile';
import { ProductQuickView } from './ProductQuickView';
import { GiftBagDrawer, bagTotals, type GiftBagLine } from './GiftBagDrawer';
import { AddressDialog, GIFTER_ADDRESSES } from './AddressDialog';
import { ConfirmDialog, type ConfirmVariant } from './ConfirmDialog';
import { CheckoutWeb, type DeliverySlot } from './CheckoutWeb';
import { ActiveOrderCard } from '../ActiveOrderCard';
import type { ActiveOrderVariant } from '../atoms';
import { ChevronIcon, GiftIcon } from './icons';

export interface RegistryProduct {
  id: string;
  imageUrl: string;
  name: string;
  price: string;
  wasPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  /** Non-interactive availability states keep their fixed look. */
  fixedState?: Extract<ProductTileState, 'purchased' | 'out-of-order' | 'list-closed'>;
}

/**
 * Default catalogue. Same products and ordering as the mobile `GifterHome`
 * default set, extended with brands (desktop tiles have room for them) so the
 * two views demo the same list.
 */
const DEFAULT_PRODUCTS: RegistryProduct[] = [
  { id: 'airpods', imageUrl: `${ASSETS}/atoms/airpods.jpg`, name: 'Apple AirPods Pro 2 Wireless Earbuds with MagSafe Charging Case', price: '899', wasPrice: '1399', discount: '33%', brand: 'Apple' },
  { id: 'mat-1', imageUrl: `${ASSETS}/mat.png`, name: 'Roseate Birch Super Soft (40x60 cm) Microfiber Bath Mat', price: '24', wasPrice: '99', discount: '33%', brand: 'Roseate' },
  { id: 'perfume-blue', imageUrl: `${ASSETS}/atoms/perfume-blue.png`, name: 'Blue Eau de Toilette for Men, 100ml', price: '499', wasPrice: '899', discount: '33%', brand: 'Chanel' },
  { id: 'perfume-black', imageUrl: `${ASSETS}/atoms/perfume-black.png`, name: 'Compatible with Versace Pour Homme EDT, 100ml', price: '799', wasPrice: '999', discount: '11%', brand: 'Versace' },
  { id: 'lamp', imageUrl: `${ASSETS}/lamp.png`, name: 'Nordic Ambient LED Table Lamp, Warm White', price: '149', wasPrice: '299', discount: '50%', brand: 'Nordic Home' },
  { id: 'perfume', imageUrl: `${ASSETS}/perfume.png`, name: 'Signature Oud Eau de Parfum Unisex, 75ml', price: '349', wasPrice: '599', discount: '41%', brand: 'Ajmal' },
  { id: 'prod-a', imageUrl: `${ASSETS}/atoms/prod-a.png`, name: 'Premium Home Essentials Gift Set', price: '199', wasPrice: '349', discount: '43%', brand: 'Casa' },
  { id: 'prod-b', imageUrl: `${ASSETS}/atoms/prod-b.png`, name: 'Everyday Comfort Collection Bundle', price: '129', wasPrice: '249', discount: '48%', brand: 'Casa' },
  { id: 'washing-machine', imageUrl: `${ASSETS}/atoms/washing-machine.png`, name: '7kg Front Load Fully Automatic Washing Machine', price: '1199', wasPrice: '1699', discount: '29%', brand: 'Samsung' },
  { id: 'fridge', imageUrl: `${ASSETS}/atoms/fridge.png`, name: 'Double Door Frost-Free Refrigerator, 340L', price: '1499', wasPrice: '1999', discount: '25%', brand: 'LG' },
];

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'discount';

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'discount', label: 'Biggest discount' },
];

export interface GifterRegistryWebProps {
  hostName?: string;
  title?: string;
  occasionDate?: string;
  countdown?: string;
  products?: RegistryProduct[];
  /** Public share URL, offered by the hero's copy-link control. */
  shareUrl?: string;
}

const num = (s: string) => Number(s.replace(/,/g, ''));

/**
 * Gifter flow · dWeb screen.
 *
 * The desktop counterpart of ../GifterHome.tsx: a shared gift list a gifter
 * browses, adds to, and checks out — inside real noon.com desktop chrome.
 *
 * It owns the same state machine as the mobile screen (bag, purchased, address,
 * quick view, confirm, checkout, placed order) so behaviour stays consistent;
 * only the layout and the overlay *presentations* differ. Self-contained: props
 * in, no store, no fetching (see ../CONVENTIONS.md).
 */
export function GifterRegistryWeb({
  hostName = 'Prasanna',
  title = 'Prasanna’s Birthday',
  occasionDate = '14th June',
  countdown = '20 days to go!',
  products = DEFAULT_PRODUCTS,
  shareUrl = 'https://noon.com/gift-list/prasanna-birthday',
}: GifterRegistryWebProps) {
  /* ------------------------------------------------------------ bag state */

  const [bag, setBag] = useState<Record<string, number>>({});
  const [purchased, setPurchased] = useState<Record<string, true>>({});
  const [saved, setSaved] = useState<Record<string, true>>({});

  const addToBag = (id: string) => setBag((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
  const increment = addToBag;
  const decrement = (id: string) => setBag((b) => ({ ...b, [id]: Math.max(1, (b[id] ?? 1) - 1) }));
  const remove = (id: string) =>
    setBag((b) => {
      const next = { ...b };
      delete next[id];
      return next;
    });
  const toggleSaved = (id: string) =>
    setSaved((s) => {
      const next = { ...s };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  /* ------------------------------------------------------- overlay state */

  const [bagOpen, setBagOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [quickView, setQuickView] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; variant: ConfirmVariant } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Freeze the confirm target so the copy doesn't flip while the dialog exits.
  const lastConfirm = useRef<{ id: string; variant: ConfirmVariant }>({ id: '', variant: 'mark-purchased' });
  if (confirm) lastConfirm.current = confirm;

  const [selectedAddressId, setSelectedAddressId] = useState('registry');
  const selectedAddress = GIFTER_ADDRESSES.find((a) => a.id === selectedAddressId) ?? GIFTER_ADDRESSES[0];
  // The registry address shows the host's name; a personal address shows its own.
  const deliveryTo = selectedAddress.kind === 'registry' ? hostName : selectedAddress.title;
  const deliveryHint = selectedAddress.kind === 'registry' ? selectedAddress.address : selectedAddress.address;

  /* --------------------------------------------------------- placed order */

  const [placedOrder, setPlacedOrder] = useState<React.ComponentProps<typeof ActiveOrderCard> | null>(null);
  const [placing, setPlacing] = useState(false);

  /* ------------------------------------------------------------- filters */

  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [priceBands, setPriceBands] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [sortOpen, setSortOpen] = useState(false);

  const togglePriceBand = (id: string) =>
    setPriceBands((bands) => (bands.includes(id) ? bands.filter((b) => b !== id) : [...bands, id]));

  const clearFilters = () => {
    setAvailability('all');
    setPriceBands([]);
  };

  /* -------------------------------------------------------- derived lists */

  const isGifted = (p: RegistryProduct) =>
    p.fixedState === 'purchased' || (!p.fixedState && !!purchased[p.id]);

  const giftedCount = products.filter(isGifted).length;

  const visible = useMemo(() => {
    const inBand = (p: RegistryProduct) => {
      if (priceBands.length === 0) return true;
      const v = num(p.price);
      return priceBands.some((id) => {
        const band = PRICE_BANDS.find((b) => b.id === id);
        if (!band) return false;
        return v >= band.min && (band.max == null || v < band.max);
      });
    };

    const matchesAvailability = (p: RegistryProduct) => {
      if (availability === 'available') return !isGifted(p) && p.fixedState !== 'out-of-order';
      if (availability === 'gifted') return isGifted(p);
      return true;
    };

    const list = products.filter((p) => inBand(p) && matchesAvailability(p));

    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => num(a.price) - num(b.price));
    if (sort === 'price-desc') sorted.sort((a, b) => num(b.price) - num(a.price));
    if (sort === 'discount') {
      const pct = (p: RegistryProduct) => (p.discount ? Number(p.discount.replace('%', '')) : 0);
      sorted.sort((a, b) => pct(b) - pct(a));
    }

    // Gifted items derank to the bottom in every sort but the "gifted" facet —
    // a gifter's attention belongs on what they can still buy.
    if (availability !== 'gifted') {
      sorted.sort((a, b) => Number(isGifted(a)) - Number(isGifted(b)));
    }
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, priceBands, availability, sort, purchased]);

  // Quick view pages through the *visible* list, so arrow keys don't jump to a
  // gift the current filters have hidden.
  const quickViewProducts = visible;

  /* -------------------------------------------------------------- actions */

  const bagLines: GiftBagLine[] = Object.keys(bag)
    .map((id) => {
      const p = products.find((x) => x.id === id);
      return p ? { id, imageUrl: p.imageUrl, name: p.name, price: p.price, quantity: bag[id] } : null;
    })
    .filter((l): l is GiftBagLine => l != null);

  const { items: bagCount } = bagTotals(bagLines);

  const commitConfirm = () => {
    if (!confirm) return;
    const { id, variant } = confirm;
    setPurchased((prev) => {
      const next = { ...prev };
      if (variant === 'mark-purchased') next[id] = true;
      else delete next[id];
      return next;
    });
    setConfirm(null);
  };

  const openCheckout = () => {
    setBagOpen(false);
    setCheckoutOpen(true);
    window.scrollTo({ top: 0, left: 0 });
  };

  const placeOrder = ({ slot }: { slot: DeliverySlot }) => {
    // Snapshot what was bought before clearing the bag: the tracker card's image
    // well and item count follow what actually checked out.
    const boughtIds = Object.keys(bag);
    const bought = boughtIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is RegistryProduct => p != null);
    const totalItems = boughtIds.reduce((n, id) => n + bag[id], 0);
    const images = bought.map((p) => p.imageUrl);
    const count = images.length;
    const imagesVariant: ActiveOrderVariant =
      count <= 1 ? '1' : count === 2 ? '2' : count === 3 ? '3' : count === 4 ? '4' : '4+';

    // Bought gifts switch to "Purchased" on the list, then the bag empties.
    setPurchased((prev) => {
      const next = { ...prev };
      boughtIds.forEach((id) => (next[id] = true));
      return next;
    });
    setBag({});
    setCheckoutOpen(false);

    setPlacing(true);
    window.scrollTo({ top: 0, left: 0 });
    window.setTimeout(() => {
      setPlacedOrder({
        senderName: 'You',
        senderSuffix: 'have sent a gift',
        arrivingLabel: slot.id === 'occasion' ? '14 June' : slot.label,
        itemsLabel: `${totalItems} item${totalItems === 1 ? '' : 's'}`,
        statusLabel: 'Processing',
        deliveryTag: 'On time',
        express: slot.tag === 'express',
        imagesVariant,
        images,
        style: { width: '100%' },
      });
      setPlacing(false);
      window.scrollTo({ top: 0, left: 0 });
    }, 900);
  };

  // Dismiss the sort menu on outside click.
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sortOpen) return;
    const onDown = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [sortOpen]);

  /* --------------------------------------------------------------- render */

  // Checkout takes over the viewport but keeps the noon chrome, matching how
  // noon's own desktop checkout behaves.
  if (checkoutOpen) {
    return (
      <div style={shell}>
        <NoonHeader cartCount={bagCount} wishlistCount={Object.keys(saved).length} onOpenCart={() => setBagOpen(true)} />
        <CheckoutWeb
          lines={bagLines}
          deliveryTo={deliveryTo}
          deliveryHint={deliveryHint}
          hostName={hostName}
          onBack={() => setCheckoutOpen(false)}
          onChangeAddress={() => setAddressOpen(true)}
          onPlaceOrder={placeOrder}
        />
        <AddressDialog
          open={addressOpen}
          selectedId={selectedAddressId}
          onSelect={(id) => {
            setSelectedAddressId(id);
            window.setTimeout(() => setAddressOpen(false), 320);
          }}
          onClose={() => setAddressOpen(false)}
        />
        <NoonFooter />
      </div>
    );
  }

  return (
    <div style={shell}>
      <NoonHeader
        cartCount={bagCount}
        wishlistCount={Object.keys(saved).length}
        onOpenCart={() => setBagOpen(true)}
        onOpenLocation={() => setAddressOpen(true)}
      />

      {/* ---------- Breadcrumb ---------- */}
      <div style={crumbBar}>
        <div style={crumbInner}>
          <span style={crumb}>Home</span>
          <ChevronIcon dir="right" size={16} color={colour['text-n-icon'].muted} />
          <span style={crumb}>Gift lists</span>
          <ChevronIcon dir="right" size={16} color={colour['text-n-icon'].muted} />
          <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{title}</span>
        </div>
      </div>

      {/* ---------- Hero ---------- */}
      <RegistryHero
        title={title}
        occasionDate={occasionDate}
        countdown={countdown}
        hostName={hostName}
        deliveryTo={deliveryTo}
        itemCount={products.length}
        giftedCount={giftedCount}
        shareUrl={shareUrl}
        onChangeAddress={() => setAddressOpen(true)}
        statusSlot={placedOrder ? <ActiveOrderCard {...placedOrder} /> : undefined}
      />

      {/* ---------- Body ---------- */}
      <main style={{ ...bodyWrap, paddingTop: placedOrder ? 52 : space[24] }}>
        <div style={bodyInner}>
          <RegistryAside
            hostName={hostName}
            deliveryHint={selectedAddress.kind === 'registry' ? 'address kept private' : undefined}
            itemCount={products.length}
            giftedCount={giftedCount}
            availability={availability}
            onChangeAvailability={setAvailability}
            priceBands={priceBands}
            onTogglePriceBand={togglePriceBand}
            onClearFilters={clearFilters}
          />

          <div style={gridCol}>
            {/* Toolbar */}
            <div style={toolbar}>
              <span style={{ ...type.h20, color: colour['text-n-icon'].primary }}>
                {visible.length} {visible.length === 1 ? 'gift' : 'gifts'}
                <span style={{ ...type.b14, color: colour['text-n-icon'].tertiary }}>
                  {' '}
                  on {hostName}&rsquo;s list
                </span>
              </span>

              <div ref={sortRef} style={{ position: 'relative' }}>
                <button type="button" onClick={() => setSortOpen((v) => !v)} style={sortBtn} aria-expanded={sortOpen}>
                  <span style={{ ...type.b14, color: colour['text-n-icon'].secondary }}>Sort by:</span>
                  <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>
                    {SORTS.find((s) => s.id === sort)?.label}
                  </span>
                  <ChevronIcon dir={sortOpen ? 'up' : 'down'} size={18} color={colour['text-n-icon'].secondary} />
                </button>

                {sortOpen && (
                  <div role="menu" style={sortMenu}>
                    {SORTS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={s.id === sort}
                        onClick={() => {
                          setSort(s.id);
                          setSortOpen(false);
                        }}
                        style={{
                          ...sortItem,
                          backgroundColor: s.id === sort ? colour.surface['action-subtle'] : 'transparent',
                          color: s.id === sort ? colour['text-n-icon'].action : colour['text-n-icon'].primary,
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Grid */}
            {visible.length === 0 ? (
              <div style={emptyGrid}>
                <span style={emptyArt}>
                  <GiftIcon size={36} color={colour['text-n-icon'].tertiary} />
                </span>
                <span style={{ ...type.h18, color: colour['text-n-icon'].primary }}>No gifts match those filters</span>
                <span style={{ ...type.b14, color: colour['text-n-icon'].secondary }}>
                  Try widening the budget or switching availability back to all gifts.
                </span>
                <button type="button" onClick={clearFilters} style={clearCta}>
                  <span style={{ ...type.b14Semi, color: colour['text-n-icon'].action }}>Clear filters</span>
                </button>
              </div>
            ) : (
              <div style={grid}>
                {visible.map((p) => {
                  const qty = bag[p.id];
                  const state: ProductTileState =
                    p.fixedState ?? (purchased[p.id] ? 'purchased' : qty != null ? 'in-bag' : 'default');
                  return (
                    <ProductTile
                      key={p.id}
                      imageUrl={p.imageUrl}
                      name={p.name}
                      price={p.price}
                      wasPrice={p.wasPrice}
                      discount={p.discount}
                      rating={p.rating}
                      reviewCount={p.reviewCount}
                      state={state}
                      quantity={qty ?? 1}
                      saved={!!saved[p.id]}
                      onOpen={() => setQuickView(visible.findIndex((v) => v.id === p.id))}
                      onAddToBag={() => addToBag(p.id)}
                      onIncrement={() => increment(p.id)}
                      onDecrement={() => decrement(p.id)}
                      onRemove={() => remove(p.id)}
                      onToggleSaved={() => toggleSaved(p.id)}
                      onMarkPurchased={() => setConfirm({ id: p.id, variant: 'mark-purchased' })}
                      onUnmarkPurchased={() => setConfirm({ id: p.id, variant: 'marked-mistake' })}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <NoonFooter />

      {/* ---------- Overlays ---------- */}
      <ProductQuickView
        products={quickViewProducts}
        index={quickView}
        inBag={bag}
        purchased={purchased}
        hostName={hostName}
        onNavigate={setQuickView}
        onAddToBag={addToBag}
        onIncrement={increment}
        onDecrement={decrement}
        onViewGiftBag={() => {
          setQuickView(null);
          setBagOpen(true);
        }}
        onMarkPurchased={(id) => setConfirm({ id, variant: 'mark-purchased' })}
        onClose={() => setQuickView(null)}
      />

      <GiftBagDrawer
        open={bagOpen}
        lines={bagLines}
        deliveryTo={deliveryTo}
        deliveryHint={selectedAddress.kind === 'registry' ? selectedAddress.address : selectedAddress.address}
        onClose={() => setBagOpen(false)}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={remove}
        onCheckout={openCheckout}
        onChangeAddress={() => setAddressOpen(true)}
      />

      <AddressDialog
        open={addressOpen}
        selectedId={selectedAddressId}
        onSelect={(id) => {
          // Hold the selected state visible briefly before the dialog closes.
          setSelectedAddressId(id);
          window.setTimeout(() => setAddressOpen(false), 320);
        }}
        onClose={() => setAddressOpen(false)}
      />

      <ConfirmDialog
        open={confirm !== null}
        variant={lastConfirm.current.variant}
        imageUrl={products.find((p) => p.id === lastConfirm.current.id)?.imageUrl}
        onConfirm={commitConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Post-checkout skeleton, mirroring the mobile flow's 900ms hand-off. */}
      {placing && <PlacingOverlay />}
    </div>
  );
}

/* ------------------------------------------------------- placing overlay */

const SHIMMER = `
@keyframes gw-shimmer { 0% { background-position: -320px 0 } 100% { background-position: calc(320px + 100%) 0 } }
`;

/**
 * Shown between "Send gift" and the placed-order reveal. A shimmering stand-in
 * for the hero + grid, so the transition reads as loading rather than a flash.
 */
function PlacingOverlay() {
  return (
    <div style={placingRoot} aria-live="polite" aria-label="Placing your order">
      <style>{SHIMMER}</style>
      <div style={{ ...shimmer, width: '100%', height: 240, borderRadius: 0 }} />
      <div style={placingBody}>
        <div style={{ ...shimmer, width: 250, height: 400, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: GRID_GAP, flex: '1 1 auto' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ ...shimmer, height: 380, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const shell: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colour.surface.tertiary,
};

const crumbBar: CSSProperties = {
  width: '100%',
  backgroundColor: colour.surface.primary,
  display: 'flex',
  justifyContent: 'center',
};

const crumbInner: CSSProperties = {
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  paddingBlock: space[10],
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
};

const crumb: CSSProperties = {
  ...type.b14Reg,
  color: colour['text-n-icon'].tertiary,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const bodyWrap: CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: space[40],
};

const bodyInner: CSSProperties = {
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'flex-start',
  gap: GRID_GAP,
};

const gridCol: CSSProperties = {
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
};

const toolbar: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[16],
  flexWrap: 'wrap',
};

const sortBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[6],
  height: 40,
  paddingInline: space[14],
  borderRadius: radius[10],
  border: `1px solid ${colour.border.primary}`,
  backgroundColor: colour.surface.primary,
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const sortMenu: CSSProperties = {
  position: 'absolute',
  top: 46,
  insetInlineEnd: 0,
  zIndex: 15,
  minWidth: 220,
  display: 'flex',
  flexDirection: 'column',
  padding: space[6],
  borderRadius: radius[12],
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.primary}`,
  boxShadow: '0 8px 24px rgba(16, 22, 40, 0.14)',
};

const sortItem: CSSProperties = {
  ...type.b14,
  textAlign: 'start',
  border: 'none',
  borderRadius: radius[8],
  padding: `${space[10]}px ${space[12]}px`,
  cursor: 'pointer',
  transition: `background-color 120ms ${EASE}`,
};

const grid: CSSProperties = {
  display: 'grid',
  // 206px min tracks noon's own PLP tile width (~208px beside the 250px rail at
  // 1440), which lands the column count on 5-up at 1440 / 4-up at 1280 / 3-up at
  // 1024. Wider minimums drop a whole column at 1280 and leave the grid sparse.
  gridTemplateColumns: 'repeat(auto-fill, minmax(206px, 1fr))',
  gap: GRID_GAP,
  alignItems: 'start',
};

const emptyGrid: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space[10],
  padding: space[56],
  borderRadius: radius[12],
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  textAlign: 'center',
  boxSizing: 'border-box',
};

const emptyArt: CSSProperties = {
  width: 68,
  height: 68,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.tertiary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: space[4],
};

const clearCta: CSSProperties = {
  height: 44,
  paddingInline: space[20],
  borderRadius: radius[10],
  border: `1px solid ${colour.border.action}`,
  backgroundColor: colour.surface.primary,
  cursor: 'pointer',
  marginTop: space[4],
};

const placingRoot: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 60,
  backgroundColor: colour.surface.tertiary,
  display: 'flex',
  flexDirection: 'column',
  gap: GRID_GAP,
  overflow: 'hidden',
  paddingTop: CHROME_H,
};

const placingBody: CSSProperties = {
  display: 'flex',
  gap: GRID_GAP,
  width: '100%',
  maxWidth: SITE_WIDTH,
  marginInline: 'auto',
  paddingInline: SITE_GUTTER,
  boxSizing: 'border-box',
};

const shimmer: CSSProperties = {
  backgroundColor: '#e3e6ee',
  backgroundImage: 'linear-gradient(90deg, #e3e6ee 0px, #f2f4f8 90px, #e3e6ee 180px)',
  backgroundSize: '320px 100%',
  backgroundRepeat: 'no-repeat',
  animation: 'gw-shimmer 1.2s ease-in-out infinite',
};
