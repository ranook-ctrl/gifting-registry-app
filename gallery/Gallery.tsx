import { useState } from 'react';
import {
  GiftStatusBadge,
  ActiveOrderCard,
  OrderStatusBar,
  GifterCard,
  CreatorCard,
  DeliveryDetails,
  FormFields,
  StickyBottom,
  BirthdayBackground,
  DateInput,
  ShareSheet,
  AddressSheet,
  NeutralButton,
  ExploreCuratedGifts,
  ConfirmationBottomsheet,
  ExplorableCard,
  PageHeaderHero,
  CreatorHeader,
  CreatorEmptyState,
  CreatorHome,
  CreateGiftList,
  GiftListDetails,
  RegistrySettings,
} from '../src/components';
import type { GifterCardProps, GifterCardState } from '../src/components';
import * as Atoms from '../src/components/atoms';
import * as Molecules from '../src/components/molecules';
import { colour, space, radius } from '../src/field-ds';
import airpods from '../src/components/assets/gifter-card/product-airpods.png';
import bathmat from '../src/components/assets/gifter-card/product-bathmat.png';

const SANS =
  '"Noontree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const AIRPODS = {
  imageUrl: airpods,
  name: 'Apple Airpods Pro 2 Wireless Earbuds',
  price: '899',
  wasPrice: '1399',
  discount: '33%',
  rating: 4.3,
  reviewCount: 128,
};

const BATHMAT = {
  imageUrl: bathmat,
  name: 'Roseate Birch Super Soft (40x60 cm) Microfiber 2000 GSM Bath Mat Super ',
  price: '24',
  wasPrice: '99',
  discount: '33%',
  rating: 4.3,
  reviewCount: 128,
};

const CREATOR_AIRPODS = {
  imageUrl: airpods,
  name: 'Apple Airpods Pro 2 Wireless Earbuds',
  sellingPrice: '899',
  listedPrice: '1399',
  discount: '33%',
};

const CREATOR_MAT = {
  imageUrl: bathmat,
  name: 'Roseate Birch Super Soft (40x60 cm) Microfiber 2000 GSM Bath Mat Super ',
  sellingPrice: '24',
  listedPrice: '99',
  discount: '33%',
};

const JULY = (d: number) => new Date(2026, 6, d);

// Controlled wrapper: GifterCard is props-in/callbacks-out, so the gallery owns
// the add-to-bag → stepper transition and quantity for the live cards.
function LiveGifterCard({
  initialState = 'default',
  ...props
}: Omit<GifterCardProps, 'state' | 'quantity'> & { initialState?: GifterCardState }) {
  const [state, setState] = useState<GifterCardState>(initialState);
  const [quantity, setQuantity] = useState(1);
  return (
    <GifterCard
      {...props}
      state={state}
      quantity={quantity}
      onAddToBag={() => {
        setState('in-bag');
        setQuantity(1);
      }}
      onIncrement={() => setQuantity((q) => q + 1)}
      onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
      onRemove={() => {
        setState('default');
        setQuantity(1);
      }}
    />
  );
}

function LiveCreatorStepper() {
  const [qty, setQty] = useState(1);
  return (
    <CreatorCard
      variant="stepper"
      {...CREATOR_AIRPODS}
      quantity={qty}
      onIncrement={() => setQty((q) => q + 1)}
      onDecrement={() => setQty((q) => Math.max(1, q - 1))}
    />
  );
}

function LiveDeliveryDetails() {
  const [expanded, setExpanded] = useState(true);
  const [leaveAtDoor, setLeaveAtDoor] = useState(true);
  return (
    <DeliveryDetails
      variant={expanded ? 'expanded' : 'minimised'}
      leaveAtDoor={leaveAtDoor}
      onToggleExpand={() => setExpanded((v) => !v)}
      onToggleLeaveAtDoor={setLeaveAtDoor}
    />
  );
}

function LiveFormFields() {
  const [checked, setChecked] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[16], alignItems: 'flex-start' }}>
      <FormFields variant="text" />
      <FormFields variant="address" onEditAddress={() => {}} />
      <FormFields variant="leave-at-door" checked={checked} onToggle={setChecked} />
      <FormFields variant="occasion" onSelectOccasion={() => {}} />
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: space[24] }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
        <h2 style={{ margin: 0, fontFamily: SANS, fontSize: 22, fontWeight: 700, color: colour['text-n-icon'].primary }}>
          {title}
        </h2>
        <p style={{ margin: 0, fontFamily: SANS, fontSize: 14, color: colour['text-n-icon'].tertiary }}>
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}

function Item({ label, children, dark }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[12] }}>
      <span
        style={{
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 600,
          color: colour['text-n-icon'].secondary,
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: space[16],
          alignItems: 'flex-start',
          padding: space[20],
          borderRadius: radius[16],
          border: `1px solid ${colour.border.subtle ?? 'rgba(0,0,0,0.06)'}`,
          background: dark ? '#0f0f14' : colour.surface.primary,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: 'linear-gradient(180deg, #f6f6fe 0%, #fff4f8 100%)',
        padding: `${space[40]}px ${space[40]}px 120px`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: space[48] }}>
        {/* Masthead */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
          <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: colour['text-n-icon'].action }}>
            Field DS · noon
          </span>
          <h1 style={{ margin: 0, fontFamily: SANS, fontSize: 36, fontWeight: 800, color: colour['text-n-icon'].primary }}>
            Gifting Registry — Component Gallery
          </h1>
          <p style={{ margin: 0, maxWidth: 640, fontFamily: SANS, fontSize: 15, color: colour['text-n-icon'].tertiary }}>
            Every Field DS Gifting Registry component — atoms, molecules, sheets and full
            screens — assembled in one place, grouped by flow. Each is token-styled,
            props-in / callbacks-out, and RTL-aware.
          </p>
        </header>

        {/* PRIMITIVES — ATOMS */}
        <Section
          title="Primitives · Atoms"
          subtitle="The Figma “Primitives” atoms, ported 1:1 from the React Native source (was localhost:3600)."
        >
          <Item label="PageTitle — occasion heading + date/countdown">
            <Atoms.PageTitle />
          </Item>
          <Item label="OccassionDate — calendar · date • countdown">
            <Atoms.OccassionDate />
          </Item>
          <Item label="PhoneHeader — iOS status bar (375×42)">
            <Atoms.PhoneHeader />
          </Item>
          <Item label="PageHeader — nav bar (375×56)">
            <Atoms.PageHeader title="Our Eid Celebration" />
          </Item>
          <Item label="ActiveOrderImages — 1 · Multi count · 2 · 3 · 4 · 4+ · Installation">
            <Atoms.ActiveOrderImages variant="1" />
            <Atoms.ActiveOrderImages variant="Multi count" />
            <Atoms.ActiveOrderImages variant="2" />
            <Atoms.ActiveOrderImages variant="3" />
            <Atoms.ActiveOrderImages variant="4" />
            <Atoms.ActiveOrderImages variant="4+" />
            <Atoms.ActiveOrderImages variant="Installation" />
          </Item>
          <Item label="OrderHistoryImages — Single · Multi · Installation · Installation_Multi · Plain · dimmed">
            <Atoms.OrderHistoryImages variant="Single" />
            <Atoms.OrderHistoryImages variant="Multi" />
            <Atoms.OrderHistoryImages variant="Installation" />
            <Atoms.OrderHistoryImages variant="Installation_Multi" />
            <Atoms.OrderHistoryImages variant="Plain" />
            <Atoms.OrderHistoryImages variant="Plain" dimmed />
          </Item>
          <Item label="StatusTags — On time · Delayed · Cancellation · On hold">
            <Atoms.StatusTags status="On time" />
            <Atoms.StatusTags status="Delayed" />
            <Atoms.StatusTags status="Cancellation" />
            <Atoms.StatusTags status="On hold" />
          </Item>
          <Item label="MarketplaceTagsPills — express · supermall · market · global">
            <Atoms.MarketplaceTagsPills tag="express" />
            <Atoms.MarketplaceTagsPills tag="supermall" />
            <Atoms.MarketplaceTagsPills tag="market" />
            <Atoms.MarketplaceTagsPills tag="global" />
          </Item>
          <Item label="AdressPill — floating delivery-address pill">
            <Atoms.AdressPill />
          </Item>
          <Item label="FloatingCart — Default · Single Item">
            <Atoms.FloatingCart variant="Default" />
            <Atoms.FloatingCart variant="Single Item" />
          </Item>
          <Item label="BG — category background tile (88×120)">
            <Atoms.BG label="Perfumes" />
            <Atoms.BG label="Home" />
          </Item>
          <Item label="FloatingCartRibbon — decorative gift ribbon (64×64)">
            <Atoms.FloatingCartRibbon />
          </Item>
        </Section>

        {/* GIFTEE — CREATE & MANAGE */}
        <Section
          title="Giftee · Create & Manage"
          subtitle="Building the registry: occasion form, date picker, delivery, themed background, share."
        >
          <Item label="FormFields — text · address · leave-at-door · occasion">
            <LiveFormFields />
          </Item>
          <Item label="DateInput — occasion date picker (July 2026)">
            <div style={{ width: 351 }}>
              <DateInput
                month={JULY(1)}
                today={JULY(15)}
                markedDates={[JULY(2), JULY(6), JULY(8)]}
                onConfirm={() => {}}
                onClose={() => {}}
              />
            </div>
          </Item>
          <Item label="DeliveryDetails — minimised · expanded (live)">
            <DeliveryDetails variant="minimised" />
            <LiveDeliveryDetails />
          </Item>
          <Item label="BirthdayBackground — occasion theming">
            <div style={{ width: 300, height: 333, borderRadius: radius[16], overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.14)' }}>
              <BirthdayBackground width={300} height={333} />
            </div>
          </Item>
          <Item label="ShareSheet — share the registry">
            <ShareSheet title="Prasanna’s Birthday" itemCount={13} onShare={() => {}} />
          </Item>
          <Item label="AddressSheet — creator · gifter">
            <AddressSheet variant="creator" />
            <AddressSheet variant="gifter" />
          </Item>
          <Item label="ExploreCuratedGifts — curated category rail">
            <ExploreCuratedGifts onSelectCategory={() => {}} />
          </Item>
          <Item label="ConfirmationBottomsheet — mark-purchased · deactivate · delete · marked-mistake">
            <ConfirmationBottomsheet variant="mark-purchased" onConfirm={() => {}} />
            <ConfirmationBottomsheet variant="deactivate" onConfirm={() => {}} />
            <ConfirmationBottomsheet variant="delete" onConfirm={() => {}} />
            <ConfirmationBottomsheet variant="marked-mistake" onConfirm={() => {}} />
          </Item>
        </Section>

        {/* GIFTER — VIEW & RESERVE */}
        <Section
          title="Gifter · View & Reserve"
          subtitle="The shared registry: product cards, gift status, availability, add-to-bag."
        >
          <Item label="GifterCard — default · in-bag (live) · purchased · out-of-order · list-closed">
            <LiveGifterCard {...AIRPODS} initialState="default" />
            <LiveGifterCard {...AIRPODS} initialState="in-bag" />
            <GifterCard {...BATHMAT} state="purchased" />
            <GifterCard {...BATHMAT} state="out-of-order" />
            <GifterCard {...AIRPODS} state="list-closed" />
          </Item>
          <Item label="CreatorCard — default · ordered · purchased · out-of-stock · stepper (live) · locked">
            <CreatorCard variant="default" {...CREATOR_AIRPODS} />
            <CreatorCard variant="ordered" {...CREATOR_AIRPODS} />
            <CreatorCard variant="purchased" {...CREATOR_MAT} />
            <CreatorCard variant="outOfStock" {...CREATOR_AIRPODS} />
            <LiveCreatorStepper />
            <CreatorCard variant="stepperLocked" {...CREATOR_AIRPODS} />
          </Item>
          <Item label="GiftStatusBadge — available · reserved · purchased">
            <GiftStatusBadge status="available" />
            <GiftStatusBadge status="reserved" />
            <GiftStatusBadge status="purchased" />
          </Item>
          <Item label="ExplorableCard — PDP product card · Add to Gift Cart · purchased">
            <ExplorableCard />
            <ExplorableCard purchased />
          </Item>
        </Section>

        {/* PRIMITIVES — MOLECULES */}
        <Section
          title="Primitives · Molecules"
          subtitle="The gift-registry order & post-purchase tiles, ported 1:1 from React Native (was localhost:3635)."
        >
          <Item label="ActiveOrderCard — Processing · Confirmed · Packed · Dispatched">
            <Molecules.ActiveOrderCard status="Processing" />
            <Molecules.ActiveOrderCard status="Confirmed" />
            <Molecules.ActiveOrderCard status="Packed" />
            <Molecules.ActiveOrderCard status="Dispatched" />
          </Item>
          <Item label="ActiveOrderCard — OFD (Default) · OFD + Delivery PIN">
            <Molecules.ActiveOrderCard status="OFD" ofdType="Default" />
            <Molecules.ActiveOrderCard status="OFD" ofdType="DelCode" />
          </Item>
          <Item label="OtherGiftStates — Delivered · Purchased · All edge cases">
            <Molecules.OtherGiftStates property1="Delivered" />
            <Molecules.OtherGiftStates property1="Purchased" />
            <Molecules.OtherGiftStates property1="All edge cases" />
          </Item>
          <Item label="NeutralButton — H48 inline · H52 full-width">
            <NeutralButton label="Search gifts" size="H48" onPress={() => {}} />
            <div style={{ width: 343 }}>
              <NeutralButton label="Share Gift List" size="H52" fullWidth onPress={() => {}} />
            </div>
          </Item>
        </Section>

        {/* ORDER TRACKING */}
        <Section
          title="Order Tracking"
          subtitle="Post-purchase: active order cards, status bars, image wells, tags."
        >
          <Item label="ActiveOrderCard — single & multiple items">
            <ActiveOrderCard
              senderName="John Doe"
              arrivingLabel="May 19 - 24"
              itemsLabel="1 item"
              statusLabel="Processing"
              deliveryTag="On time"
              express
              imagesVariant="Multi count"
              style={{ width: 340 }}
            />
            <ActiveOrderCard
              senderName="Sara"
              arrivingLabel="May 20 - 25"
              itemsLabel="2 items"
              statusLabel="Shipped"
              deliveryTag="On time"
              imagesVariant="2"
              style={{ width: 340 }}
            />
          </Item>
          <Item label="OrderStatusBar — multiple · single · allDelivered · gifter">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[24], width: 375 }}>
              <OrderStatusBar variant="multiple" />
              <OrderStatusBar variant="single" />
              <OrderStatusBar variant="allDelivered" />
              <OrderStatusBar variant="gifter" />
            </div>
          </Item>
          <Item label="ActiveOrderImages — single (with qty) · stacked pair">
            <Atoms.ActiveOrderImages variant="Multi count" />
            <Atoms.ActiveOrderImages variant="2" />
          </Item>
          <Item label="StatusTags — On time · Delayed · Cancellation · On hold">
            <Atoms.StatusTags status="On time" />
            <Atoms.StatusTags status="Delayed" />
            <Atoms.StatusTags status="Cancellation" />
            <Atoms.StatusTags status="On hold" />
          </Item>
          <Item label="MarketplaceTagsPills — express">
            <Atoms.MarketplaceTagsPills tag="express" />
          </Item>
        </Section>

        {/* HEADERS & FULL SCREENS */}
        <Section
          title="Headers & Full Screens"
          subtitle="Occasion hero headers and the assembled end-to-end screens that compose the atoms, molecules and sheets above."
        >
          <Item label="PageHeaderHero — receiver · gifter · creator">
            <PageHeaderHero variant="receiver" onBack={() => {}} onViewAll={() => {}} onPreferences={() => {}} />
            <PageHeaderHero variant="gifter" onBack={() => {}} onChangeAddress={() => {}} />
            <PageHeaderHero variant="creator" onBack={() => {}} onPreferences={() => {}} />
          </Item>
          <Item label="CreatorHeader — birthday pink hero">
            <CreatorHeader onBack={() => {}} onPreferences={() => {}} />
          </Item>
          <Item label="CreatorEmptyState — list creator · empty">
            <CreatorEmptyState onBack={() => {}} onSearchGifts={() => {}} />
          </Item>
          <Item label="CreatorHome — list creator · full view">
            <CreatorHome onBack={() => {}} onShare={() => {}} />
          </Item>
          <Item label="CreateGiftList — occasion creation flow">
            <CreateGiftList />
          </Item>
          <Item label="GiftListDetails — registry details sheet">
            <GiftListDetails />
          </Item>
          <Item label="RegistrySettings — manage registry">
            <RegistrySettings onBack={() => {}} />
          </Item>
        </Section>

        {/* STICKY CTA — pinned to viewport */}
        <StickyBottom label="Create Registry" onPress={() => {}} />
      </div>
    </div>
  );
}
