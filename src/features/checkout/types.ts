import type { CustomerOrderDetail, CustomerOrder } from "../orders/types";

/**
 * Backend Payment Contract Types
 * Route: /api/v1/payments/*
 */

export interface CreatePaymentRequest {
  addressId: string;
  specialInstructions?: string;
}

export interface CreatePaymentResponse {
  paymentId: string;
  amount: number;
  status: "pending";
}

export type PaymentFailureReason =
  | "SIMULATED_DECLINE"
  | "RESTAURANT_CLOSED"
  | "RESTAURANT_UNAVAILABLE"
  | "OUT_OF_STOCK"
  | "ITEM_UNAVAILABLE"
  | "CART_EMPTY"
  | "ADDRESS_UNAVAILABLE"
  | "AMOUNT_CHANGED";

export interface ConfirmPaymentSuccessResponse {
  paymentId: string;
  status: "success";
  transactionId: string;
  order: CustomerOrderDetail | CustomerOrder;
}

export interface ConfirmPaymentFailureResponse {
  paymentId: string;
  status: "failed";
  reason: PaymentFailureReason;
  itemId?: string;
  itemName?: string;
}

export type ConfirmPaymentResponse =
  | ConfirmPaymentSuccessResponse
  | ConfirmPaymentFailureResponse;

export type CheckoutStep =
  | "form"
  | "creating_payment"
  | "ready_to_pay"
  | "confirming_payment"
  | "failed";
