import { colour, space, radius, fontFamily } from '../field-ds';
import {
  StatusTags,
  MarketplaceTagsPills,
  ActiveOrderImages,
  type ActiveOrderVariant,
  type StatusTagVariant,
} from './atoms';
import { NumpadIcon } from './atoms/icons';

const ASSETS = '/gift-registry';

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const ff = {
  regular: { fontFamily: `${fontFamily.regular.fontFamily}, ${SANS}`, fontWeight: 400 },
  medium: { fontFamily: `${fontFamily.medium.fontFamily}, ${SANS}`, fontWeight: 500 },
  semibold: { fontFamily: `Noontree-SemiBold, ${SANS}`, fontWeight: 600 },
  bold: { fontFamily: `${fontFamily.bold.fontFamily}, ${SANS}`, fontWeight: 700 },
} as const;

// Field DS body/action type ramp (from Figma variables: font/body/*, font/action/*).
const type = {
  b16Bold: { ...ff.bold, fontSize: 16, lineHeight: '22px', letterSpacing: -0.15 },
  b13SemiBold: { ...ff.semibold, fontSize: 13, lineHeight: '18px', letterSpacing: -0.1 },
  b12Bold: { ...ff.bold, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 },
  b12Medium: { ...ff.medium, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 },
  b12Regular: { ...ff.regular, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 },
} as const;

export interface ActiveOrderCardProps {
  /** Sender name shown in blue in the header (e.g. "John Doe"). */
  senderName: string;
  /** Header suffix after the sender name. */
  senderSuffix?: string;
  /** Static "Arriving" prefix label. */
  arrivingPrefix?: string;
  /** Arrival window, e.g. "May 19 - 24". */
  arrivingLabel: string;
  /** Item-count label, e.g. "2 items". */
  itemsLabel: string;
  /** Fulfilment label, e.g. "Processing". */
  statusLabel: string;
  /** Delivery-timeliness tag shown under the details. Omit to hide. */
  deliveryTag?: StatusTagVariant;
  /** Show the yellow "express" marketplace pill. */
  express?: boolean;
  /** Image-well layout variant (see the ActiveOrderImages atom). */
  imagesVariant?: ActiveOrderVariant;
  /** Actual product photos to show in the image well (e.g. the items bought). */
  images?: string[];
  /**
   * Out-for-delivery PIN digits. When set, a "Delivery PIN" footer strip renders
   * under the card with each digit in a blue box, e.g. ['1','2','4','5','0','0'].
   */
  deliveryPin?: string[];
  /** Footer PIN label. */
  deliveryPinLabel?: string;
  /** Merged onto the card root — used by containers to set width. */
  style?: React.CSSProperties;
  onPress?: () => void;
}

export function ActiveOrderCard({
  senderName,
  senderSuffix = 'sent you a gift',
  arrivingPrefix = 'Arriving',
  arrivingLabel,
  itemsLabel,
  statusLabel,
  deliveryTag,
  express,
  imagesVariant = '1',
  images,
  deliveryPin,
  deliveryPinLabel = 'Delivery PIN',
  style,
  onPress,
}: ActiveOrderCardProps) {
  return (
    <div
      onClick={onPress}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: colour.surface.primary,
        borderRadius: radius[16],
        overflow: 'hidden',
        boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.02)',
        cursor: onPress ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* Header: sender + gift icon on a subtle gradient with inset white border */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          paddingTop: space[12],
          paddingBottom: space[10],
          paddingInline: space[10],
          borderTop: `3px solid ${colour.border.white}`,
          borderInline: `3px solid ${colour.border.white}`,
          borderTopLeftRadius: radius[16],
          borderTopRightRadius: radius[16],
          background: `linear-gradient(90deg, ${colour.surface.secondary} 0%, ${colour.surface.primary} 100%)`,
        }}
      >
        <div style={{ display: 'flex', gap: space[4], alignItems: 'center' }}>
          <img src={`${ASSETS}/gift-box.svg`} alt="" width={16} height={16} style={{ display: 'block' }} />
          <div style={{ display: 'flex', gap: space[2], alignItems: 'center', whiteSpace: 'nowrap' }}>
            <span style={{ ...type.b12Bold, color: colour['text-n-icon'].action }}>{senderName}</span>
            <span style={{ ...type.b12Medium, color: colour['text-n-icon'].primary }}>{senderSuffix}</span>
          </div>
        </div>
      </div>

      {/* Shipment content */}
      <div
        style={{
          display: 'flex',
          gap: space[12],
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          padding: space[10],
        }}
      >
        <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, gap: space[12], alignItems: 'center' }}>
          <ActiveOrderImages variant={imagesVariant} images={images} />

          <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, flexDirection: 'column', gap: space[10], alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[4], alignItems: 'flex-start', width: '100%' }}>
              <div style={{ display: 'flex', gap: space[4], alignItems: 'flex-start' }}>
                <span style={{ ...type.b16Bold, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
                  {arrivingPrefix}
                </span>
                <span
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: 22,
                    ...type.b16Bold,
                    color: colour['text-n-icon'].primary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {arrivingLabel}
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: -20.43,
                      top: -6.41,
                      width: 13,
                      height: 33.8,
                      transform: 'rotate(15deg)',
                      backgroundColor: colour['text-n-icon']['on-surface-bold'],
                      mixBlendMode: 'color-dodge',
                    }}
                  />
                </span>
              </div>
              <div style={{ display: 'flex', gap: space[6], alignItems: 'center' }}>
                <span style={{ ...type.b12Regular, color: colour['text-n-icon'].tertiary, whiteSpace: 'nowrap' }}>
                  {itemsLabel}
                </span>
                <img src={`${ASSETS}/dot.svg`} alt="" width={2} height={2} style={{ display: 'block' }} />
                <span style={{ ...type.b12Regular, color: colour['text-n-icon'].tertiary, whiteSpace: 'nowrap' }}>
                  {statusLabel}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              {deliveryTag ? <StatusTags status={deliveryTag} /> : <span />}
              {express && <MarketplaceTagsPills tag="express" />}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery PIN footer (out-for-delivery only) */}
      {deliveryPin && deliveryPin.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: space[10],
            width: '100%',
            boxSizing: 'border-box',
            paddingTop: space[10],
            paddingBottom: space[12],
            paddingLeft: space[14],
            paddingRight: space[12],
            backgroundColor: colour.surface.secondary,
            borderBottom: `3px solid ${colour.border.white}`,
            borderInline: `3px solid ${colour.border.white}`,
            borderBottomLeftRadius: radius[16],
            borderBottomRightRadius: radius[16],
          }}
        >
          <div style={{ display: 'flex', gap: space[6], alignItems: 'center' }}>
            <NumpadIcon size={20} />
            <span style={{ ...type.b13SemiBold, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
              {deliveryPinLabel}
            </span>
          </div>
          <div style={{ display: 'flex', gap: space[2], alignItems: 'center' }}>
            {deliveryPin.map((digit, i) => (
              <span
                key={i}
                style={{
                  minWidth: 20,
                  boxSizing: 'border-box',
                  paddingInline: space[6],
                  paddingBlock: space[4],
                  borderRadius: radius[6],
                  backgroundColor: colour.surface['action-extrabold'],
                  color: colour['text-n-icon']['on-surface-bold'],
                  textAlign: 'center',
                  ...type.b12Bold,
                }}
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Floating gift ribbon, top-inline-end corner */}
      <div style={{ position: 'absolute', insetInlineEnd: 0, top: 0, width: 64, height: 64, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: -20.99,
            width: 79.91,
            height: 79.91,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ transform: 'rotate(45deg)' }}>
            <img src={`${ASSETS}/ribbon.svg`} alt="" style={{ width: 88.846, height: 24.164, display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
