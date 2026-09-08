import { useState } from "react";
import FilterTabs from "../../../components/common/FilterTabs";
import SectionHeading from "../../../components/common/SectionHeading";
import Container from "../../../components/layout/Container";
import MenuCard from "../components/MenuCard";
import { menuItems } from "../data";

const FILTER_TABS = [
  "All",
  "Pizza",
  "Burger",
  "Pasta",
  "Dessert",
] as const;

function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered =
    activeTab === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <section className="w-full min-h-screen bg-[#f9f5f0] py-10 px-4 sm:px-6 lg:px-12">
      <Container>
        {/* Heading */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <SectionHeading colorHeading="Foods">
            Our Delicious
          </SectionHeading>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3">
          <FilterTabs
            tabs={FILTER_TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center">
          {filtered.map((item) => (
            <div key={item.id} className="w-full max-w-sm">
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {/* Empty state if no items match */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No dishes found in this category.
          </p>
        )}
      </Container>
    </section>
  );
}

export default MenuPage;