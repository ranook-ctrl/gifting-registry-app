import React from 'react';
import { space, radius } from '../../field-ds/tokens';
import { colors, font } from '../atoms/_shared';
import {
  ActiveOrderImages,
  StatusTags,
  MarketplaceTagsPills,
  FloatingCartRibbon,
  type StatusTagVariant,
  type MarketplaceTag,
} from '../atoms';
import { GiftBoxFilledIcon, NumpadIcon } from '../atoms/icons';
import { LinearGradientFill } from '../atoms/Gradient';

/**
 * "ActiveOrderCard" — the gift-registry order tile. Six variants driven by
 * `status` × `ofdType`, matching the Figma component-set:
 *   • Processing / Confirmed / Packed / Dispatched  (ofdType = NA)
 *   • OFD + DelCode   (adds the Delivery-PIN footer)
 *   • OFD + Default   (no footer)
 */
export type ActiveOrderStatus = 'Processing' | 'Confirmed' | 'Packed' | 'Dispatched' | 'OFD';
export type ActiveOrderOfdType = 'NA' | 'DelCode' | 'Default';

export interface ActiveOrderCardProps {
  status?: ActiveOrderStatus;
  ofdType?: ActiveOrderOfdType;
  sender?: string;
  itemCount?: number;
  marketplace?: MarketplaceTag;
  statusTag?: StatusTagVariant;
  deliveryPin?: string;
}

const STATUS_CONFIG: Record<ActiveOrderStatus, { arriving: string; date: string; subtitle: string }> = {
  Processing: { arriving: 'Arriving', date: 'May 19 - 24', subtitle: 'Processing' },
  Confirmed: { arriving: 'Arriving', date: 'May 19 - 24', subtitle: 'Confirmed' },
  Packed: { arriving: 'Arriving by', date: 'May 19', subtitle: 'Packed' },
  Dispatched: { arriving: 'Arriving by', date: 'May 19', subtitle: 'Dispatched' },
  OFD: { arriving: 'Arriving by', date: '9 pm, today', subtitle: 'Out for delivery' },
};

export function ActiveOrderCard({
  status = 'Processing',
  ofdType = 'NA',
  sender = 'John Doe',
  itemCount = 2,
  marketplace = 'express',
  statusTag = 'On time',
  deliveryPin = '124500',
}: ActiveOrderCardProps) {
  const cfg = STATUS_CONFIG[status];
  const isOFD = status === 'OFD';
  const showPin = isOFD && ofdType === 'DelCode';
  const imagesVariant = isOFD ? 'Multi count' : '2';

  return (
    <div style={shadow}>
      <div style={card}>
        {/* Header — sender line over a subtle secondary→white gradient */}
        <div style={header}>
          <LinearGradientFill
            stops={[
              { offset: 0, color: colors.surface.secondary },
              { offset: 1, color: colors.surface.primary },
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
          <div style={senderRow}>
            <GiftBoxFilledIcon size={16} />
            <span style={senderTextWrap}>
              <span style={senderName}>{sender}</span>
              <span style={senderRest}> sent you a gift</span>
            </span>
          </div>
        </div>

        {/* Shipment content — thumbnail + arriving details + tags */}
        <div style={shipment}>
          <ActiveOrderImages variant={imagesVariant} />
          <div style={details}>
            <div style={detailsTop}>
              <div style={titleRow}>
                <span style={title}>{cfg.arriving}</span>
                <span style={title}>{cfg.date}</span>
              </div>
              <div style={metaRow}>
                <span style={meta}>{itemCount} items</span>
                <span style={dot} />
                <span style={meta}>{cfg.subtitle}</span>
              </div>
            </div>
            <div style={tagsRow}>
              <StatusTags status={statusTag} />
              <MarketplaceTagsPills tag={marketplace} />
            </div>
          </div>
        </div>

        {/* Delivery-PIN footer — OFD + DelCode only */}
        {showPin && (
          <div style={pinFooter}>
            <div style={pinInner}>
              <div style={pinLabelGroup}>
                <NumpadIcon size={20} />
                <span style={pinLabel}>Delivery PIN</span>
              </div>
              <div style={pinDigits}>
                {deliveryPin.split('').map((d, i) => (
                  <span key={i} style={pinBox}>
                    <span style={pinDigit}>{d}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Decorative gift ribbon, pinned to the top-right corner */}
        <div style={ribbon}>
          <FloatingCartRibbon size={64} />
        </div>
      </div>
    </div>
  );
}

const WHITE = colors.surface.primary;

const shadow: React.CSSProperties = {
  width: 351,
  borderRadius: radius[16],
  backgroundColor: WHITE,
  boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.02)',
};
const card: React.CSSProperties = {
  position: 'relative',
  width: 351,
  borderRadius: radius[16],
  backgroundColor: WHITE,
  overflow: 'hidden',
  boxSizing: 'border-box',
};
const header: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  borderTopLeftRadius: radius[16],
  borderTopRightRadius: radius[16],
  borderTop: `3px solid ${WHITE}`,
  borderLeft: `3px solid ${WHITE}`,
  borderRight: `3px solid ${WHITE}`,
  paddingTop: space[12],
  paddingBottom: space[10],
  paddingLeft: space[10],
  paddingRight: space[10],
  overflow: 'hidden',
  boxSizing: 'border-box',
};
const senderRow: React.CSSProperties = { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 };
const senderTextWrap: React.CSSProperties = { flexShrink: 1, whiteSpace: 'nowrap' };
const senderName: React.CSSProperties = { fontFamily: font.bold, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 700, color: colors.text.action };
const senderRest: React.CSSProperties = { fontFamily: font.medium, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 500, color: colors.text.primary };

const shipment: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  padding: space[10],
  width: '100%',
  boxSizing: 'border-box',
};
const details: React.CSSProperties = { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: space[10] };
const detailsTop: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: space[4], width: '100%' };
const titleRow: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 4 };
const title: React.CSSProperties = { fontFamily: font.bold, fontSize: 16, lineHeight: '22px', letterSpacing: -0.15, fontWeight: 700, color: colors.text.primary, whiteSpace: 'nowrap' };
const metaRow: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: space[6] };
const meta: React.CSSProperties = { fontFamily: font.regular, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 400, color: colors.text.tertiary, whiteSpace: 'nowrap' };
const dot: React.CSSProperties = { width: 2, height: 2, borderRadius: 1, backgroundColor: colors.text.tertiary };
const tagsRow: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' };

const pinFooter: React.CSSProperties = {
  width: '100%',
  backgroundColor: colors.surface.secondary,
  borderBottom: `3px solid ${WHITE}`,
  borderLeft: `3px solid ${WHITE}`,
  borderRight: `3px solid ${WHITE}`,
  borderBottomLeftRadius: radius[16],
  borderBottomRightRadius: radius[16],
  paddingTop: space[10],
  paddingBottom: space[12],
  paddingLeft: space[14],
  paddingRight: space[12],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
};
const pinInner: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' };
const pinLabelGroup: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: space[6] };
const pinLabel: React.CSSProperties = { fontFamily: font.semibold, fontSize: 13, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 600, color: colors.text.primary };
const pinDigits: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: space[2] };
const pinBox: React.CSSProperties = {
  minWidth: 20,
  backgroundColor: colors.surface.actionExtrabold,
  borderRadius: radius[6],
  paddingLeft: space[6],
  paddingRight: space[6],
  paddingTop: space[4],
  paddingBottom: space[4],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
};
const pinDigit: React.CSSProperties = { fontFamily: font.bold, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 700, textAlign: 'center', color: colors.text.onSurfaceBold };

const ribbon: React.CSSProperties = { position: 'absolute', top: 0, right: 0, width: 64, height: 64, overflow: 'hidden', pointerEvents: 'none' };
