import api from "../../../services/api";
import type {
  MenuItem,
  MenuItemsApiResponse,
  PopularMenuItem,
  PopularMenuItemsApiResponse,
  SingleMenuItemApiResponse,
  MenuItemQueryParams,
} from "../types";

/**
 * Fetch menu items with optional filtering by type ('veg' | 'non_veg') and category (ID)
 */
export const getMenuItems = async (
  params?: MenuItemQueryParams
): Promise<MenuItem[]> => {
  const response = await api.get<MenuItemsApiResponse>("/menu/items", {
    params,
  });
  return response.data.items;
};

/**
 * Fetch only vegetarian menu items
 */
export const getVegMenuItems = async (): Promise<MenuItem[]> => {
  return getMenuItems({ type: "veg" });
};

/**
 * Fetch menu items belonging to a specific category ID
 */
export const getMenuItemsByCategory = async (
  categoryId: string
): Promise<MenuItem[]> => {
  return getMenuItems({ category: categoryId });
};

/**
 * Fetch a single menu item by ID
 */
export const getMenuItemById = async (itemId: string): Promise<MenuItem> => {
  const response = await api.get<SingleMenuItemApiResponse>(
    `/menu/items/${itemId}`
  );
  return response.data.item;
};

/**
 * Search menu items by query string
 * GET /menu/search?q=<query>
 */
export const searchMenuItems = async (query: string): Promise<MenuItem[]> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  const response = await api.get<MenuItemsApiResponse>("/menu/search", {
    params: { q: trimmed },
  });
  return response.data.items;
};

/**
 * Fetch popular menu items
 * GET /menu/popular
 */
export const getPopularMenuItems = async (): Promise<PopularMenuItem[]> => {
  const response = await api.get<PopularMenuItemsApiResponse>("/menu/popular");
  return response.data.items;
};
