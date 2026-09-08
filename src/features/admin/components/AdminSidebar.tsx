import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

type AdminSidebarProps = {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/menu",
    label: "Menu",
    icon: UtensilsCrossed,
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    to: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
];

const AdminSidebar = ({
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) => {
  const renderNavLinks = (onItemClick?: () => void) => (
    <nav className="space-y-1 sm:space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-content shadow-xs"
                  : "hover:bg-base-300 text-base-content/80 hover:text-base-content"
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
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