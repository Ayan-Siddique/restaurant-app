export type RestaurantOrderStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "preparing"
  | "delivered"
  | "cancelled";

export type OrderStatus = RestaurantOrderStatus;

export type StaffSettableStatus = "preparing" | "delivered";

export interface RestaurantCustomerSummary {
  id: string;
  name: string;
  phone: string;
}

export interface RestaurantCustomerDetail {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface RestaurantOrderSummary {
  id: string;
  orderNumber: string | null;
  status: RestaurantOrderStatus;
  total: number;
  paymentStatus: string | null;
  createdAt: string | Date | null;
  customer: RestaurantCustomerSummary;
}

export interface RestaurantOrderView {
  id: string;
  orderNumber: string | null;
  status: RestaurantOrderStatus;
  subtotal: number;
  gst: number;
  deliveryCharge: number;
  total: number;
  paymentStatus: string | null;
  createdAt: string | Date | null;
}

export interface RestaurantOrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface RestaurantOrderAddress {
  id: string;
  label: string | null;
  street: string;
  building: string | null;
  area: string;
  city: string;
  landmark: string | null;
  instructions: string | null;
}

export interface RestaurantOrderStatusHistory {
  status: string;
  at: string | Date | null;
  notes: string | null;
  by: "user" | "staff";
  byName: string;
}

export interface RestaurantRescheduleRequest {
  id: string;
  requestedTime: string | Date;
  reason: string | null;
  status: string | null;
  confirmedTime: string | Date | null;
  rejectionReason: string | null;
  respondedAt: string | Date | null;
  createdAt: string | Date | null;
}

export interface RestaurantOrderDetail extends RestaurantOrderView {
  specialInstructions: string | null;
  customer: RestaurantCustomerDetail;
  items: RestaurantOrderItem[];
  address: RestaurantOrderAddress;
  statusHistory: RestaurantOrderStatusHistory[];
  rescheduleRequests: RestaurantRescheduleRequest[];
}

export interface RescheduleResponseView {
  id: string;
  orderId: string;
  requestedTime: string | Date;
  reason: string | null;
  status: string | null;
  confirmedTime: string | Date | null;
  rejectionReason: string | null;
  respondedAt: string | Date | null;
  kitchenNotifyAt?: string | Date;
}

export interface RestaurantOrdersApiResponse {
  orders: RestaurantOrderSummary[];
}

// Backward compatibility for existing references
export type AdminOrder = RestaurantOrderSummary;

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  isVeg: boolean;
  description?: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  itemCount?: number;
  type?: "veg" | "non_veg";
  isActive: boolean;
};

export interface ApiCategoryItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  itemCount?: number;
}

export interface CategoriesApiResponse {
  categories: ApiCategoryItem[];
  veg?: ApiCategoryItem[];
  non_veg?: ApiCategoryItem[];
}

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
};