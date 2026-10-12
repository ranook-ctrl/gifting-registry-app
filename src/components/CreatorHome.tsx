import React, { useState } from 'react';
import { colour, space } from '../field-ds';
import { PageHeaderHero } from './PageHeaderHero';
import { CreatorCard, type CreatorCardProps } from './CreatorCard';
import { ExploreCuratedGifts } from './ExploreCuratedGifts';
import { NeutralButton } from './NeutralButton';
import { BottomSheet } from './BottomSheet';
import { ShareSheet } from './ShareSheet';
import { GiftTracking } from './GiftTracking';
import { RegistrySettings } from './RegistrySettings';

const P = '/gift-registry/atoms';
const A = '/gift-registry/creator';

/** Demo registry, mirroring the products shown in the Figma full view. */
const PRODUCTS: CreatorCardProps[] = [
  { imageUrl: `${P}/prod-a.png`, name: 'Roseate Happy Super Soft Anti Skid Microfiber Bath Mat', sellingPrice: '49', listedPrice: '79', discount: '33%' },
  { imageUrl: `${P}/airpods.jpg`, name: 'Apple Airpods Pro 2 Wireless Earbuds', sellingPrice: '899', listedPrice: '1399', discount: '33%' },
  { imageUrl: `${P}/washing-machine.png`, name: 'Bajaj MX 45 Steam Aluminium Non-Stick Iron', sellingPrice: '161', listedPrice: '269', discount: '33%' },
  { imageUrl: `${P}/prod-b.png`, name: 'Roseate Birch Super Soft (40x60 cm) Microfiber Bath Mat', sellingPrice: '24', listedPrice: '99', discount: '33%' },
  { imageUrl: `${P}/perfume-black.png`, name: 'Compatible with Versace Pour Homme EDT for Men', sellingPrice: '799', listedPrice: '999', discount: '33%' },
  { imageUrl: `${P}/perfume-blue.png`, name: 'Blue Eau de Toilette for Men 100ml', sellingPrice: '499', listedPrice: '999', discount: '33%' },
  { imageUrl: `${P}/airpods-box.png`, name: 'Apple Airpods Pro 2 Wireless Earbuds', sellingPrice: '899', listedPrice: '1399', discount: '33%' },
  { imageUrl: `${P}/fridge.png`, name: 'Roseate Birch Super Soft Microfiber Bath Mat', sellingPrice: '24', listedPrice: '99', discount: '33%' },
];

export interface CreatorHomeProps {
  className?: string;
  title?: string;
  date?: string;
  countdown?: string;
  products?: CreatorCardProps[];
  /**
   * Fill the parent height instead of the fixed 812 phone-frame height — use
   * when hosted in the app shell so the "Share Gift List" CTA sticks just above
   * the bottom nav with no empty space below.
   */
  fill?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  /** Fired when the header preferences icon is tapped (opens Registry Settings). */
  onOpenSettings?: () => void;
}

/**
 * Gift List Creator · Home / Full view (Figma node 1379:1039153). Pink birthday
 * header, a two-column grid of selected gifts, the curated-gifts rail on a rose
 * wash, and a pinned "Share Gift List" CTA.
 */
export function CreatorHome({
  className,
  title = 'Prasanna’s Birthday',
  date = '14th June',
  countdown = '20 days to go!',
  products = PRODUCTS,
  fill = false,
  onBack,
  onShare,
  onOpenSettings,
}: CreatorHomeProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Open the Gift Tracking page behind a brief skeleton loader (Retune).
  const openTracking = () => {
    setTrackingOpen(true);
    setTrackingLoading(true);
    window.setTimeout(() => setTrackingLoading(false), 900);
  };
  // The header preferences icon (expanded + minimised bar) opens Registry
  // Settings. Defer to a caller-provided handler (the standalone create-list flow
  // routes it as a step); otherwise open a self-contained overlay.
  const openSettings = onOpenSettings ?? (() => setSettingsOpen(true));

  return (
    <div
      className={className}
      style={
        fill
          ? // Fill the shell height as a self-scroller (like the standalone 812
            // frame) so the sticky "Share Gift List" CTA floats over the curated
            // footer as the content scrolls under it — not tacked on below it.
            { ...screen, height: '100%' }
          : screen
      }
    >
      {/* Creator header — the first PageHeaderHero variant (receiver): birthday
          backdrop, back/preferences glass buttons, centred title and the
          glassmorphic "gifts ordered" rail. Sizes to content (12px below the
          rail); tapping the rail opens the Gift Tracking page (Retune). */}
      <PageHeaderHero
        variant="receiver"
        title={title}
        occasionDate={date}
        countdown={countdown}
        onBack={onBack}
        onPreferences={openSettings}
        onViewAll={openTracking}
        onOrderPress={openTracking}
      />

      <div style={{ height: space[16] }} />

      <div style={grid}>
        {products.map((p, i) => (
          <CreatorCard key={i} variant="default" favorited quantity={1} {...p} />
        ))}
      </div>

      {/* Rose wash — the page-footer section. Its bottom padding clears the
          always-sticky CTA below, which overlaps this padding so the rose wash
          is the backdrop behind the CTA scrim (no white band). */}
      <div style={pinkZone}>
        <ExploreCuratedGifts />
      </div>

      {/* Share Gift List — sticky to the bottom of the viewport, always visible
          above the scrolling content (z-index 100, Retune). Negative top margin
          overlaps the curated section's bottom padding so it adds no gap. */}
      <div style={footer}>
        <NeutralButton
          label="Share Gift List"
          size="H52"
          fullWidth
          iconPosition="right"
          onPress={() => setShareOpen(true)}
          icon={<img src={`${A}/share-upload.svg`} alt="" aria-hidden width={16} height={16} style={{ display: 'block' }} />}
        />
      </div>

      {/* Share action sheet — same slide-in/out chrome as the other sheets.
          `fixed` pins it to the viewport bottom (the home content is taller
          than the phone frame, so an absolute sheet would land off-screen). */}
      <BottomSheet open={shareOpen} onClose={() => setShareOpen(false)} fixed zIndex={110}>
        <div style={{ width: 351 }}>
          <ShareSheet
            title={title}
            itemCount={products.length}
            onShare={() => {
              onShare?.();
              setShareOpen(false);
            }}
          />
        </div>
      </BottomSheet>

      {/* Gift Tracking page — opened from the header's "gifts ordered" rail,
          behind a brief skeleton loader. */}
      {trackingOpen && (
        <div style={trackingOverlay}>
          {trackingLoading ? (
            <TrackingSkeleton />
          ) : (
            <GiftTracking title={title} onBack={() => setTrackingOpen(false)} />
          )}
        </div>
      )}

      {/* Registry Settings — opened from the header preferences icon. */}
      {settingsOpen && (
        <div style={trackingOverlay}>
          <RegistrySettings giftListName={title} onBack={() => setSettingsOpen(false)} />
        </div>
      )}
    </div>
  );
}

/** Shimmer skeleton for the Gift Tracking page (status bar + address + cards). */
function TrackingSkeleton() {
  return (
    <div style={skTrack} aria-hidden>
      <style>{SK_KEYFRAMES}</style>
      <div style={{ ...skShimmer, width: 200, height: 24, borderRadius: 8, marginTop: 8 }} />
      <div style={{ ...skShimmer, width: 120, height: 14, borderRadius: 6, marginTop: 10 }} />
      <div style={{ ...skShimmer, width: 351, height: 64, borderRadius: 16, marginTop: 24 }} />
      <div style={{ ...skShimmer, width: 120, height: 18, borderRadius: 6, marginTop: 28, alignSelf: 'flex-start', marginLeft: 12 }} />
      {[0, 1].map((i) => (
        <div key={i} style={{ ...skShimmer, width: 351, height: 130, borderRadius: 16, marginTop: 12 }} />
      ))}
    </div>
  );
}

const SK_KEYFRAMES = `
@keyframes ch-shimmer { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }
`;

const skTrack: React.CSSProperties = {
  width: 375,
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 54,
  paddingInline: 12,
  boxSizing: 'border-box',
  backgroundColor: colour.surface.primary,
};

const skShimmer: React.CSSProperties = {
  backgroundColor: '#e3e6ee',
  backgroundImage: 'linear-gradient(90deg, #e3e6ee 0px, #f2f4f8 60px, #e3e6ee 120px)',
  backgroundSize: '200px 100%',
  backgroundRepeat: 'no-repeat',
  animation: 'ch-shimmer 1.2s ease-in-out infinite',
  flexShrink: 0,
};

const trackingOverlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  // Above the sticky Share CTA (z-index 100) so it doesn't poke through.
  zIndex: 110,
  backgroundColor: colour.surface.primary,
  display: 'flex',
  justifyContent: 'center',
  // Top-align so the (unbounded-height) tracking page keeps its natural height
  // and the overlay scrolls the whole page, rather than stretch-clipping it.
  alignItems: 'flex-start',
  overflowY: 'auto',
};

const screen: React.CSSProperties = {
  position: 'relative',
  width: 375,
  // Fixed phone-frame height so the CTA can stick to the frame's bottom edge
  // while the header/grid/curated content scrolls beneath it.
  height: 812,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colour.surface.primary,
  overflowY: 'auto',
  overflowX: 'hidden',
  boxSizing: 'border-box',
};

// Approx height of the sticky footer (paddingTop 56 + H52 button + paddingBottom 16).
const SHARE_CTA_H = 124;

const grid: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  columnGap: space[12],
  rowGap: space[12],
  paddingInline: space[12],
  paddingTop: space[12],
  // Don't let the fixed-height flex column shrink the grid/curated — they keep
  // their content height and the screen scrolls instead.
  flexShrink: 0,
};

const pinkZone: React.CSSProperties = {
  flexShrink: 0,
  marginTop: space[24],
  // 40px top padding gives the rose-wash curated section more breathing room
  // (per design feedback on this section).
  paddingTop: space[40],
  // Clearance for the always-sticky Share CTA (which overlaps this padding).
  paddingBottom: SHARE_CTA_H,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  background: 'linear-gradient(to bottom, #f9f9fb, #ffc4da)',
};

const footer: React.CSSProperties = {
  position: 'sticky',
  bottom: 0,
  zIndex: 100,
  // Overlap the curated section's bottom padding so the CTA floats over the rose
  // wash without adding a gap; it stays pinned to the bottom on scroll.
  marginTop: -SHARE_CTA_H,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingTop: space[56],
  paddingBottom: space[16],
  paddingInline: space[16],
  boxSizing: 'border-box',
  background: 'linear-gradient(to bottom, rgba(255,196,218,0) 0%, #ffffff 55%)',
};
