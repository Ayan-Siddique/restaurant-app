import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  CustomerOrder,
  CustomerOrderDetail,
  CancelOrderRequest,
  CancelOrderResponse,
  RescheduleOrderRequest,
  OrderTracking,
} from "../types";
import {
  orderService,
  getRescheduleErrorMessage,
} from "../services/orderService";
import { logout } from "../../../store/slices/authSlice";

interface OrderState {
  orders: CustomerOrder[];
  selectedOrder: CustomerOrderDetail | null;
  tracking: OrderTracking | null;
  isLoading: boolean;
  isTrackingLoading: boolean;
  error: string | null;
  isCancelling: boolean;
  cancelError: string | null;
  isRescheduling: boolean;
  rescheduleError: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  tracking: null,
  isLoading: false,
  isTrackingLoading: false,
  error: null,
  isCancelling: false,
  cancelError: null,
  isRescheduling: false,
  rescheduleError: null,
};

function extractOrderErrorMessage(err: unknown, defaultMsg: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosError = err as {
      response?: {
        status?: number;
        data?: {
          error?: string;
          message?: string;
          details?: Record<string, unknown>;
        };
      };
    };
    const status = axiosError.response?.status;
    const errorCode = axiosError.response?.data?.error;
    const message = axiosError.response?.data?.message;

    if (status === 409 && errorCode === "ORDER_NOT_CANCELLABLE") {
      return "This order can no longer be cancelled. Orders can only be cancelled while pending, accepted, or preparing.";
    }
    if (status === 422) {
      return (
        message ||
        "Invalid cancellation request. Please enter a reason between 1 and 500 characters."
      );
    }
    if (status === 404) {
      return "Order not found or does not belong to your account.";
    }
    if (status === 429) {
      return "Too many requests. Please wait a few moments before trying again.";
    }
    if (message) {
      return message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return defaultMsg;
}

/**
 * Thunk to fetch list of customer orders
 * GET /api/v1/orders
 */
export const fetchOrdersThunk = createAsyncThunk<
  CustomerOrder[],
  void,
  { rejectValue: string }
>("order/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    return await orderService.getOrders();
  } catch (err) {
    return rejectWithValue(
      extractOrderErrorMessage(err, "Failed to load orders. Please try again.")
    );
  }
});

/**
 * Thunk to fetch detail for a specific customer order
 * GET /api/v1/orders/:id
 */
export const fetchOrderDetailThunk = createAsyncThunk<
  CustomerOrderDetail,
  string,
  { rejectValue: string }
>("order/fetchOrderDetail", async (orderId, { rejectWithValue }) => {
  try {
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return rejectWithValue("Order not found");
    }
    return order;
  } catch (err) {
    return rejectWithValue(
      extractOrderErrorMessage(
        err,
        "Failed to load order details. Please try again."
      )
    );
  }
});

/**
 * Thunk to fetch live tracking history
 * GET /api/v1/orders/:id/track
 */
export const fetchOrderTrackingThunk = createAsyncThunk<
  OrderTracking,
  string,
  { rejectValue: string }
>("order/fetchTracking", async (orderId, { rejectWithValue }) => {
  try {
    return await orderService.trackOrder(orderId);
  } catch (err) {
    return rejectWithValue(
      extractOrderErrorMessage(err, "Failed to load order tracking.")
    );
  }
});

/**
 * Thunk to cancel an order with reason
 * PUT /api/v1/orders/:id/cancel
 */
export const cancelOrderThunk = createAsyncThunk<
  CancelOrderResponse,
  CancelOrderRequest,
  { rejectValue: string }
>("order/cancelOrder", async (payload, { rejectWithValue }) => {
  try {
    return await orderService.cancelOrder(payload);
  } catch (err) {
    return rejectWithValue(
      extractOrderErrorMessage(err, "Failed to cancel order. Please try again.")
    );
  }
});

/**
 * Thunk to request delivery rescheduling
 * POST /api/v1/orders/:id/reschedule
 * On success, immediately refetches the authoritative order detail from GET /api/v1/orders/:id.
 * No optimistic state updates are used.
 */
export const rescheduleOrderThunk = createAsyncThunk<
  void,
  RescheduleOrderRequest,
  { rejectValue: string }
>("order/rescheduleOrder", async (payload, { dispatch, rejectWithValue }) => {
  try {
    await orderService.rescheduleOrder(payload);
    // Refetch the full authoritative order from backend
    await dispatch(fetchOrderDetailThunk(payload.orderId)).unwrap();
  } catch (err) {
    return rejectWithValue(getRescheduleErrorMessage(err));
  }
});

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.tracking = null;
      state.error = null;
      state.cancelError = null;
      state.rescheduleError = null;
    },
    clearOrderError: (state) => {
      state.error = null;
      state.cancelError = null;
      state.rescheduleError = null;
    },
    setCreatedOrder: (
      state,
      action: { payload: CustomerOrderDetail | CustomerOrder }
    ) => {
      state.selectedOrder = action.payload as CustomerOrderDetail;
      const exists = state.orders.some((o) => o.id === action.payload.id);
      if (!exists) {
        state.orders.unshift(action.payload as CustomerOrder);
      }
    },
  },
  extraReducers: (builder) => {
    // ── Fetch Orders ──
    builder.addCase(fetchOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load orders.";
    });

    // ── Fetch Order Detail ──
    builder.addCase(fetchOrderDetailThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderDetailThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedOrder = action.payload;
    });
    builder.addCase(fetchOrderDetailThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load order detail.";
    });

    // ── Fetch Tracking ──
    builder.addCase(fetchOrderTrackingThunk.pending, (state) => {
      state.isTrackingLoading = true;
    });
    builder.addCase(fetchOrderTrackingThunk.fulfilled, (state, action) => {
      state.isTrackingLoading = false;
      state.tracking = action.payload;
      // Also update selectedOrder status if tracking reports newer status
      if (state.selectedOrder && action.payload.status) {
        state.selectedOrder.status = action.payload.status;
      }
    });
    builder.addCase(fetchOrderTrackingThunk.rejected, (state) => {
      state.isTrackingLoading = false;
    });

    // ── Cancel Order ──
    builder.addCase(cancelOrderThunk.pending, (state) => {
      state.isCancelling = true;
      state.cancelError = null;
    });
    builder.addCase(cancelOrderThunk.fulfilled, (state, action) => {
      state.isCancelling = false;
      // Merge updated cancellation status onto selectedOrder
      if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
        state.selectedOrder = {
          ...state.selectedOrder,
          status: "cancelled",
          paymentStatus: "refunded",
        };
      }
      // Also update in orders list
      const idx = state.orders.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) {
        state.orders[idx] = {
          ...state.orders[idx],
          status: "cancelled",
          paymentStatus: "refunded",
        };
      }
    });
    builder.addCase(cancelOrderThunk.rejected, (state, action) => {
      state.isCancelling = false;
      state.cancelError = action.payload || "Failed to cancel order.";
    });

    // ── Reschedule Order ──
    builder.addCase(rescheduleOrderThunk.pending, (state) => {
      state.isRescheduling = true;
      state.rescheduleError = null;
    });
    builder.addCase(rescheduleOrderThunk.fulfilled, (state) => {
      state.isRescheduling = false;
      state.rescheduleError = null;
    });
    builder.addCase(rescheduleOrderThunk.rejected, (state, action) => {
      state.isRescheduling = false;
      state.rescheduleError = action.payload || "Failed to reschedule order.";
    });

    // ── Reset state on logout ──
    builder.addCase(logout, () => initialState);
  },
});

export const { clearSelectedOrder, clearOrderError, setCreatedOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
