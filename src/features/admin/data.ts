import type { AdminCustomer, Category } from "./types";

export const adminCustomers: AdminCustomer[] = [
  {
    id: "CUST-001",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 98765 43210",
    totalOrders: 14,
    totalSpent: 8420,
    joinedDate: "Jan 15, 2026",
  },
  {
    id: "CUST-002",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98123 45678",
    totalOrders: 22,
    totalSpent: 14250,
    joinedDate: "Feb 02, 2026",
  },
  {
    id: "CUST-003",
    name: "Aman Singh",
    email: "aman.singh@example.com",
    phone: "+91 97654 32109",
    totalOrders: 8,
    totalSpent: 4890,
    joinedDate: "Mar 10, 2026",
  },
  {
    id: "CUST-004",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "+91 99887 76655",
    totalOrders: 31,
    totalSpent: 21800,
    joinedDate: "Dec 18, 2025",
  },
  {
    id: "CUST-005",
    name: "Arjun Das",
    email: "arjun.das@example.com",
    phone: "+91 95432 10987",
    totalOrders: 5,
    totalSpent: 3120,
    joinedDate: "Apr 05, 2026",
  },
];

export const adminCategories: Category[] = [
  {
    id: "CAT-001",
    name: "Pizza",
    description: "Wood-fired and classic pizzas with a variety of toppings.",
    isActive: true,
  },
  {
    id: "CAT-002",
    name: "Burger",
    description: "Juicy burgers with fresh ingredients and house sauces.",
    isActive: true,
  },
  {
    id: "CAT-003",
    name: "Pasta",
    description: "Authentic Italian pastas with rich, creamy sauces.",
    isActive: true,
  },
  {
    id: "CAT-004",
    name: "Dessert",
    description: "Sweet treats and indulgent desserts to end your meal.",
    isActive: true,
  },
  {
    id: "CAT-005",
    name: "Starters",
    description: "Appetizers and small bites to kick off your dining experience.",
    isActive: true,
  },
];