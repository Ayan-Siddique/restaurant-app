import type { PaymentFailureReason } from "../types";

export interface ParsedPaymentError {
  title: string;
  message: string;
  isRetryable: boolean;
  requiresCartRefresh: boolean;
  requiresNewPayment: boolean;
  existingPaymentId?: string;
  existingAmount?: number;
}

/**
 * Format application-level payment failure reasons (returned as HTTP 200)
 */
export function getPaymentFailureDetails(
  reason: PaymentFailureReason,
  itemName?: string
): ParsedPaymentError {
  switch (reason) {
    case "SIMULATED_DECLINE":
      return {
        title: "Payment Declined",
        message: "Payment was declined. You can try again.",
        isRetryable: true,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };

    case "AMOUNT_CHANGED":
      return {
        title: "Cart Total Updated",
        message:
          "Your cart total has changed. Please review your cart and start checkout again.",
        isRetryable: false,
        requiresCartRefresh: true,
        requiresNewPayment: true,
      };

    case "OUT_OF_STOCK":
      return {
        title: "Item Out of Stock",
        message: itemName
          ? `The item "${itemName}" is no longer available in the requested quantity.`
          : "An item in your cart is no longer available in the requested quantity.",
        isRetryable: false,
        requiresCartRefresh: true,
        requiresNewPayment: true,
      };

    case "ITEM_UNAVAILABLE":
      return {
        title: "Item Unavailable",
        message: itemName
          ? `"${itemName}" is currently unavailable.`
          : "An item in your cart is currently unavailable.",
        isRetryable: false,
        requiresCartRefresh: true,
        requiresNewPayment: true,
      };

    case "RESTAURANT_CLOSED":
      return {
        title: "Restaurant Closed",
        message: "The restaurant is currently closed. Please try again later.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };

    case "RESTAURANT_UNAVAILABLE":
      return {
        title: "Restaurant Unavailable",
        message: "The restaurant is currently unavailable.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };

    case "CART_EMPTY":
      return {
        title: "Cart Empty",
        message: "Your cart is empty. Please add dishes to continue.",
        isRetryable: false,
        requiresCartRefresh: true,
        requiresNewPayment: true,
      };

    case "ADDRESS_UNAVAILABLE":
      return {
        title: "Address Unavailable",
        message:
          "The selected delivery address is no longer available. Please choose or enter another address.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: true,
      };

    default:
      return {
        title: "Payment Unsuccessful",
        message: "Your payment could not be completed. Please try again.",
        isRetryable: true,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };
  }
}

/**
 * Format HTTP errors from create or confirm payment calls
 */
export function getHttpPaymentError(error: unknown): ParsedPaymentError {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          error?: string;
          message?: string;
          details?: {
            paymentId?: string;
            amount?: number;
            retryAfterSeconds?: number;
            [key: string]: unknown;
          };
        };
      };
    };

    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const errorCode = data?.error;
    const details = data?.details;

    if (status === 409) {
      if (errorCode === "PAYMENT_ALREADY_PENDING") {
        return {
          title: "Payment Already In Progress",
          message:
            data?.message ||
            "You have a pending payment open. You can continue directly to confirm it.",
          isRetryable: true,
          requiresCartRefresh: false,
          requiresNewPayment: false,
          existingPaymentId: details?.paymentId,
          existingAmount: details?.amount,
        };
      }
      if (errorCode === "PAYMENT_EXPIRED") {
        return {
          title: "Payment Expired",
          message:
            "This payment session has expired (pending > 10 minutes). Please start a fresh checkout.",
          isRetryable: false,
          requiresCartRefresh: false,
          requiresNewPayment: true,
        };
      }
      if (errorCode === "PAYMENT_ALREADY_FINALIZED") {
        return {
          title: "Payment Already Finalized",
          message:
            "This payment has already been completed or processed. Please check your orders.",
          isRetryable: false,
          requiresCartRefresh: true,
          requiresNewPayment: true,
        };
      }
    }

    if (status === 422) {
      return {
        title: "Validation Error",
        message:
          data?.message ||
          "A valid address UUID is required. Please check your delivery address.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };
    }

    if (status === 404) {
      return {
        title: "Not Found",
        message:
          data?.message ||
          "The specified address or payment was not found for your account.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: true,
      };
    }

    if (status === 400 && errorCode === "CART_EMPTY") {
      return {
        title: "Cart Empty",
        message: "Your cart has no items. Please add dishes before checkout.",
        isRetryable: false,
        requiresCartRefresh: true,
        requiresNewPayment: true,
      };
    }

    if (status === 429) {
      const waitSeconds = details?.retryAfterSeconds;
      return {
        title: "Rate Limit Exceeded",
        message: waitSeconds
          ? `Too many payment requests. Please try again in ${waitSeconds} seconds.`
          : "Too many payment requests. Please wait a moment before trying again.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };
    }

    if (status === 401) {
      return {
        title: "Authentication Required",
        message: "Your session has expired or is invalid. Please sign in again.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };
    }

    if (status === 403) {
      return {
        title: "Access Denied",
        message: "Only user accounts are permitted to place orders.",
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };
    }

    if (data?.message) {
      return {
        title: "Payment Error",
        message: data.message,
        isRetryable: false,
        requiresCartRefresh: false,
        requiresNewPayment: false,
      };
    }
  }

  if (error instanceof Error) {
    return {
      title: "Network Error",
      message: error.message,
      isRetryable: true,
      requiresCartRefresh: false,
      requiresNewPayment: false,
    };
  }

  return {
    title: "Unexpected Error",
    message: "An unexpected error occurred during payment. Please try again.",
    isRetryable: true,
    requiresCartRefresh: false,
    requiresNewPayment: false,
  };
}
