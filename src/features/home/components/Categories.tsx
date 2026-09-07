import { useRef } from "react";
import type { Category } from "../types";
import CategoryCard from "./CategoryCard";
import Container from "../../../components/layout/Container";

interface CategoriesProps {
  categories: Category[];
}

function Categories({ categories }: CategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // const scroll = (dir: "left" | "right") => {
  //   if (!scrollRef.current) return;
  //   const amount = 310; // card width + gap
  //   scrollRef.current.scrollBy({
  //     left: dir === "left" ? -amount : amount,
  //     behavior: "smooth",
  //   });
  // };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        fontFamily: "'Roboto', sans-serif",
        background: "#f9f5f0",
      }}
    >
      <Container>
      

      {/* ── Card track ── */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth scrollbar-hide py-6 md:py-8"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>

      
      </Container>
    </section>
  );
}

export default Categories;