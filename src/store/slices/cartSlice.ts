import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem } from "../../features/cart/types";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../features/cart/services/cartService";
import { logout } from "./authSlice";

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: false,
  error: null,
};

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
    };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred while updating the cart.";
}

/**
 * Async Thunks
 */

export const getCartThunk = createAsyncThunk<
  Cart,
  void,
  { rejectValue: string }
>("cart/getCart", async (_, { rejectWithValue }) => {
  try {
    return await fetchCart();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const addToCartThunk = createAsyncThunk<
  Cart,
  { menuItemId: string; quantity?: number },
  { rejectValue: string }
>("cart/addToCart", async ({ menuItemId, quantity = 1 }, { rejectWithValue }) => {
  try {
    return await addToCart(menuItemId, quantity);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateCartItemThunk = createAsyncThunk<
  Cart,
  { id: string; quantity: number },
  { rejectValue: string }
>("cart/updateCartItem", async ({ id, quantity }, { rejectWithValue }) => {
  try {
    return await updateCartItem(id, quantity);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const removeCartItemThunk = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string }
>("cart/removeCartItem", async (id, { rejectWithValue }) => {
  try {
    return await removeCartItem(id);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const clearCartThunk = createAsyncThunk<
  Cart,
  void,
  { rejectValue: string }
>("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    return await clearCart();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

function applyCartPayload(state: CartState, cart: Cart) {
  state.items = cart.items;
  state.totalAmount = cart.totalAmount ?? 0;
  state.totalItems =
    cart.totalItems !== undefined
      ? cart.totalItems
      : cart.items.reduce((sum, it) => sum + it.quantity, 0);
  state.isLoading = false;
  state.error = null;
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: () => initialState,
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Auth Logout Integration: Reset cart state to initial state on user logout
    builder.addCase(logout, () => {
      return initialState;
    });

    // getCartThunk
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action: PayloadAction<Cart>) => {
        applyCartPayload(state, action.payload);
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load cart.";
      });

    // addToCartThunk
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action: PayloadAction<Cart>) => {
        applyCartPayload(state, action.payload);
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add item to cart.";
      });

    // updateCartItemThunk
    builder
      .addCase(updateCartItemThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateCartItemThunk.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          applyCartPayload(state, action.payload);
        }
      )
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update cart item.";
      });

    // removeCartItemThunk
    builder
      .addCase(removeCartItemThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        removeCartItemThunk.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          applyCartPayload(state, action.payload);
        }
      )
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to remove item from cart.";
      });

    // clearCartThunk
    builder
      .addCase(clearCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        clearCartThunk.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          applyCartPayload(state, action.payload);
        }
      )
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to clear cart.";
      });
  },
});

export const { resetCartState, clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
