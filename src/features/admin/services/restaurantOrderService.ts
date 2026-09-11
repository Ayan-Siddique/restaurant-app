import api from "../../../services/api";
import type {
  RestaurantOrderStatus,
  RestaurantOrderSummary,
  RestaurantOrderDetail,
  RestaurantOrderView,
  RescheduleResponseView,
  RestaurantOrdersApiResponse,
} from "../types";
import type { ApiErrorResponse } from "../../../types/auth";

export const restaurantOrderService = {
  /**
   * Fetch orders list with optional status filter
   * GET /api/v1/restaurant/orders?status=...
   */
  async listOrders(query?: {
    status?: RestaurantOrderStatus;
  }): Promise<RestaurantOrderSummary[]> {
    const params = query?.status ? { status: query.status } : undefined;
    const response = await api.get<RestaurantOrdersApiResponse>(
      "/restaurant/orders",
      { params }
    );
    return response.data.orders;
  },

  /**
   * Fetch single order full detail
   * GET /api/v1/restaurant/orders/:id
   */
  async getOrder(id: string): Promise<RestaurantOrderDetail> {
    const response = await api.get<RestaurantOrderDetail>(
      `/restaurant/orders/${id}`
    );
    return response.data;
  },

  /**
   * Accept a pending order
   * PUT /api/v1/restaurant/orders/:id/accept
   */
  async acceptOrder(id: string): Promise<RestaurantOrderView> {
    const response = await api.put<RestaurantOrderView>(
      `/restaurant/orders/${id}/accept`
    );
    return response.data;
  },

  /**
   * Decline a pending order with a reason (triggers refund)
   * PUT /api/v1/restaurant/orders/:id/decline
   */
  async declineOrder(
    id: string,
    reason: string
  ): Promise<RestaurantOrderView & { refunded: boolean }> {
    const response = await api.put<RestaurantOrderView & { refunded: boolean }>(
      `/restaurant/orders/${id}/decline`,
      { reason: reason.trim() }
    );
    return response.data;
  },

  /**
   * Advance order status forward (accepted -> preparing -> delivered)
   * PUT /api/v1/restaurant/orders/:id/status
   */
  async updateStatus(
    id: string,
    status: "preparing" | "delivered"
  ): Promise<RestaurantOrderView> {
    const response = await api.put<RestaurantOrderView>(
      `/restaurant/orders/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Cancel an accepted or preparing order with a reason (triggers refund)
   * PUT /api/v1/restaurant/orders/:id/cancel
   */
  async cancelOrder(
    id: string,
    reason: string
  ): Promise<RestaurantOrderView & { refunded: boolean }> {
    const response = await api.put<RestaurantOrderView & { refunded: boolean }>(
      `/restaurant/orders/${id}/cancel`,
      { reason: reason.trim() }
    );
    return response.data;
  },

  /**
   * Accept customer's reschedule request with a committed delivery time
   * PUT /api/v1/restaurant/orders/:id/reschedule/accept
   */
  async acceptReschedule(
    id: string,
    confirmedTime: string
  ): Promise<RescheduleResponseView> {
    const response = await api.put<RescheduleResponseView>(
      `/restaurant/orders/${id}/reschedule/accept`,
      { confirmedTime }
    );
    return response.data;
  },

  /**
   * Reject customer's reschedule request with a reason
   * PUT /api/v1/restaurant/orders/:id/reschedule/reject
   */
  async rejectReschedule(
    id: string,
    reason: string
  ): Promise<RescheduleResponseView> {
    const response = await api.put<RescheduleResponseView>(
      `/restaurant/orders/${id}/reschedule/reject`,
      { reason: reason.trim() }
    );
    return response.data;
  },
};

/**
 * Format restaurant order API error responses into user-friendly messages
 */
export function getRestaurantOrderErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: ApiErrorResponse & {
          error?: string;
          message?: string;
          details?: {
            currentStatus?: string;
            requestedStatus?: string;
            allowedFrom?: string[];
            fieldErrors?: Record<string, string[]>;
            [key: string]: unknown;
          };
        };
        status?: number;
      };
      message?: string;
    };

    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    if (data) {
      if (data.error === "INVALID_STATUS_TRANSITION") {
        const from = data.details?.currentStatus;
        const to = data.details?.requestedStatus;
        return `Cannot move order from ${from} to ${to}. Please follow the sequential preparation ladder.`;
      }

      if (data.error === "NO_PENDING_RESCHEDULE") {
        return "This order has no reschedule request awaiting a response.";
      }

      if (data.details?.fieldErrors) {
        const fields = Object.entries(data.details.fieldErrors);
        if (fields.length > 0) {
          const [field, messages] = fields[0];
          return `${field}: ${messages.join(", ")}`;
        }
      }

      if (data.message) {
        return data.message;
      }
    }

    if (status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    if (status === 403) {
      return "You do not have permission to manage restaurant orders.";
    }

    if (status === 404) {
      return "The requested order was not found.";
    }

    if (status === 429) {
      return "Too many requests. Please wait a moment before trying again.";
    }

    if (status === 500) {
      return "Server error while processing order action. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred while updating the order.";
}

export default restaurantOrderService;
