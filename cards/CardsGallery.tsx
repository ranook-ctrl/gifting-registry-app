import { useEffect, useRef, useState } from "react";
import { CreatorCard, type CreatorCardVariant } from "../src/components";
import { colour } from "../src/field-ds";

const AIRPODS = "/assets/airpods.png";
const RUG = "/assets/rug.png";

const AIRPODS_PRODUCT = {
  imageUrl: AIRPODS,
  name: "Apple Airpods Pro 2 Wireless Earbuds",
  sellingPrice: "899",
  listedPrice: "1399",
  discount: "33%",
};

const cards: Array<{
  label: string;
  variant: CreatorCardVariant;
  props: React.ComponentProps<typeof CreatorCard>;
}> = [
  { label: "Default", variant: "default", props: { variant: "default", ...AIRPODS_PRODUCT } },
  { label: "Ordered", variant: "ordered", props: { variant: "ordered", ...AIRPODS_PRODUCT } },
  { label: "Purchased", variant: "purchased", props: {
      variant: "purchased",
      imageUrl: RUG,
      name: "Roseate Birch Super Soft (40x60 cm) Microfiber 2000 GSM Bath Mat Super ",
      sellingPrice: "24",
      listedPrice: "99",
      discount: "33%",
    } },
  { label: "Out of Stock", variant: "outOfStock", props: { variant: "outOfStock", ...AIRPODS_PRODUCT } },
  { label: "Stepper", variant: "stepper", props: { variant: "stepper", ...AIRPODS_PRODUCT } },
  { label: "Stepper — locked", variant: "stepperLocked", props: { variant: "stepperLocked", ...AIRPODS_PRODUCT } },
];

export function CardsGallery() {
  // Live quantity for the interactive stepper card: minimum 1, no upper limit.
  const [stepperQty, setStepperQty] = useState(1);

  // Default card: tapping the QTY badge reveals the stepper, which reverts to
  // the badge after 4s of no tapping. Quantity is shared across both views.
  const [defaultQty, setDefaultQty] = useState(1);
  const [defaultAsStepper, setDefaultAsStepper] = useState(false);
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const armRevert = () => {
    if (revertTimer.current) clearTimeout(revertTimer.current);
    revertTimer.current = setTimeout(() => setDefaultAsStepper(false), 4000);
  };
  useEffect(() => () => {
    if (revertTimer.current) clearTimeout(revertTimer.current);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colour.surface.tertiary,
        padding: 48,
        fontFamily: '"Noontree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colour["text-n-icon"].primary, margin: 0 }}>
        Creator Cards
      </h1>
      <p style={{ fontSize: 14, color: colour["text-n-icon"].tertiary, marginTop: 4, marginBottom: 32 }}>
        Field DS · Gifting Registry · all 6 variants
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
        {cards.map((c) => {
          let liveProps: Partial<React.ComponentProps<typeof CreatorCard>> = {};

          if (c.variant === "stepper") {
            liveProps = {
              quantity: stepperQty,
              onIncrement: () => setStepperQty((q) => q + 1),
              onDecrement: () => setStepperQty((q) => Math.max(1, q - 1)),
            };
          } else if (c.variant === "default") {
            liveProps = defaultAsStepper
              ? {
                  variant: "stepper",
                  quantity: defaultQty,
                  onIncrement: () => {
                    setDefaultQty((q) => q + 1);
                    armRevert();
                  },
                  onDecrement: () => {
                    setDefaultQty((q) => Math.max(1, q - 1));
                    armRevert();
                  },
                }
              : {
                  quantity: defaultQty,
                  onQtyPress: () => {
                    setDefaultAsStepper(true);
                    armRevert();
                  },
                };
          }

          return (
            <div key={c.variant} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: colour["text-n-icon"].secondary }}>
                {c.label}
              </span>
              <CreatorCard {...c.props} {...liveProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
