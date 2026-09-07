import MenuCard from "../components/MenuCard";
import { menuItems } from "../data";

function MenuPage() {
  return (
    <div className="w-full py-16 px-4" style={{ background: "#f9f5f0" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-base font-medium mb-2" style={{ color: "#f5a623" }}>
            Special Selection
          </p>
          <h1
            className="text-4xl font-bold text-neutral-800 m-0"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            Our Menu
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {menuItems.map((item) => (
            <div key={item.id} className="w-full max-w-sm">
              <MenuCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuPage;