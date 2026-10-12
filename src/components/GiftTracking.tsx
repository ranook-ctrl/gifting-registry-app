import React, { useState } from 'react';
import { colour, space, radius } from '../field-ds';
import { PhoneHeader, PageHeader } from './atoms';
import { ActiveOrderCard, type ActiveOrderCardProps } from './ActiveOrderCard';
import { DeliveryDetails, type DeliveryDetailsProps } from './DeliveryDetails';
import { ReceivedGiftCard, type ReceivedGiftCardProps } from './ReceivedGiftCard';

const ASSETS = '/gift-registry';

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const CONTENT_WIDTH = 351;

export interface GiftTrackingProps {
  /** Page title, e.g. "Your gifts". */
  title?: string;
  /** Occasion subtitle under the title, e.g. "Eidii 2026". */
  occasion?: string;
  /** iOS status-bar clock. */
  time?: string;
  /** Delivery address pill props. */
  delivery?: DeliveryDetailsProps;
  /** Upcoming (active) order tracker cards. */
  upcoming?: ActiveOrderCardProps[];
  /** Delivered gift cards. */
  delivered?: ReceivedGiftCardProps[];
  /** In-person purchased gift cards. */
  inPerson?: ReceivedGiftCardProps[];
  onBack?: () => void;
  onChangeAddress?: () => void;
}

const DEFAULT_UPCOMING: ActiveOrderCardProps[] = [
  {
    senderName: 'John Doe',
    senderSuffix: 'sent you a gift',
    arrivingPrefix: 'Arriving by',
    arrivingLabel: '9 pm, today',
    itemsLabel: '2 items',
    statusLabel: 'Out for delivery',
    deliveryTag: 'On time',
    express: true,
    imagesVariant: 'Multi count',
    deliveryPin: ['1', '2', '4', '5', '0', '0'],
  },
  {
    senderName: 'John Doe',
    senderSuffix: 'sent you a gift',
    arrivingPrefix: 'Arriving',
    arrivingLabel: '9 pm, today',
    itemsLabel: '1 item',
    statusLabel: 'Dispatched',
    deliveryTag: 'On time',
    express: true,
    imagesVariant: '1',
  },
];

const SAMSUNG =
  'Samsung 8KG Washer With 6KG Dryer, Eco Bubble, Air Wash, Hygiene Steam With Digital Inverter Technology 1400 RPM 8.0 kg';

const DEFAULT_DELIVERED: ReceivedGiftCardProps[] = [
  {
    badge: 'delivered',
    name: 'Ayush',
    productName: SAMSUNG,
    productImage: `${ASSETS}/lamp.png`,
    express: true,
    deliveredDate: 'on April 16, 2026',
  },
  {
    badge: 'delivered',
    name: 'Rahul',
    invoice: true,
    productName: 'Roseate Birch Super Soft (40x60 cm) Microfiber 2000 GSM Bath Mat Super',
    productImage: `${ASSETS}/mat.png`,
    express: true,
    details: [
      { kind: 'returns', label: 'Returns & exchanges available', info: true },
      { kind: 'warranty', label: '1-year warranty' },
    ],
    deliveredDate: 'on April 16, 2026',
    installation: {
      label: 'Installation scheduled',
      price: 'Free',
      time: '12:00 PM',
      date: 'Feb 12, 2026',
    },
  },
];

const DEFAULT_IN_PERSON: ReceivedGiftCardProps[] = [
  {
    badge: 'purchased',
    name: 'Tanaya',
    productName: SAMSUNG,
    productImage: `${ASSETS}/atoms/airpods-box.png`,
    dimmed: true,
  },
];

/**
 * "Gift Tracking" — the recipient's "Your gifts" screen. Composes the shared
 * PhoneHeader + PageHeader atoms, the DeliveryDetails address pill, a rail of
 * ActiveOrderCards (Upcoming gifts, with delivery PIN), and ReceivedGiftCards
 * for delivered + in-person states. Pixel-matched to Figma node 1379:1042137.
 */
export function GiftTracking({
  title = 'Your gifts',
  occasion = 'Eidii 2026',
  time = '9:41',
  delivery,
  upcoming = DEFAULT_UPCOMING,
  delivered = DEFAULT_DELIVERED,
  inPerson = DEFAULT_IN_PERSON,
  onBack,
  onChangeAddress,
}: GiftTrackingProps) {
  const [deliveryExpanded, setDeliveryExpanded] = useState(delivery?.variant === 'expanded');

  return (
    <div
      style={{
        width: 375,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: space[16],
        paddingBottom: space[24],
        backgroundColor: colour.surface.tertiary,
        borderRadius: radius[24],
        overflow: 'hidden',
      }}
    >
      {/* Status bar + nav header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <PhoneHeader time={time} height={40} />
        <PageHeader title={title} subtitle={occasion} showAction={false} onBack={onBack} />
      </div>

      {/* Delivery address pill — tapping the chevron toggles minimised ↔ expanded */}
      <DeliveryDetails
        {...delivery}
        variant={deliveryExpanded ? 'expanded' : 'minimised'}
        onToggleExpand={() => {
          setDeliveryExpanded((v) => !v);
          delivery?.onToggleExpand?.();
          onChangeAddress?.();
        }}
      />

      {/* Tracked gifts */}
      <div style={{ width: CONTENT_WIDTH, display: 'flex', flexDirection: 'column', gap: space[20] }}>
        <Section title="Upcoming gifts">
          {upcoming.map((order, i) => (
            <ActiveOrderCard key={i} {...order} style={{ width: '100%', ...order.style }} />
          ))}
        </Section>

        <Section title="Gifts delivered">
          {delivered.map((gift, i) => (
            <ReceivedGiftCard key={i} {...gift} />
          ))}
        </Section>

        <Section title="In-Person Gifts">
          {inPerson.map((gift, i) => (
            <ReceivedGiftCard key={i} {...gift} />
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: space[12], width: '100%' }}>
      <h2
        style={{
          margin: 0,
          fontFamily: `Noontree-Bold, ${SANS}`,
          fontWeight: 700,
          fontSize: 16,
          lineHeight: '20px',
          letterSpacing: -0.15,
          color: colour['text-n-icon'].primary,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
