import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  weight?: string;
  rating: number;
  reviews: number;
  price: string;
  originalPrice?: string;
  discount?: string;
  badge?: "Best Seller" | "Top Rated" | "New";
  bg: string;
  imgPlaceholder: string;
}

interface Category {
  id: number;
  label: string;
  icon: string;
  bg: string;
}

interface OfferBanner {
  id: number;
  title: string;
  subtitle: string;
  bg: string;
  textColor: string;
  accentColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const topCategories: Category[] = [
  { id: 1, label: "Beauty & Skin Care", icon: "💄", bg: "#FFF0F5" },
  { id: 2, label: "Home & Kitchen", icon: "🏠", bg: "#F0F8FF" },
  { id: 3, label: "Electronics", icon: "⚡", bg: "#FFFFF0" },
  { id: 4, label: "Hair Care", icon: "💇", bg: "#F5F0FF" },
  { id: 5, label: "Toys", icon: "🎮", bg: "#F0FFF4" },
  { id: 6, label: "Appliances", icon: "🧊", bg: "#FFF5F0" },
  { id: 7, label: "Hall Time", icon: "⏰", bg: "#F0F5FF" },
  { id: 8, label: "Shop", icon: "🛍️", bg: "#FFF0FF" },
];

const shopCategories: Category[] = [
  { id: 1, label: "Beauty & Skin Care", icon: "💄", bg: "#FFF0F5" },
  { id: 2, label: "Home & Kitchen", icon: "🏠", bg: "#F0F8FF" },
  { id: 3, label: "Electronics", icon: "⚡", bg: "#FFFFF0" },
  { id: 4, label: "Hair Care", icon: "💇", bg: "#F5F0FF" },
  { id: 5, label: "Toys", icon: "🎮", bg: "#F0FFF4" },
];

const recommendedProducts: Product[] = [
  {
    id: 1,
    name: "Apple Airpods Pro 2 Wireless Earbuds",
    rating: 4.1,
    reviews: 12,
    price: "AED 929",
    originalPrice: "AED 1,299",
    discount: "28%",
    badge: "Best Seller",
    bg: "#F0F4FF",
    imgPlaceholder: "🎧",
  },
  {
    id: 2,
    name: "Whirlpool 7 kg Top Load Washing Machine",
    weight: "7 kg",
    rating: 4.3,
    reviews: 87,
    price: "AED 1,199",
    originalPrice: "AED 1,599",
    discount: "25%",
    badge: "Top Rated",
    bg: "#F0FFF4",
    imgPlaceholder: "🫧",
  },
  {
    id: 3,
    name: "MAXCO Phone Case iPhone 15 Pro Max",
    rating: 3.9,
    reviews: 34,
    price: "AED 49",
    originalPrice: "AED 79",
    discount: "38%",
    bg: "#FFF5F0",
    imgPlaceholder: "📱",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Wireless Headphones",
    rating: 4.7,
    reviews: 203,
    price: "AED 1,049",
    originalPrice: "AED 1,499",
    discount: "30%",
    badge: "Best Seller",
    bg: "#F5F5FF",
    imgPlaceholder: "🎵",
  },
];

const offerBanners: OfferBanner[] = [
  {
    id: 1,
    title: "10% Cashback",
    subtitle: "On Beauty & Skin Care",
    bg: "#FEE000",
    textColor: "#1A1A1A",
    accentColor: "#FF6B00",
  },
  {
    id: 2,
    title: "Dash Delivery",
    subtitle: "Get it in under 2 hours",
    bg: "#1A1A2E",
    textColor: "#FFFFFF",
    accentColor: "#FEE000",
  },
  {
    id: 3,
    title: "10% Off",
    subtitle: "On your first noon order",
    bg: "#FF4757",
    textColor: "#FFFFFF",
    accentColor: "#FFE56B",
  },
];

const megaDealsProducts: Product[] = [
  {
    id: 1,
    name: "Apple Airpods Pro 2 Wireless Earbuds",
    rating: 4.1,
    reviews: 12,
    price: "AED 2,100",
    originalPrice: "AED 2,900",
    discount: "28%",
    bg: "#F0F4FF",
    imgPlaceholder: "🎧",
  },
  {
    id: 2,
    name: "Apple Airpods Pro 2 Wireless Earbuds",
    rating: 4.1,
    reviews: 12,
    price: "AED 2,299",
    originalPrice: "AED 3,200",
    discount: "28%",
    bg: "#F0F4FF",
    imgPlaceholder: "🎧",
  },
  {
    id: 3,
    name: "Apple Airpods Pro 2 Wireless Earbuds",
    rating: 4.5,
    reviews: 67,
    price: "AED 1,899",
    originalPrice: "AED 2,499",
    discount: "24%",
    bg: "#EFF9F0",
    imgPlaceholder: "🎧",
  },
];

const bestsellerProducts: Product[] = [
  {
    id: 1,
    name: "Apple Airpods Pro 2 Wireless Earbuds",
    rating: 4.1,
    reviews: 12,
    price: "AED 929",
    originalPrice: "AED 1,299",
    discount: "28%",
    badge: "Best Seller",
    bg: "#F0F4FF",
    imgPlaceholder: "🎧",
  },
  {
    id: 2,
    name: "Whirlpool 7 kg Top Load",
    weight: "7 kg",
    rating: 4.3,
    reviews: 87,
    price: "AED 1,199",
    bg: "#F0FFF4",
    imgPlaceholder: "🫧",
  },
  {
    id: 3,
    name: "MAXCO Phone Case",
    rating: 3.9,
    reviews: 34,
    price: "AED 49",
    bg: "#FFF5F0",
    imgPlaceholder: "📱",
  },
];

const keepShoppingItems = [
  { id: 1, label: "Playstation 4", icon: "🎮", bg: "#EEF0FF" },
  { id: 2, label: "Adidas Rivalry", icon: "👟", bg: "#FFF5F0" },
  { id: 3, label: "Body service", icon: "🧴", bg: "#F0FFF4" },
];

const sellingOutProducts: Product[] = [
  {
    id: 1,
    name: "Apple Airpods Pro 2 Wireless Earbuds",
    rating: 4.1,
    reviews: 12,
    price: "AED 929",
    originalPrice: "AED 1,299",
    discount: "28%",
    badge: "Best Seller",
    bg: "#F0F4FF",
    imgPlaceholder: "🎧",
  },
  {
    id: 2,
    name: "Whirlpool 7 kg Top Load",
    rating: 4.3,
    reviews: 87,
    price: "AED 1,199",
    originalPrice: "AED 1,599",
    discount: "25%",
    bg: "#F0FFF4",
    imgPlaceholder: "🫧",
  },
  {
    id: 3,
    name: "MAXCO Phone Case",
    rating: 3.9,
    reviews: 34,
    price: "AED 49",
    bg: "#FFF5F0",
    imgPlaceholder: "📱",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-2.5 h-2.5"
          viewBox="0 0 12 12"
          fill={star <= Math.round(rating) ? "#FFA500" : "#E0E0E0"}
        >
          <path d="M6 1l1.4 2.8 3.1.5-2.25 2.18.53 3.07L6 8.1 3.22 9.55l.53-3.07L1.5 4.3l3.1-.5z" />
        </svg>
      ))}
      <span className="text-[10px] text-gray-500 ml-0.5">({rating})</span>
    </div>
  );
}

function ProductBadge({ badge }: { badge: string }) {
  const colors: Record<string, string> = {
    "Best Seller": "bg-[#FEE000] text-[#1A1A1A]",
    "Top Rated": "bg-[#1A1A2E] text-white",
    New: "bg-[#00C853] text-white",
  };
  return (
    <span
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${colors[badge] ?? "bg-gray-200 text-gray-700"}`}
    >
      {badge}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex-none w-[148px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image area */}
      <div
        className="relative h-[130px] flex items-center justify-center"
        style={{ backgroundColor: product.bg }}
      >
        {product.badge && (
          <div className="absolute top-2 left-2">
            <ProductBadge badge={product.badge} />
          </div>
        )}
        {product.discount && (
          <div className="absolute top-2 right-2 bg-[#FF4757] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
            -{product.discount}
          </div>
        )}
        <span className="text-5xl">{product.imgPlaceholder}</span>
        {/* Add to wishlist */}
        <button className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info area */}
      <div className="p-2.5 space-y-1.5">
        <p className="text-[11px] text-gray-800 leading-tight line-clamp-2 font-medium">
          {product.name}
        </p>
        {product.weight && (
          <p className="text-[10px] text-gray-400">{product.weight}</p>
        )}
        <StarRating rating={product.rating} />
        <div>
          <p className="text-sm font-bold text-gray-900">{product.price}</p>
          {product.originalPrice && (
            <p className="text-[10px] text-gray-400 line-through">
              {product.originalPrice}
            </p>
          )}
        </div>
        <button className="w-full bg-[#FEE000] text-[#1A1A1A] text-[11px] font-bold py-1.5 rounded-lg">
          Add to Basket
        </button>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="text-[15px] font-bold text-gray-900">{title}</h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1 text-[12px] text-gray-500"
        >
          See all
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewHomepage() {
  const [activeTab, setActiveTab] = useState(0);
  const [, setSearchQuery] = useState("");

  const bottomNavItems = [
    {
      label: "Home",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: "Categories",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      label: "Bag",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: "Favourites",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      label: "Account",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative flex flex-col bg-[#F5F5F5] w-[390px] min-h-screen mx-auto overflow-hidden font-sans">

      {/* ── Status Bar ── */}
      <div className="bg-[#1A1A1A] flex justify-between items-center px-5 pt-3 pb-1">
        <span className="text-white text-xs font-semibold">12:21</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex items-center">
            <div className="w-5 h-2.5 rounded-sm border border-white flex items-center px-0.5">
              <div className="h-1.5 w-3.5 bg-white rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* ── App Header ── */}
      <div className="bg-[#1A1A1A] px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo group */}
          <div className="flex items-center gap-2">
            {/* noon logo */}
            <div className="flex items-center">
              <span className="text-[#FEE000] font-black text-xl tracking-tight">noon</span>
            </div>
            <div className="w-px h-5 bg-gray-600" />
            {/* super */}
            <div className="bg-[#2D1B69] rounded px-1.5 py-0.5">
              <span className="text-white text-[10px] font-bold">super</span>
            </div>
            {/* noon food */}
            <div className="bg-[#FF4136] rounded px-1.5 py-0.5">
              <span className="text-white text-[10px] font-bold">noon food</span>
            </div>
          </div>
          {/* Right icons */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#FEE000] text-[#1A1A1A] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                15
              </span>
            </div>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-[#1A1A1A] px-4 pb-3">
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for 'Playstation 5™'"
              className="flex-1 text-[12px] text-gray-500 bg-transparent outline-none placeholder-gray-400"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="w-4 h-4 text-gray-400 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <button className="bg-[#FEE000] rounded-xl px-3 py-2.5">
            <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto pb-20">

        {/* ── Welcome Banner ── */}
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden">
          <div
            className="relative flex items-center justify-between px-4 py-4"
            style={{
              background: "linear-gradient(135deg, #FEE000 0%, #FFD000 60%, #FFBA00 100%)",
            }}
          >
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-[#7A5800] uppercase tracking-wide">
                Welcome back
              </p>
              <h1 className="text-[18px] font-black text-[#1A1A1A] leading-tight mt-0.5">
                Shop & Save<br />up to 40% off
              </h1>
              <button className="mt-2.5 bg-[#1A1A1A] text-white text-[11px] font-bold px-4 py-1.5 rounded-full">
                Shop Now
              </button>
            </div>
            {/* Promo visual */}
            <div className="w-28 h-24 flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center">
                  <span className="text-4xl">🎧</span>
                </div>
                <div className="absolute -top-1 -right-1 bg-[#FF4757] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  40% OFF
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 10% Cashback Strip ── */}
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="bg-[#FEE000] px-4 py-2 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-black text-[#1A1A1A]">10% cashback</p>
              <p className="text-[10px] text-[#7A5800]">On every E-Commerce spends</p>
            </div>
            <div className="flex items-center gap-1 bg-[#1A1A1A]/10 rounded-full px-2 py-1">
              <svg className="w-3 h-3 text-[#7A5800]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-[9px] font-bold text-[#1A1A1A]">3 hrs &amp; 13 min</span>
            </div>
          </div>
          <div className="flex overflow-x-auto px-3 py-3 gap-3 scrollbar-none">
            {topCategories.map((cat) => (
              <button key={cat.id} className="flex-none flex flex-col items-center gap-1 w-14">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: cat.bg }}
                >
                  {cat.icon}
                </div>
                <span className="text-[9px] text-gray-600 text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Shop by Category ── */}
        <div className="mt-4">
          <SectionHeader title="Shop by category" onSeeAll={() => {}} />
          <div className="flex overflow-x-auto px-4 gap-3 pb-1 scrollbar-none">
            {shopCategories.map((cat) => (
              <button key={cat.id} className="flex-none flex flex-col items-center gap-1.5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: cat.bg }}
                >
                  {cat.icon}
                </div>
                <span className="text-[10px] text-gray-600 text-center font-medium">
                  {cat.label.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Recommended for you ── */}
        <div className="mt-4">
          <SectionHeader title="Recommended for you" onSeeAll={() => {}} />
          <div className="flex overflow-x-auto px-4 gap-3 pb-1 scrollbar-none">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* ── Offers for you ── */}
        <div className="mt-4">
          <SectionHeader title="Offers for you" onSeeAll={() => {}} />
          {/* Banner row */}
          <div className="flex overflow-x-auto px-4 gap-3 pb-3 scrollbar-none">
            {offerBanners.map((banner) => (
              <div
                key={banner.id}
                className="flex-none w-[160px] h-[80px] rounded-2xl flex flex-col justify-center px-4 cursor-pointer"
                style={{ backgroundColor: banner.bg }}
              >
                <p
                  className="text-[14px] font-black leading-tight"
                  style={{ color: banner.textColor }}
                >
                  {banner.title}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: banner.accentColor }}
                >
                  {banner.subtitle}
                </p>
              </div>
            ))}
          </div>
          {/* Products */}
          <div className="flex overflow-x-auto px-4 gap-3 pb-1 scrollbar-none">
            {recommendedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* ── Mega Deals ── */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-black text-gray-900">Mega Deals</h2>
              {/* Timer */}
              <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-full px-2.5 py-1">
                <svg className="w-3 h-3 text-[#FEE000]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-bold text-white">E 15 : 30m</span>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[12px] text-gray-500">
              See all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 gap-3 pb-1 scrollbar-none">
            {megaDealsProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* ── Bestsellers ── */}
        <div className="mt-4">
          <SectionHeader title="Bestsellers" onSeeAll={() => {}} />
          <div className="flex overflow-x-auto px-4 gap-3 pb-1 scrollbar-none">
            {bestsellerProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* ── Keep shopping for ── */}
        <div className="mt-4">
          <SectionHeader title="Keep shopping for" onSeeAll={() => {}} />
          <div className="flex overflow-x-auto px-4 gap-3 pb-1 scrollbar-none">
            {keepShoppingItems.map((item) => (
              <button
                key={item.id}
                className="flex-none flex flex-col items-center gap-2 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] font-medium text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Selling out fast ── */}
        <div className="mt-4 mb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-[15px] font-black text-gray-900">Selling out fast</h2>
            <button className="flex items-center gap-1 text-[12px] text-gray-500">
              See all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 gap-3 pb-1 scrollbar-none">
            {sellingOutProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {/* Promo card */}
            <div
              className="flex-none w-[148px] rounded-xl overflow-hidden flex items-end"
              style={{
                background: "linear-gradient(160deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)",
              }}
            >
              <div className="p-3 w-full">
                <p className="text-white text-[12px] font-black leading-tight">
                  Premium<br />Audio
                </p>
                <p className="text-[#FEE000] text-[10px] mt-1">Shop now →</p>
                <div className="mt-3 flex justify-center">
                  <span className="text-5xl">👩‍🎤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-white border-t border-gray-100 px-2 pt-2 pb-6 shadow-lg">
        <div className="flex justify-around">
          {bottomNavItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <div
                className={`${
                  activeTab === i ? "text-[#FEE000]" : "text-gray-400"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  activeTab === i ? "text-[#1A1A1A]" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
