import React from 'react';
import { colour, palette, space, radius } from '../field-ds';
import { OrderHistoryImages, MarketplaceTagsPills, type OrderHistoryVariant } from './atoms';
import {
  VerifiedFilledIcon,
  PurchasedBadgeIcon,
  InvoiceIcon,
  RewindCheckIcon,
  WarrantyIcon,
  InfoCircleFilledIcon,
  InstallationV2Icon,
} from './atoms/icons';

const ASSETS = '/gift-registry';

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const ff = {
  regular: `Noontree-Regular, ${SANS}`,
  medium: `Noontree-Medium, ${SANS}`,
  semibold: `Noontree-SemiBold, ${SANS}`,
  bold: `Noontree-Bold, ${SANS}`,
} as const;

// Field DS body/action type ramp used in the design.
const type = {
  b13SemiBold: { fontFamily: ff.semibold, fontWeight: 600, fontSize: 13, lineHeight: '18px', letterSpacing: -0.1 },
  b12Regular: { fontFamily: ff.regular, fontWeight: 400, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 },
  b12Medium: { fontFamily: ff.medium, fontWeight: 500, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 },
  b12SemiBold: { fontFamily: ff.semibold, fontWeight: 600, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 },
  a12SemiBold: { fontFamily: ff.semibold, fontWeight: 600, fontSize: 12, lineHeight: '16px', letterSpacing: 0 },
} as const;

/** Which check sits in the header — green "verified" (delivered) or blue (in-person). */
export type ReceivedGiftBadge = 'delivered' | 'purchased';

export interface ReceivedGiftDetail {
  kind: 'returns' | 'warranty';
  label: string;
  /** Trailing info-circle (returns row). */
  info?: boolean;
}

export interface ReceivedGiftInstallation {
  /** e.g. "Installation scheduled". */
  label: string;
  /** e.g. "Free". */
  price: string;
  /** e.g. "12:00 PM". */
  time: string;
  /** e.g. "Feb 12, 2026". */
  date: string;
}

export interface ReceivedGiftCardProps {
  /** Header badge/state: green verified check, or blue purchased check. */
  badge?: ReceivedGiftBadge;
  /** Sender/buyer name, coloured green (delivered) or blue (purchased). */
  name: string;
  /** Header text after the name, e.g. "’s gift has been delivered". */
  headerSuffix?: string;
  /** Show the blue "Invoice" text-button + download glyph in the header. */
  invoice?: boolean;
  onInvoice?: () => void;
  /** Product title (clamps to two lines). */
  productName: string;
  /** Product thumbnail image URL. */
  productImage?: string;
  /** Thumbnail layout variant (defaults to a plain image). */
  productVariant?: OrderHistoryVariant;
  /** Grey the thumbnail (in-person gift). */
  dimmed?: boolean;
  /** Show the yellow express marketplace pill at the body's trailing edge. */
  express?: boolean;
  /** "Delivered on …" attribute pill. Omit to hide. */
  deliveredDate?: string;
  /** Delivered-pill leading word. */
  deliveredLabel?: string;
  /** Returns / warranty detail rows. */
  details?: ReceivedGiftDetail[];
  /** Bottom installation strip. Omit to hide. */
  installation?: ReceivedGiftInstallation;
  style?: React.CSSProperties;
  onPress?: () => void;
}

const Dot = () => <img src={`${ASSETS}/dot.svg`} alt="" width={2} height={2} style={{ display: 'block' }} />;

/**
 * "ReceivedGiftCard" — the post-order gift states on the Gift Tracking screen:
 * a "Gifts delivered" card (green verified check, optional invoice button,
 * returns/warranty rows, delivered pill, installation strip) and the
 * "In-Person Gifts" card (blue purchased check, dimmed thumbnail). All colours,
 * spacing and type come from Field DS tokens.
 */
export function ReceivedGiftCard({
  badge = 'delivered',
  name,
  headerSuffix = badge === 'purchased' ? 'has purchased this gift for you' : '’s gift has been delivered',
  invoice,
  onInvoice,
  productName,
  productImage,
  productVariant = 'Plain',
  dimmed,
  express,
  deliveredDate,
  deliveredLabel = 'Delivered',
  details,
  installation,
  style,
  onPress,
}: ReceivedGiftCardProps) {
  const nameColour = badge === 'purchased' ? colour['text-n-icon'].action : colour['text-n-icon'].success;

  return (
    <div
      onClick={onPress}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: colour.surface.primary,
        borderRadius: radius[16],
        overflow: 'hidden',
        boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.02)',
        cursor: onPress ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* Header strip: check + name/suffix (+ optional Invoice button) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space[8],
          width: '100%',
          boxSizing: 'border-box',
          paddingTop: invoice ? space[8] : space[12],
          paddingBottom: invoice ? space[8] : space[12],
          paddingLeft: space[10],
          paddingRight: invoice ? space[6] : space[10],
          backgroundColor: colour.surface.secondary,
          borderTop: `3px solid ${colour.border.white}`,
          borderInline: `3px solid ${colour.border.white}`,
          borderTopLeftRadius: radius[16],
          borderTopRightRadius: radius[16],
        }}
      >
        <div style={{ display: 'flex', gap: space[6], alignItems: 'center', minWidth: 0 }}>
          {badge === 'purchased' ? <PurchasedBadgeIcon size={14} /> : <VerifiedFilledIcon size={18} />}
          <div style={{ display: 'flex', gap: space[2], alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...type.b12Medium, fontFamily: ff.bold, fontWeight: 700, color: nameColour }}>{name}</span>
            <span style={{ ...type.b12Medium, color: colour['text-n-icon'].primary }}>{headerSuffix}</span>
          </div>
        </div>
        {invoice && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInvoice?.();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: space[4],
              minHeight: 24,
              maxHeight: 24,
              paddingInline: space[6],
              paddingBlock: space[4],
              border: 'none',
              background: 'transparent',
              borderRadius: radius[4],
              cursor: onInvoice ? 'pointer' : 'default',
              flexShrink: 0,
            }}
          >
            <span style={{ ...type.a12SemiBold, color: colour['text-n-icon'].action, whiteSpace: 'nowrap' }}>Invoice</span>
            <InvoiceIcon width={12} height={12.25} />
          </button>
        )}
      </div>

      {/* Body: thumbnail + text column */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          gap: space[12],
          alignItems: 'flex-start',
          width: '100%',
          boxSizing: 'border-box',
          paddingTop: space[10],
          paddingBottom: space[12],
          paddingInline: space[12],
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <OrderHistoryImages variant={productVariant} image={productImage} dimmed={dimmed} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: space[8], flex: '1 0 0', minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              ...type.b12Regular,
              color: colour['text-n-icon'].secondary,
              textAlign: 'center',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {productName}
          </p>

          {details && details.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
              {details.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: space[6], alignItems: 'center' }}>
                  {d.kind === 'returns' ? (
                    <RewindCheckIcon width={13.3} height={15.6} />
                  ) : (
                    <WarrantyIcon width={13.3} height={15.2} />
                  )}
                  <span style={{ ...type.b12Medium, color: colour['text-n-icon'].tertiary }}>{d.label}</span>
                  {d.info && <InfoCircleFilledIcon size={14} />}
                </div>
              ))}
            </div>
          )}

          {deliveredDate && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                paddingInline: space[6],
                paddingBlock: space[4],
                borderRadius: radius[8],
                background: `linear-gradient(90deg, ${palette.green[100]} 0%, ${colour.surface.primary} 100%)`,
              }}
            >
              <span style={{ ...type.b12SemiBold, color: colour['text-n-icon'].success, whiteSpace: 'nowrap' }}>
                {deliveredLabel}&nbsp;
              </span>
              <span style={{ ...type.b12Regular, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
                {deliveredDate}
              </span>
            </div>
          )}
        </div>

        {express && (
          <div style={{ position: 'absolute', insetInlineEnd: space[12], bottom: space[12] }}>
            <MarketplaceTagsPills tag="express" />
          </div>
        )}
      </div>

      {/* Installation strip */}
      {installation && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[10],
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: space[8],
            paddingRight: space[4],
            paddingBlock: space[6],
            marginBottom: 3,
            backgroundColor: palette.brandBlue[50],
            borderBottomLeftRadius: radius[14],
            borderBottomRightRadius: radius[14],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: space[8],
              borderRadius: radius[6],
              backgroundColor: colour.surface.primary,
              flexShrink: 0,
            }}
          >
            <InstallationV2Icon width={20} height={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            <div style={{ display: 'flex', gap: space[6], alignItems: 'center' }}>
              <span style={{ ...type.b13SemiBold, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
                {installation.label}
              </span>
              <Dot />
              <span style={{ ...type.b13SemiBold, color: colour['text-n-icon'].success, whiteSpace: 'nowrap' }}>
                {installation.price}
              </span>
            </div>
            <div style={{ display: 'flex', gap: space[6], alignItems: 'center' }}>
              <span style={{ ...type.b12Medium, color: colour['text-n-icon'].tertiary, whiteSpace: 'nowrap' }}>
                {installation.time}
              </span>
              <Dot />
              <span style={{ ...type.b12Medium, color: colour['text-n-icon'].tertiary, whiteSpace: 'nowrap' }}>
                {installation.date}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
