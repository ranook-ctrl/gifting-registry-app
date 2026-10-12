// Import the component file directly (not the ../src/components barrel) so this
// demo keeps working while other sessions edit unrelated components in the barrel.
import { GiftListCard, type GiftListCardProduct } from "../src/components/GiftListCard";
import { colour, fontFamily } from "../src/field-ds";

import activeP1 from "../src/components/assets/gift-list-card/product_active_1.png";
import activeP2 from "../src/components/assets/gift-list-card/product_active_2.png";
import activeP3 from "../src/components/assets/gift-list-card/product_active_3.png";
import activeP4 from "../src/components/assets/gift-list-card/product_active_4.png";
import inactiveP1 from "../src/components/assets/gift-list-card/product_inactive_1.png";
import inactiveP2 from "../src/components/assets/gift-list-card/product_inactive_2.png";
import inactiveP3 from "../src/components/assets/gift-list-card/product_inactive_3.png";
import inactiveP4 from "../src/components/assets/gift-list-card/product_inactive_4.png";

const ACTIVE_PRODUCTS: GiftListCardProduct[] = [
  { src: activeP1 },
  { src: activeP2 },
  { src: activeP3 },
  { src: activeP4 },
];

const INACTIVE_PRODUCTS: GiftListCardProduct[] = [
  { src: inactiveP1, fit: "contain", blend: "darken" },
  { src: inactiveP2, fit: "contain" },
  { src: inactiveP3, fit: "contain", inset: 16 },
  { src: inactiveP4 },
];

function Caption({ children }: { children: string }) {
  return (
    <div
      style={{
        ...fontFamily.medium,
        fontSize: 13,
        lineHeight: "20px",
        letterSpacing: -0.1,
        color: colour["text-n-icon"].muted,
      }}
    >
      {children}
    </div>
  );
}

export default function GiftListCardsDemo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        background: colour.surface.secondary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 16px",
        gap: 40,
      }}
    >
      <div
        style={{
          ...fontFamily.bold,
          fontSize: 20,
          lineHeight: "28px",
          letterSpacing: -0.25,
          color: colour["text-n-icon"].primary,
        }}
      >
        Gift List cards
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Caption>Active</Caption>
        <GiftListCard
          variant="active"
          title="Prasanna’s Birthday"
          subtitle="19 July’26 • 9 Items"
          newGiftsLabel="2 new gifts"
          products={ACTIVE_PRODUCTS}
          onOpen={() => console.log("open: active list")}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Caption>Inactive</Caption>
        <GiftListCard
          variant="inactive"
          title="Anisha’s Birthday"
          subtitle="03 May’26 • 19 Items"
          giftCount={5}
          statusLabel="Closed"
          products={INACTIVE_PRODUCTS}
          onOpen={() => console.log("open: inactive list")}
        />
      </div>
    </div>
  );
}
