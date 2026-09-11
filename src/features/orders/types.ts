/**
 * Verified Live Customer Order Domain Types
 * Endpoint: /api/v1/orders/*
 */

export type OrderStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "preparing"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "success"
  | "failed"
  | "expired"
  | "refunded";

export interface CustomerOrder {
  id: string;
  orderNumber: string | null;
  status: OrderStatus;
  total: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  itemCount?: number;
}

export interface OrderItem {
  id: string;
  menuItemId?: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  // UI compatibility helpers
  price?: number;
  lineTotal?: number;
  imageUrl?: string;
}

export interface OrderAddress {
  id?: string;
  label?: string | null;
  street: string;
  building?: string | null;
  area: string;
  city: string;
  landmark?: string | null;
  instructions?: string | null;
}

export interface CustomerOrderDetail {
  id: string;
  orderNumber: string | null;
  status: OrderStatus;
  subtotal: number;
  gst: number;
  deliveryCharge: number;
  total: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  specialInstructions?: string | null;
  items: OrderItem[];
  address: OrderAddress;
  itemCount?: number;
  cancellationReason?: string | null;
  declineReason?: string | null;
  rescheduleRequests?: CustomerRescheduleRequest[];
}

export interface CustomerRescheduleRequest {
  id: string;
  orderId?: string;
  requestedTime: string;
  reason: string | null;
  status: "pending" | "accepted" | "rejected" | string | null;
  confirmedTime?: string | null;
  rejectionReason?: string | null;
  respondedAt?: string | null;
  createdAt?: string | null;
}

export interface CancelOrderRequest {
  orderId: string;
  reason: string;
}

export interface CancelOrderResponse {
  id: string;
  orderNumber: string | null;
  status: "cancelled";
  subtotal: number;
  gst: number;
  deliveryCharge: number;
  total: number;
  paymentStatus: "refunded";
  createdAt: string;
}

export interface RescheduleOrderRequest {
  orderId: string;
  requestedTime: string; // ISO-8601 with offset or Z
  reason: string;
}

export interface RescheduleOrderResponse {
  id: string;
  orderId: string;
  requestedTime: string;
  reason: string;
  status: "pending";
  confirmedTime?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  at: string;
  by: "user" | "staff" | string;
}

export interface OrderTracking {
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  estimatedReadyAt?: string;
}
