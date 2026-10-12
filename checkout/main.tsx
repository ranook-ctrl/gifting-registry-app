import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import { CheckoutPage, GifterHome } from "../src/components";
import type { ActiveOrderCardProps } from "../src/components";

// Post-checkout "You have sent a gift" status card shown in the Gifter hero
// once the order is placed (Figma node 1379:1050777).
const SENT_GIFT_ORDER: ActiveOrderCardProps = {
  senderName: "You",
  senderSuffix: "have sent a gift",
  arrivingLabel: "May 19 - 24",
  itemsLabel: "2 items",
  statusLabel: "Processing",
  deliveryTag: "On time",
  express: true,
  imagesVariant: "2",
};

// Prototype loop between the Checkout page and the Gifter flow:
//  • checkout → ENTER CVV  → gifter home with the "sent a gift" status card
//  • checkout → back       → gifter home (browsing)
//  • gifter   → back       → checkout page
function CheckoutFlow() {
  const [screen, setScreen] = useState<"checkout" | "gifter">("checkout");
  const [sentGift, setSentGift] = useState(false);

  if (screen === "gifter") {
    return (
      <GifterHome
        statusOrder={sentGift ? SENT_GIFT_ORDER : undefined}
        onBack={() => setScreen("checkout")}
      />
    );
  }

  return (
    <CheckoutPage
      onBack={() => {
        setSentGift(false);
        setScreen("gifter");
      }}
      onSubmit={() => {
        setSentGift(true);
        setScreen("gifter");
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#e9eaf0",
        padding: 24,
      }}
    >
      <CheckoutFlow />
    </div>
    <Retune force />
  </React.StrictMode>
);
