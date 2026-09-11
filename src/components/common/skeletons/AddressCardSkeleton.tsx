/**
 * AddressCardSkeleton
 * Matches the exact layout of address cards in AccountPage:
 *  - rounded-3xl white card with border
 *  - Header: label + "Set as Default" area
 *  - Address text lines
 *  - Footer: Edit + Delete action buttons
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */
function AddressCardSkeleton() {
  return (
    <article
      className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-xs flex flex-col justify-between gap-4"
      aria-hidden="true"
    >
      {/* Header: Label + Default badge area */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-100">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>

        {/* Address lines */}
        <div className="flex flex-col gap-1.5">
          <div className="skeleton h-4 w-36 rounded" />
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3.5 w-3/4 rounded" />
          <div className="skeleton h-3 w-28 rounded mt-1" />
        </div>
      </div>

      {/* Actions: Edit + Delete */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
        <div className="skeleton h-6 w-14 rounded" />
        <div className="skeleton h-6 w-16 rounded" />
      </div>
    </article>
  );
}

export default AddressCardSkeleton;
