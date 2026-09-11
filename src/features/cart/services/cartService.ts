import api from "../../../services/api";
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartApiResponse,
} from "../types";

/**
 * Normalizes backend responses into a standard Cart object.
 * Handles both direct Cart returns and wrapped { cart: Cart } or { data: Cart } schemas.
 */
export function normalizeCartResponse(data: unknown): Cart {
  if (!data || typeof data !== "object") {
    return { items: [], totalAmount: 0, totalItems: 0 };
  }

  const raw = data as Record<string, unknown>;
  const cartObj = ((raw.cart || raw.data || raw) as Record<string, unknown>) || {};
  const rawItems = Array.isArray(cartObj.items)
    ? cartObj.items
    : Array.isArray(raw.items)
    ? raw.items
    : [];

  const items: CartItem[] = rawItems.map((rawItem: unknown, index: number) => {
    const item = (rawItem && typeof rawItem === "object") ? (rawItem as Record<string, unknown>) : {};
    const nested = ((item.menuItem || item.item) && typeof (item.menuItem || item.item) === "object")
      ? ((item.menuItem || item.item) as Record<string, unknown>)
      : {};

    const id = String(item.id || item._id || item.cartItemId || nested.id || index);
    const menuItemId = String(
      item.menuItemId || item.itemId || nested.id || nested._id || id
    );
    const name = String(item.name || nested.name || "Item");
    const price = Number(item.price ?? nested.price ?? 0);
    const quantity = Math.max(1, Number(item.quantity ?? 1));
    const rawImageUrl =
      item.imageUrl || item.image || nested.imageUrl || nested.image;
    const imageUrl = typeof rawImageUrl === "string" ? rawImageUrl : undefined;
    const subtotal = Number(
      item.subtotal ?? item.itemTotal ?? nested.subtotal ?? price * quantity
    );
    // Unavailable items must be preserved and flagged
    const isAvailable = Boolean(
      item.isAvailable !== undefined
        ? item.isAvailable
        : nested.isAvailable !== undefined
        ? nested.isAvailable
        : true
    );

    return {
      id,
      menuItemId,
      name,
      price,
      quantity,
      imageUrl,
      subtotal,
      isAvailable,
    };
  });

  const totalAmount =
    cartObj.totalAmount !== undefined
      ? Number(cartObj.totalAmount)
      : raw.totalAmount !== undefined
      ? Number(raw.totalAmount)
      : items.reduce((sum, it) => sum + (it.subtotal ?? it.price * it.quantity), 0);

  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  const rawId = cartObj.id || raw.id;
  const id = typeof rawId === "string" || typeof rawId === "number" ? String(rawId) : undefined;
  const rawSubtotal = cartObj.subtotal ?? raw.subtotal;
  const subtotal = typeof rawSubtotal === "number" ? rawSubtotal : typeof rawSubtotal === "string" ? Number(rawSubtotal) : totalAmount;

  return {
    id,
    items,
    totalAmount,
    subtotal,
    totalItems,
  };
}

/**
 * Fetch customer cart
 * GET /cart (resolves to /api/v1/cart via axios baseURL)
 */
export const fetchCart = async (): Promise<Cart> => {
  const response = await api.get<CartApiResponse | Cart>("/cart");
  return normalizeCartResponse(response.data);
};

/**
 * Add an item to the cart
 * POST /cart/add
 */
export const addToCart = async (
  menuItemId: string,
  quantity: number = 1
): Promise<Cart> => {
  const payload: AddToCartRequest = { menuItemId, quantity };
  const response = await api.post<CartApiResponse | Cart>("/cart/add", payload);
  return normalizeCartResponse(response.data);
};

/**
 * Update cart item quantity
 * PUT /cart/update/{id}
 */
export const updateCartItem = async (
  id: string,
  quantity: number
): Promise<Cart> => {
  const payload: UpdateCartItemRequest = { quantity };
  const response = await api.put<CartApiResponse | Cart>(
    `/cart/update/${id}`,
    payload
  );
  return normalizeCartResponse(response.data);
};

/**
 * Remove an item from the cart
 * DELETE /cart/remove/{id}
 */
export const removeCartItem = async (id: string): Promise<Cart> => {
  const response = await api.delete<CartApiResponse | Cart>(
    `/cart/remove/${id}`
  );
  return normalizeCartResponse(response.data);
};

/**
 * Clear all items from the cart
 * DELETE /cart/clear
 */
export const clearCart = async (): Promise<Cart> => {
  const response = await api.delete<CartApiResponse | Cart>("/cart/clear");
  return normalizeCartResponse(response.data);
};

export const cartService = {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

export default cartService;
