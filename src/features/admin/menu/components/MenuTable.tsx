import type { MenuItem } from "../../types";
import Button from "../../../../components/common/Button";

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
                  No dishes found matching your search.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap">
                    <div className="font-semibold flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.isVeg && (
                        <span className="badge badge-success badge-xs">Veg</span>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-xs opacity-60 max-w-xs truncate">
                        {item.description}
                      </div>
                    )}
                  </td>

                  <td className="whitespace-nowrap">
                    <span className="badge badge-ghost badge-sm sm:badge-md">
                      {item.category}
                    </span>
                  </td>

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
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => onEditDish(item)}
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => onDeleteDish(item.id)}
                      >
                        Delete
                      </Button>
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
