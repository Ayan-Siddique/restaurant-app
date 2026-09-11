interface CulinaryPlacardProps {
  title?: string;
  category?: string;
  className?: string;
  aspectRatio?: "square" | "landscape" | "hero";
}

export function CulinaryPlacard({
  title = "Culinary Creation",
  category = "Chef's Selection",
  className = "",
  aspectRatio = "landscape",
}: CulinaryPlacardProps) {
  // Extract clean initials
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "hero"
      ? "aspect-4/3 sm:aspect-16/10"
      : "aspect-16/10";

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-[#f4efea] border border-[#e7e0d8] flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Delicate tactile background texture grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#1c1917 1px, transparent 1px), radial-gradient(#1c1917 1px, #f4efea 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      />

      {/* Outer framing hairline */}
      <div className="absolute inset-3 border border-[#e7e0d8] pointer-events-none rounded-xl" />

      {/* Heritage Insignia Motif */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full border border-[#c2410c]/30 bg-white/80 flex items-center justify-center shadow-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c2410c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
            <path d="m4.93 4.93 2.12 2.12" />
            <path d="m16.95 16.95 2.12 2.12" />
            <path d="m4.93 19.07 2.12-2.12" />
            <path d="m16.95 7.05 2.12-2.12" />
          </svg>
        </div>

        {/* Initials & Category */}
        <span
          className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c2410c] mt-1"
          style={{ fontFamily: "'Rubik', sans-serif" }}
        >
          {category}
        </span>

        <h4
          className="text-base sm:text-lg font-bold text-[#1c1917] tracking-tight max-w-[200px] leading-tight line-clamp-2"
          style={{ fontFamily: "'Rubik', sans-serif" }}
        >
          {title}
        </h4>

        {initials && (
          <span
            className="text-3xl sm:text-4xl font-black text-[#1c1917]/10 tracking-widest mt-1"
            style={{ fontFamily: "'Doppio One', sans-serif" }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Subtle authentic seal in corner */}
      <div className="absolute bottom-4 right-4 z-10 text-[9px] font-semibold uppercase tracking-widest text-[#8c827a]">
        Feesto Kitchen
      </div>
    </div>
  );
}

export default CulinaryPlacard;
