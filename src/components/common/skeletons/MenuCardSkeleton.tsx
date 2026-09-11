/**
 * MenuCardSkeleton
 * Structurally matches the redesigned MenuCard:
 *  - Responsive composition:
 *    - Mobile/tablet (< 1024px): horizontal list card with thumbnail on left,
 *      title/category + bottom price & button row on right.
 *    - Desktop (>= 1024px): vertical grid card with hero image on top,
 *      title/category + full-width cart button below.
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */
function MenuCardSkeleton() {
  return (
    <article
      className="flex flex-row lg:flex-col bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden w-full"
      aria-hidden="true"
    >
      {/* Image placeholder: square thumbnail on mobile/tablet, full banner on desktop */}
      <div className="skeleton w-28 h-28 sm:w-28 sm:h-28 lg:w-full lg:h-52 shrink-0 m-2.5 lg:m-0 rounded-2xl lg:rounded-none lg:rounded-t-2xl" />

      {/* Content placeholder */}
      <div className="flex-1 min-w-0 p-2.5 sm:p-3 lg:p-4 pl-0 lg:pl-4 flex flex-col justify-between">
        {/* Top: Title & Category lines */}
        <div>
          <div className="skeleton h-4 sm:h-5 lg:h-6 w-3/4 rounded-lg mb-2" />
          <div className="skeleton h-3 sm:h-3.5 w-1/3 rounded" />
        </div>

        {/* Mobile/Tablet Bottom Row (< 1024px): Price on left + Button on right */}
        <div className="flex lg:hidden items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-100">
          <div className="skeleton h-5 sm:h-6 w-16 rounded-md" />
          <div className="skeleton h-8 w-20 rounded-xl" />
        </div>

        {/* Desktop Bottom Row (>= 1024px): Full-width button */}
        <div className="hidden lg:flex items-center justify-between gap-2 mt-3 pt-2 border-t border-neutral-100">
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      </div>
    </article>
  );
}

export default MenuCardSkeleton;
