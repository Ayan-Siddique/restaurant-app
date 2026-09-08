import type { Category } from "../types";
import { CATEGORY_META, FALLBACK_META } from "../data";
import { useAppSelector } from "../../../store/hooks";

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  const meta = CATEGORY_META[category.id] ?? FALLBACK_META;
  const mode = useAppSelector((state) => state.theme.mode);
  const isVeg = mode === "veg";

  return (
    <article
  className={`group relative flex h-[370px] sm:h-[420px] md:h-[470px] flex-shrink-0 cursor-pointer overflow-hidden flex-col w-[220px] sm:w-[250px] md:w-[280px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]`}
>

      <div
  className={`absolute -bottom-[65%] z-0 -left-[10%] h-[90%] w-[140%] rotate-[-10deg] origin-center transition-all pb-2 duration-350 ease-in-out group-hover:bottom-0 group-hover:left-0 group-hover:h-full group-hover:w-full group-hover:rotate-0 ${
    isVeg ? "bg-[#4caf50]" : "bg-[#f5a623]"
  }`}
/>
      {/* ── Top content ── */}
      <div className="flex flex-col z-10 items-center text-center px-4 sm:px-5 md:px-6 pt-6 sm:pt-7 md:pt-8 pb-4 sm:pb-5 gap-2 sm:gap-3">
        <span className="text-4xl sm:text-5xl leading-none text-[#f5a623] transition-colors duration-350 group-hover:text-white">
          {meta.icon}
        </span>

        <h3 className="m-0 text-base sm:text-lg md:text-[1.3rem] font-['Rubik',sans-serif] fw-bold text-[#2d2d2d] transition-colors duration-350 group-hover:text-white">
          {category.name}
        </h3>

        <p className="text-xs sm:text-sm leading-relaxed m-0 font-['Roboto',sans-serif] text-[#888] transition-colors duration-350 group-hover:text-white/85">
          {meta.description}
        </p>
      </div>

      {/* ── Image area ── */}
      <div className="relative mt-auto flex items-end justify-center min-h-[130px] sm:min-h-[150px] md:min-h-[180px]">
       

        <img
          src={meta.image}
          alt={category.name}
         className="relative z-[1] rounded-full object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] border-[4px] border-white/85 shadow-[0_8px_25px_rgba(0,0,0,0.12)] -translate-y-2 sm:-translate-y-3 md:-translate-y-4 transition-[border-color] duration-250"
        />
      </div>
      
    </article>
  );
}

export default CategoryCard;