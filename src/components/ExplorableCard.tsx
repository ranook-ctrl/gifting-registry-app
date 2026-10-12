import { colour, space, radius, typography, palette } from '../field-ds';

const ASSETS = '/gift-registry';

/**
 * Explorable Card — the noon PDP "explorable" product card (Figma node 1635:222819).
 * Renders the visible 335×640 viewport: hero image carousel, brand + Visit Store
 * row, name, rating/tag chips, price block, and the sticky Add-to-Gift-Cart bar.
 */
export interface ExplorableCardProps {
  brandName?: string;
  verified?: boolean;
  productName?: string;
  rating?: number;
  reviewCount?: number;
  /** Small tinted tag to the right of the rating (e.g. "Prepaid Only"). */
  tagLabel?: string;
  price?: string;
  wasPrice?: string;
  discount?: string;
  vatNote?: string;
  imageUrl?: string;
  exclusiveLabel?: string;
  /** Carousel dots. */
  imageCount?: number;
  activeImage?: number;
  quantity?: number;
  primaryLabel?: string;
  purchased?: boolean;
  /** Whether this product is already in the gift bag — flips the primary CTA. */
  inBag?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onFavorite?: () => void;
  onVisitStore?: () => void;
  onExpandName?: () => void;
  onInfo?: () => void;
  onRotate?: () => void;
  onQuantity?: () => void;
  onAddToGiftCart?: () => void;
  /** Tapping the primary CTA once the item is in the bag ("View Gift Bag"). */
  onViewGiftBag?: () => void;
  onTogglePurchased?: () => void;
}

export function ExplorableCard({
  brandName = 'Anker',
  verified = true,
  productName = 'AirPods 4 ANC Wireless Earbuds, Bluetooth Headphones, with Active Noise Cancellation,',
  rating = 4.3,
  reviewCount = 126,
  tagLabel = 'Prepaid Only',
  price = '555',
  wasPrice = '789',
  discount = '29% OFF',
  vatNote = '(incl. of VAT)',
  imageUrl = `${ASSETS}/atoms/airpods.jpg`,
  exclusiveLabel = "noon's exclusive",
  imageCount = 4,
  activeImage = 0,
  quantity = 1,
  primaryLabel = 'Add to Gift Bag',
  purchased = false,
  inBag = false,
  onBack,
  onSearch,
  onFavorite,
  onVisitStore,
  onExpandName,
  onInfo,
  onRotate,
  onQuantity,
  onAddToGiftCart,
  onViewGiftBag,
  onTogglePurchased,
}: ExplorableCardProps) {
  // Once the item is in the bag the primary CTA flips from "Add to Gift Bag"
  // to "View Gift Bag" and opens the bag instead of adding again.
  const primaryText = inBag ? 'View Gift Bag' : primaryLabel;
  const onPrimary = inBag ? onViewGiftBag : onAddToGiftCart;
  return (
    <div style={card}>
      {/* ---------- Hero image ---------- */}
      <div style={imageArea}>
        <img src={imageUrl} alt={productName} style={heroImg} />
      </div>

      {/* ---------- Header ---------- */}
      <div style={header}>
        <button type="button" aria-label="Back" onClick={onBack} style={iconBtn}>
          <ChevronLeft />
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" aria-label="Search" onClick={onSearch} style={iconBtn}>
          <SearchIcon />
        </button>
        <button type="button" aria-label="Add to wishlist" onClick={onFavorite} style={iconBtn}>
          <HeartIcon />
        </button>
      </div>

      {/* ---------- Carousel controls ---------- */}
      <div style={controlsRow}>
        <span style={exclusivePill}>{exclusiveLabel}</span>
        <div style={dots}>
          {Array.from({ length: imageCount }).map((_, i) => (
            <span key={i} style={i === activeImage ? dotActive : dot} />
          ))}
        </div>
        <button type="button" aria-label="360° view" onClick={onRotate} style={rotateBtn}>
          <RotateIcon />
        </button>
      </div>

      {/* ---------- Main info ---------- */}
      <div style={mainInfo}>
        <div style={brandRow}>
          <span style={brandGroup}>
            {verified && <VerifiedBadge />}
            <span style={brandName_}>{brandName}</span>
          </span>
          <button type="button" onClick={onVisitStore} style={visitStore}>
            <span style={visitLabel}>Visit Store</span>
            <ChevronRightSmall />
          </button>
        </div>

        <div style={infoCard}>
          <div style={content}>
            {/* Name */}
            <div style={nameRow}>
              <p style={name_}>{productName}</p>
              <button type="button" aria-label="More" onClick={onExpandName} style={chevronCircle}>
                <ChevronDown />
              </button>
            </div>

            {/* Rating + tag chips */}
            <div style={chipsRow}>
              <span style={ratingChip}>
                <StarIcon />
                <span style={ratingText}>
                  {rating}{' '}
                  <span style={{ color: colour['text-n-icon'].secondary }}>({reviewCount} reviews)</span>
                </span>
              </span>
              {tagLabel && (
                <span style={tagChip}>
                  <CardIcon />
                  <span style={tagText}>{tagLabel}</span>
                </span>
              )}
            </div>

            {/* Price */}
            <div style={priceRow}>
              <span style={priceNow}>{price}</span>
              {wasPrice && <span style={priceWas}>{wasPrice}</span>}
              {discount && <span style={priceOff}>{discount}</span>}
              {vatNote && <span style={priceVat}>{vatNote}</span>}
              <button type="button" aria-label="Price info" onClick={onInfo} style={infoBtn}>
                <InfoCircle />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Sticky ATC bar ---------- */}
      <div style={atc}>
        <button type="button" onClick={onQuantity} style={qtyBox}>
          <span style={qtyLabel}>QTY</span>
          <span style={qtyValue}>{quantity}</span>
        </button>
        <button type="button" onClick={onPrimary} style={primaryButton}>
          <BagIcon />
          <span style={primaryLabel_}>{primaryText}</span>
        </button>
        <button type="button" onClick={onTogglePurchased} style={secondaryButton}>
          <CheckboxIcon checked={purchased} />
          <span style={secondaryLabel}>Purchased</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ icons */

const ChevronLeft = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <path
      d="M11.2246 4.55812C11.4686 4.31404 11.8643 4.31404 12.1084 4.55812C12.3524 4.8022 12.3524 5.19783 12.1084 5.44191L7.55025 10L12.1084 14.5581C12.3524 14.8022 12.3524 15.1978 12.1084 15.4419C11.8643 15.686 11.4686 15.686 11.2246 15.4419L6.22456 10.4419C5.98048 10.1978 5.98048 9.8022 6.22456 9.55812L11.2246 4.55812Z"
      fill={colour['text-n-icon'].primary}
    />
  </svg>
);

const SearchIcon = () => (
  <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.4" stroke={colour['text-n-icon'].primary} strokeWidth="1.5" />
    <path d="M12.2 12.2L15.5 15.5" stroke={colour['text-n-icon'].primary} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HeartIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <path
      d="M10 16.75C10 16.75 3.125 12.5 3.125 7.8125C3.125 5.7415 4.804 4.0625 6.875 4.0625C8.155 4.0625 9.286 4.7135 10 5.7035C10.714 4.7135 11.845 4.0625 13.125 4.0625C15.196 4.0625 16.875 5.7415 16.875 7.8125C16.875 12.5 10 16.75 10 16.75Z"
      fill={palette.pink[600]}
      stroke={palette.pink[600]}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const RotateIcon = () => (
  <svg width={18} height={18} viewBox="0 0 19.8519 19.8519" fill="none">
    <path
      d="M5.85206 7.49853L4.68577 6.32397C3.94132 7.28347 3.47811 8.39187 3.3375 9.54162H5.00836C5.12416 8.82199 5.41367 8.1189 5.85206 7.49853ZM5.00836 11.1959H3.3375C3.47811 12.3457 3.93305 13.4541 4.6775 14.4136L5.84379 13.239C5.41367 12.6187 5.12416 11.9238 5.00836 11.1959ZM5.84379 15.5964C6.8033 16.3409 7.91997 16.7875 9.06972 16.9282V15.249C8.35009 15.125 7.65527 14.8437 7.0349 14.3971L5.84379 15.5964ZM10.724 3.8094V1.27001L6.96046 5.0336L10.724 8.71446V5.48026C13.0732 5.8773 14.8598 7.91211 14.8598 10.3688C14.8598 12.8254 13.0732 14.8603 10.724 15.2573V16.9282C13.9913 16.5229 16.5142 13.7436 16.5142 10.3688C16.5142 6.99397 13.9913 4.21471 10.724 3.8094Z"
      fill={colour['text-n-icon'].primary}
    />
  </svg>
);

const VerifiedBadge = () => (
  <svg width={15} height={15} viewBox="0 0 13.4551 13.4551" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.63381 0.274257C8.80578 -0.39745 10.2956 0.22026 10.65 1.52304L10.8956 2.42694L10.8959 2.42776C10.9129 2.49065 10.9622 2.54123 11.0281 2.55941L11.9319 2.80505C13.2151 3.15302 13.8329 4.60357 13.2115 5.76623L13.1809 5.82135L12.715 6.63415C12.6825 6.69088 12.6818 6.762 12.715 6.82092L13.1809 7.63372C13.8526 8.80568 13.2348 10.2956 11.9321 10.65H11.9319L11.0282 10.8957L11.0273 10.8959C10.9642 10.913 10.9136 10.9625 10.8956 11.0287L10.6501 11.9315L10.6502 11.9316C10.2968 13.2353 8.80537 13.8523 7.63381 13.1809L6.82091 12.715C6.76391 12.6824 6.69238 12.6818 6.63332 12.7155L5.82134 13.1809C4.64937 13.8526 3.15954 13.2349 2.80513 11.9321L2.80504 11.9319L2.5594 11.0282L2.55922 11.0273C2.54218 10.9643 2.49262 10.9136 2.42647 10.8956L1.52358 10.6501C0.219818 10.2968 -0.397247 8.8053 0.274246 7.63372L0.740158 6.82092C0.772652 6.76419 0.773374 6.69306 0.740158 6.63415L0.274246 5.82135C-0.397483 4.64937 0.220245 3.15952 1.52303 2.80514L1.52312 2.80505L2.42693 2.55941L2.42775 2.55923C2.49065 2.54223 2.54123 2.49288 2.5594 2.42694L2.80504 1.52313C3.15306 0.240016 4.60358 -0.377783 5.76622 0.243678L5.82134 0.274257L6.63414 0.740169C6.69086 0.77266 6.76201 0.773379 6.82091 0.740169L7.63381 0.274257Z"
      fill={colour['text-n-icon'].action}
    />
    <path
      d="M4.55 6.95L6 8.45L9.45 4.85"
      stroke="#ffffff"
      strokeWidth="1.25"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightSmall = () => (
  <svg width={11} height={11} viewBox="0 0 12 12" fill="none">
    <path d="M4.5 3L8 6L4.5 9" stroke={colour['text-n-icon'].action} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const ChevronDown = () => (
  <svg width={12} height={12} viewBox="0 0 18 18" fill="none">
    <path d="M5 7L9 11L13 7" stroke={colour['text-n-icon'].secondary} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const StarIcon = () => (
  <svg width={10} height={10} viewBox="0 0 20 20" fill="none">
    <path
      d="M10 0.8L12.76 6.39L18.94 7.29L14.47 11.64L15.53 17.8L10 14.89L4.47 17.8L5.53 11.64L1.06 7.29L7.24 6.39L10 0.8Z"
      fill={colour['text-n-icon'].success}
    />
  </svg>
);

const CardIcon = () => (
  <svg width={14} height={12.57} viewBox="0 0 11.6126 10.4222" fill="none">
    <g fill={colour['text-n-icon'].primary}>
      <path d="M11.5612 2.1254C11.4972 1.13529 10.7364 0.323833 9.75223 0.196533C7.72734 -0.0655111 5.67416 -0.0655111 3.64778 0.196533C2.66363 0.323833 1.9028 1.13529 1.83803 2.12689C1.81347 2.49688 1.79859 2.86835 1.79114 3.24058C0.841231 3.39691 0.1139 4.19123 0.0513667 5.15901C-0.0171222 6.19974 -0.0171222 7.25536 0.0513667 8.29684C0.0513667 8.29684 0.0513667 8.29758 0.0513667 8.29833C0.116878 9.28769 0.876961 10.0977 1.86261 10.2257C2.87505 10.3567 3.89419 10.4222 4.91334 10.4222C5.93248 10.4222 6.95312 10.3567 7.96556 10.2257C8.94972 10.0984 9.71054 9.28695 9.77456 8.29684C9.79913 7.92685 9.81476 7.55463 9.82146 7.18166C10.7714 7.02533 11.4987 6.23175 11.5612 5.26472C11.6297 4.22398 11.6297 3.16762 11.5612 2.12615V2.1254ZM1.97799 4.11381C3.9262 3.86144 5.9027 3.86144 7.85091 4.11381C8.41222 4.18676 8.84698 4.64981 8.88346 5.21708C8.88643 5.26472 8.88867 5.31162 8.89164 5.35926H0.935031C0.938009 5.31087 0.940241 5.26323 0.943219 5.21484C0.979696 4.64981 1.41445 4.18676 1.97725 4.11381H1.97799ZM8.88346 8.23728C8.84698 8.80231 8.41222 9.26536 7.85091 9.33831C5.9027 9.59068 3.92621 9.59068 1.97576 9.33831C1.41445 9.26536 0.979696 8.80231 0.943219 8.23728C0.943219 8.23728 0.943219 8.23579 0.943219 8.23504C0.900041 7.5777 0.885146 6.91441 0.89929 6.25185H8.92813C8.94153 6.91441 8.92738 7.57844 8.8842 8.23653L8.88346 8.23728ZM10.6701 5.20516C10.6374 5.70691 10.292 6.12678 9.82146 6.26599C9.81402 5.89526 9.79913 5.52453 9.77456 5.15603C9.71054 4.16592 8.94972 3.35448 7.96556 3.22718C6.21612 3.00013 4.44434 2.97033 2.68819 3.1356C2.69564 2.81698 2.70904 2.49911 2.72989 2.18272C2.76636 1.61769 3.20112 1.15464 3.76392 1.08169C5.71213 0.829321 7.68862 0.829321 9.63683 1.08169C10.1981 1.15464 10.6329 1.61769 10.6694 2.18496C10.7356 3.18698 10.7356 4.20314 10.6694 5.20516H10.6701Z" />
      <path d="M7.29556 6.99703C7.06627 6.99703 6.85782 7.08414 6.7 7.22558C6.88239 7.38936 6.99778 7.62609 6.99778 7.89037C6.99778 8.15464 6.88239 8.39137 6.7 8.55515C6.85782 8.69734 7.06627 8.7837 7.29556 8.7837C7.78912 8.7837 8.18889 8.38393 8.18889 7.89037C8.18889 7.3968 7.78912 6.99703 7.29556 6.99703Z" />
      <path d="M6.40222 7.89037C6.40222 7.62609 6.51761 7.38936 6.7 7.22558C6.54218 7.08414 6.33373 6.99703 6.10444 6.99703C5.61088 6.99703 5.21111 7.3968 5.21111 7.89037C5.21111 8.38393 5.61088 8.7837 6.10444 8.7837C6.33373 8.7837 6.54218 8.69659 6.7 8.55515C6.51761 8.39137 6.40222 8.15464 6.40222 7.89037Z" />
    </g>
  </svg>
);

const InfoCircle = () => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.7" stroke={colour['text-n-icon'].muted} strokeWidth="1.1" fill="none" />
    <path d="M7 6.2V9.6" stroke={colour['text-n-icon'].muted} strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="7" cy="4.3" r="0.75" fill={colour['text-n-icon'].muted} />
  </svg>
);

const BagIcon = () => (
  <svg width={11} height={12.81} viewBox="0 0 10.9917 12.8125" fill="none">
    <path
      d="M4.23909 3.43255C5.07537 3.36082 5.91624 3.36082 6.75253 3.43254C6.76451 2.87933 6.69379 2.32476 6.54012 1.78751C6.45622 1.49503 6.25385 1.2513 5.98136 1.11466C5.67547 0.961728 5.31614 0.961794 5.01025 1.11474C4.73871 1.25023 4.53557 1.49431 4.45149 1.78743C4.29781 2.3247 4.22708 2.8793 4.23909 3.43255ZM7.50146 1.51228C7.69194 2.17821 7.77459 2.86694 7.74943 3.55244C7.8746 3.57185 7.99959 3.59289 8.12436 3.61555C8.99756 3.77395 9.72139 4.38436 10.0256 5.21768L10.1439 5.5419C10.7013 7.06897 10.9882 8.6816 10.9917 10.3072L10.991 10.3718C10.9597 11.7245 9.85239 12.8125 8.49171 12.8125H2.50001C1.11771 12.8125 -0.00311146 11.6897 6.48945e-06 10.3072C0.00346959 8.6816 0.29041 7.06897 0.847826 5.5419L0.966152 5.21768C1.27032 4.38438 1.99418 3.77397 2.86736 3.61555C2.99209 3.59289 3.11704 3.57186 3.24218 3.55246C3.21703 2.86695 3.29967 2.17846 3.49015 1.51252C3.65108 0.950917 4.03991 0.481466 4.56307 0.220288C5.13213 -0.0642431 5.79809 -0.0731433 6.37321 0.193595L6.42863 0.220288C6.93456 0.473784 7.31595 0.920917 7.48576 1.45979L7.50146 1.51228ZM7.94564 4.59944C6.32558 4.30517 4.66613 4.30517 3.04607 4.59944C2.52264 4.69438 2.08802 5.06063 1.90552 5.56062L1.7872 5.88476C1.26963 7.30266 1.00322 8.80003 1.00001 10.3094C0.998149 11.1385 1.67065 11.8125 2.50001 11.8125H8.49171C9.32105 11.8125 9.99356 11.1386 9.99171 10.3095C9.9885 8.80011 9.72209 7.30266 9.20452 5.88476L9.08619 5.56062C8.9037 5.06064 8.46907 4.69439 7.94564 4.59944Z"
      fill="#ffffff"
    />
  </svg>
);

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <rect
      x="1.5"
      y="1.5"
      width="13"
      height="13"
      rx="3.5"
      stroke={colour['text-n-icon'].action}
      strokeWidth="1.3"
      fill={checked ? colour['text-n-icon'].action : 'none'}
    />
    {checked && (
      <path d="M4.5 8L7 10.4L11.5 5.6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    )}
  </svg>
);

/* ------------------------------------------------------------------ styles */

const NT = {
  regular: 'Noontree-Regular',
  medium: 'Noontree-Medium',
  semibold: 'Noontree-SemiBold',
  bold: typography.H20_Bold.fontFamily, // Noontree-Bold
};

const card: React.CSSProperties = {
  position: 'relative',
  width: 335,
  height: 640,
  borderRadius: 18,
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #ffffff 0%, #f3f3f7 100%)',
  fontFamily: NT.regular,
  WebkitFontSmoothing: 'antialiased',
};

const imageArea: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 418,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, #ffffff 0%, #f3f3f7 100%)',
};

const heroImg: React.CSSProperties = {
  width: 250,
  height: 250,
  objectFit: 'contain',
  mixBlendMode: 'multiply',
};

const header: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  gap: space[6],
  height: 56,
  paddingInline: 11,
  paddingBlock: space[6],
  boxSizing: 'border-box',
  background: 'linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0) 100%)',
};

const iconBtn: React.CSSProperties = {
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const controlsRow: React.CSSProperties = {
  position: 'absolute',
  top: 376,
  left: 11,
  right: 11,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const exclusivePill: React.CSSProperties = {
  backgroundColor: colour.surface['secondary-inverted'],
  color: colour['text-n-icon']['on-surface-bold'],
  fontFamily: NT.semibold,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
  paddingInline: space[10],
  paddingBlock: space[6],
  borderRadius: radius.rounded,
  whiteSpace: 'nowrap',
};

const dots: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const dot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: radius.rounded,
  backgroundColor: colour.border.medium,
};

const dotActive: React.CSSProperties = {
  width: 16,
  height: 6,
  borderRadius: radius.rounded,
  backgroundColor: colour['text-n-icon'].primary,
};

const rotateBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  flexShrink: 0,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const mainInfo: React.CSSProperties = {
  position: 'absolute',
  top: 424,
  bottom: 0,
  left: 11,
  right: 11,
  display: 'flex',
  flexDirection: 'column',
  gap: space[6],
  paddingTop: space[8],
  backgroundColor: colour.surface['supermall-subtle'],
  borderTopLeftRadius: radius[14],
  borderTopRightRadius: radius[14],
};

const brandRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[2],
  paddingInline: 11,
};

const brandGroup: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
};

const brandName_: React.CSSProperties = {
  fontFamily: NT.bold,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].action,
};

const visitStore: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
};

const visitLabel: React.CSSProperties = {
  fontFamily: NT.semibold,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].action,
};

const infoCard: React.CSSProperties = {
  flex: 1,
  backgroundColor: colour.surface.primary,
  borderTopLeftRadius: radius[14],
  borderTopRightRadius: radius[14],
  overflow: 'hidden',
};

const content: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 11,
  padding: 11,
};

const nameRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[4],
  paddingRight: 11,
};

const name_: React.CSSProperties = {
  flex: 1,
  margin: 0,
  fontFamily: NT.medium,
  fontSize: 14,
  lineHeight: '18px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].primary,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  height: 36,
};

const chevronCircle: React.CSSProperties = {
  width: 18,
  height: 18,
  flexShrink: 0,
  marginTop: 16,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.secondary,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer',
};

const chipsRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
};

const ratingChip: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[4],
  height: 23,
  paddingInline: space[6],
  borderRadius: radius[4],
  backgroundColor: colour.surface.secondary,
};

const ratingText: React.CSSProperties = {
  fontFamily: NT.semibold,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].primary,
  whiteSpace: 'nowrap',
};

const tagChip: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[4],
  height: 23,
  paddingInline: space[6],
  borderRadius: radius[4],
  backgroundColor: colour.surface['error-subtle'],
};

const tagText: React.CSSProperties = {
  fontFamily: NT.medium,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].primary,
  whiteSpace: 'nowrap',
};

const priceRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: space[4],
};

const priceNow: React.CSSProperties = {
  fontFamily: NT.bold,
  fontSize: 20,
  lineHeight: '24px',
  letterSpacing: -0.25,
  color: colour['text-n-icon'].primary,
};

const priceWas: React.CSSProperties = {
  fontFamily: NT.regular,
  fontSize: 14,
  lineHeight: '16px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].tertiary,
  textDecoration: 'line-through',
};

const priceOff: React.CSSProperties = {
  fontFamily: NT.semibold,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].success,
};

const priceVat: React.CSSProperties = {
  fontFamily: NT.regular,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].tertiary,
};

const infoBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  marginBottom: 2,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const atc: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  padding: space[12],
  boxSizing: 'border-box',
  backgroundColor: colour.surface.primary,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
};

const qtyBox: React.CSSProperties = {
  width: 42,
  height: 42,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 11,
  border: `1px solid ${colour.border.primary}`,
  backgroundColor: colour.surface.primary,
  cursor: 'pointer',
};

const qtyLabel: React.CSSProperties = {
  fontFamily: NT.medium,
  fontSize: 11,
  lineHeight: '14px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].muted,
};

const qtyValue: React.CSSProperties = {
  fontFamily: NT.bold,
  fontSize: 14,
  lineHeight: '18px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].secondary,
};

const primaryButton: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[4],
  borderRadius: radius[8],
  border: 'none',
  backgroundColor: colour.surface['action-extrabold'],
  cursor: 'pointer',
};

const primaryLabel_: React.CSSProperties = {
  fontFamily: NT.semibold,
  fontSize: 12,
  lineHeight: '16px',
  color: colour['text-n-icon']['on-surface-bold'],
  whiteSpace: 'nowrap',
};

const secondaryButton: React.CSSProperties = {
  flex: '0 0 auto',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[6],
  paddingInline: 16,
  borderRadius: radius[10],
  border: `1px solid ${colour.border.action}`,
  backgroundColor: colour.surface.primary,
  cursor: 'pointer',
};

const secondaryLabel: React.CSSProperties = {
  fontFamily: NT.semibold,
  fontSize: 12,
  lineHeight: '16px',
  color: colour['text-n-icon'].action,
  whiteSpace: 'nowrap',
};
