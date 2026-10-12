import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import airpodsImg from "../assets/product-card/airpods.png";
import hpEtaImg from "../assets/product-card/hp-eta.png";
import heartIcon from "../assets/product-card/heart.svg";
import starIcon from "../assets/product-card/star.svg";
import cartIcon from "../assets/product-card/cart.svg";
import uploadIcon from "../assets/product-card/upload.svg";
import tickIcon from "../assets/product-card/tick.svg";
import trashIcon from "../assets/product-card/trash.svg";
import plusIcon from "../assets/product-card/plus.svg";

export type ProductCardVariant =
  | "default"
  | "added-to-cart"
  | "unselected"
  | "selected";

export type ProductCardProps = {
  variant?: ProductCardVariant;
  image?: string;
  imageAlt?: string;
  name?: string;
  rating?: number;
  ratingCount?: number;
  sellingPrice?: string;
  listedPrice?: string;
  discount?: string;
  quantity?: number;
  priceDropLabel?: string;
  onWishlistToggle?: () => void;
  onSelectToggle?: () => void;
  onLongPress?: () => void;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onShare?: () => void;
  className?: string;
};

const LONG_PRESS_MS = 450;
const MOVE_CANCEL_PX = 10;

function PageDots() {
  return (
    <div className="absolute bottom-[6px] left-1/2 flex -translate-x-1/2 items-center justify-center gap-[3px] overflow-hidden rounded-full bg-alpha-dark-4 px-1 py-0.5">
      <span className="block size-1 rounded-full bg-surface-primary-inverted" />
      <span className="block size-[3px] rounded-full bg-surface-overlay-subtle" />
      <span className="block size-0.5 rounded-full bg-surface-overlay-subtle" />
      <span className="block size-px rounded-full bg-surface-overlay-subtle" />
    </div>
  );
}

function HeartButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Wishlist"
      onClick={onClick}
      className="absolute right-[6px] top-[6px] flex items-center justify-center rounded-full bg-alpha-light-16 p-1"
    >
      <img src={heartIcon} alt="" aria-hidden className="size-4" />
    </button>
  );
}

function CheckboxControl({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label="Select product"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={
        "absolute right-[6px] top-[6px] flex size-7 items-center justify-center overflow-hidden rounded-lg " +
        (checked
          ? "border-[1.4px] border-surface-action-subtle bg-surface-action-bold"
          : "border-[1.077px] border-surface-tertiary bg-surface-primary")
      }
    >
      {checked ? (
        <span className="flex size-4 items-center justify-center">
          <img
            src={tickIcon}
            alt=""
            aria-hidden
            className="block h-[10.67px] w-[11.67px]"
          />
        </span>
      ) : null}
    </button>
  );
}

function AddToCartButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-[110px] max-h-9 items-center justify-center gap-0.5 rounded-lg border border-surface-action-subtle bg-surface-action-subtle px-2 py-2.5"
    >
      <span className="flex size-4 shrink-0 items-center justify-center">
        <img
          src={cartIcon}
          alt=""
          aria-hidden
          className="block h-[9px] w-[9px]"
        />
      </span>
      <span className="font-primary text-l3 font-semibold text-text-action">
        Add to cart
      </span>
    </button>
  );
}

function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: {
  quantity: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) {
  return (
    <div className="flex h-9 w-[110px] max-h-9 items-center justify-between overflow-hidden rounded-lg border-[1.2px] border-border-action bg-surface-action-subtle px-3 py-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrement}
        className="flex size-4 shrink-0 items-center justify-center"
      >
        <img
          src={trashIcon}
          alt=""
          aria-hidden
          className="block h-[13px] w-[11.67px]"
        />
      </button>
      <div className="flex size-6 items-center justify-center">
        <span className="font-primary text-[18px] font-medium leading-6 text-text-action">
          {quantity}
        </span>
      </div>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrement}
        className="flex size-4 shrink-0 items-center justify-center"
      >
        <img
          src={plusIcon}
          alt=""
          aria-hidden
          className="block h-[11px] w-[11px]"
        />
      </button>
    </div>
  );
}

function ShareButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Share"
      onClick={onClick}
      className="relative flex size-9 max-h-9 shrink-0 items-center justify-center rounded-lg border border-surface-tertiary"
    >
      <span className="flex size-4 items-center justify-center">
        <img
          src={uploadIcon}
          alt=""
          aria-hidden
          className="block h-[11px] w-[11.67px]"
        />
      </span>
    </button>
  );
}

export default function ProductCard({
  variant = "default",
  image = airpodsImg,
  imageAlt,
  name = "Apple Airpods Pro 2 Wireless Earbuds",
  rating = 4.3,
  ratingCount = 128,
  sellingPrice = "899",
  listedPrice = "1399",
  discount = "33%",
  quantity = 1,
  priceDropLabel,
  onWishlistToggle,
  onSelectToggle,
  onLongPress,
  onAddToCart,
  onIncrement,
  onDecrement,
  onShare,
  className = "",
}: ProductCardProps) {
  const showButtonsRow = variant === "default" || variant === "added-to-cart";
  const isCheckable = variant === "selected" || variant === "unselected";

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressStart = useRef<{ x: number; y: number } | null>(null);
  const longPressFired = useRef(false);

  function clearLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    longPressStart.current = null;
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!onLongPress) return;
    longPressFired.current = false;
    longPressStart.current = { x: e.clientX, y: e.clientY };
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!longPressStart.current) return;
    const dx = Math.abs(e.clientX - longPressStart.current.x);
    const dy = Math.abs(e.clientY - longPressStart.current.y);
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearLongPress();
  }

  function handleClick() {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    if (isCheckable) onSelectToggle?.();
  }

  return (
    <div
      data-variant={variant}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      onPointerCancel={clearLongPress}
      role={isCheckable ? "button" : undefined}
      tabIndex={isCheckable ? 0 : undefined}
      className={
        "flex w-[164px] flex-col items-stretch overflow-hidden rounded-[12px] border-[0.75px] border-surface-tertiary bg-surface-primary font-primary touch-manipulation select-none " +
        (isCheckable ? "cursor-pointer " : "") +
        className
      }
    >
      {/* Top container — image (3 : 4.1 frame, width 164 → height auto) */}
      <div className="relative w-full bg-surface-secondary" style={{ aspectRatio: "3 / 4.1" }}>
        {/* Image (1:1 inside a 3:4.1 frame) */}
        <div className="absolute left-1/2 top-1/2 h-full w-[99.39%] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          <img
            src={image}
            alt={imageAlt ?? name}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>

        <PageDots />

        {isCheckable ? (
          <CheckboxControl
            checked={variant === "selected"}
            onClick={onSelectToggle}
          />
        ) : (
          <HeartButton onClick={onWishlistToggle} />
        )}

        {priceDropLabel && (
          <div className="absolute left-0 top-0 flex h-5 items-center rounded-br-lg border-b-[1.5px] border-black/50 bg-emerald-800 px-1.5 py-0.5">
            <span className="whitespace-nowrap font-primary text-b12 font-semibold text-text-on-surface-bold">
              {priceDropLabel}
            </span>
          </div>
        )}
      </div>

      {/* Bottom container */}
      <div className="flex flex-col items-start gap-1.5 p-1.5">
        {/* Product name + rating */}
        <div className="flex w-full flex-col items-start gap-1 overflow-hidden">
          <p
            className="w-full overflow-hidden text-ellipsis font-primary text-b12 font-medium text-text-primary"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </p>
          <div className="flex items-center gap-0.5">
            <div className="flex h-[18px] items-center gap-0.5 rounded-[4.067px] bg-surface-tertiary px-1 py-0.5">
              <img
                src={starIcon}
                alt=""
                aria-hidden
                className="h-[11.5px] w-3 shrink-0"
              />
              <span
                className="whitespace-nowrap font-primary"
                style={{
                  fontSize: "12.202px",
                  letterSpacing: "-0.12px",
                  lineHeight: "14px",
                }}
              >
                <span className="font-semibold text-text-primary">
                  {rating}{" "}
                </span>
                <span className="font-normal text-text-tertiary">
                  ({ratingCount})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex w-full flex-wrap items-end gap-0.5">
          <span className="whitespace-nowrap font-primary text-b14 font-bold text-text-primary">
            {sellingPrice}
          </span>
          <span className="whitespace-nowrap font-primary text-b12 font-normal text-text-tertiary line-through">
            {listedPrice}
          </span>
          <span className="whitespace-nowrap font-primary text-b12 font-semibold text-text-success">
            {discount}
          </span>
        </div>

        {/* HP ETA — Express Today badge */}
        <img
          src={hpEtaImg}
          alt="Express Today"
          className="h-[18px] w-[122px] max-w-full shrink-0 object-contain object-left"
        />

        {/* Buttons row (default & added-to-cart) */}
        {showButtonsRow && (
          <div className="flex items-center gap-1.5">
            {variant === "default" ? (
              <AddToCartButton onClick={onAddToCart} />
            ) : (
              <QuantityStepper
                quantity={quantity}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
            )}
            <ShareButton onClick={onShare} />
          </div>
        )}
      </div>
    </div>
  );
}
