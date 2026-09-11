import { useState } from "react";
import type { MenuItem } from "../../types";
import Button from "../../../../components/common/Button";

type AddDishModalProps = {
  onClose: () => void;
  onAddDish: (dish: MenuItem) => void;
  dish?: MenuItem | null;
  onUpdateDish: (dish: MenuItem) => void;
};



const AddDishModal = ({
  onClose,
  onAddDish,
  dish,
  onUpdateDish
}: AddDishModalProps) => {

  const [name, setName] = useState(dish?.name ?? "");
const [category, setCategory] = useState(dish?.category ?? "Pizza");
const [isVeg, setIsVeg] = useState(dish?.isVeg ?? true);
const [price, setPrice] = useState(
  dish ? dish.price.toString() : ""
);
const [description, setDescription] = useState("")
const [error, setError] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl bg-base-100 p-4 sm:p-6 shadow-xl max-h-[90vh] flex flex-col my-auto">
        <div className="mb-4 sm:mb-6 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              {dish ? "Edit Dish" : "Add New Dish"}
            </h2>

            <p className="mt-1 text-xs sm:text-sm opacity-60">
              {dish
                ? "Update details of this menu item."
                : "Add a new item to your restaurant menu."}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost shrink-0 ml-2"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Dish Name
            </label>

            <input
              type="text"
              placeholder="Enter dish name"
              className="input input-bordered w-full input-sm sm:input-md"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>

              <select
                className="select select-bordered w-full select-sm sm:select-md"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Pizza</option>
                <option>Burger</option>
                <option>Pasta</option>
                <option>Dessert</option>
                <option>Starters</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Food Type
              </label>

              <select
                className="select select-bordered w-full select-sm sm:select-md"
                value={isVeg ? "veg" : "non-veg"}
                onChange={(event) =>
                  setIsVeg(event.target.value === "veg")
                }
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Price (₹)
            </label>

            <input
              type="number"
              placeholder="Enter price"
              className="input input-bordered w-full input-sm sm:input-md"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              placeholder="Enter dish description"
              className="textarea textarea-bordered w-full textarea-sm sm:textarea-md"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            {error && (
              <p className="mt-1 text-sm text-error">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 shrink-0 pt-3 border-t">
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => {
              if (!name.trim()) {
                setError("Dish name is required.");
                return;
              }

              if (!price || Number(price) <= 0) {
                setError("Please enter a valid price.");
                return;
              }

              const dishData = {
                id: dish?.id ?? Date.now().toString(),
                name: name.trim(),
                category,
                price: Number(price),
                available: dish?.available ?? true,
                isVeg,
              };

              if (dish) {
                onUpdateDish(dishData);
              } else {
                onAddDish(dishData);
              }
            }}
          >
            {dish ? "Save Changes" : "Add Dish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddDishModal;
