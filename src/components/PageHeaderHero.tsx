import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { space, radius } from '../field-ds';

// Height of the fully-minimised bar: iOS status bar + 56px nav row + 12px pad.
// The hero's height interpolates down to this as it collapses.
const COLLAPSED_BAR_H = 116;

// Linear interpolate a → b by t (t already eased/clamped by the caller).
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Solid-white circular action button (close / location) used in the gifter hero.
function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 5L15 15M15 5L5 15" stroke="#1D2539" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
import { PhoneHeader, PageTitle, AdressPill, OccassionDate } from './atoms';
import { ChevronLeftIcon, PreferencesIcon, LocationBaseIcon } from './atoms/icons';
import { colors, type as atomType } from './atoms/_shared';
import { ActiveOrderCard, type ActiveOrderCardProps } from './ActiveOrderCard';

// 375×416 birthday hero backdrop — 3× PNG export from Figma (node 1547:586025).
const BG_IMAGE = '/gift-registry/page-header-bg.png';

export type PageHeaderVariant = 'receiver' | 'gifter' | 'creator';

export interface PageHeaderHeroProps {
  /** Which layout to render. "receiver" = gift tracker rail; "gifter" = delivery pill. */
  variant?: PageHeaderVariant;
  /** Occasion heading, e.g. "Prasanna's Birthday". */
  title?: string;
  /** Formatted occasion date, e.g. "14th June". */
  occasionDate?: string;
  /** Countdown label, e.g. "20 days to go!". */
  countdown?: string;
  /** iOS status-bar clock. */
  time?: string;
  /** Fixed hero height in px. When omitted, the hero sizes to its content. */
  height?: number;
  onBack?: () => void;
  // --- Receiver ---
  /** Rail heading, e.g. "5 Gifts ordered till now". */
  ordersLabel?: string;
  /** Order tracker cards shown in the horizontal rail. Defaults to the sample set. */
  orders?: ActiveOrderCardProps[];
  onPreferences?: () => void;
  onViewAll?: () => void;
  /** Tapping an order card in the rail (e.g. to open the Gift Tracking page). */
  onOrderPress?: () => void;
  // --- Gifter ---
  /** Registry owner name shown in the delivery pill. */
  ownerName?: string;
  /** Delivery location shown in the collapsed sticky bar's subtitle. */
  deliveryTo?: string;
  onChangeAddress?: () => void;
  /**
   * Gifter only — when set, a single "Gifter · 1 gift" order card renders in the
   * hero just below the delivery pill (Figma node 1379:1050777), used once the
   * gifter has placed an order.
   */
  statusOrder?: ActiveOrderCardProps;
}

const DEFAULT_ORDERS: ActiveOrderCardProps[] = [
  {
    senderName: 'John Doe',
    senderSuffix: 'sent you a gift',
    arrivingLabel: 'May 19 - 24',
    itemsLabel: '2 items',
    statusLabel: 'Processing',
    deliveryTag: 'On time',
    express: true,
    imagesVariant: '2',
  },
  {
    senderName: 'Sarah Lee',
    senderSuffix: 'sent you a gift',
    arrivingLabel: 'May 21 - 26',
    itemsLabel: '1 item',
    statusLabel: 'Processing',
    deliveryTag: 'On time',
    express: true,
    imagesVariant: '1',
  },
];

/**
 * "Page Header" — the birthday hero that tops a registry screen. One component,
 * two Figma variants (node 1547:587686):
 *
 * • receiver — back + preferences glass buttons, centred occasion title, and a
 *   glassmorphic "gifts ordered" rail of horizontally-scrolling order trackers.
 * • gifter — back glass button, centred occasion title, and a centred
 *   "Delivering to <name>" address pill.
 * • creator — back + preferences glass buttons and the centred occasion title
 *   only (no rail/pill); used to top the list-creator dashboard.
 *
 * Built entirely from Field DS atoms/components (BirthdayBackground, PhoneHeader,
 * PageTitle, ActiveOrderCard, AdressPill) with tokens for every colour/space.
 */
export function PageHeaderHero({
  variant = 'receiver',
  title = 'Prasanna’s Birthday',
  occasionDate = '14th June',
  countdown = '20 days to go!',
  time = '9:41',
  height,
  onBack,
  ordersLabel = '5 Gifts ordered till now',
  orders = DEFAULT_ORDERS,
  onPreferences,
  onViewAll,
  onOrderPress,
  ownerName = 'Prasanna',
  deliveryTo = 'Downtown Dubai',
  onChangeAddress,
  statusOrder,
}: PageHeaderHeroProps) {
  const isGifter = variant === 'gifter';
  const isCreator = variant === 'creator';
  const isReceiver = variant === 'receiver';
  // Gifter and the creator-home (receiver) hero both drop a minimised sticky bar
  // on scroll.
  const canCollapse = isGifter || isReceiver;

  // Minimised-bar height. The gifter bar drops its 12px bottom padding plus a
  // further 8px of bottom spacing (Retune comments) → 20px shorter than the base
  // bar. The nav row keeps its full height so the buttons retain their position.
  const collapsedH = isGifter ? COLLAPSED_BAR_H - 20 : COLLAPSED_BAR_H;

  // Reveal the status card by expanding the hero (grid-rows 0fr → 1fr) so the
  // product list below is pushed down smoothly. Runs once the card mounts —
  // e.g. right after checkout. 500ms ease-in-out (Retune).
  const [statusRevealed, setStatusRevealed] = useState(false);
  useEffect(() => {
    if (!statusOrder) {
      setStatusRevealed(false);
      return;
    }
    setStatusRevealed(false);
    // Double rAF: let the collapsed (0fr) state paint before transitioning.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setStatusRevealed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [statusOrder]);

  // Sticky-collapse (gifter): as the hero scrolls away, a compact bar
  // (back · centred title/subtitle · location action) pins to the top.
  // Figma node 1476:1424017.
  const rootRef = useRef<HTMLDivElement>(null);
  // Scroll-linked collapse progress: 0 = full hero, 1 = fully minimised bar.
  // The hero's height shrinks and its content crossfades in place as you scroll,
  // so the header *morphs* into the minimised bar instead of dropping one in.
  const [progress, setProgress] = useState(0);
  // Natural (expanded) hero height, measured once so the height can be
  // interpolated down to COLLAPSED_BAR_H as `progress` goes 0 → 1.
  const [expandedH, setExpandedH] = useState<number | null>(null);
  // Mirror in a ref so the (mount-only) scroll handler reads the stable natural
  // height, not the live scrollHeight (which shrinks as content collapses).
  const expandedHRef = useRef(320);
  useLayoutEffect(() => {
    if (!canCollapse) return;
    // scrollHeight reports the natural content height even while `height` is
    // constrained, so this stays correct after the first measure.
    const el = rootRef.current;
    if (el) {
      expandedHRef.current = el.scrollHeight;
      setExpandedH(el.scrollHeight);
    }
  }, [canCollapse, variant, statusOrder]);

  useEffect(() => {
    if (!canCollapse) return;

    // The page may scroll the window (standalone) or a scrollable ancestor
    // (inside the tabbed app shell). Bind to whichever actually scrolls so the
    // minimised bar still tracks the scroll.
    let el = rootRef.current?.parentElement;
    let scroller: HTMLElement | null = null;
    while (el) {
      const oy = getComputedStyle(el).overflowY;
      if (oy === 'auto' || oy === 'scroll') {
        scroller = el;
        break;
      }
      el = el.parentElement;
    }

    const readTop = () => (scroller ? scroller.scrollTop : window.scrollY);
    const onScroll = () => {
      const h = expandedHRef.current;
      // Collapse finishes exactly as the hero has shrunk to the minimised bar.
      const distance = Math.max(1, h - collapsedH);
      const t = Math.min(1, Math.max(0, readTop() / distance));
      // Smoothstep: subtle early, settling as the hero exits — reads as a morph.
      setProgress(t * t * (3 - 2 * t));
    };
    onScroll();
    const target: Window | HTMLElement = scroller ?? window;
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, [canCollapse]);

  // Height interpolated from the natural hero height down to the minimised bar.
  const morphHeight =
    canCollapse && expandedH != null
      ? collapsedH + (expandedH - collapsedH) * (1 - progress)
      : null;

  return (
    <div
      ref={rootRef}
      style={{
        ...root,
        // Gifter: 16px bottom padding when maximised (Retune), fading to 0 as it
        // minimises. Others keep a static bottom padding.
        paddingBottom: isCreator ? space[24] : isGifter ? lerp(space[16], 0, progress) : space[12],
        // Pin the hero to the top of the scroller so it stays put and *shrinks*
        // (morphs) in place as you scroll, rather than scrolling away. Sticky is
        // used (not fixed) so it's unaffected by the frame's `zoom`.
        ...(canCollapse ? { position: 'sticky', top: 0, zIndex: 20 } : null),
        // While collapsing, the hero height shrinks to the minimised bar and its
        // content (clipped by `overflow: hidden`) compresses — a real morph, not
        // a scroll-away. Falls back to the fixed `height` prop when not collapsing.
        ...(morphHeight != null
          ? { height: morphHeight, minHeight: collapsedH }
          : height != null
            ? { height, minHeight: height }
            : null),
      }}
    >
      {/* Decorative birthday backdrop. The source art is 375×416 anchored to the
          top of the card (per Figma). object-fit: cover keeps its aspect ratio so it
          never stretches, and the shorter gifter card simply crops the bottom. */}
      <img
        src={BG_IMAGE}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          display: 'block',
        }}
      />

      {isGifter ? (
        /* ---- Gifter: one morphing header. The SAME title scales down (28→16)
           and slides up into the nav band; the date row scales to 80% into the
           subtitle slot while the delivery pill collapses its text and travels to
           the top-right. All scroll-linked via `progress`. */
        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Status bar + action buttons — always visible, pinned at the top */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[6], width: '100%' }}>
            <PhoneHeader time={time} />
            {/* Nav row keeps its 56px height so the buttons retain position. */}
            <div style={navBar}>
              <button type="button" aria-label="Close" onClick={onBack} style={solidButton}>
                <CloseIcon size={18} />
              </button>
              {/* Right slot is left empty — the delivery pill itself collapses into
                  an icon and travels here (see the traveling pill below). */}
              <div style={{ flex: 1, minWidth: 0 }} />
            </div>
          </div>

          {/* Title stack — slides up into the nav band as it collapses. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              marginTop: space[12],
              transform: `translateY(${lerp(0, -60, progress)}px)`,
            }}
          >
            {/* Occasion title — the SAME element, scaled 28 → 16. */}
            <span
              style={{
                fontFamily: atomType.h28Bold.fontFamily,
                fontWeight: 700,
                color: colors.text.primary,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontSize: lerp(28, 16, progress),
                lineHeight: `${lerp(36, 22, progress)}px`,
                letterSpacing: lerp(-0.25, -0.15, progress),
              }}
            >
              {title}
            </span>

            {/* Date row — in the minimised state this scales to 80% and sits
                directly under the title as the subtitle. */}
            <div
              style={{
                marginTop: lerp(4, 2, progress),
                transform: `scale(${lerp(1, 0.8, progress)})`,
                transformOrigin: 'center top',
              }}
            >
              <OccassionDate date={occasionDate} countdown={countdown} tone="primary" />
            </div>

            {/* Spacer reserving the delivery pill's space while expanded (16px gap
                + 44px pill = 60); collapses to 0 as it minimises (the pill is the
                travelling element below). */}
            <div style={{ height: lerp(60, 0, progress) }} />

            {/* Post-checkout status card (revealed after placing an order). */}
            {statusOrder && (
              <div
                style={{
                  width: '100%',
                  paddingInline: space[12],
                  boxSizing: 'border-box',
                  marginTop: space[20],
                  display: 'grid',
                  gridTemplateRows: statusRevealed ? '1fr' : '0fr',
                  opacity: statusRevealed ? Math.max(0, 1 - progress * 1.6) : 0,
                  transition:
                    'grid-template-rows 500ms ease-in-out, opacity 500ms ease-in-out',
                }}
              >
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  <ActiveOrderCard {...statusOrder} style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>

          {/* Travelling delivery pill — its text collapses right-to-left into the
              icon circle, then it curves up to the top-right (X leads, Y lags via
              progress²), landing where a separate location CTA would be. */}
          <div
            onClick={onChangeAddress}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              zIndex: 4,
              cursor: onChangeAddress ? 'pointer' : 'default',
              transform: `translate(calc(-50% + ${lerp(0, 152, progress)}px), ${lerp(166, 32, progress * progress)}px)`,
            }}
          >
            <AdressPill name={ownerName} collapse={Math.min(1, progress * 1.3)} />
          </div>
        </div>
      ) : (
        <>
          {/* Foreground — fades out as the minimised bar fades in (receiver/creator). */}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[12], opacity: Math.max(0, 1 - progress * 1.25), pointerEvents: canCollapse && progress > 0.5 ? 'none' : 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[6], width: '100%' }}>
              <PhoneHeader time={time} />
              <div style={navBar}>
                <button type="button" aria-label="Back" onClick={onBack} style={glassButton}>
                  <ChevronLeftIcon size={20} />
                </button>
                <div style={{ flex: 1, minWidth: 0 }} />
                <button type="button" aria-label="Preferences" onClick={onPreferences} style={glassButton}>
                  <PreferencesIcon size={20} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[20], width: '100%' }}>
              <div style={{ width: 250 }}>
                <PageTitle title={title} date={occasionDate} countdown={countdown} tone="primary" />
              </div>

              {isCreator ? null : (
                <div style={railOuter}>
                  <div style={railCard}>
                    <div style={railHeader}>
                      <span style={railTitle}>{ordersLabel}</span>
                      <button type="button" onClick={onViewAll} style={viewAllBtn}>
                        <span style={viewAllLabel}>View All</span>
                        <span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
                          <ChevronLeftIcon size={16} />
                        </span>
                      </button>
                    </div>
                    <div style={railScroller}>
                      {orders.map((order, i) => (
                        <ActiveOrderCard key={i} {...order} onPress={onOrderPress} style={{ width: 307, flexShrink: 0 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {canCollapse && (
            <div
              style={{
                ...minimisedLayer,
                opacity: progress,
                pointerEvents: progress > 0.5 ? 'auto' : 'none',
              }}
              aria-hidden={progress < 0.5}
            >
              <PhoneHeader time={time} />
              <div style={navBar}>
                <button type="button" aria-label="Back" onClick={onBack} style={glassButton}>
                  <ChevronLeftIcon size={20} />
                </button>
                <div style={collapsedCenter}>
                  <span style={collapsedTitle}>{title}</span>
                  <span style={collapsedSubtitle}>{occasionDate}</span>
                </div>
                <button type="button" aria-label="Preferences" onClick={onPreferences} style={glassButton}>
                  <PreferencesIcon size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// The minimised header content (status bar + nav row with back · centred
// title/subtitle · location action), layered over the top of the shrinking hero.
// Transparent — it sits on the hero's own cropped birthday backdrop, which crops
// to this height as the hero collapses. Opacity is driven directly by scroll
// progress (no transition) so it tracks the scroll exactly.
const minimisedLayer: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: space[6],
  boxSizing: 'border-box',
  zIndex: 2,
  willChange: 'opacity',
};

const collapsedCenter: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  overflow: 'hidden',
};

const collapsedTitle: CSSProperties = {
  fontFamily: 'Noontree-SemiBold',
  fontWeight: 600,
  fontSize: 16,
  lineHeight: '22px',
  letterSpacing: -0.15,
  color: colors.text.primary,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const collapsedSubtitle: CSSProperties = {
  fontFamily: 'Noontree-Regular',
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '18px',
  letterSpacing: -0.1,
  color: colors.text.secondary,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const root: CSSProperties = {
  position: 'relative',
  width: 375,
  // Never shrink: as a flex child of a fixed-height screen (e.g. the app shell),
  // the hero's `overflow: hidden` would otherwise let flexbox collapse it.
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space[12],
  overflow: 'hidden',
  borderBottomLeftRadius: radius[28],
  borderBottomRightRadius: radius[28],
  boxSizing: 'border-box',
};

// Glassmorphic surface shared by the nav buttons and the order rail.
const GLASS_BG = 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.8))';

const navBar: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[4],
  width: '100%',
  minHeight: 56,
  maxHeight: 56,
  paddingInline: space[16],
  paddingBlock: space[8],
  boxSizing: 'border-box',
};

const glassButton: CSSProperties = {
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 20,
  border: '1px solid #ffffff',
  background: GLASS_BG,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer',
  boxSizing: 'border-box',
};

// Solid-white circular action button (gifter close / location), per the morph refs.
const solidButton: CSSProperties = {
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 20,
  border: 'none',
  background: '#ffffff',
  boxShadow: '0 2px 8px rgba(16,22,40,0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const railOuter: CSSProperties = {
  width: 375,
  paddingInline: space[12],
  boxSizing: 'border-box',
};

const railCard: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  paddingBlock: space[12],
  borderRadius: radius[20],
  border: '1px solid #ffffff',
  background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.8) 119%)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  overflow: 'hidden',
};

const railHeader: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: space[16],
  paddingRight: space[12],
};

const railTitle: CSSProperties = {
  fontFamily: atomType.h16Bold.fontFamily,
  fontWeight: 700,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: -0.1,
  color: colors.text.primary,
  whiteSpace: 'nowrap',
};

const viewAllBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
  minHeight: 24,
  maxHeight: 24,
  paddingBlock: space[4],
  border: 'none',
  background: 'transparent',
  borderRadius: radius[4],
  cursor: 'pointer',
  flexShrink: 0,
};

const viewAllLabel: CSSProperties = {
  fontFamily: 'Noontree-SemiBold',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: 0,
  color: colors.text.primary,
  whiteSpace: 'nowrap',
};

const railScroller: CSSProperties = {
  display: 'flex',
  gap: space[12],
  alignItems: 'center',
  paddingInline: space[12],
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
} as CSSProperties;
