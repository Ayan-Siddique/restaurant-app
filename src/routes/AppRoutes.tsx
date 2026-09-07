import { Routes, Route } from "react-router-dom";
import MenuPage from "../features/menu/pages/MenuPage";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../features/common/pages/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;