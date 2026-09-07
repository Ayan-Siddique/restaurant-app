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
        className="cat-card flex-shrink-0 cursor-pointer overflow-hidden flex flex-col"
        style={{
          width: "280px",
          borderRadius: "1.25rem",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        {/* ── Top content ── */}
        <div className="flex flex-col items-center text-center px-6 pt-8 pb-5 gap-3">
          {/* Icon */}
          <span
            className="cat-icon text-5xl leading-none"
            style={{
              color: "#f5a623",
              transition: "color 0.35s ease",
            }}
          >
            {meta.icon}
          </span>

          {/* Category name */}
          <h3
            className="cat-heading m-0"
            style={{
              fontFamily: "'Doppio One', sans-serif",
              fontSize: "1.3rem",
              color: "#2d2d2d",
              transition: "color 0.35s ease",
            }}
          >
            {category.name}
          </h3>

          {/* Description */}
          <p
            className="cat-desc text-sm leading-relaxed m-0"
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
          className="relative mt-auto flex items-end justify-center"
          style={{ minHeight: "180px" }}
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
            className="cat-img-ring relative z-[1] rounded-full object-cover"
            style={{
              width: "170px",
              height: "170px",
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
