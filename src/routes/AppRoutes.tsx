import { Routes, Route, Navigate } from "react-router-dom";

import MenuPage from "../features/menu/pages/MenuPage";
import HomePage from "../features/home/pages/HomePage";
import CartPage from "../features/cart/pages/CartPage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import OrderDetailPage from "../features/orders/pages/OrderDetailPage";
import AccountPage from "../features/account/pages/AccountPage";
import NotFoundPage from "../features/common/pages/NotFoundPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../features/admin/dashboard/pages/AdminDashboardPage";
import AdminMenuPage from "../features/admin/menu/pages/AdminMenuPage";
import AdminOrdersPage from "../features/admin/orders/pages/AdminOrdersPage";
import AdminCustomersPage from "../features/admin/customers/pages/AdminCustomersPage";
import AdminCategoriesPage from "../features/admin/menu/pages/AdminCategoriesPage";
import AdminLoginPage from "../features/admin/auth/pages/AdminLoginPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Customer routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/profile" element={<Navigate to="/account" replace />} />

      {/* Restaurant Public Auth */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/restaurant/login"
        element={<Navigate to="/admin/login" replace />}
      />

      {/* Protected Restaurant / Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={["staff", "admin"]}
            redirectTo="/admin/login"
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="menu/categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;