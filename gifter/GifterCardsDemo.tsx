import { useState } from 'react';
import { GifterCard } from '../src/components';
import type { GifterCardProps, GifterCardState } from '../src/components';
import { colour, space } from '../src/field-ds';
import airpods from '../src/components/assets/gifter-card/product-airpods.png';
import bathmat from '../src/components/assets/gifter-card/product-bathmat.png';

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

// Consumer-side state: GifterCard stays controlled (props-in/callbacks-out),
// so the demo owns the add-to-bag → stepper transition and quantity.
function InteractiveGifterCard({
  initialState = 'default',
  initialQuantity = 1,
  ...props
}: Omit<GifterCardProps, 'state' | 'quantity'> & {
  initialState?: GifterCardState;
  initialQuantity?: number;
}) {
  const [state, setState] = useState<GifterCardState>(initialState);
  const [quantity, setQuantity] = useState(initialQuantity);

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

export default function GifterCardsDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space[40],
      }}
    >
      <div style={{ display: 'flex', gap: space[16], flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>
        <InteractiveGifterCard {...AIRPODS} initialState="default" />
        <InteractiveGifterCard {...AIRPODS} initialState="in-bag" initialQuantity={1} />
        <GifterCard {...BATHMAT} state="purchased" />
        <GifterCard {...BATHMAT} state="out-of-order" />
        <GifterCard {...AIRPODS} state="list-closed" />
      </div>
    </div>
  );
}
