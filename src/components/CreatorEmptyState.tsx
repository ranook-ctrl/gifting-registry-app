import React from 'react';
import { colour, space, Button } from '../field-ds';
import { font } from './atoms/_shared';
import { PageHeader } from './atoms';
import { ExploreCuratedGifts } from './ExploreCuratedGifts';
import { CreatorCard, type CreatorCardProps } from './CreatorCard';

const A = '/gift-registry/creator';

/** The three "gifts you might like" previews, rendered as real CreatorCards. */
const HERO_CARDS: Record<'left' | 'center' | 'right', CreatorCardProps> = {
  left: { imageUrl: `${A}/visual-left.png`, name: 'Cosmetic Gift Set', sellingPrice: '129', listedPrice: '199', discount: '35%' },
  center: { imageUrl: `${A}/visual-center.png`, name: 'Ceramic Table Lamp', sellingPrice: '89', listedPrice: '149', discount: '40%' },
  right: { imageUrl: `${A}/visual-right.png`, name: 'Stand Mixer', sellingPrice: '349', listedPrice: '499', discount: '30%' },
};

export interface CreatorEmptyStateProps {
  className?: string;
  title?: string;
  date?: string;
  countdown?: string;
  onBack?: () => void;
  onSearchGifts?: () => void;
  /** Fired when the header preferences icon is tapped (opens Registry Settings). */
  onOpenSettings?: () => void;
}

/**
 * Gift List Creator · Empty state (Figma node 1450:1411992). Plain nav (back +
 * preferences) with a large centred occasion title, a fan of tilted "like these?"
 * cards, the heart-hint copy, the "Search gifts" CTA and the curated-gifts rail
 * over a white→rose backdrop.
 */
export function CreatorEmptyState({
  className,
  title = 'Prasanna’s Birthday',
  date = '14th June',
  countdown = '20 days to go!',
  onBack,
  onSearchGifts,
  onOpenSettings,
}: CreatorEmptyStateProps) {
  return (
    <div className={className} style={screen}>
      {/* Creator header — status bar + nav row + centred occasion title (Figma 1450:1411992). */}
      <PageHeader
        variant="creator"
        title={title}
        date={date}
        countdown={countdown}
        onBack={onBack}
        onPreferences={onOpenSettings}
      />

      {/* Visual + copy + CTA */}
      <div style={centerBlock}>
        <Visual />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[4], textAlign: 'center', width: '100%' }}>
          <span style={hint}>Tap the heart icon for gifts you like!</span>
          <span style={sub}>Add items you want and share it with your family &amp; friends</span>
        </div>
        <Button
          variant="neutral"
          size="H48"
          label="Search gifts"
          onPress={onSearchGifts}
          iconLeft={<img src={`${A}/search.svg`} alt="" aria-hidden width={16} height={16} style={{ display: 'block' }} />}
        />
      </div>

      {/* Curated rail — page footer, sits flush to the bottom edge (no padding below). */}
      <div style={{ marginTop: 'auto', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        <ExploreCuratedGifts />
      </div>
    </div>
  );
}

/** The tilted "gifts you might like" fan — real CreatorCards + edge silhouettes. */
function Visual() {
  return (
    <div style={{ position: 'relative', width: 374, height: 180, flexShrink: 0 }}>
      {/* Faded edge silhouettes */}
      <img src={`${A}/visual-edge-left.svg`} alt="" aria-hidden style={{ position: 'absolute', left: -55.92, top: 89.5, width: 95.27, height: 105.16 }} />
      <img src={`${A}/visual-edge-right.svg`} alt="" aria-hidden style={{ position: 'absolute', left: 334.65, top: 89.5, width: 95.27, height: 105.16 }} />

      {/* Left tilted card */}
      <div style={{ position: 'absolute', left: 38.7, top: 56.5, opacity: 0.6, transform: 'rotate(-15deg) scale(0.43)', transformOrigin: 'top left' }}>
        <CreatorCard variant="default" imageOnly favorited quantity={1} {...HERO_CARDS.left} />
      </div>

      {/* Right tilted card */}
      <div style={{ position: 'absolute', left: 263.9, top: 56.5, opacity: 0.6, transform: 'rotate(15deg) scale(0.43)', transformOrigin: 'top left' }}>
        <CreatorCard variant="default" imageOnly favorited quantity={1} {...HERO_CARDS.right} />
      </div>

      {/* Center upright card */}
      <div style={{ position: 'absolute', left: 136, top: 13.07, transform: 'scale(0.6145)', transformOrigin: 'top left' }}>
        <CreatorCard variant="default" imageOnly favorited quantity={1} {...HERO_CARDS.center} />
      </div>
    </div>
  );
}

const screen: React.CSSProperties = {
  position: 'relative',
  width: 375,
  minHeight: 812,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'hidden',
  // Gradient opacity reduced again per design feedback: rose stops at 0.25 alpha over white.
  background:
    'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.25) 42%, rgba(255,214,220,0.25) 74%, rgba(255,196,218,0.25) 100%), #ffffff',
  boxSizing: 'border-box',
};

const centerBlock: React.CSSProperties = {
  marginTop: 56,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space[16],
  width: 319,
};

const hint: React.CSSProperties = {
  fontFamily: font.bold,
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '22px',
  letterSpacing: -0.15,
  color: colour['text-n-icon'].primary,
};
const sub: React.CSSProperties = {
  fontFamily: font.regular,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: '18px',
  letterSpacing: -0.14,
  color: colour['text-n-icon'].tertiary,
};
