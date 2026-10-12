import { useState, type CSSProperties, type ReactNode } from 'react';
import { colour, space, radius } from '../field-ds';

// Icons sourced 1:1 from Figma (Gifting Registry / node 1625:876423 "Address Bottomsheets").
import icSearch from './assets/address-sheet/ic-search.svg';
import icLocationArrow from './assets/address-sheet/ic-location-arrow.svg';
import icPlus from './assets/address-sheet/ic-plus.svg';
import icChevron from './assets/address-sheet/ic-chevron.svg';
import icBriefcaseBlue from './assets/address-sheet/ic-briefcase-blue.svg';
import icBriefcaseGrey from './assets/address-sheet/ic-briefcase-grey.svg';
import icGiftbox from './assets/address-sheet/ic-giftbox.svg';
import icHome from './assets/address-sheet/ic-home.svg';
import icPin from './assets/address-sheet/ic-pin.svg';
import icLock from './assets/address-sheet/ic-lock.svg';
import icUpload from './assets/address-sheet/ic-upload.svg';
import icDots from './assets/address-sheet/ic-dots.svg';
import icVerified from './assets/address-sheet/ic-verified.svg';
import icNotch from './assets/address-sheet/ic-notch.svg';

export type AddressSheetVariant = 'creator' | 'gifter';
export type AddressIcon = 'briefcase' | 'home' | 'pin' | 'giftbox';

export interface AddressItem {
  id: string;
  icon: AddressIcon;
  title: string;
  /** Distance chip (e.g. "24 m"). Omit to hide the chip. */
  distance?: string;
  address: string;
  contactName?: string;
  contactPhone?: string;
  verified?: boolean;
  /** Renders the blue privacy notice instead of the contact row (gifter registry card). */
  privacy?: boolean;
  privacyBold?: string;
  privacyRest?: string;
}

export interface AddressSheetProps {
  variant?: AddressSheetVariant;
  addresses?: AddressItem[];
  /** Controlled selected id. */
  selectedId?: string;
  /** Uncontrolled initial selection. Defaults to the first address. */
  defaultSelectedId?: string;
  /** Fired when an address is tapped. Receives the id and the full item. */
  onSelect?: (id: string, item: AddressItem) => void;
  onEnableLocation?: () => void;
  onAddAddress?: () => void;
  className?: string;
  style?: CSSProperties;
}

const ff = (family: string) => `${family}, 'SF Pro Text', system-ui, sans-serif`;

/* ---------- type styles (Noontree — noon brand face) ---------- */

// Noontree:SemiBold 14 / 18 — card titles, "Enable location".
const label3Semibold: CSSProperties = {
  fontFamily: ff('Noontree-SemiBold'),
  fontWeight: 600,
  fontSize: 14,
  lineHeight: '18px',
  letterSpacing: -0.14,
};
// Noontree:Medium 14 / 18 — unselected card titles.
const label3Medium: CSSProperties = {
  fontFamily: ff('Noontree-Medium'),
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '18px',
  letterSpacing: -0.14,
};
// Noontree:Bold 10 / 12 — distance chip.
const tinyBold: CSSProperties = {
  fontFamily: ff('Noontree-Bold'),
  fontWeight: 700,
  fontSize: 10,
  lineHeight: '12px',
};
// Body 13 / 17 — address line.
const body13: CSSProperties = {
  fontFamily: ff('Noontree-Regular'),
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '17px',
  letterSpacing: -0.05,
};
// Body 12 / 17 — contact line & subtitles.
const body12: CSSProperties = {
  fontFamily: ff('Noontree-Regular'),
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '17px',
  letterSpacing: -0.05,
};
// Search placeholder — Noontree:Medium 13 / 18.
const searchPlaceholder: CSSProperties = {
  fontFamily: ff('Noontree-Medium'),
  fontWeight: 500,
  fontSize: 13,
  lineHeight: '18px',
  letterSpacing: -0.26,
};

/* ---------- icon helper ---------- */

interface IconMeta {
  src: string;
  w: number;
  h: number;
}

// Centres an intrinsically-sized glyph inside a fixed square slot.
function Glyph({ meta, slot }: { meta: IconMeta; slot: number }) {
  return (
    <span style={{ position: 'relative', display: 'block', width: slot, height: slot, flexShrink: 0 }}>
      <img
        src={meta.src}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: meta.w,
          height: meta.h,
          display: 'block',
          maxWidth: 'none',
        }}
      />
    </span>
  );
}

const CARD_ICON: Record<AddressIcon, { selected: IconMeta; idle: IconMeta }> = {
  briefcase: {
    selected: { src: icBriefcaseBlue, w: 20, h: 20 },
    idle: { src: icBriefcaseGrey, w: 20, h: 20 },
  },
  giftbox: {
    selected: { src: icGiftbox, w: 18.333, h: 17.5 },
    idle: { src: icGiftbox, w: 18.333, h: 17.5 },
  },
  home: {
    selected: { src: icHome, w: 16.25, h: 14.58 },
    idle: { src: icHome, w: 16.25, h: 14.58 },
  },
  pin: {
    selected: { src: icPin, w: 12.9, h: 15.53 },
    idle: { src: icPin, w: 12.9, h: 15.53 },
  },
};

/* ---------- search bar ---------- */

function SearchBar() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        paddingBlock: space[12],
        boxSizing: 'border-box',
        backgroundColor: colour.surface.primary,
        border: `1px solid ${colour.border.subtle}`,
        borderRadius: radius[12],
      }}
    >
      <div style={{ display: 'flex', gap: space[8], alignItems: 'center', paddingInline: space[12], width: '100%', boxSizing: 'border-box' }}>
        <Glyph meta={{ src: icSearch, w: 15.563, h: 15.563 }} slot={24} />
        <p style={{ ...searchPlaceholder, flex: '1 0 0', minWidth: 0, margin: 0, color: colour['text-n-icon'].tertiary }}>
          Search for your building, area...
        </p>
      </div>
    </div>
  );
}

/* ---------- action unit (enable location + add new address) ---------- */

function ActionUnit({
  onEnableLocation,
  onAddAddress,
}: {
  onEnableLocation?: () => void;
  onAddAddress?: () => void;
}) {
  const actionRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: space[8],
    borderRadius: radius[12],
    backgroundColor: colour.surface.primary,
    width: '100%',
    boxSizing: 'border-box',
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space[4],
        padding: space[6],
        borderRadius: radius[16],
        backgroundColor: colour.surface.primary,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Enable location */}
      <div style={actionRow}>
        <div style={{ display: 'flex', gap: space[12], alignItems: 'center', width: '100%' }}>
          <Glyph meta={{ src: icLocationArrow, w: 20, h: 20 }} slot={20} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2], flex: '1 0 0', minWidth: 0 }}>
            <p style={{ ...label3Semibold, margin: 0, color: '#0076ff', width: '100%' }}>Enable location</p>
            <p
              style={{
                ...body12,
                margin: 0,
                color: colour.surface['tertiary-inverted'],
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              location helps us in deliver faster
            </p>
          </div>
          <button
            type="button"
            onClick={onEnableLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 32,
              width: 65,
              padding: space[6],
              borderRadius: radius[8],
              backgroundColor: colour.surface.primary,
              border: '1px solid #0076ff',
              boxShadow: '0px 0px 3px 0px rgba(26,26,26,0.09)',
              cursor: onEnableLocation ? 'pointer' : 'default',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: ff('Noontree-SemiBold'),
                fontWeight: 600,
                fontSize: 12,
                lineHeight: '14px',
                letterSpacing: -0.12,
                color: '#0076ff',
              }}
            >
              Enable
            </span>
          </button>
        </div>
      </div>

      {/* divider */}
      <div style={{ height: 1, width: '100%', backgroundColor: colour.border.primary }} />

      {/* Add new address */}
      <button
        type="button"
        onClick={onAddAddress}
        style={{ ...actionRow, border: 'none', cursor: onAddAddress ? 'pointer' : 'default' }}
      >
        <div style={{ display: 'flex', gap: space[12], alignItems: 'center', width: '100%' }}>
          <Glyph meta={{ src: icPlus, w: 12, h: 12 }} slot={20} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minWidth: 0, alignItems: 'flex-start' }}>
            <p style={{ ...label3Semibold, margin: 0, color: '#0e0e0e', width: '100%', textAlign: 'start' }}>Add new address</p>
          </div>
          <span style={{ position: 'relative', display: 'block', width: 20, height: 20, flexShrink: 0 }}>
            <img
              src={icChevron}
              alt=""
              aria-hidden
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) scaleX(-1)',
                width: 5.75,
                height: 10,
                display: 'block',
                maxWidth: 'none',
              }}
            />
          </span>
        </div>
      </button>
    </div>
  );
}

/* ---------- address card ---------- */

function AddressCard({
  item,
  selected,
  showUpload,
  onSelect,
}: {
  item: AddressItem;
  selected: boolean;
  showUpload: boolean;
  onSelect?: () => void;
}) {
  const iconMeta = selected ? CARD_ICON[item.icon].selected : CARD_ICON[item.icon].idle;
  const bold = item.privacyBold ?? 'Address hidden for privacy. ';
  const rest = item.privacyRest ?? 'Noon will deliver to Prasanna’s saved registry address.';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: radius[12],
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
        backgroundColor: selected ? '#eff7ff' : colour.surface.secondary,
        border: `1px solid ${selected ? '#e1efff' : colour.border.primary}`,
        transition: 'background-color 160ms ease, border-color 160ms ease',
      }}
    >
      {/* Top unit */}
      <div
        style={{
          display: 'flex',
          height: 45,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: space[8],
          paddingRight: space[4],
          paddingBlock: space[8],
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, alignItems: 'center', gap: space[8] }}>
          {/* Card icon */}
          <div
            style={{
              position: 'relative',
              width: 29,
              height: 29,
              flexShrink: 0,
              borderRadius: radius[8],
              backgroundColor: colour.surface.primary,
              border: `1px solid ${selected ? '#e1efff' : colour.border.subtle}`,
              filter: 'drop-shadow(0px 12.889px 14.844px rgba(0,0,0,0.02))',
            }}
          >
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <Glyph meta={iconMeta} slot={20} />
            </div>
          </div>
          {/* Title (design applies a -0.31deg tilt) */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ transform: 'rotate(-0.31deg)' }}>
              <p
                style={{
                  ...(selected ? label3Semibold : label3Medium),
                  margin: 0,
                  color: '#0e0e0e',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.title}
              </p>
            </div>
          </div>
          {/* Distance chip */}
          {item.distance ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 3,
                paddingRight: 6,
                paddingBottom: 4,
                paddingLeft: 7,
                borderRadius: radius[6],
                backgroundColor: colour.surface.primary,
                flexShrink: 0,
              }}
            >
              <span style={{ ...tinyBold, color: selected ? '#0076ff' : colour['text-n-icon'].secondary }}>{item.distance}</span>
            </div>
          ) : null}
        </div>
        {/* Right actions */}
        <div style={{ display: 'flex', gap: space[8], alignItems: 'center', flexShrink: 0 }}>
          {showUpload ? <Glyph meta={{ src: icUpload, w: 14.582, h: 13.75 }} slot={20} /> : null}
          <Glyph meta={{ src: icDots, w: 2.498, h: 12.495 }} slot={20} />
        </div>
      </div>

      {/* Bottom unit */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: space[12],
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: colour.surface.primary,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[8], width: '100%' }}>
          <p style={{ ...body13, margin: 0, color: colour['text-n-icon'].primary, width: '100%' }}>{item.address}</p>

          {item.privacy ? (
            <>
              <img src={icNotch} alt="" aria-hidden style={{ display: 'block', width: 80, height: 8 }} />
              <div
                style={{
                  display: 'flex',
                  gap: space[10],
                  alignItems: 'center',
                  padding: space[12],
                  borderRadius: radius[12],
                  backgroundColor: colour.surface['action-subtle'],
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <p style={{ flex: '1 0 0', minWidth: 0, margin: 0, color: '#0076ff', fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 }}>
                  <span style={{ fontFamily: ff('Noontree-SemiBold'), fontWeight: 600 }}>{bold}</span>
                  <span style={{ fontFamily: ff('Noontree-Regular'), fontWeight: 400 }}>{rest}</span>
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: space[8],
                    borderRadius: radius[8],
                    backgroundColor: colour.surface.primary,
                    flexShrink: 0,
                  }}
                >
                  <Glyph meta={{ src: icLock, w: 11.666, h: 12.999 }} slot={16} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ height: 1, width: '100%', backgroundColor: colour.border.primary }} />
              <div style={{ display: 'flex', gap: space[4], alignItems: 'center' }}>
                {item.contactName ? (
                  <span style={{ ...body12, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{item.contactName},</span>
                ) : null}
                {item.contactPhone ? (
                  <span style={{ ...body12, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{item.contactPhone}</span>
                ) : null}
                {item.verified ? <img src={icVerified} alt="Verified" style={{ width: 14, height: 14, display: 'block' }} /> : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- default data (1:1 with the two Figma variants) ---------- */

const CONTACT = { contactName: 'Ahmed Ali', contactPhone: '+971-50 789 3456', verified: true };
const ADDRESS = 'Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai';

const CREATOR_ADDRESSES: AddressItem[] = [
  { id: 'work', icon: 'briefcase', title: 'Work', distance: '24 m', address: ADDRESS, ...CONTACT },
  { id: 'dubai-1', icon: 'briefcase', title: 'Ayush’s Dubai Place', distance: '24 m', address: ADDRESS, ...CONTACT },
  { id: 'dubai-2', icon: 'briefcase', title: 'Ayush’s Dubai Place', distance: '24 m', address: ADDRESS, ...CONTACT },
];

const GIFTER_ADDRESSES: AddressItem[] = [
  { id: 'registry', icon: 'giftbox', title: 'Prasanna’s address', address: 'Somewhere in Downtown Dubai', privacy: true },
  { id: 'home', icon: 'home', title: 'Home', distance: '24 m', address: ADDRESS, ...CONTACT },
  { id: 'dubai', icon: 'pin', title: 'Ayush’s Dubai Place', distance: '24 m', address: ADDRESS, ...CONTACT },
];

/* ---------- AddressSheet ---------- */

export function AddressSheet({
  variant = 'creator',
  addresses,
  selectedId,
  defaultSelectedId,
  onSelect,
  onEnableLocation,
  onAddAddress,
  className,
  style,
}: AddressSheetProps) {
  const items = addresses ?? (variant === 'gifter' ? GIFTER_ADDRESSES : CREATOR_ADDRESSES);
  const [internal, setInternal] = useState(defaultSelectedId ?? items[0]?.id);
  const active = selectedId ?? internal;

  const select = (item: AddressItem) => {
    if (selectedId === undefined) setInternal(item.id);
    onSelect?.(item.id, item);
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: 351,
        // Was a fixed `height: 651`, which clipped the address list outright on
        // any screen shorter than the design frame. The height now follows the
        // content and is capped at 80% of the visible screen, so the sheet always
        // leaves the page behind it partly visible and the list scrolls inside
        // once it reaches the cap.
        //
        // `--frame-height` (not a raw `dvh`) because the app shell scales the
        // whole canvas with `zoom`: inside it, a viewport unit is off by exactly
        // the zoom factor. The fallback covers the standalone unzoomed entries.
        maxHeight: 'calc(var(--frame-height, 100dvh) * 0.8)',
        overflowY: 'auto',
        overflowX: 'hidden',
        // Don't chain the scroll to the page behind the sheet at either end.
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        backgroundColor: colour.surface.secondary,
        borderRadius: radius[16],
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: 329,
          marginInline: 'auto',
          // Was the parent's `top: 12` inset; as an in-flow child it owns the
          // block padding on both edges (the old fixed height supplied the tail).
          paddingBlock: space[12],
          display: 'flex',
          flexDirection: 'column',
          gap: space[12],
        }}
      >
        <SearchBar />
        <ActionUnit onEnableLocation={onEnableLocation} onAddAddress={onAddAddress} />
        {items.map((item) => (
          <AddressCard
            key={item.id}
            item={item}
            selected={item.id === active}
            showUpload={variant === 'creator'}
            onSelect={() => select(item)}
          />
        ))}
      </div>
    </div>
  );
}
