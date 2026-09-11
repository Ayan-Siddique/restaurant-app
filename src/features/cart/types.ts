/**
 * Types for the customer Cart feature matching the backend Cart API contract:
 * - GET    /api/v1/cart
 * - POST   /api/v1/cart/add
 * - PUT    /api/v1/cart/update/{id}
 * - DELETE /api/v1/cart/remove/{id}
 * - DELETE /api/v1/cart/clear
 */

export interface CartItemMenuItemRef {
  id?: string;
  name?: string;
  price?: number;
  imageUrl?: string;
  image?: string;
  isAvailable?: boolean;
}

export interface CartItem {
  /** Cart item row ID */
  id: string;
  /** Associated menu item ID */
  menuItemId?: string;
  itemId?: string;
  /** Nested menu item reference if returned by backend */
  menuItem?: CartItemMenuItemRef;
  /** Dish / item name */
  name: string;
  /** Unit price of the item */
  price: number;
  /** Quantity of the item in the cart */
  quantity: number;
  /** Image URL of the dish if provided */
  imageUrl?: string;
  image?: string;
  /** Calculated or returned line-item subtotal if provided */
  subtotal?: number;
  itemTotal?: number;
  /** Availability status from backend: unavailable items remain visible but greyed out */
  isAvailable: boolean;
}

export interface Cart {
  id?: string;
  items: CartItem[];
  /** Total cost of all items in cart returned by backend */
  totalAmount?: number;
  subtotal?: number;
  totalItems?: number;
}

export interface AddToCartRequest {
  menuItemId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

/**
 * Flexible wrapper type to handle direct cart payloads, nested { cart: ... }, or { data: ... }
 */
export interface CartApiResponse {
  cart?: Cart;
  data?: Cart;
  items?: CartItem[];
  totalAmount?: number;
  subtotal?: number;
  message?: string;
}
