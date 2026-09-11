import api from "../../../services/api";
import type {
  CustomerOrder,
  CustomerOrderDetail,
  CancelOrderRequest,
  CancelOrderResponse,
  RescheduleOrderRequest,
  RescheduleOrderResponse,
  OrderTracking,
} from "../types";

/**
 * Customer Order Service
 * Connects directly to confirmed backend endpoints under /api/v1/orders:
 * - GET    /api/v1/orders
 * - GET    /api/v1/orders/:id
 * - PUT    /api/v1/orders/:id/cancel
 * - POST   /api/v1/orders/:id/reschedule
 * - GET    /api/v1/orders/:id/track
 */

export const orderService = {
  /**
   * Fetch customer order list
   * GET /api/v1/orders
   * Success: { "orders": [ { id, orderNumber, status, total, paymentStatus, createdAt } ] }
   */
  async getOrders(): Promise<CustomerOrder[]> {
    const response = await api.get<{ orders: CustomerOrder[] }>("/orders");
    return response.data?.orders || [];
  },

  /**
   * Fetch customer order detail by ID
   * GET /api/v1/orders/:id
   * Success: direct CustomerOrderDetail JSON object
   */
  async getOrderById(id: string): Promise<CustomerOrderDetail> {
    const response = await api.get<CustomerOrderDetail>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Request order cancellation
   * PUT /api/v1/orders/:id/cancel
   * Request body: { "reason": string } (1 - 500 chars)
   * Success: CancelOrderResponse
   */
  async cancelOrder(
    payload: CancelOrderRequest
  ): Promise<CancelOrderResponse> {
    const response = await api.put<CancelOrderResponse>(
      `/orders/${payload.orderId}/cancel`,
      {
        reason: payload.reason.trim(),
      }
    );
    return response.data;
  },

  /**
   * Request delivery reschedule
   * POST /api/v1/orders/:id/reschedule
   * Request body: { "requestedTime": "ISO-8601 string", "reason": string }
   * Success: HTTP 201 RescheduleOrderResponse
   */
  async rescheduleOrder(
    payload: RescheduleOrderRequest
  ): Promise<RescheduleOrderResponse> {
    const response = await api.post<RescheduleOrderResponse>(
      `/orders/${payload.orderId}/reschedule`,
      {
        requestedTime: payload.requestedTime,
        reason: payload.reason.trim(),
      }
    );
    return response.data;
  },

  /**
   * Fetch live order tracking history
   * GET /api/v1/orders/:id/track
   * Success: OrderTracking
   */
  async trackOrder(orderId: string): Promise<OrderTracking> {
    const response = await api.get<OrderTracking>(`/orders/${orderId}/track`);
    return response.data;
  },
};

/**
 * Maps backend errors from POST /api/v1/orders/:id/reschedule to user-friendly messages.
 */
export function getRescheduleErrorMessage(
  err: unknown,
  defaultMsg = "Failed to submit reschedule request. Please try again."
): string {
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

    if (status === 400 && errorCode === "RESCHEDULE_NOT_ALLOWED") {
      return "This order can no longer be rescheduled. Rescheduling is only allowed while the order is pending, accepted, or being prepared.";
    }
    if (status === 409 && errorCode === "RESCHEDULE_ALREADY_PENDING") {
      return "A reschedule request for this order is already awaiting approval from the restaurant.";
    }
    if (status === 422) {
      if (message?.toLowerCase().includes("future")) {
        return "The requested delivery time must be in the future.";
      }
      if (message?.toLowerCase().includes("reason")) {
        return "Please provide a valid reason (between 1 and 500 characters).";
      }
      return message || "Invalid reschedule details. Please verify the date, time, and reason.";
    }
    if (status === 401) {
      return "Your session has expired. Please log in again to reschedule.";
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

export default orderService;
