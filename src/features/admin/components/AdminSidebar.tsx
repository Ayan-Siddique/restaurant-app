import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  X,
  ChevronDown,
  Layers,
  LogOut,
  Shield,
  UserCheck,
} from "lucide-react";
import { useAppSelector } from "../../../store/hooks";
import { restaurantAuthService } from "../services/restaurantAuthService";
import Button from "../../../components/common/Button";

type AdminSidebarProps = {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const AdminSidebar = ({
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const isMenuRoute = location.pathname.startsWith("/admin/menu");
  const [isMenuOpen, setIsMenuOpen] = useState(isMenuRoute);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await restaurantAuthService.logout();
    } finally {
      setIsLoggingOut(false);
      navigate("/admin/login", { replace: true });
    }
  };

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

  const renderUserProfileAndLogout = () => (
    <div className="pt-4 border-t border-base-300 flex flex-col gap-2">
      <div className="flex items-center gap-2.5 px-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {user?.role === "admin" ? (
            <Shield size={16} />
          ) : (
            <UserCheck size={16} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold capitalize text-base-content truncate">
              {user?.role === "admin" ? "Administrator" : "Staff Member"}
            </span>
          </div>
          {user?.email && (
            <p className="text-[11px] text-base-content/60 truncate m-0">
              {user.email}
            </p>
          )}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        loading={isLoggingOut}
        variant="ghost"
        size="sm"
        className="w-full !justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700 mt-1 font-semibold"
      >
        {!isLoggingOut && <LogOut size={16} className="mr-2.5" />}
        <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-base-200 p-4 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-8 px-2">
            <h2 className="text-xl font-bold tracking-tight">Restaurant Admin</h2>
            <p className="text-sm opacity-60">Management Panel</p>
          </div>

          {renderNavLinks()}
        </div>

        {renderUserProfileAndLogout()}
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

            {renderUserProfileAndLogout()}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;