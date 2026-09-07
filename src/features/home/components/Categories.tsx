import { useRef } from "react";
import type { Category } from "../types";
import CategoryCard from "./CategoryCard";

interface CategoriesProps {
  categories: Category[];
}

function Categories({ categories }: CategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 310; // card width + gap
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative w-full py-10 md:py-16 px-2 md:px-4"
      style={{
        fontFamily: "'Roboto', sans-serif",
        background: "#f9f5f0",
      }}
    >
      {/* ── Left arrow — hidden on mobile ── */}
      <button
        onClick={() => scroll("left")}
        className="hidden sm:flex btn btn-circle btn-ghost btn-sm absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50 items-center justify-center"
        style={{
          border: "1px solid #e5e5e5",
          width: "40px",
          height: "40px",
        }}
        aria-label="Scroll left"
      >
        ←
      </button>

      {/* ── Card track ── */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth px-4 sm:px-14 pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>

      {/* ── Right arrow — hidden on mobile ── */}
      <button
        onClick={() => scroll("right")}
        className="hidden sm:flex btn btn-circle btn-ghost btn-sm absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50 items-center justify-center"
        style={{
          border: "1px solid #e5e5e5",
          width: "40px",
          height: "40px",
        }}
        aria-label="Scroll right"
      >
        →
      </button>
    </section>
  );
}

export default Categories;