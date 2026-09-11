import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import Container from "../../../components/layout/Container";
import SectionHeading from "../../../components/common/SectionHeading";
import Button from "../../../components/common/Button";
import LoginModal from "../../../components/common/LoginModal";
import RegisterModal from "../../../components/common/RegisterModal";
import OrderCard from "../components/OrderCard";
import OrderCardSkeleton from "../../../components/common/skeletons/OrderCardSkeleton";
import EmptyOrders from "../components/EmptyOrders";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchOrdersThunk } from "../store/orderSlice";

export function OrdersPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { orders, isLoading, error } = useAppSelector((state) => state.order);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Only fetch orders when authenticated — strictly prevents unauthenticated requests
    if (isAuthenticated) {
      dispatch(fetchOrdersThunk());
    }
  }, [dispatch, isAuthenticated]);

  const handleRetry = () => {
    dispatch(fetchOrdersThunk());
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
                <SectionHeading colorHeading="Orders">My</SectionHeading>
              </div>
            </div>

            {/* Sign-in required card */}
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-6 shadow-xs">
                <LogIn size={48} strokeWidth={1.5} />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Sign in to view your orders
              </h3>

              <p className="text-sm sm:text-base text-neutral-500 max-w-md mb-8">
                Please sign in to your account to view your active and past orders, check delivery status, and view receipts.
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

  // ── Authenticated state: Order list ──
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
            <span>Browse Menu</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <SectionHeading colorHeading="Orders">My</SectionHeading>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Track current deliveries and view your order history
              </p>
            </div>
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div
            className="max-w-3xl mx-auto flex flex-col gap-4"
            aria-busy="true"
            aria-label="Loading your orders"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
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
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default OrdersPage;
