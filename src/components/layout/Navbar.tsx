import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Clock, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "../common/LoginModal";
import RegisterModal from "../common/RegisterModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { getCartThunk } from "../../store/slices/cartSlice";

interface NavbarProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

function Navbar({ containerRef }: NavbarProps = {}) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartTotalItems = useAppSelector((state) => state.cart.totalItems);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [navHeight, setNavHeight] = useState(64);

  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch current cart only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCartThunk());
    }
  }, [dispatch, isAuthenticated]);

  /* Switch between modals */
  const openLogin = (email?: string) => {
    if (email && typeof email === "string") {
      setPrefilledEmail(email);
    }
    setShowRegister(false);
    setShowLogin(true);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  /* Track scroll position relative to containing section */
  useEffect(() => {
    const getTargetSection = (): HTMLElement | null => {
      if (containerRef?.current) return containerRef.current;
      return (
        navbarRef.current?.closest("section") ||
        navbarRef.current?.parentElement ||
        null
      );
    };

    const updateHeight = () => {
      if (navbarRef.current) {
        const measuredHeight = navbarRef.current.offsetHeight;
        if (measuredHeight > 0) {
          setNavHeight(measuredHeight);
        }
      }
    };

    updateHeight();

    let rafId: number | null = null;

    const checkPosition = () => {
      const section = getTargetSection();
      const navEl = navbarRef.current;
      if (!section || !navEl) return;

      const sectionRect = section.getBoundingClientRect();
      const currentNavHeight = navEl.offsetHeight || 64;

      // When the bottom edge of the containing section reaches or goes above
      // the bottom edge of the fixed navbar: switch to absolute at section bottom
      const atBottom = sectionRect.bottom <= currentNavHeight;

      setIsAtBottom((prev) => (prev !== atBottom ? atBottom : prev));
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateHeight();
        checkPosition();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // Initial evaluation
    checkPosition();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [containerRef, menuOpen]);

  return (
    <>
      <header
        ref={navbarRef}
        className={`w-full left-0 right-0 z-50 transition-all duration-300 ${
          isAtBottom ? "absolute bottom-0 top-auto" : "fixed top-0"
        }`}
      >
        <div
          className={`navbar px-4 md:px-8 relative transition-all duration-300 ${
            isHome && !isScrolled
              ? "bg-transparent shadow-none border-b border-transparent"
              : "bg-[#faf7f2]/92 backdrop-blur-md shadow-xs border-b border-[#e7e0d8]"
          }`}
        >
          {/* Logo */}
          <div className="flex-1">
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold tracking-tight text-[#1c1917] cursor-pointer"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Feesto
            </Link>
          </div>

          {/* Desktop nav — hidden below md */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4">
            <ul className="menu menu-horizontal px-0.5 gap-0.5 text-xs lg:text-sm">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/menu">Menu</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/orders" id="navbar-orders-desktop">
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/account" id="navbar-account-desktop">
                      My Account
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/account"
                  className="text-xs font-medium text-base-content/80 hover:text-[#f5a623] max-w-[140px] truncate transition-colors cursor-pointer"
                  title={user?.firstName || user?.email || "Customer"}
                  id="navbar-user-greeting"
                >
                  Hi, {user?.firstName || "Customer"}
                </Link>
                <button
                  className="btn btn-sm btn-outline font-medium"
                  onClick={handleLogout}
                  id="navbar-sign-out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-outline font-medium"
                onClick={() => openLogin()}
                id="navbar-sign-in"
              >
                Sign In
              </button>
            )}

            {/* Desktop Cart Icon Link — only when authenticated */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="btn btn-ghost btn-circle btn-sm relative"
                aria-label={`Shopping Cart with ${cartTotalItems} items`}
                id="navbar-cart-desktop"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartTotalItems > 0 && (
                  <span className="badge badge-sm bg-[#f5a623] border-none text-black font-bold absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full text-[10px] flex items-center justify-center shadow-sm">
                    {cartTotalItems > 99 ? "99+" : cartTotalItems}
                  </span>
                )}
              </Link>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile hamburger — visible below md */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart Icon Link — only when authenticated */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="btn btn-ghost btn-circle btn-sm relative"
                aria-label={`Shopping Cart with ${cartTotalItems} items`}
                id="navbar-cart-mobile"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartTotalItems > 0 && (
                  <span className="badge badge-sm bg-[#f5a623] border-none text-black font-bold absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full text-[10px] flex items-center justify-center shadow-sm">
                    {cartTotalItems > 99 ? "99+" : cartTotalItems}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <button
                className="btn btn-sm btn-outline font-medium"
                onClick={handleLogout}
                id="navbar-sign-out-mobile"
              >
                Sign Out
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline font-medium"
                onClick={() => openLogin()}
                id="navbar-sign-in-mobile"
              >
                Sign In
              </button>
            )}

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              id="navbar-hamburger"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-base-100 shadow-md border-t border-base-200 px-4 py-3 flex flex-col gap-3 animate-[slideDown_0.2s_ease-out] relative">
            <Link
              to="/"
              className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Menu
            </Link>
            {/* My Orders link in mobile dropdown — only when authenticated */}
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors flex items-center justify-between"
                  onClick={() => setMenuOpen(false)}
                  id="navbar-orders-mobile"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    My Orders
                  </span>
                </Link>
                <Link
                  to="/account"
                  className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors flex items-center justify-between"
                  onClick={() => setMenuOpen(false)}
                  id="navbar-account-mobile"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    My Account
                  </span>
                </Link>
              </>
            )}
            {/* Cart link in mobile dropdown — only when authenticated */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors flex items-center justify-between"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </span>
                {cartTotalItems > 0 && (
                  <span className="badge bg-[#f5a623] text-black border-none badge-sm font-bold">
                    {cartTotalItems}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <button
                className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors text-left text-error bg-transparent border-none cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                id="navbar-dropdown-logout"
              >
                Sign Out ({user?.firstName || user?.email || "Account"})
              </button>
            ) : (
              <button
                className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors text-left bg-transparent border-none cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  openLogin();
                }}
                id="navbar-dropdown-login"
              >
                Sign in
              </button>
            )}
            <div className="border-t border-base-200 pt-3">
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>

      {/* Spacer to preserve normal document flow and prevent layout shift */}
      <div
        style={{ height: navHeight }}
        className="w-full shrink-0 pointer-events-none"
        aria-hidden="true"
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={openRegister}
        initialEmail={prefilledEmail}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}

export default Navbar;