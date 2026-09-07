import { useState } from "react";
import type { MenuItem } from "../../menu/types";
import NotFound from "../../../components/common/NotFound";
import SectionHeading from "../../../components/common/SectionHeading";
import MenuCard from "../../menu/components/MenuCard";

interface PopularDishesProps {
  items: MenuItem[];
}

const FILTER_TABS = ["All", "Pizza", "Burger", "Pasta", "Dessert"] as const;

function PopularDishes({ items }: PopularDishesProps) {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered =
    activeTab === "All"
      ? items
      : items.filter(
          (item) => item.category.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <>
      <section
        className="w-full py-12 md:py-20 px-3 sm:px-4"
        style={{
          fontFamily: "'Roboto', sans-serif",
          background: "#f9f5f0",
        }}
      >
        {/* ── Section header ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p
            className="text-sm sm:text-base font-medium mb-2 m-0"
            style={{ color: "#f5a623" }}
          >
            Popular Dishes
          </p>
          <SectionHeading colorHeading="Foods">Our Delicious</SectionHeading>
          <p
            className="text-sm sm:text-base m-0"
            style={{ color: "#888" }}
          >
            Food is any substance consumed to provide nutritional support for an
            organism.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive ? "#f5a623" : "#fff",
                  color: isActive ? "#fff" : "#2d2d2d",
                  border: isActive ? "2px solid #f5a623" : "2px solid #e0ddd8",
                  boxShadow: isActive
                    ? "0 4px 12px rgba(245,166,35,0.3)"
                    : "none",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── Dish grid ── */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {filtered.map((item) => (
            <div key={item.id} className="w-full max-w-sm">
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="w-full flex justify-center mt-6">
            <NotFound
              title="Nothing found"
              message="No dishes in this category with the current filters"
              buttonText="Clear filters"
              onAction={() => setActiveTab("All")}
              className="py-8 min-h-0 bg-transparent"
            />
          </div>
        )}
      </section>
    </>
  );
}

export default PopularDishes;