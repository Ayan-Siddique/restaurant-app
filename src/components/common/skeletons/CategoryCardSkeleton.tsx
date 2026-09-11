/**
 * CategoryCardSkeleton
 * Matches the exact layout of CategoryCard:
 *  - Same dimensions: w-[220px] sm:w-[250px] md:w-[280px], h-[370px] sm:h-[420px] md:h-[470px]
 *  - Top icon area, title, description lines
 *  - Bottom circular image placeholder
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */
function CategoryCardSkeleton() {
  return (
    <article
      className="relative flex h-[370px] sm:h-[420px] md:h-[470px] flex-shrink-0 overflow-hidden flex-col w-[220px] sm:w-[250px] md:w-[280px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
      aria-hidden="true"
    >
      {/* Top content area */}
      <div className="flex flex-col items-center text-center px-4 sm:px-5 md:px-6 pt-6 sm:pt-7 md:pt-8 pb-4 sm:pb-5 gap-2 sm:gap-3">
        {/* Icon placeholder */}
        <div className="skeleton w-12 h-12 sm:w-14 sm:h-14 rounded-full" />

        {/* Title */}
        <div className="skeleton h-5 sm:h-6 w-28 sm:w-36 rounded-lg" />

        {/* Description lines */}
        <div className="flex flex-col gap-1.5 w-full items-center">
          <div className="skeleton h-3 sm:h-3.5 w-full rounded" />
          <div className="skeleton h-3 sm:h-3.5 w-4/5 rounded" />
        </div>
      </div>

      {/* Image area */}
      <div className="relative mt-auto flex items-end justify-center min-h-[130px] sm:min-h-[150px] md:min-h-[180px]">
        <div
          className="skeleton w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] rounded-full -translate-y-2 sm:-translate-y-3 md:-translate-y-4"
          style={{ border: "4px solid rgba(255,255,255,0.85)" }}
        />
      </div>
    </article>
  );
}

export default CategoryCardSkeleton;
