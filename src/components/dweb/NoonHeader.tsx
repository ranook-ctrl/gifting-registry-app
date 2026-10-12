import { useState, type CSSProperties } from 'react';
import { colour, space, radius, type, font, SITE_WIDTH, SITE_GUTTER, HEADER_H, NAV_H, ASSETS, EASE } from './_shared';

const ICONS = `${ASSETS}/dweb`;

/** Default category rail — noon UAE's live top-level taxonomy. */
export const NOON_CATEGORIES = [
  'Electronics',
  'Beauty & Fragrance',
  'Home & Kitchen',
  'Grocery',
  "Men's Fashion",
  "Women's Fashion",
  'Mom & Baby',
  'Toys',
  "Kids' Fashion",
  'Sports & Outdoors',
];

export interface NoonHeaderProps {
  /** Delivery city shown in the location pill, e.g. "Dubai". */
  city?: string;
  /** Area label preceding the city, e.g. "Other". */
  area?: string;
  /** Signed-in shopper's first name; omit to show "Log in". */
  accountName?: string;
  /** Cart badge count; 0 hides the badge. */
  cartCount?: number;
  /** Wishlist badge count; 0 hides the badge. */
  wishlistCount?: number;
  /** Category labels in the nav strip. */
  categories?: string[];
  /** Which category to render as current. */
  activeCategory?: string;
  onSearch?: (query: string) => void;
  onOpenCart?: () => void;
  onOpenLocation?: () => void;
}

/**
 * noon.com desktop masthead — the yellow search bar plus the category nav strip
 * beneath it. Transcribed from the live site at a 1440px viewport: 60px yellow
 * row on #feee00, a 1440px `siteWidthContainer`, then a 44px white nav strip.
 *
 * Sticky, so it behaves like the real site when the registry grid is long. It's
 * chrome only — every control is inert except search and the cart, which the
 * registry wires up.
 */
export function NoonHeader({
  city = 'Dubai',
  area = 'Other',
  accountName,
  cartCount = 0,
  wishlistCount = 0,
  categories = NOON_CATEGORIES,
  activeCategory,
  onSearch,
  onOpenCart,
  onOpenLocation,
}: NoonHeaderProps) {
  const [query, setQuery] = useState('');

  return (
    <header style={headerRoot}>
      {/* ---------- Yellow masthead ---------- */}
      <div style={mastRow}>
        <div style={mastInner}>
          <img src={`${ICONS}/noon-logo.svg`} alt="noon" style={{ width: 79, height: 20, display: 'block' }} />

          {/* Location pill */}
          <button type="button" onClick={onOpenLocation} style={locationBtn}>
            <img src={`${ICONS}/pin.svg`} alt="" style={{ width: 24, height: 24 }} />
            <span style={{ ...type.nav, color: colour['text-n-icon'].primary }}>
              {area} • {city}
            </span>
            <img src={`${ICONS}/chevron-framed.svg`} alt="" style={{ width: 16, height: 16 }} />
          </button>

          {/* Search */}
          <form
            style={searchWrap}
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.(query);
            }}
          >
            <img src={`${ICONS}/search.svg`} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search noon"
              style={searchInput}
            />
          </form>

          {/* Utilities */}
          <nav style={utilRow} aria-label="Account">
            <UtilItem icon="lang" label="العربية" />
            <UtilItem icon="profile" label={accountName ? accountName : 'Log in'} />
            <UtilItem icon="orders" label="Orders" />
            <UtilItem icon="wishlist" label="Wishlist" badge={wishlistCount} />
            <UtilItem icon="cart" label="Cart" badge={cartCount} onClick={onOpenCart} />
          </nav>
        </div>
      </div>

      {/* ---------- Category nav ---------- */}
      <div style={navRow}>
        <div style={navInner}>
          <div style={navLinks}>
            {categories.map((c) => (
              <span
                key={c}
                style={{
                  ...type.nav,
                  color: colour['text-n-icon'].primary,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  paddingBlock: space[12],
                  borderBottom:
                    c === activeCategory ? `2px solid ${colour.surface['action-extrabold']}` : '2px solid transparent',
                }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* noon One upsell pill — always trailing on the live site. */}
          <div style={onePill}>
            <span style={{ ...type.b13, color: colour['text-n-icon'].primary }}>Get</span>
            <span style={{ ...type.b13, fontFamily: font.bold, fontWeight: 700, color: colour['text-n-icon'].primary }}>
              Free Delivery
            </span>
            <span style={{ ...type.b13, color: colour['text-n-icon'].primary }}>with</span>
            <span style={{ ...type.b13, fontFamily: font.extrabold, fontWeight: 800, color: colour['text-n-icon'].primary }}>
              noon
            </span>
            <span style={oneBadge}>one</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------- util item */

function UtilItem({
  icon,
  label,
  badge = 0,
  onClick,
}: {
  icon: string;
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} style={utilBtn}>
      <span style={{ position: 'relative', display: 'flex' }}>
        <img src={`${ICONS}/${icon}.svg`} alt="" style={{ width: 24, height: 24, display: 'block' }} />
        {badge > 0 && <span style={badgeDot}>{badge > 9 ? '9+' : badge}</span>}
      </span>
      <span style={{ ...type.nav, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ styles */

const headerRoot: CSSProperties = {
  position: 'sticky',
  top: 0,
  // Above the page content and the hero, below the drawer/dialog layer (40+).
  zIndex: 20,
  width: '100%',
  flexShrink: 0,
};

const mastRow: CSSProperties = {
  width: '100%',
  height: HEADER_H,
  backgroundColor: colour.surface['brand-primary'],
  display: 'flex',
  justifyContent: 'center',
};

const mastInner: CSSProperties = {
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: space[16],
};

const locationBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  flexShrink: 0,
};

const searchWrap: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[10],
  // Grows to fill the masthead; ~620px at 1440, matching the live site.
  flex: '1 1 auto',
  minWidth: 180,
  height: 44,
  paddingInline: space[16],
  borderRadius: radius[12],
  backgroundColor: colour.surface.primary,
  boxSizing: 'border-box',
};

const searchInput: CSSProperties = {
  flex: '1 1 auto',
  minWidth: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  ...type.b16,
  fontSize: 15,
  color: colour['text-n-icon'].primary,
};

const utilRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[20],
  flexShrink: 0,
};

const utilBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[6],
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
};

const badgeDot: CSSProperties = {
  position: 'absolute',
  top: -4,
  insetInlineEnd: -6,
  minWidth: 16,
  height: 16,
  paddingInline: 4,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['action-extrabold'],
  color: colour['text-n-icon']['on-surface-bold'],
  ...type.b11,
  fontSize: 10,
  lineHeight: '16px',
  textAlign: 'center',
  boxSizing: 'border-box',
};

const navRow: CSSProperties = {
  width: '100%',
  height: NAV_H,
  backgroundColor: colour.surface.primary,
  borderBottom: `1px solid ${colour.border.primary}`,
  display: 'flex',
  justifyContent: 'center',
};

const navInner: CSSProperties = {
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[16],
};

const navLinks: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[20],
  // The live nav clips overflowing categories rather than wrapping. `minWidth: 0`
  // lets this flex item actually shrink past its content width; the mask fades
  // the clipped edge out so a category never ends up cut mid-letter against the
  // noon One pill at narrower desktop widths.
  flex: '1 1 auto',
  minWidth: 0,
  overflow: 'hidden',
  maskImage: 'linear-gradient(to right, #000 calc(100% - 40px), transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to right, #000 calc(100% - 40px), transparent 100%)',
};

const onePill: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
  flexShrink: 0,
  height: 30,
  paddingInline: space[12],
  borderRadius: radius.rounded,
  border: `1px solid ${colour.border.yellow}`,
  backgroundColor: colour.surface['yellow-subtle'],
  cursor: 'pointer',
  transition: `background-color 160ms ${EASE}`,
};

const oneBadge: CSSProperties = {
  ...type.b11,
  fontFamily: font.extrabold,
  fontWeight: 800,
  fontStyle: 'italic',
  color: colour['text-n-icon'].primary,
  backgroundColor: colour.surface['yellow-bold'],
  borderRadius: radius.rounded,
  paddingInline: space[6],
  paddingBlock: space[1],
};
