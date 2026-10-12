import { colour, space, radius, palette, fontFamily } from '../field-ds';
import { ActiveOrderCard, type ActiveOrderCardProps } from './ActiveOrderCard';

const ASSETS = '/gift-registry';

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const ff = {
  bold: { fontFamily: `${fontFamily.bold.fontFamily}, ${SANS}`, fontWeight: 700 },
  semibold: { fontFamily: `Noontree-SemiBold, ${SANS}`, fontWeight: 600 },
} as const;

const type = {
  b14Bold: { ...ff.bold, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 },
  a12SemiBold: { ...ff.semibold, fontSize: 12, lineHeight: '16px', letterSpacing: 0 },
} as const;

export type OrderStatusVariant = 'multiple' | 'single' | 'allDelivered' | 'gifter';

const DEMO_ORDER: ActiveOrderCardProps = {
  senderName: 'Anisha',
  arrivingLabel: 'May 21',
  itemsLabel: '2 items',
  statusLabel: 'Processing',
  deliveryTag: 'On time',
  express: true,
  imagesVariant: '2',
};

const DELIVERED_THUMBS = [
  `${ASSETS}/lamp.png`,
  `${ASSETS}/mat.png`,
  `${ASSETS}/perfume.png`,
];

export interface OrderStatusBarProps {
  variant?: OrderStatusVariant;
  /** Header title. Defaults to a per-variant sample. */
  title?: string;
  viewAllLabel?: string;
  onViewAll?: () => void;
  /** Order data for the card(s). Defaults to the design's sample order. */
  orders?: ActiveOrderCardProps[];
}

function ViewAll({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        gap: space[4],
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 24,
        maxHeight: 24,
        paddingBlock: space[4],
        paddingInlineEnd: 0,
        borderRadius: radius[4],
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <span style={{ ...type.a12SemiBold, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src={`${ASSETS}/chevron.svg`} alt="" style={{ width: 5.333, height: 9.333, display: 'block' }} />
      </span>
    </button>
  );
}

function GlassPanel({
  title,
  viewAllLabel,
  onViewAll,
  cardGap,
  children,
}: {
  title: string;
  viewAllLabel: string;
  onViewAll?: () => void;
  cardGap: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: space[12],
        paddingBlock: space[12],
        borderRadius: radius[20],
        border: `1px solid ${colour.border.white}`,
        overflow: 'hidden',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.8) 119.04%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box',
          paddingInlineStart: space[16],
          paddingInlineEnd: space[12],
        }}
      >
        <span style={{ ...type.b14Bold, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{title}</span>
        <ViewAll label={viewAllLabel} onPress={onViewAll} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingInline: space[12],
          gap: cardGap,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function DeliveredThumb({ src, showBorder }: { src: string; showBorder?: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 60,
        height: 80,
        flexShrink: 0,
        borderRadius: radius[8],
        overflow: 'hidden',
        backgroundColor: colour.surface.primary,
        border: `1px solid ${showBorder ? colour.border.subtle : colour.surface.primary}`,
        boxSizing: 'border-box',
      }}
    >
      <img
        src={src}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', bottom: 4, insetInlineStart: 4, width: 20, height: 20 }}>
        <img src={`${ASSETS}/verified.svg`} alt="delivered" width={20} height={20} style={{ display: 'block' }} />
      </div>
    </div>
  );
}

export function OrderStatusBar({
  variant = 'multiple',
  title,
  viewAllLabel = 'View All',
  onViewAll,
  orders,
}: OrderStatusBarProps) {
  const data = orders && orders.length ? orders : [DEMO_ORDER, DEMO_ORDER];

  const shell: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 375,
    boxSizing: 'border-box',
    paddingInline: space[12],
  };

  if (variant === 'gifter') {
    return (
      <div style={shell}>
        <ActiveOrderCard {...data[0]} style={{ width: '100%' }} />
      </div>
    );
  }

  if (variant === 'single') {
    return (
      <div style={shell}>
        <GlassPanel title={title ?? '1 Gift ordered till now'} viewAllLabel={viewAllLabel} onViewAll={onViewAll} cardGap={0}>
          <ActiveOrderCard {...data[0]} style={{ flex: '1 0 0', minWidth: 0 }} />
        </GlassPanel>
      </div>
    );
  }

  if (variant === 'allDelivered') {
    return (
      <div style={shell}>
        <GlassPanel title={title ?? '3 Gifts ordered till now'} viewAllLabel={viewAllLabel} onViewAll={onViewAll} cardGap={0}>
          <div
            style={{
              display: 'flex',
              flex: '1 0 0',
              minWidth: 0,
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderRadius: radius[12],
              border: `1px solid ${colour.border.white}`,
              backgroundColor: palette.alphaLight[50],
              boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box', padding: space[10] }}>
              <div style={{ display: 'flex', gap: space[8], alignItems: 'center' }}>
                {DELIVERED_THUMBS.map((src, i) => (
                  <DeliveredThumb key={i} src={src} showBorder={i === 2} />
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    );
  }

  // multiple
  return (
    <div style={shell}>
      <GlassPanel title={title ?? '5 Gifts ordered till now'} viewAllLabel={viewAllLabel} onViewAll={onViewAll} cardGap={space[12]}>
        {data.map((order, i) => (
          <ActiveOrderCard
            key={i}
            {...order}
            imagesVariant={i === 1 ? '1' : order.imagesVariant}
            style={{ width: 307, flexShrink: 0 }}
          />
        ))}
      </GlassPanel>
    </div>
  );
}
