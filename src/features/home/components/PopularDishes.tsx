import { useState } from "react";

import type { MenuItem } from "../../menu/types";

import NotFound from "../../../components/common/NotFound";
import SectionHeading from "../../../components/common/SectionHeading";
import MenuCard from "../../menu/components/MenuCard";
import Container from "../../../components/layout/Container";
import FilterTabs from "../../../components/common/FilterTabs";

interface PopularDishesProps {
  items: MenuItem[];
}

const FILTER_TABS = [
  "All",
  "Pizza",
  "Burger",
  "Pasta",
  "Dessert",
] as const;

function PopularDishes({ items }: PopularDishesProps) {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered =
    activeTab === "All"
      ? items
      : items.filter((item) => {
          const catName =
            typeof item.category === "string"
              ? item.category
              : item.category?.name || "";
          return catName.toLowerCase() === activeTab.toLowerCase();
        });

  return (
    <section
      className="w-full py-12 md:py-20"
      style={{
        fontFamily: "'Roboto', sans-serif",
        background: "#f9f5f0",
      }}
    >
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p
            className="m-0 mb-2 text-sm font-medium sm:text-base"
            style={{ color: "#f5a623" }}
          >
            Popular Dishes
          </p>

          <SectionHeading colorHeading="Foods">
            Our Delicious
          </SectionHeading>

          <p
            className="m-0 text-sm sm:text-base"
            style={{ color: "#888" }}
          >
            Food is any substance consumed to provide nutritional support for
            an organism.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3">
          <FilterTabs
          tabs={FILTER_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-8 sm:mb-12"
        />
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-sm"
            >
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="mt-6 flex w-full justify-center">
            <NotFound
              title="Nothing found"
              message="No dishes in this category with the current filters"
              buttonText="Clear filters"
              onAction={() => setActiveTab("All")}
              className="min-h-0 bg-transparent py-8"
            />
          </div>
        )}
      </Container>
    </section>
  );
}

export default PopularDishes;