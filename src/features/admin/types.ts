export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export type AdminOrder = {
  id: string;
  customerName: string;
  items: number;
  amount: number;
  status: OrderStatus;
  orderDate: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  isVeg: boolean;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
};