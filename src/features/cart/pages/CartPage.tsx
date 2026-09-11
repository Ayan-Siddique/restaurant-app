import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, AlertCircle, LogIn } from "lucide-react";
import Container from "../../../components/layout/Container";
import SectionHeading from "../../../components/common/SectionHeading";
import Button from "../../../components/common/Button";
import CartItemCard from "../components/CartItemCard";
import CartSummary from "../components/CartSummary";
import CartSkeleton from "../../../components/common/skeletons/CartSkeleton";
import EmptyCart from "../components/EmptyCart";
import LoginModal from "../../../components/common/LoginModal";
import RegisterModal from "../../../components/common/RegisterModal";
import CheckoutModal from "../../checkout/components/CheckoutModal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getCartThunk, clearCartThunk } from "../../../store/slices/cartSlice";

export function CartPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { items, totalAmount, isLoading, error } = useAppSelector(
    (state) => state.cart
  );
  const [isClearing, setIsClearing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    // Only fetch cart when authenticated — prevents raw 401 error display
    if (isAuthenticated) {
      dispatch(getCartThunk());
    }
  }, [dispatch, isAuthenticated]);

  const handleClearCart = async () => {
    if (items.length === 0) return;
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );
    if (!confirmed) return;

    setIsClearing(true);
    try {
      await dispatch(clearCartThunk()).unwrap();
    } finally {
      setIsClearing(false);
    }
  };

  const handleRetry = () => {
    dispatch(getCartThunk());
  };

  /* Switch between modals */
  const openLogin = (email?: string) => {
    void email;
    setShowRegister(false);
    setShowLogin(true);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const hasUnavailableItems = items.some((it) => it.isAvailable === false);

  // ── Unauthenticated state: friendly "Sign In Required" ──
  if (!isAuthenticated) {
    return (
      <>
        <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
          <Container>
            {/* Navigation */}
            <div className="mb-6 sm:mb-8">
              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mb-4 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Browse Menu</span>
              </Link>

              <div>
                <SectionHeading colorHeading="Cart">Your</SectionHeading>
              </div>
            </div>

            {/* Sign-in required card */}
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-6 shadow-sm">
                <LogIn size={48} strokeWidth={1.5} />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Sign in to view your cart
              </h3>

              <p className="text-sm sm:text-base text-neutral-500 max-w-md mb-8">
                Please sign in to your account to view, manage, and check out
                items in your cart.
              </p>

              <Button
                type="button"
                onClick={() => setShowLogin(true)}
                className="rounded-full !px-8 !py-3 font-semibold shadow-md hover:shadow-lg transition-transform"
              >
                Sign In
              </Button>
            </div>
          </Container>
        </section>

        {/* Login / Register Modals */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={openRegister}
        />
        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={openLogin}
        />
      </>
    );
  }

  // ── Authenticated state: normal cart ──
  return (
    <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
      <Container>
        {/* Navigation & Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <SectionHeading colorHeading="Cart">Your</SectionHeading>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Review your selected dishes before placing your order
              </p>
            </div>

            {items.length > 0 && (
              <Button
                type="button"
                onClick={handleClearCart}
                disabled={isClearing || isLoading}
                loading={isClearing}
                variant="ghost"
                size="sm"
                className="text-error hover:bg-error/10 font-medium"
                id="cart-clear-button"
              >
                <Trash2 size={15} />
                <span>{isClearing ? "Clearing..." : "Clear Cart"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Unavailable Items Global Notice */}
        {hasUnavailableItems && (
          <div className="mb-6 bg-error/10 border border-error/30 rounded-2xl p-4 flex items-center gap-3 text-error">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs sm:text-sm font-medium m-0">
              One or more items in your cart are currently out of stock. Please
              remove unavailable items to enable checkout.
            </p>
          </div>
        )}

        {/* Content States */}
        {isLoading && items.length === 0 ? (
          <CartSkeleton />
        ) : error && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-base text-error font-medium">{error}</p>
            <Button
              type="button"
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="border-[#f5a623] hover:bg-[#f5a623] hover:text-white"
            >
              Try Again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          /* Grid: Cart Items List + Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 flex flex-col gap-3.5">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4">
              <CartSummary
                items={items}
                totalAmount={totalAmount}
                onProceedToCheckout={() => setShowCheckout(true)}
              />
            </div>
          </div>
        )}

        {/* Checkout & Payment Modal */}
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cartTotal={totalAmount}
          itemCount={items.reduce((sum, it) => sum + it.quantity, 0)}
        />
      </Container>
    </section>
  );
}

export default CartPage;
