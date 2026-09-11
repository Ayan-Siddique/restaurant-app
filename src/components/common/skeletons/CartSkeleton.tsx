/**
 * CartSkeleton
 * Matches the exact layout of CartPage content area:
 *  - Left (8 cols): 3 cart item card skeletons matching CartItemCard
 *  - Right (4 cols): summary card skeleton matching CartSummary
 * Uses same responsive grid: grid-cols-1 lg:grid-cols-12
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */

function CartItemSkeleton() {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm"
      aria-hidden="true"
    >
      {/* Left: Image + Info */}
      <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto min-w-0">
        {/* Image */}
        <div className="skeleton w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl" />
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="skeleton h-5 sm:h-6 w-32 sm:w-40 rounded-lg mb-1.5" />
          <div className="skeleton h-3.5 w-24 rounded" />
        </div>
      </div>

      {/* Right: Qty + Total + Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        {/* Quantity stepper */}
        <div className="skeleton h-9 w-24 rounded-full" />
        {/* Total */}
        <div className="text-right min-w-[70px]">
          <div className="skeleton h-3 w-10 rounded mb-1 ml-auto" />
          <div className="skeleton h-5 sm:h-6 w-16 rounded-lg ml-auto" />
        </div>
        {/* Remove button */}
        <div className="skeleton w-9 h-9 rounded-lg" />
      </div>
    </div>
  );
}

function CartSummarySkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-xs">
      <div className="skeleton h-5 w-32 rounded-lg mb-5" />

      {/* Line items */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="skeleton h-3.5 w-24 rounded" />
            <div className="skeleton h-3.5 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Divider + Total */}
      <div className="border-t border-neutral-100 pt-3 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-6 w-20 rounded-lg" />
        </div>
      </div>

      {/* Checkout button */}
      <div className="skeleton h-11 w-full rounded-full" />
    </div>
  );
}

function CartSkeleton() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      aria-busy="true"
      aria-label="Loading cart items"
    >
      {/* Items column */}
      <div className="lg:col-span-8 flex flex-col gap-3.5">
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>

      {/* Summary column */}
      <div className="lg:col-span-4">
        <CartSummarySkeleton />
      </div>
    </div>
  );
}

export default CartSkeleton;
