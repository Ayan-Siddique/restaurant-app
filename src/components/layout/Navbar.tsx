import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "../common/LoginModal";
import RegisterModal from "../common/RegisterModal";

interface NavbarProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

function Navbar({ containerRef }: NavbarProps = {}) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [navHeight, setNavHeight] = useState(64);

  const navbarRef = useRef<HTMLDivElement>(null);

  /* Switch between modals */
  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
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
        className={`w-full left-0 right-0 z-50 ${
          isAtBottom ? "absolute bottom-0 top-auto" : "fixed top-0"
        }`}
      >
        <div className="navbar bg-base-100 shadow-sm px-4 md:px-6 relative">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="text-lg md:text-xl font-bold cursor-pointer">
              Restaurant
            </Link>
          </div>

          {/* Desktop nav — hidden below md */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/menu">Menu</Link>
              </li>
            </ul>

            <button
              className="btn btn-sm btn-outline font-medium"
              onClick={openLogin}
              id="navbar-sign-in"
            >
              Sign In
            </button>

            <ThemeToggle />
          </div>

          {/* Mobile hamburger — visible below md */}
          <div className="flex md:hidden items-center gap-2">
            <button
              className="btn btn-sm btn-outline font-medium"
              onClick={openLogin}
              id="navbar-sign-in-mobile"
            >
              Sign In
            </button>

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
            <button
              className="text-base font-medium py-2 px-3 rounded-lg hover:bg-base-200 transition-colors text-left bg-transparent border-none cursor-pointer"
              onClick={() => { setMenuOpen(false); openLogin(); }}
            >
              Sign in
            </button>
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

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToRegister={openRegister} />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}

export default Navbar;