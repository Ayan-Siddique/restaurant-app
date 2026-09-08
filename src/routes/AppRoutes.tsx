import { Routes, Route, Navigate } from "react-router-dom";

import MenuPage from "../features/menu/pages/MenuPage";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../features/common/pages/NotFoundPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../features/admin/dashboard/pages/AdminDashboardPage";
import AdminMenuPage from "../features/admin/menu/pages/AdminMenuPage";
import AdminOrdersPage from "../features/admin/orders/pages/AdminOrdersPage";
import AdminCustomersPage from "../features/admin/customers/pages/AdminCustomersPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Customer routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;