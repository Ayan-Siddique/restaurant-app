import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "../common/LoginModal";
import RegisterModal from "../common/RegisterModal";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Switch between modals */
  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-6 relative z-50">
        {/* Logo */}
        <div className="flex-1">
          <a className="text-lg md:text-xl font-bold">Restaurant</a>
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
        <div className="md:hidden bg-base-100 shadow-md border-t border-base-200 px-4 py-3 flex flex-col gap-3 animate-[slideDown_0.2s_ease-out] z-40 relative">
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