export interface MenuCategoryRef {
  id: string;
  name: string;
  type: "veg" | "non_veg" | string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  image?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  category?: MenuCategoryRef | string;
  description?: string;
  prepTimeMinutes?: number;
}

export interface PopularMenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: MenuCategoryRef | string;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface MenuItemsApiResponse {
  items: MenuItem[];
}

export interface PopularMenuItemsApiResponse {
  items: PopularMenuItem[];
}

export interface SingleMenuItemApiResponse {
  item: MenuItem;
}

export interface MenuItemQueryParams {
  type?: "veg" | "non_veg" | string;
  category?: string;
}