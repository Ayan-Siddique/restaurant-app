/**
 * Static metadata and UI configuration for the Admin feature module.
 * 
 * NOTE: This file contains ONLY static constants, navigation items, category lists,
 * filter options, and status configurations. It does NOT contain runtime state or API mock data.
 */

import type { OrderStatus } from "./types";

/**
 * Admin Navigation Items configured in the Admin Sidebar
 */
export const ADMIN_NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    iconName: "LayoutDashboard",
  },
  {
    label: "Menu",
    path: "/admin/menu",
    iconName: "UtensilsCrossed",
  },
  {
    label: "Orders",
    path: "/admin/orders",
    iconName: "ShoppingBag",
  },
  {
    label: "Customers",
    path: "/admin/customers",
    iconName: "Users",
  },
] as const;

/**
 * Menu categories currently available in the Admin Menu Filters and Add Dish modal
 */
export const MENU_CATEGORIES = [
  "Pizza",
  "Burger",
  "Pasta",
  "Dessert",
  "Starters",
] as const;

export const MENU_FILTER_CATEGORIES = [
  "All",
  ...MENU_CATEGORIES,
] as const;

/**
 * Food Types / Dietary options for dishes
 */
export const FOOD_TYPES = [
  { label: "Veg", value: true, key: "veg" },
  { label: "Non-Veg", value: false, key: "non-veg" },
] as const;

/**
 * Order statuses supported across Admin Orders and Dashboard (backend source of truth)
 */
export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "delivered",
  "declined",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  delivered: "Delivered",
  declined: "Declined",
  cancelled: "Cancelled",
};

export const ORDER_FILTER_STATUSES = [
  "all",
  ...ORDER_STATUSES,
] as const;

/**
 * UI Badge styles for each Order Status (DaisyUI class mapping)
 */
export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: "badge-warning",
  accepted: "badge-info",
  preparing: "badge-primary",
  delivered: "badge-success",
  declined: "badge-error",
  cancelled: "badge-neutral",
};

/**
 * Period options for Dashboard Revenue Overview chart
 */
export const DASHBOARD_PERIOD_OPTIONS = [
  "Last 7 Days",
  "Last 30 Days",
  "Today",
] as const;
