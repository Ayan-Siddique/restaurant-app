import type { MenuItem } from "../types";

interface MenuCardProps {
  item: MenuItem;
}

/* Tag mappings to display ingredient pills */
const INGREDIENT_TAGS: Record<string, string[]> = {
  "pizza-1": ["Tomato", "Mozzarella", "Fresh Basil", "Olive Oil"],
  "pizza-2": ["Pepperoni", "Mozzarella", "Oregano", "Crust"],
  "burger-1": ["Beef Patty", "Lettuce", "Tomato", "Cheese"],
  "burger-2": ["Crispy Bacon", "BBQ Sauce", "Cheddar", "Beef"],
  "pasta-1": ["Fettuccine", "Alfredo", "Parmesan", "Garlic"],
  "dessert-1": ["Dark Chocolate", "Molten Lava", "Vanilla", "Cocoa"],
};

const getTags = (item: MenuItem): string[] => {
  if (INGREDIENT_TAGS[item.id]) {
    return INGREDIENT_TAGS[item.id];
  }
  switch (item.category) {
    case "pizza":
      return ["Tomato", "Mozzarella", "Basil", "Crust"];
    case "burger":
      return ["Patty", "Lettuce", "Cheddar", "Sauce"];
    case "pasta":
      return ["Pasta", "Parmesan", "Cream", "Garlic"];
    case "dessert":
      return ["Chocolate", "Sugar", "Vanilla", "Cocoa"];
    default:
      return ["Fresh", "Organic", "Chef Special", "Artisan"];
  }
};

function MenuCard({ item }: MenuCardProps) {
  const tags = getTags(item);

  return (
    <article
      className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300 hover:shadow-xl"
      style={{
        borderRadius: "32px",
        padding: "14px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* ── Top Media Container with Full Image ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          borderRadius: "24px",
          height: "260px",
          background: "#f0ece4",
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* ── Bottom Info Section ── */}
      <div className="pt-4 pb-2 px-2 flex flex-col gap-3">
        {/* Title, Price & Order Now CTA */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <h3
              className="m-0 text-xl font-medium text-neutral-900 truncate"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              {item.name}
            </h3>
            <span
              className="text-base font-semibold text-neutral-700"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              • {item.price}$
            </span>
          </div>

          <a
            href="#order"
            className="text-sm font-normal text-black no-underline underline underline-offset-4 flex items-center gap-1 shrink-0 transition-opacity duration-200 hover:opacity-70"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            <span>Order Now</span>
            <span className="text-xs">↗</span>
          </a>
        </div>

        {/* Ingredient / Tag Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-normal rounded-full transition-colors duration-200"
              style={{
                background: "#f0f3ed",
                color: "#5c6b5a",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MenuCard;