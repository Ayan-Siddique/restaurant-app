import { useState } from "react";
import { Search, Pencil } from "lucide-react";

import AdminPageHeader from "../../components/AdminPageHeader";
import AddCategoryModal from "../components/AddCategoryModal";
import { adminCategories } from "../../data";
import type { Category } from "../../types";

const AdminCategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>(adminCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCategory = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
    setIsAddModalOpen(false);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.length - activeCount;

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage your restaurant food categories."
      >
        <button
          type="button"
          className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Category
        </button>
      </AdminPageHeader>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-xl border bg-base-100 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm opacity-60 font-medium">
            Total Categories
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight">
            {categories.length}
          </p>
        </div>

        <div className="rounded-xl border bg-base-100 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm opacity-60 font-medium">Active</p>
          <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-success">
            {activeCount}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border bg-base-100 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm opacity-60 font-medium">Inactive</p>
          <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-base-content/50">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-sm">
          <Search size={18} className="opacity-50 shrink-0" />
          <input
            type="text"
            className="grow w-full min-w-0"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Categories Table */}
      <section className="rounded-xl border bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-sm sm:table-md w-full min-w-[540px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm opacity-60"
                  >
                    No categories found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="whitespace-nowrap">
                      <div className="font-semibold">{cat.name}</div>
                      <div className="text-xs opacity-50">{cat.id}</div>
                    </td>

                    <td>
                      <span className="text-sm opacity-70 line-clamp-2">
                        {cat.description || "—"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap">
                      <span
                        className={`badge badge-sm sm:badge-md ${
                          cat.isActive
                            ? "badge-success"
                            : "badge-ghost opacity-60"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap">
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs sm:btn-sm gap-1"
                      >
                        <Pencil size={14} className="shrink-0" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isAddModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddModalOpen(false)}
          onAddCategory={handleAddCategory}
          existingCategories={categories}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
