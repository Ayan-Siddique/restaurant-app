import { Search } from "lucide-react";

type MenuFiltersProps = {
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

const categories = [
  "All",
  "Pizza",
  "Burger",
  "Pasta",
  "Dessert",
  "Starters",
];

const MenuFilters = ({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: MenuFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-sm">
        <Search size={18} className="opacity-50 shrink-0" />

        <input
          type="text"
          className="grow w-full min-w-0"
          placeholder="Search dishes..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <select
        className="select select-bordered w-full sm:w-auto sm:min-w-[160px]"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item === "All" ? "All Categories" : item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MenuFilters;