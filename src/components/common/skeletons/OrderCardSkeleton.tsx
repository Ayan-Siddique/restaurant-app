/**
 * OrderCardSkeleton
 * Matches the exact layout of OrderCard:
 *  - rounded-3xl white card with border + shadow
 *  - Top header: icon circle + title/date lines + total price
 *  - Middle: status badge placeholders
 *  - Footer: CTA link placeholder
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */
function OrderCardSkeleton() {
  return (
    <article
      className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 flex flex-col justify-between gap-5"
      style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)" }}
      aria-hidden="true"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="skeleton w-10 h-10 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-1.5">
            {/* Order number */}
            <div className="skeleton h-5 sm:h-6 w-32 sm:w-40 rounded-lg" />
            {/* Date */}
            <div className="skeleton h-3.5 w-28 sm:w-36 rounded" />
          </div>
        </div>

        {/* Total */}
        <div className="text-right flex flex-col items-end gap-1">
          <div className="skeleton h-3 w-10 rounded" />
          <div className="skeleton h-6 sm:h-7 w-16 sm:w-20 rounded-lg" />
        </div>
      </div>

      {/* Middle: Status badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="skeleton h-4 w-12 rounded" />
      </div>

      {/* Footer: CTA */}
      <div className="pt-2 flex justify-end">
        <div className="skeleton h-7 w-28 rounded-full" />
      </div>
    </article>
  );
}

export default OrderCardSkeleton;
