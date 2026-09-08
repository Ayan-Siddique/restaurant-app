import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";

type AdminSidebarProps = {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const AdminSidebar = ({
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) => {
  const location = useLocation();
  const isMenuRoute = location.pathname.startsWith("/admin/menu");
  const [isMenuOpen, setIsMenuOpen] = useState(isMenuRoute);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-primary-content shadow-xs"
        : "hover:bg-base-300 text-base-content/80 hover:text-base-content"
    }`;

  const subLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "hover:bg-base-300 text-base-content/70 hover:text-base-content"
    }`;

  const renderNavLinks = (onItemClick?: () => void) => (
    <nav className="space-y-1 sm:space-y-2">
      {/* Dashboard */}
      <NavLink
        to="/admin/dashboard"
        end
        onClick={onItemClick}
        className={linkClass}
      >
        <LayoutDashboard size={20} className="shrink-0" />
        <span>Dashboard</span>
      </NavLink>

      {/* Menu (expandable) */}
      <div>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            isMenuRoute
              ? "bg-base-300 text-base-content"
              : "hover:bg-base-300 text-base-content/80 hover:text-base-content"
          }`}
        >
          <UtensilsCrossed size={20} className="shrink-0" />
          <span className="flex-1 text-left">Menu</span>
          <ChevronDown
            size={16}
            className={`shrink-0 opacity-50 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isMenuOpen && (
          <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-base-300 pl-3">
            <NavLink
              to="/admin/menu"
              end
              onClick={onItemClick}
              className={subLinkClass}
            >
              <UtensilsCrossed size={16} className="shrink-0" />
              <span>Dishes</span>
            </NavLink>

            <NavLink
              to="/admin/menu/categories"
              onClick={onItemClick}
              className={subLinkClass}
            >
              <Layers size={16} className="shrink-0" />
              <span>Categories</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Orders */}
      <NavLink
        to="/admin/orders"
        onClick={onItemClick}
        className={linkClass}
      >
        <ShoppingBag size={20} className="shrink-0" />
        <span>Orders</span>
      </NavLink>

      {/* Customers */}
      <NavLink
        to="/admin/customers"
        onClick={onItemClick}
        className={linkClass}
      >
        <Users size={20} className="shrink-0" />
        <span>Customers</span>
      </NavLink>
    </nav>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-base-200 p-4 lg:block">
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold tracking-tight">Restaurant Admin</h2>
          <p className="text-sm opacity-60">Management Panel</p>
        </div>

        {renderNavLinks()}
      </aside>

      {/* Mobile & Tablet Drawer (< 1024px) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-base-200 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-50">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Restaurant Admin
                  </h2>
                  <p className="text-sm opacity-60">Management Panel</p>
                </div>

                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="btn btn-ghost btn-circle btn-sm"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              {renderNavLinks(onCloseMobile)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
