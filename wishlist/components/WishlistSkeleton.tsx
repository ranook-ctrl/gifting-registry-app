const SHIMMER =
  "bg-gradient-to-r from-surface-tertiary via-surface-secondary to-surface-tertiary bg-[length:200%_100%] animate-[skeleton-shimmer_1.4s_ease-in-out_infinite]";

export default function WishlistSkeleton() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-surface-primary font-primary">
      {/* Status-bar gap */}
      <div className="h-[47px] shrink-0" />

      {/* Header skeleton: back, title, create CTA */}
      <div className="flex h-14 shrink-0 items-center gap-3 px-4">
        <div className={`size-10 shrink-0 rounded-xl ${SHIMMER}`} />
        <div className={`h-7 w-28 rounded-full ${SHIMMER}`} />
        <div className={`ml-auto h-9 w-24 rounded-full ${SHIMMER}`} />
      </div>

      {/* Horizontal collections row — plain blocks, no labels */}
      <div className="flex shrink-0 items-center gap-3 overflow-hidden px-4 pt-4">
        <div className={`size-[150px] shrink-0 rounded-2xl ${SHIMMER}`} />
        <div className={`size-[150px] shrink-0 rounded-2xl ${SHIMMER}`} />
        <div className={`size-[150px] shrink-0 rounded-2xl ${SHIMMER}`} />
      </div>

      {/* "All Saved Items" header row */}
      <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-8">
        <div className={`h-6 w-28 rounded-full ${SHIMMER}`} />
        <div className={`h-6 w-16 rounded-full ${SHIMMER}`} />
      </div>

      {/* Product grid skeleton — plain tall blocks */}
      <div className="grid grid-cols-2 gap-[15px] px-4">
        <div className={`h-[320px] rounded-xl ${SHIMMER}`} />
        <div className={`h-[320px] rounded-xl ${SHIMMER}`} />
        <div className={`h-[320px] rounded-xl ${SHIMMER}`} />
        <div className={`h-[320px] rounded-xl ${SHIMMER}`} />
      </div>
    </div>
  );
}
