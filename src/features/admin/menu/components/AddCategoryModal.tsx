import { useState, useEffect, useCallback } from "react";
import type { Category } from "../../types";
import Button from "../../../../components/common/Button";

type AddCategoryModalProps = {
  onClose: () => void;
  onAddCategory: (category: Category) => void;
  existingCategories: Category[];
  category?: Category | null;
  onUpdateCategory?: (category: Category) => void;
};

const AddCategoryModal = ({
  onClose,
  onAddCategory,
  existingCategories,
  category,
  onUpdateCategory,
}: AddCategoryModalProps) => {
  const isEditing = Boolean(category);

  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [error, setError] = useState("");

  const handleClose = useCallback(() => {
    setName("");
    setDescription("");
    setError("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const generateCategoryId = (): string => {
    const numericIds = existingCategories
      .map((c) => parseInt(c.id.replace(/\D/g, ""), 10))
      .filter((n) => !isNaN(n));
    if (numericIds.length > 0) {
      const nextNum = Math.max(...numericIds) + 1;
      return `CAT-${String(nextNum).padStart(3, "0")}`;
    }
    return `CAT-${Date.now()}`;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    const isDuplicate = existingCategories.some((cat) => {
      if (category && cat.id === category.id) {
        return false;
      }
      return cat.name.trim().toLowerCase() === trimmedName.toLowerCase();
    });

    if (isDuplicate) {
      setError(`A category named "${trimmedName}" already exists.`);
      return;
    }

    if (category && onUpdateCategory) {
      const updatedCategory: Category = {
        ...category,
        name: trimmedName,
        description: description.trim() || undefined,
      };
      onUpdateCategory(updatedCategory);
    } else {
      const newCategory: Category = {
        id: generateCategoryId(),
        name: trimmedName,
        description: description.trim() || undefined,
        isActive: true,
      };
      onAddCategory(newCategory);
    }

    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-base-100 p-4 sm:p-6 shadow-xl max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-start justify-between shrink-0">
          <div>
            <h2 id="category-modal-title" className="text-lg sm:text-xl font-bold">
              {isEditing ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm opacity-60">
              {isEditing
                ? "Update details of this food category."
                : "Create a new food category for your menu."}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost shrink-0 ml-2"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div>
              <label
                htmlFor="category-name"
                className="mb-1 block text-sm font-medium"
              >
                Category Name <span className="text-error">*</span>
              </label>

              <input
                id="category-name"
                type="text"
                placeholder="Enter category name"
                className={`input input-bordered w-full input-sm sm:input-md ${
                  error ? "input-error" : ""
                }`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="category-description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="category-description"
                placeholder="Enter category description (optional)"
                className="textarea textarea-bordered w-full textarea-sm sm:textarea-md"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-error font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 shrink-0 pt-3 border-t">
            <Button
              type="button"
              variant="ghost"
              size="md"
              className="w-full sm:w-auto"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
            >
              {isEditing ? "Save Changes" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
