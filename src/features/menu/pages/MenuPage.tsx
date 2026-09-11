import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import FilterTabs from "../../../components/common/FilterTabs";
import SectionHeading from "../../../components/common/SectionHeading";
import Container from "../../../components/layout/Container";
import Button from "../../../components/common/Button";
import MenuCard from "../components/MenuCard";
import MenuCardSkeleton from "../../../components/common/skeletons/MenuCardSkeleton";
import { getMenuItems, searchMenuItems } from "../services/menuService";
import { getCategories } from "../../admin/menu/services/categoryService";
import { useAppSelector } from "../../../store/hooks";
import type { MenuItem } from "../types";

interface CategoryOption {
  id: string;
  name: string;
}

function MenuPage() {
  const mode = useAppSelector((state) => state.theme.mode);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 300ms debounce on search input to prevent unnecessary API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch categories on mount to populate filter tabs
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) {
          const rawCategories =
            data.categories || [
              ...(data.veg || []),
              ...(data.non_veg || []),
            ];
          const list: CategoryOption[] = rawCategories.map((c) => ({
            id: c.id,
            name: c.name,
          }));
          setCategories(list);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories for menu tabs:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch menu items: uses search API if search term entered, otherwise uses filter APIs
  useEffect(() => {
    let isMounted = true;
    const trimmedQuery = debouncedQuery.trim();

    if (trimmedQuery) {
      // Search mode
      searchMenuItems(trimmedQuery)
        .then((data) => {
          if (isMounted) {
            setItems(data);
            setError(null);
            setIsLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (isMounted) {
            console.error("Failed to search menu items:", err);
            const message =
              err instanceof Error
                ? err.message
                : "Failed to search menu items. Please try again.";
            setError(message);
            setIsLoading(false);
          }
        });
    } else {
      // Browse mode with backend category and/or veg filters
      const selectedCategory = categories.find((c) => c.name === activeTab);
      const categoryId =
        activeTab !== "All" && selectedCategory
          ? selectedCategory.id
          : undefined;
      const typeFilter = mode === "veg" ? "veg" : undefined;

      getMenuItems({
        type: typeFilter,
        category: categoryId,
      })
        .then((data) => {
          if (isMounted) {
            setItems(data);
            setError(null);
            setIsLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (isMounted) {
            console.error("Failed to fetch menu items:", err);
            const message =
              err instanceof Error
                ? err.message
                : "Failed to load menu items. Please try again.";
            setError(message);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, activeTab, mode, categories]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);

    const trimmedQuery = debouncedQuery.trim();
    if (trimmedQuery) {
      searchMenuItems(trimmedQuery)
        .then((data) => {
          setItems(data);
          setError(null);
        })
        .catch((err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to search menu items. Please try again.";
          setError(message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      const selectedCategory = categories.find((c) => c.name === activeTab);
      const categoryId =
        activeTab !== "All" && selectedCategory
          ? selectedCategory.id
          : undefined;
      const typeFilter = mode === "veg" ? "veg" : undefined;

      getMenuItems({
        type: typeFilter,
        category: categoryId,
      })
        .then((data) => {
          setItems(data);
          setError(null);
        })
        .catch((err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load menu items. Please try again.";
          setError(message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsLoading(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsLoading(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsLoading(true);
  };

  const tabs = ["All", ...categories.map((c) => c.name)];
  const isSearchActive = Boolean(debouncedQuery.trim());

  return (
    <section className="w-full min-h-screen bg-[#f9f5f0] py-10 px-4 sm:px-6 lg:px-12">
      <Container>
        {/* Heading */}
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <SectionHeading colorHeading="Foods">Our Delicious</SectionHeading>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-8 max-w-md">
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search dishes (e.g. Chicken, Paneer)..."
              className="w-full rounded-full border border-neutral-300 bg-white py-2.5 pl-11 pr-10 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm transition-all focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs (shown when not searching) */}
        {!isSearchActive && (
          <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3">
            <FilterTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={handleTabChange}
            />
          </div>
        )}

        {/* Search Result Feedback Header */}
        {isSearchActive && (
          <div className="mb-6 flex items-center justify-between flex-wrap gap-2 text-sm text-neutral-600 px-1">
            <p>
              Showing search results for:{" "}
              <span className="font-semibold text-neutral-900">
                "{debouncedQuery.trim()}"
              </span>
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs font-medium text-[#f5a623] hover:underline cursor-pointer"
            >
              Clear search & view all
            </button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center"
            aria-busy="true"
            aria-label="Loading menu items"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full max-w-sm">
                <MenuCardSkeleton />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-base text-error font-medium">{error}</p>
            <Button
              type="button"
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="border-[#f5a623] hover:bg-[#f5a623] hover:text-white"
            >
              Try Again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {isSearchActive
                ? `No dishes found matching "${debouncedQuery.trim()}".`
                : "No dishes found in this category."}
            </p>
            {isSearchActive && (
              <Button
                type="button"
                onClick={handleClearSearch}
                variant="outline"
                size="sm"
                className="border-[#f5a623] hover:bg-[#f5a623] hover:text-white"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          /* Menu Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center">
            {items.map((item) => (
              <div key={item.id} className="w-full max-w-sm">
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default MenuPage;