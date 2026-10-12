import { useState } from "react";
import { motion } from "motion/react";
import notchImg from "../assets/status-bar/notch.svg";
import rightSideImg from "../assets/status-bar/right-side.svg";

/* Icon vectors from Figma (M-Icon/System-Icon) — fill follows currentColor. */
function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 7.5 13.5"
      fill="none"
      aria-hidden
      className="block h-[11.25px] w-[6.25px] text-text-primary"
    >
      <path
        d="M6.21967 0.21967C6.51256 -0.0732233 6.98732 -0.0732233 7.28022 0.21967C7.57311 0.512563 7.57311 0.987324 7.28022 1.28022L1.81049 6.74994L7.28022 12.2197C7.57311 12.5126 7.57311 12.9873 7.28022 13.2802C6.98732 13.5731 6.51256 13.5731 6.21967 13.2802L0.21967 7.28022C-0.0732233 6.98732 -0.0732233 6.51256 0.21967 6.21967L6.21967 0.21967Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 14.5 14.5"
      fill="none"
      aria-hidden
      className="block size-[14.5px] text-text-on-surface-bold"
    >
      <path
        d="M13.75 6.5H8V0.75C8 0.33625 7.66375 0 7.25 0C6.83625 0 6.5 0.33625 6.5 0.75V6.5H0.75C0.33625 6.5 0 6.83625 0 7.25C0 7.66375 0.33625 8 0.75 8H6.5V13.75C6.5 14.1637 6.83625 14.5 7.25 14.5C7.66375 14.5 8 14.1637 8 13.75V8H13.75C14.1637 8 14.5 7.66375 14.5 7.25C14.5 6.83625 14.1637 6.5 13.75 6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="relative h-[47px] w-full shrink-0 overflow-hidden">
      <img
        src={notchImg}
        alt=""
        aria-hidden
        className="absolute left-1/2 top-[-2px] block h-8 w-[164px] -translate-x-1/2"
      />
      <span className="absolute left-[27px] top-[15px] block w-[54px] text-center font-['SF_Pro_Text','SF_Pro','-apple-system',system-ui] text-[17px] font-semibold leading-[22px] text-[#010101] tracking-[-0.408px]">
        9:41
      </span>
      <img
        src={rightSideImg}
        alt=""
        aria-hidden
        className="absolute right-[26.6px] top-[19px] block h-[13px] w-[77.4px]"
      />
    </div>
  );
}

export type WishlistHeaderTab = "wishlists" | "giftlists";

export type WishlistHeaderProps = {
  onBack?: () => void;
  onCreate?: () => void;
  /** Selected M-Switch segment; omit to let the header manage it. */
  activeTab?: WishlistHeaderTab;
  onTabChange?: (tab: WishlistHeaderTab) => void;
};

/* M-Switch (Figma 1593:856829) — Wish lists / Gift lists segmented control. */
function HeaderSwitch({
  tab,
  onSelect,
}: {
  tab: WishlistHeaderTab;
  onSelect: (tab: WishlistHeaderTab) => void;
}) {
  const segment = (value: WishlistHeaderTab, selected: boolean) =>
    "relative flex h-8 min-w-0 flex-1 items-center rounded-full " +
    (value === "wishlists" ? "justify-center px-2.5 " : "justify-between pl-2.5 pr-1.5 ") +
    (selected ? "" : "cursor-pointer");

  const pill = (
    <motion.span
      layoutId="header-switch-pill"
      aria-hidden
      className="absolute inset-0 rounded-full border border-surface-primary bg-neutral-white shadow-[0px_1px_3px_rgba(34,34,34,0.06)]"
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    />
  );

  return (
    <div
      role="tablist"
      className="relative flex h-10 w-[231px] shrink-0 items-center rounded-full bg-surface-secondary px-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={tab === "wishlists"}
        onClick={() => onSelect("wishlists")}
        className={segment("wishlists", tab === "wishlists")}
      >
        {tab === "wishlists" && pill}
        <span
          className={
            "relative z-[1] truncate font-primary text-b13 font-semibold " +
            (tab === "wishlists" ? "text-text-primary" : "text-text-tertiary")
          }
        >
          Wish lists
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === "giftlists"}
        onClick={() => onSelect("giftlists")}
        className={segment("giftlists", tab === "giftlists")}
      >
        {tab === "giftlists" && pill}
        <span
          className={
            "relative z-[1] truncate font-primary text-b13 font-semibold " +
            (tab === "giftlists" ? "text-text-primary" : "text-text-tertiary")
          }
        >
          Gift lists
        </span>
        <span className="relative z-[1] flex shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-b from-[#19cb83] to-green-700 px-[6px] py-[2px]">
          <span className="whitespace-nowrap font-primary text-b11 font-bold text-text-on-surface-bold">
            NEW
          </span>
        </span>
      </button>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_1px_4px_0px_rgba(36,36,36,0.04)]"
      />
    </div>
  );
}

export default function Header({
  onBack,
  onCreate,
  activeTab,
  onTabChange,
}: WishlistHeaderProps) {
  const [internalTab, setInternalTab] = useState<WishlistHeaderTab>("wishlists");
  const tab = activeTab ?? internalTab;
  const selectTab = (next: WishlistHeaderTab) => {
    setInternalTab(next);
    onTabChange?.(next);
  };

  return (
    <div className="relative flex w-full flex-col items-stretch bg-gradient-to-b from-white from-40% to-white/0 font-primary">
      <StatusBar />
      {/* Header stack (Figma 1593:856823): back M-IconButton · M-Switch · create M-IconButton */}
      <div className="flex h-14 w-full items-center justify-between px-4 py-2">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-primary"
        >
          <span className="flex size-5 items-center justify-center">
            <ChevronLeftIcon />
          </span>
        </button>

        <HeaderSwitch tab={tab} onSelect={selectTab} />

        <button
          type="button"
          aria-label="Create"
          onClick={onCreate}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-neutral-white bg-surface-action-bold"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
