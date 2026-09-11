/**
 * OrderDetailSkeleton
 * Matches the exact 2-column layout of OrderDetailPage:
 *  - Left (8 cols): status timeline card, items card, address card
 *  - Right (4 cols): summary breakdown card
 * Uses same responsive grid: grid-cols-1 lg:grid-cols-12
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */
function OrderDetailSkeleton() {
  return (
    <div aria-hidden="true">
      {/* Header: order number + status badge */}
      <div className="mb-6 sm:mb-8">
        <div className="skeleton h-4 w-28 rounded mb-4" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="skeleton h-8 sm:h-9 w-48 sm:w-56 rounded-lg" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton h-3.5 w-36 rounded mt-2" />
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Timeline card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs">
            <div className="skeleton h-5 w-32 rounded-lg mb-4" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-28 rounded mb-1" />
                    <div className="skeleton h-3 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs">
            <div className="skeleton h-5 w-44 rounded-lg mb-4 pb-3 border-b border-neutral-100" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="skeleton h-4 w-32 rounded mb-1" />
                    <div className="skeleton h-3 w-16 rounded" />
                  </div>
                  <div className="skeleton h-5 w-14 rounded shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Address card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-neutral-100">
              <div className="skeleton w-5 h-5 rounded" />
              <div className="skeleton h-5 w-36 rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-3.5 w-56 rounded" />
              <div className="skeleton h-3.5 w-32 rounded" />
            </div>
          </div>
        </div>

        {/* Right column (4 cols) — Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs">
            <div className="skeleton h-5 w-32 rounded-lg mb-5" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="skeleton h-3.5 w-20 rounded" />
                  <div className="skeleton h-3.5 w-14 rounded" />
                </div>
              ))}
              <div className="border-t border-neutral-100 pt-3 mt-1">
                <div className="flex items-center justify-between">
                  <div className="skeleton h-5 w-16 rounded" />
                  <div className="skeleton h-6 w-20 rounded-lg" />
                </div>
              </div>
            </div>
            {/* Action buttons */}
            <div className="mt-5 flex flex-col gap-2">
              <div className="skeleton h-9 w-full rounded-full" />
              <div className="skeleton h-9 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailSkeleton;
