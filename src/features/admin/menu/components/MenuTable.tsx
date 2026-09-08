import type { MenuItem } from "../../types";

type MenuTableProps = {
  items: MenuItem[];
  onAvailabilityChange: (id: string) => void;
  onEditDish: (dish: MenuItem) => void;
  onDeleteDish: (id: string) => void;
};

const MenuTable = ({ items, onAvailabilityChange, onEditDish, onDeleteDish }: MenuTableProps) => {
  return (
    <section className="rounded-xl border bg-base-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="table table-sm sm:table-md w-full min-w-[620px]">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm opacity-60">
                  No dishes found matching your criteria.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.name}</span>
                      <span
                        className={`badge badge-xs shrink-0 ${
                          item.isVeg ? "badge-success" : "badge-error"
                        }`}
                      >
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap">{item.category}</td>

                  <td className="whitespace-nowrap font-medium">
                    ₹{item.price.toLocaleString("en-IN")}
                  </td>

                  <td className="whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="toggle toggle-success toggle-sm sm:toggle-md"
                      checked={item.available}
                      onChange={() => onAvailabilityChange(item.id)}
                      aria-label={`Toggle availability for ${item.name}`}
                    />
                  </td>

                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        className="btn btn-ghost btn-xs sm:btn-sm"
                        onClick={() => onEditDish(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-ghost btn-xs sm:btn-sm text-error"
                        onClick={() => onDeleteDish(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MenuTable;
