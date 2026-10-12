import React, { useState } from 'react';
import { colour, space, radius } from '../field-ds';
import { PhoneHeader } from './atoms';
import { ChevronLeftIcon, ChevronBottomBoldIcon } from './atoms/icons';
import { font } from './atoms/_shared';
import { BottomSheet } from './BottomSheet';
import { AddressSheet } from './AddressSheet';

const ASSETS = '/gift-registry/checkout';

// Body of the checkout (shipments, pay-with, payment summary) is a single flat
// PNG exported from Figma — the design ships it baked, so we display it as-is.
const BODY_IMG = '/gift-registry/checkout-body.png';
const BODY_W = 351;
const BODY_H = 1681.516; // exported PNG keeps the 855×4096 aspect at this width

// noon marketplace cart palette (legacy, not Field DS) — used by the dock and
// baked into the body PNG, so kept verbatim for a 1:1 match.
const NOON_BLACK = '#404553';
const GREY_1 = '#7e859b';
const GREY_3 = '#dadce3';

export interface CheckoutPageProps {
  /** iOS status-bar clock. */
  time?: string;
  /** Delivery pill: leading regular copy + bold recipient name. */
  deliverPrefix?: string;
  deliverName?: string;
  /** Swipe-button label. */
  ctaLabel?: string;
  /** Cart summary. */
  itemsLabel?: string;
  currency?: string;
  total?: string;
  /**
   * Render inside the 375×812 rounded device card (default), or full-bleed —
   * filling its container edge-to-edge with no border/shadow. Use full-bleed
   * when the screen is presented as a real page (e.g. inside the app shell).
   */
  framed?: boolean;
  onBack?: () => void;
  onChangeAddress?: () => void;
  onSubmit?: () => void;
}

/**
 * "Checkout - Full View" — the gifter's checkout screen. Sticky header
 * (PhoneHeader status bar + a "Delivering to <name>" pill) over a scrollable
 * body PNG, with a sticky bottom dock (swipe CVV button + cart summary + home
 * indicator). Pixel-matched to Figma node 1655:258698.
 */
export function CheckoutPage({
  time = '9:41',
  deliverPrefix = 'Delivering to',
  deliverName = 'Prasanna',
  ctaLabel = 'ENTER CVV',
  itemsLabel = '4 Items',
  currency = 'AED',
  total = '1,643.00',
  framed = true,
  onBack,
  onChangeAddress,
  onSubmit,
}: CheckoutPageProps) {
  const [addressOpen, setAddressOpen] = useState(false);

  const openAddress = () => {
    setAddressOpen(true);
    onChangeAddress?.();
  };

  // Full-bleed: drop the device chrome (border/radius/shadow) and fill the
  // container height, but keep the 375 mobile width so the header/content don't
  // stretch across a wide viewport.
  const frameStyle: React.CSSProperties = framed
    ? frame
    : { ...frame, height: '100%', border: 'none', borderRadius: 0, boxShadow: 'none' };

  return (
    <div style={frameStyle}>
      {/* Sticky header: status bar + delivery pill */}
      <div style={{ flexShrink: 0, width: '100%' }}>
        <PhoneHeader time={time} />
        <div style={headerRow}>
          <div
            role={onBack ? 'button' : undefined}
            aria-label={onBack ? 'Back' : undefined}
            onClick={onBack}
            style={{ ...circle, cursor: onBack ? 'pointer' : 'default' }}
          >
            <ChevronLeftIcon size={20} />
          </div>

          <div
            role="button"
            aria-label="Change delivery address"
            onClick={openAddress}
            style={{ ...deliverPill, cursor: 'pointer' }}
          >
            <div style={homeCircle}>
              <img src={`${ASSETS}/home.svg`} alt="" style={{ width: 16.25, height: 14.58, display: 'block' }} />
            </div>
            <div style={pillTextRow}>
              <span style={pillPrefix}>{deliverPrefix}</span>
              <span style={pillName}>{deliverName}</span>
              <ChevronBottomBoldIcon size={14} />
            </div>
          </div>

          {/* Invisible trailing slot keeps the pill optically centred (Figma opacity 0). */}
          <div style={{ ...circle, opacity: 0, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Scrollable body — baked PNG */}
      <div style={scrollArea}>
        <img src={BODY_IMG} alt="Checkout details" style={{ width: BODY_W, height: BODY_H, display: 'block' }} />
      </div>

      {/* Sticky bottom dock */}
      <div style={{ flexShrink: 0, width: '100%' }}>
        <div style={buttonDock}>
          <div
            role={onSubmit ? 'button' : undefined}
            onClick={onSubmit}
            style={{ ...swipeButton, cursor: onSubmit ? 'pointer' : 'default' }}
          >
            <div style={arrowBox}>
              <img src={`${ASSETS}/swipe-arrow.svg`} alt="" style={{ width: 17.82, height: 17.55, display: 'block', transform: 'rotate(90deg)' }} />
            </div>
            <span style={ctaText}>{ctaLabel}</span>
          </div>
          <div style={cartSummary}>
            <span style={itemsText}>{itemsLabel}</span>
            <div style={totalContainer}>
              <span style={totalText}>{currency}</span>
              <span style={totalText}>{total}</span>
            </div>
          </div>
        </div>
        <div style={homeBarWrap}>
          <div style={homeBar} />
        </div>
      </div>

      {/* Address bottom sheet — opens on tapping the delivery pill */}
      <BottomSheet open={addressOpen} onClose={() => setAddressOpen(false)}>
        <AddressSheet variant="gifter" />
      </BottomSheet>
    </div>
  );
}

const frame: React.CSSProperties = {
  position: 'relative',
  width: 375,
  height: 812,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: colour.surface.tertiary, // #f2f3f7
  border: `2px solid ${colour.surface.tertiary}`,
  borderRadius: radius[20],
  boxShadow: '0px 4px 11.9px 0px rgba(102,102,102,0.25)',
  overflow: 'hidden',
};

/* ---- header ---- */
const headerRow: React.CSSProperties = {
  width: '100%',
  height: 56,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: space[16],
  paddingRight: space[16],
  paddingTop: space[8],
  paddingBottom: space[8],
  boxSizing: 'border-box',
};
const circle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
};
const deliverPill: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[6],
  paddingLeft: 4,
  paddingRight: 12,
  paddingTop: 4,
  paddingBottom: 4,
  borderRadius: 40,
  border: '0.769px solid #ffffff',
  background: 'linear-gradient(180deg, #ffffff 0%, #f2f3f7 100%)',
  boxShadow: '0px 6px 16px rgba(0,0,0,0.08)',
  boxSizing: 'border-box',
  userSelect: 'none',
};
const homeCircle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 6,
  borderRadius: 40,
  background: 'linear-gradient(180deg, #f2f3f7 0%, #ffffff 100%)',
  boxShadow: '0px 6px 16px rgba(0,0,0,0.08)',
  flexShrink: 0,
  boxSizing: 'border-box',
};
const pillTextRow: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[4],
};
const b13: React.CSSProperties = {
  fontSize: 13,
  lineHeight: '20px',
  letterSpacing: -0.1,
  color: colour['text-n-icon'].primary,
  whiteSpace: 'nowrap',
};
const pillPrefix: React.CSSProperties = { ...b13, fontFamily: font.regular, fontWeight: 400 };
const pillName: React.CSSProperties = { ...b13, fontFamily: font.semibold, fontWeight: 600 };

/* ---- body ---- */
const scrollArea: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: space[8],
  paddingBottom: space[8],
  paddingLeft: space[12],
  paddingRight: space[12],
  boxSizing: 'border-box',
};

/* ---- bottom dock ---- */
const buttonDock: React.CSSProperties = {
  width: '100%',
  backgroundColor: colour.surface.primary,
  boxShadow: '0px -4px 3.5px rgba(0,0,0,0.13)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: space[8],
  paddingTop: space[12],
  boxSizing: 'border-box',
};
const swipeButton: React.CSSProperties = {
  width: 343,
  height: 48,
  backgroundColor: GREY_3,
  borderRadius: radius[12],
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[8],
  padding: space[8],
  boxSizing: 'border-box',
  userSelect: 'none',
};
const arrowBox: React.CSSProperties = {
  width: 54,
  height: '100%',
  backgroundColor: colour.surface.primary,
  borderRadius: radius[8],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: space[8],
  paddingRight: space[8],
  paddingTop: space[4],
  paddingBottom: space[4],
  flexShrink: 0,
  boxSizing: 'border-box',
};
const ctaText: React.CSSProperties = {
  flex: 1,
  fontFamily: font.bold,
  fontWeight: 700,
  fontSize: 19,
  lineHeight: '26.6px',
  color: '#ffffff',
  textAlign: 'center',
};
const cartSummary: React.CSSProperties = {
  width: 338,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const itemsText: React.CSSProperties = {
  fontFamily: font.bold,
  fontWeight: 700,
  fontSize: 19,
  lineHeight: '26.6px',
  color: GREY_1,
  whiteSpace: 'nowrap',
};
const totalContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  gap: space[4],
};
const totalText: React.CSSProperties = {
  fontFamily: font.bold,
  fontWeight: 700,
  fontSize: 19,
  lineHeight: '26.6px',
  color: NOON_BLACK,
  whiteSpace: 'nowrap',
};

/* ---- home indicator ---- */
const homeBarWrap: React.CSSProperties = {
  width: '100%',
  backgroundColor: colour.surface.primary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: space[12],
  paddingBottom: space[8],
  boxSizing: 'border-box',
};
const homeBar: React.CSSProperties = {
  width: 124,
  height: 5,
  borderRadius: radius[8],
  backgroundColor: NOON_BLACK,
};
