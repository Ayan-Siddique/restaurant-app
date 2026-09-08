import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "../features/admin/components/AdminSidebar";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile menu when navigating to another route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col lg:flex-row">
      {/* Mobile & Tablet Header (< 1024px) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-base-100/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <span className="block text-sm font-bold leading-tight">
              Restaurant Admin
            </span>
            <span className="block text-xs opacity-60 leading-tight">
              Management Panel
            </span>
          </div>
        </div>
      </header>

      {/* Responsive Sidebar (Desktop persistent + Mobile drawer) */}
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;