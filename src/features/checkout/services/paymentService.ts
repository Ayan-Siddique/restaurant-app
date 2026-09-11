import api from "../../../services/api";
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  ConfirmPaymentResponse,
} from "../types";

export const paymentService = {
  /**
   * Initialize checkout by creating a pending payment record.
   * POST /api/v1/payments/create
   *
   * Request body contains ONLY addressId and optional specialInstructions.
   * Backend computes amount server-side from the user's cart.
   */
  async createPayment(
    payload: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    const body: { addressId: string; specialInstructions?: string } = {
      addressId: payload.addressId.trim(),
    };

    if (payload.specialInstructions && payload.specialInstructions.trim()) {
      body.specialInstructions = payload.specialInstructions.trim().slice(0, 1000);
    }

    const response = await api.post<CreatePaymentResponse>(
      "/payments/create",
      body
    );
    return response.data;
  },

  /**
   * Finalize payment and trigger atomic backend order creation.
   * POST /api/v1/payments/:id/confirm
   *
   * No request body.
   * Returns HTTP 200 with status: "success" or application failure status: "failed".
   */
  async confirmPayment(paymentId: string): Promise<ConfirmPaymentResponse> {
    const response = await api.post<ConfirmPaymentResponse>(
      `/payments/${paymentId}/confirm`
    );
    return response.data;
  },
};

export default paymentService;
