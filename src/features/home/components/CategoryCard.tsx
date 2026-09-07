import type { Category } from "../types";
import { CATEGORY_META, FALLBACK_META } from "../data";

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  const meta = CATEGORY_META[category.id] ?? FALLBACK_META;

  return (
    <>
      <style>{`
        .cat-card {
          background: #fff;
          transition: all 0.35s ease;
        }
        .cat-card:hover {
          background: #f5a623 !important;
          box-shadow: 0 12px 35px rgba(245,166,35,0.35) !important;
        }
        .cat-card:hover .cat-heading  { color: #fff !important; }
        .cat-card:hover .cat-desc     { color: rgba(255,255,255,0.85) !important; }
        .cat-card:hover .cat-icon     { color: #fff !important; }
        .cat-card:hover .cat-strip    { opacity: 0 !important; }
        .cat-card:hover .cat-img-ring { border-color: rgba(255,255,255,0.3) !important; }
      `}</style>

      <article
        className="cat-card flex-shrink-0 cursor-pointer overflow-hidden flex flex-col w-[220px] sm:w-[250px] md:w-[280px]"
        style={{
          borderRadius: "1.25rem",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        {/* ── Top content ── */}
        <div className="flex flex-col items-center text-center px-4 sm:px-5 md:px-6 pt-6 sm:pt-7 md:pt-8 pb-4 sm:pb-5 gap-2 sm:gap-3">
          {/* Icon */}
          <span
            className="cat-icon text-4xl sm:text-5xl leading-none"
            style={{
              color: "#f5a623",
              transition: "color 0.35s ease",
            }}
          >
            {meta.icon}
          </span>

          {/* Category name */}
          <h3
            className="cat-heading m-0 text-base sm:text-lg md:text-[1.3rem]"
            style={{
              fontFamily: "'Doppio One', sans-serif",
              color: "#2d2d2d",
              transition: "color 0.35s ease",
            }}
          >
            {category.name}
          </h3>

          {/* Description */}
          <p
            className="cat-desc text-xs sm:text-sm leading-relaxed m-0"
            style={{
              fontFamily: "'Roboto', sans-serif",
              color: "#888",
              transition: "color 0.35s ease",
            }}
          >
            {meta.description}
          </p>
        </div>

        {/* ── Image area ── */}
        <div
          className="relative mt-auto flex items-end justify-center min-h-[130px] sm:min-h-[150px] md:min-h-[180px]"
        >
          {/* Orange accent strip — visible by default, hides on hover */}
          <div
            className="cat-strip absolute bottom-0 left-0 w-full"
            style={{
              height: "55%",
              background: "#f5a623",
              borderRadius: "2rem 2rem 0 0",
              transition: "opacity 0.35s ease",
            }}
          />

          {/* Food plate image */}
          <img
            src={meta.image}
            alt={category.name}
            className="cat-img-ring relative z-[1] rounded-full object-cover w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[170px] md:h-[170px]"
            style={{
              border: "5px solid rgba(255,255,255,0.85)",
              marginBottom: "-6px",
              transition: "border-color 0.35s ease",
              boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            }}
          />
        </div>
      </article>
    </>
  );
}

export default CategoryCard;
