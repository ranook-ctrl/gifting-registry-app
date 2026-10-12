import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Header, { type WishlistHeaderTab } from "./Header";
import CollectionCard from "./CollectionCard";
import ProductCard from "./ProductCard";
import WishlistSkeleton from "./WishlistSkeleton";
import ToastCard from "./ToastCard";
import { GiftListsEmptyState } from "../../src/components";

import homeDecorBack from "../assets/collections/home-decor-1.png";
import homeDecorMiddle from "../assets/collections/home-decor-2.png";
import homeDecorFront from "../assets/collections/home-decor-3.png";
import birthdayMiddle from "../assets/collections/birthday-1.png";
import birthdayFront from "../assets/collections/birthday-2.png";
import sneakersFront from "../assets/collections/sneakers-1.png";

import airpodsImg from "../assets/products/airpods.png";
import washingMachineImg from "../assets/products/washing-machine.png";
import phoneCaseImg from "../assets/products/phonecase.png";
import chargerImg from "../assets/products/charger.png";
import sneakerImg from "../assets/products/sneaker.png";
import bottleImg from "../assets/products/bottle.png";

const collections = [
  {
    name: "Home decor",
    itemCount: 9,
    assets: {
      back: homeDecorBack,
      middle: homeDecorMiddle,
      front: homeDecorFront,
    },
  },
  {
    name: "Adyuu’s Birthday",
    itemCount: 2,
    assets: {
      middle: birthdayMiddle,
      front: birthdayFront,
    },
  },
  {
    name: "Sneakers",
    itemCount: 1,
    assets: {
      front: sneakersFront,
    },
  },
];

type ProductData = {
  image: string;
  name: string;
  rating: number;
  ratingCount: number;
  sellingPrice: string;
  listedPrice: string;
  discount: string;
};

const products: ProductData[] = [
  {
    image: airpodsImg,
    name: "Apple Airpods Pro 2 Wireless Earbuds",
    rating: 4.5,
    ratingCount: 128,
    sellingPrice: "899",
    listedPrice: "1399",
    discount: "33%",
  },
  {
    image: washingMachineImg,
    name: "Whirlpool 7 kg Fully automatic Magic Clean",
    rating: 4.3,
    ratingCount: 412,
    sellingPrice: "899",
    listedPrice: "1399",
    discount: "33%",
  },
  {
    image: phoneCaseImg,
    name: "MAYNOS Suction Phone Case Mount",
    rating: 4.1,
    ratingCount: 89,
    sellingPrice: "129",
    listedPrice: "199",
    discount: "35%",
  },
  {
    image: chargerImg,
    name: "Anker 65W USB-C Fast Wall Charger",
    rating: 4.7,
    ratingCount: 256,
    sellingPrice: "199",
    listedPrice: "299",
    discount: "33%",
  },
  {
    image: sneakerImg,
    name: "Air Jordan 1 Mid 'Yellow Toe' Sneakers",
    rating: 4.4,
    ratingCount: 167,
    sellingPrice: "549",
    listedPrice: "799",
    discount: "31%",
  },
  {
    image: bottleImg,
    name: "Stanley Quencher Insulated Water Bottle",
    rating: 4.6,
    ratingCount: 94,
    sellingPrice: "149",
    listedPrice: "229",
    discount: "35%",
  },
];

type RemovedToast = { id: number; image: string };

export type WishlistPageProps = {
  /** Fires from both create entry points (header "+" and the Gift-lists CTA). */
  onCreateList?: () => void;
  /** Fill the parent height instead of the fixed 812 device-frame height. */
  fill?: boolean;
};

export default function WishlistPage({ onCreateList, fill = false }: WishlistPageProps = {}) {
  const rootClass =
    "relative mx-auto flex w-[375px] flex-col overflow-hidden bg-surface-primary font-primary " +
    (fill ? "h-full" : "h-[812px]");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(() =>
    products.map((p, i) => ({ ...p, id: `p${i}` })),
  );
  const [toasts, setToasts] = useState<RemovedToast[]>([]);
  const [tab, setTab] = useState<WishlistHeaderTab>("wishlists");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const addToCart = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const increment = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const decrement = (id: string) =>
    setCart((c) => {
      const next = (c[id] ?? 0) - 1;
      const copy = { ...c };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });

  const removeItem = (id: string) => {
    const item = items.find((p) => p.id === id);
    if (!item) return;
    // Card goes away…
    setItems((prev) => prev.filter((p) => p.id !== id));
    // …and the "removed" toast slides in, stays 4s, then slides out.
    const toastId = Date.now() + Math.random();
    setToasts([{ id: toastId, image: item.image }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  };

  if (loading) {
    return (
      <div className={rootClass}>
        <WishlistSkeleton />
      </div>
    );
  }

  if (tab === "giftlists") {
    return (
      <div className={rootClass}>
        <Header activeTab={tab} onTabChange={setTab} onCreate={onCreateList} />
        {/* Gift Lists landing (Figma 1599:915021) — empty state over the tile-grid BG */}
        <div className="relative min-h-0 flex-1">
          <GiftListsEmptyState onCreate={onCreateList} />
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <Header activeTab={tab} onTabChange={setTab} onCreate={onCreateList} />

      <div className="flex flex-1 min-h-0 flex-col gap-8 overflow-y-auto pt-4">
        <div className="flex shrink-0 items-center gap-[19px] overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Collection drill-in (CollectionPage in the source repo) isn't ported
              yet — cards render non-interactive until it is. */}
          {collections.map((c) => (
            <CollectionCard
              key={c.name}
              name={c.name}
              itemCount={c.itemCount}
              assets={c.assets}
            />
          ))}
        </div>

        <div className="flex shrink-0 flex-col">
          <div className="flex items-center justify-between px-4 pb-3">
            <h2 className="font-primary text-[16px] font-bold leading-5 text-text-primary tracking-[-0.16px]">
              All Saved Items
            </h2>
            <button
              type="button"
              className="flex items-center justify-center rounded-full bg-surface-tertiary px-3 py-1.5"
            >
              <span className="font-primary text-l3 font-semibold text-text-primary opacity-80">
                Select
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-[15px] px-4 pt-3">
            <AnimatePresence mode="popLayout">
              {items.map((p) => {
                const qty = cart[p.id] ?? 0;
                const variant = qty > 0 ? "added-to-cart" : "default";
                return (
                  <motion.div
                    key={p.id}
                    layout
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard
                      variant={variant}
                      image={p.image}
                      name={p.name}
                      rating={p.rating}
                      ratingCount={p.ratingCount}
                      sellingPrice={p.sellingPrice}
                      listedPrice={p.listedPrice}
                      discount={p.discount}
                      quantity={qty}
                      onWishlistToggle={() => removeItem(p.id)}
                      onAddToCart={() => addToCart(p.id)}
                      onIncrement={() => increment(p.id)}
                      onDecrement={() => decrement(p.id)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Removed-item toast: slides in, stays 4s, slides out */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-2">
        <AnimatePresence mode="wait">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className="pointer-events-auto relative"
              initial={{ y: "140%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "140%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 bg-gradient-to-b from-black/0 to-black/20"
              />
              <div className="relative">
                <ToastCard
                  variant="removed"
                  image={t.image}
                  destination="All Items"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
