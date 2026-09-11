import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, RefreshCw } from "lucide-react";

import AdminPageHeader from "../../components/AdminPageHeader";
import Button from "../../../../components/common/Button";
import AddCategoryModal from "../components/AddCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import AdminTableRowSkeleton from "../../../../components/common/skeletons/AdminTableRowSkeleton";
import {
  getCategories,
  transformCategoriesResponse,
} from "../services/categoryService";
import type { Category } from "../../types";

const AdminCategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    let isMounted = true;

    getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(transformCategoriesResponse(data));
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to fetch categories:", err);
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load categories from backend.";
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    getCategories()
      .then((data) => {
        setCategories(transformCategoriesResponse(data));
      })
      .catch((err: unknown) => {
        console.error("Failed to retry categories:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load categories from backend.";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddCategory = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
    setIsAddModalOpen(false);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
    setEditingCategory(null);
  };

  const handleToggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    setCategories((prev) => prev.filter((cat) => cat.id !== deletingCategory.id));
    setDeletingCategory(null);
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
        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Category
        </Button>
      </AdminPageHeader>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-xl border bg-base-100 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm opacity-60 font-medium">
            Total Categories
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight">
            {isLoading ? "—" : categories.length}
          </p>
        </div>

        <div className="rounded-xl border bg-base-100 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm opacity-60 font-medium">Active</p>
          <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-success">
            {isLoading ? "—" : activeCount}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border bg-base-100 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm opacity-60 font-medium">Inactive</p>
          <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-base-content/50">
            {isLoading ? "—" : inactiveCount}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mb-6 alert alert-error shadow-sm flex items-center justify-between"
        >
          <span className="text-sm">{error}</span>
          <button
            type="button"
            className="btn btn-xs btn-outline"
            onClick={handleRetry}
          >
            <RefreshCw size={12} className="shrink-0" />
            Retry
          </button>
        </div>
      )}

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
              {isLoading ? (
                <AdminTableRowSkeleton columns={4} rows={5} />
              ) : error ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-error">
                      <p className="text-sm font-medium">{error}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-rose-300 text-rose-700 hover:bg-rose-50"
                        onClick={handleRetry}
                      >
                        <RefreshCw size={14} />
                        Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
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
                      <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input
                          type="checkbox"
                          className="toggle toggle-success toggle-xs sm:toggle-sm"
                          checked={cat.isActive}
                          onChange={() => handleToggleActive(cat.id)}
                          aria-label={`Toggle active status for ${cat.name}`}
                          title={
                            cat.isActive
                              ? "Click to deactivate"
                              : "Click to activate"
                          }
                        />
                        <span
                          className={`badge badge-sm sm:badge-md select-none ${
                            cat.isActive
                              ? "badge-success"
                              : "badge-ghost opacity-60"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </td>

                    <td className="whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => setEditingCategory(cat)}
                          aria-label={`Edit ${cat.name}`}
                          title="Edit category"
                        >
                          <Pencil size={14} className="shrink-0" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          className="text-rose-600 hover:bg-rose-50"
                          onClick={() => setDeletingCategory(cat)}
                          aria-label={`Delete ${cat.name}`}
                          title="Delete category"
                        >
                          <Trash2 size={14} className="shrink-0" />
                          <span className="hidden sm:inline">Delete</span>
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

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <AddCategoryModal
          key="add-category"
          onClose={() => setIsAddModalOpen(false)}
          onAddCategory={handleAddCategory}
          existingCategories={categories}
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <AddCategoryModal
          key={`edit-${editingCategory.id}`}
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          existingCategories={categories}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <DeleteCategoryModal
          categoryName={deletingCategory.name}
          onClose={() => setDeletingCategory(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
