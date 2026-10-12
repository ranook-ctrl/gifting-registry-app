import React, { useState } from 'react';
import { colour, space, radius } from '../field-ds';
import { PhoneHeader } from './atoms';
import { ChevronLeftIcon, HomeIcon, ChevronBottomBoldIcon } from './atoms/icons';
import { BottomSheet } from './BottomSheet';
import { AddressSheet } from './AddressSheet';

const ASSETS = '/gift-registry';

// Noontree faces with a system fallback, matching the other screens' ramps.
const ff = (family: string) =>
  `${family}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

// accent/700 — the Figma cart checkout fill. Not in the shared token set (which
// tops out at surface.action-extrabold #0f61ff), so the exact design value is kept.
const ACCENT_700 = '#0057ff';

export interface CartPageProps {
  /** iOS status-bar clock. */
  time?: string;
  /** Bold recipient name in the delivery pill. */
  deliveringToName?: string;
  /** Leading regular-weight copy in the delivery pill. */
  deliveringToPrefix?: string;
  /** Cart body artwork (the full scrollable cart content, rendered as-is). */
  contentSrc?: string;
  /** Small label above the total. */
  totalLabel?: string;
  /** Formatted total, incl. the leading dirham glyph. */
  totalPrice?: string;
  /** CTA label. */
  checkoutLabel?: string;
  onBack?: () => void;
  onChangeAddress?: () => void;
  onCheckout?: () => void;
}

/**
 * Cart page (Figma "Cart Full View") — sticky status bar + page header with a
 * back button and delivery-address pill, a scrollable cart-content image, and a
 * sticky footer showing the total and a Checkout CTA. The cart body is exported
 * artwork rather than re-coded per the source.
 */
export function CartPage({
  time = '9:41',
  deliveringToName = 'Prasanna',
  deliveringToPrefix = 'Delivering to',
  contentSrc = `${ASSETS}/cart-content.png`,
  totalLabel = 'Total',
  totalPrice = ' 1,760.00',
  checkoutLabel = 'Checkout',
  onBack,
  onChangeAddress,
  onCheckout,
}: CartPageProps) {
  const [addressOpen, setAddressOpen] = useState(false);
  const openAddress = () => {
    setAddressOpen(true);
    onChangeAddress?.();
  };
  return (
    <div style={frame}>
      {/* Sticky top: status bar + page header, on the frame background. */}
      <div style={stickyTop}>
        <PhoneHeader time={time} />
        <div style={pageHeader}>
          <div
            role={onBack ? 'button' : undefined}
            aria-label={onBack ? 'Back' : undefined}
            onClick={onBack}
            style={{ ...circleBtn, cursor: onBack ? 'pointer' : 'default' }}
          >
            <ChevronLeftIcon size={20} />
          </div>

          <div
            role="button"
            aria-haspopup="dialog"
            aria-expanded={addressOpen}
            onClick={openAddress}
            style={{ ...pill, cursor: 'pointer' }}
          >
            <div style={pillIconCircle}>
              <HomeIcon size={20} />
            </div>
            <div style={pillTextRow}>
              <span style={pillPrefix}>{deliveringToPrefix}</span>
              <span style={pillName}>{deliveringToName}</span>
              <ChevronBottomBoldIcon size={14} />
            </div>
          </div>

          {/* Trailing slot — present but invisible (Figma opacity 0), balances the row. */}
          <div style={{ ...circleBtn, opacity: 0, pointerEvents: 'none' }} aria-hidden />
        </div>
      </div>

      {/* Scrollable cart body (exported artwork). */}
      <div style={body}>
        <img src={contentSrc} alt="" style={contentImg} />
      </div>

      {/* Sticky bottom: total + checkout. */}
      <div style={footer}>
        <div style={totalBlock}>
          <div style={priceCol}>
            <span style={totalLabelStyle}>{totalLabel}</span>
            <span style={priceLabel}>{totalPrice}</span>
          </div>
        </div>
        <button type="button" onClick={onCheckout} style={checkoutBtn}>
          <span style={checkoutLabelStyle}>{checkoutLabel}</span>
        </button>
      </div>

      {/* Delivery address picker, opened from the header pill. */}
      <BottomSheet open={addressOpen} onClose={() => setAddressOpen(false)} fixed>
        <AddressSheet variant="gifter" />
      </BottomSheet>
    </div>
  );
}

const frame: React.CSSProperties = {
  position: 'relative',
  width: 375,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colour.surface.tertiary, // blue-gray/200 #f2f3f7
  boxSizing: 'border-box',
};

const stickyTop: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  width: 375,
  backgroundColor: colour.surface.tertiary,
};

const pageHeader: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 375,
  minHeight: 56,
  maxHeight: 56,
  paddingInline: space[16],
  paddingBlock: space[8],
  boxSizing: 'border-box',
};

const circleBtn: React.CSSProperties = {
  width: 40,
  height: 40,
  minWidth: 40,
  minHeight: 40,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
};

const SHADOW = '0px 6px 16px rgba(0, 0, 0, 0.08)';
const HAIRLINE = '0.769px solid #ffffff';

const pill: React.CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingBlock: space[4],
  paddingInlineStart: space[4],
  paddingInlineEnd: space[12],
  borderRadius: 40,
  border: HAIRLINE,
  background: `linear-gradient(180deg, ${colour.surface.primary} 0%, ${colour.surface.tertiary} 100%)`,
  boxShadow: SHADOW,
  boxSizing: 'border-box',
  userSelect: 'none',
};

const pillIconCircle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: space[6],
  borderRadius: 40,
  background: `linear-gradient(180deg, ${colour.surface.tertiary} 0%, ${colour.surface.primary} 100%)`,
  boxShadow: SHADOW,
  flexShrink: 0,
  boxSizing: 'border-box',
  marginInlineEnd: space[6],
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
const pillPrefix: React.CSSProperties = { ...b13, fontFamily: ff('Noontree-Regular'), fontWeight: 400 };
const pillName: React.CSSProperties = { ...b13, fontFamily: ff('Noontree-SemiBold'), fontWeight: 600 };

const body: React.CSSProperties = {
  flex: '1 0 auto',
  width: 375,
  paddingTop: space[8], // 8px gap between header and cart artwork (Figma y=99 → 107)
  boxSizing: 'border-box',
};

const contentImg: React.CSSProperties = {
  display: 'block',
  width: 375,
  height: 'auto',
  pointerEvents: 'none',
  userSelect: 'none',
};

const footer: React.CSSProperties = {
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[12],
  width: 375,
  height: 72,
  paddingInline: space[12],
  paddingBlock: space[10],
  backgroundColor: colour.surface.primary,
  borderTopLeftRadius: radius[12],
  borderTopRightRadius: radius[12],
  boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.08)',
  boxSizing: 'border-box',
};

const totalBlock: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
  paddingInlineStart: space[4],
  flexShrink: 0,
};

const priceCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[4],
};

const totalLabelStyle: React.CSSProperties = {
  fontFamily: ff('Noontree-Medium'),
  fontWeight: 500,
  fontSize: 12,
  lineHeight: '14px',
  letterSpacing: -0.12,
  color: colour['text-n-icon'].tertiary, // blue-gray/600 #666d85
  whiteSpace: 'nowrap',
};

const priceLabel: React.CSSProperties = {
  fontFamily: ff('Noontree-Bold'),
  fontWeight: 700,
  fontSize: 20,
  lineHeight: '24px',
  letterSpacing: -0.2,
  color: '#0e0e0e',
  textDecorationLine: 'underline',
  textDecorationStyle: 'dotted',
  textUnderlinePosition: 'from-font',
  fontFeatureSettings: '"case"',
  whiteSpace: 'nowrap',
};

const checkoutBtn: React.CSSProperties = {
  flex: '1 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[8],
  height: 52,
  minHeight: 48,
  maxHeight: 56,
  minWidth: 80,
  paddingInline: space[16],
  paddingBlock: space[12],
  border: 'none',
  borderRadius: radius[12],
  backgroundColor: ACCENT_700,
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const checkoutLabelStyle: React.CSSProperties = {
  fontFamily: ff('Noontree-SemiBold'),
  fontWeight: 600,
  fontSize: 17,
  lineHeight: '20px',
  letterSpacing: -0.26,
  color: colour['text-n-icon']['on-surface-bold'],
  textAlign: 'center',
  fontFeatureSettings: '"case"',
  whiteSpace: 'nowrap',
};
