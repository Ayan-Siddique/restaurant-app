import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, FileText, LogIn } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/common/Button";
import LoginModal from "../../../components/common/LoginModal";
import RegisterModal from "../../../components/common/RegisterModal";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import OrderItemRow from "../components/OrderItemRow";
import OrderSummaryBreakdown from "../components/OrderSummaryBreakdown";
import OrderDetailSkeleton from "../../../components/common/skeletons/OrderDetailSkeleton";
import CancelOrderModal from "../components/CancelOrderModal";
import RescheduleOrderModal from "../components/RescheduleOrderModal";
import OrderRescheduleBanner from "../components/OrderRescheduleBanner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchOrderDetailThunk,
  fetchOrderTrackingThunk,
  cancelOrderThunk,
  rescheduleOrderThunk,
  clearSelectedOrder,
} from "../store/orderSlice";
import { formatOrderDate } from "../utils";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const {
    selectedOrder,
    tracking,
    isLoading,
    error,
    isCancelling,
    cancelError,
    isRescheduling,
    rescheduleError,
  } = useAppSelector((state) => state.order);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(fetchOrderDetailThunk(id));
      dispatch(fetchOrderTrackingThunk(id));
    }
    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, isAuthenticated, id]);

  const handleRetry = () => {
    if (id) {
      dispatch(fetchOrderDetailThunk(id));
      dispatch(fetchOrderTrackingThunk(id));
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedOrder) return;
    try {
      await dispatch(
        cancelOrderThunk({
          orderId: selectedOrder.id,
          reason,
        })
      ).unwrap();
      setIsCancelModalOpen(false);
    } catch {
      // Error handled via Redux state
    }
  };

  const handleConfirmReschedule = async (
    requestedTimeIso: string,
    reason: string
  ) => {
    if (!selectedOrder) return;
    try {
      await dispatch(
        rescheduleOrderThunk({
          orderId: selectedOrder.id,
          requestedTime: requestedTimeIso,
          reason,
        })
      ).unwrap();
      setIsRescheduleModalOpen(false);
    } catch {
      // Error handled via Redux state
    }
  };

  /* Switch between modals */
  const openLogin = () => {
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
            <div className="mb-6 sm:mb-8">
              <Link
                to="/orders"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mb-4 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back to My Orders</span>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-6 shadow-xs">
                <LogIn size={48} strokeWidth={1.5} />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Sign in to view order details
              </h3>

              <p className="text-sm sm:text-base text-neutral-500 max-w-md mb-8">
                Please sign in to view the live status, itemized receipt, and tracking information for this order.
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

  // ── Loading state ──
  if (isLoading && !selectedOrder) {
    return (
      <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <Container>
          <OrderDetailSkeleton />
        </Container>
      </section>
    );
  }

  // ── Error state ──
  if (error && !selectedOrder) {
    return (
      <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <Container>
          <div className="mb-6">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to My Orders</span>
            </Link>
          </div>

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
        </Container>
      </section>
    );
  }

  // ── Not found fallback ──
  if (!selectedOrder) {
    return (
      <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <Container>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Order Not Found
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              We couldn't find the order you were looking for.
            </p>
            <Button to="/orders" className="!px-6 !py-2.5">
              View All Orders
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  // ── Authenticated Order Detail View ──
  return (
    <>
      <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <Container>
          {/* Navigation & Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to My Orders</span>
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1
                    className="text-2xl sm:text-3xl font-bold text-neutral-900 m-0"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    {selectedOrder.orderNumber
                      ? `Order #${selectedOrder.orderNumber}`
                      : `Order #${selectedOrder.id.slice(0, 8)}`}
                  </h1>
                  <OrderStatusBadge status={selectedOrder.status} size="lg" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 m-0">
                  Placed on {formatOrderDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation Error Alert */}
          {cancelError && (
            <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs sm:text-sm">
              <span className="font-semibold">Unable to cancel:</span>
              <span>{cancelError}</span>
            </div>
          )}

          {/* Reschedule Error Alert */}
          {rescheduleError && (
            <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs sm:text-sm">
              <span className="font-semibold">Unable to reschedule:</span>
              <span>{rescheduleError}</span>
            </div>
          )}

          {/* Main Grid: Left Column (Timeline, Items, Delivery Address) + Right Column (Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Reschedule Status Banner (Pending, Accepted, or Rejected) */}
              <OrderRescheduleBanner
                requests={selectedOrder.rescheduleRequests}
                orderStatus={selectedOrder.status}
                onOpenRescheduleModal={() => setIsRescheduleModalOpen(true)}
              />

              {/* Status Timeline */}
              <OrderStatusTimeline
                status={selectedOrder.status}
                statusHistory={tracking?.statusHistory}
                estimatedReadyAt={tracking?.estimatedReadyAt}
              />

              {/* Ordered Items Card */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs">
                  <h3
                    className="text-base sm:text-lg font-bold text-neutral-900 pb-3 mb-2 border-b border-neutral-100"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    Items in this order ({selectedOrder.items.length})
                  </h3>

                  <div className="flex flex-col">
                    {selectedOrder.items.map((item) => (
                      <OrderItemRow key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address Card */}
              {selectedOrder.address && (
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-neutral-100">
                    <MapPin size={18} className="text-[#f5a623]" />
                    <h3
                      className="text-base sm:text-lg font-bold text-neutral-900 m-0"
                      style={{ fontFamily: "'Rubik', sans-serif" }}
                    >
                      Delivery Address
                    </h3>
                    {selectedOrder.address.label && (
                      <span className="badge badge-sm bg-neutral-100 text-neutral-700 border-none font-medium ml-auto">
                        {selectedOrder.address.label}
                      </span>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {selectedOrder.address.building && (
                      <p className="font-semibold text-neutral-900 m-0">
                        {selectedOrder.address.building}
                      </p>
                    )}
                    {selectedOrder.address.street && (
                      <p className="m-0">{selectedOrder.address.street}</p>
                    )}
                    {(selectedOrder.address.area || selectedOrder.address.city) && (
                      <p className="m-0">
                        {[selectedOrder.address.area, selectedOrder.address.city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  {selectedOrder.address.landmark && (
                    <p className="text-neutral-500 text-xs mt-1 m-0">
                      Landmark: {selectedOrder.address.landmark}
                    </p>
                  )}
                  {selectedOrder.address.instructions && (
                    <p className="text-neutral-500 text-xs mt-1 m-0 italic">
                      Note: {selectedOrder.address.instructions}
                    </p>
                  )}
                </div>
              </div>
            )}

              {/* Special Instructions (Only if present and meaningful) */}
              {selectedOrder.specialInstructions &&
                selectedOrder.specialInstructions.trim().length > 0 && (
                  <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-neutral-100">
                      <FileText size={18} className="text-[#f5a623]" />
                      <h3
                        className="text-base sm:text-lg font-bold text-neutral-900 m-0"
                        style={{ fontFamily: "'Rubik', sans-serif" }}
                      >
                        Special Instructions
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-700 m-0 bg-neutral-50 p-3 rounded-2xl border border-neutral-100 italic">
                      "{selectedOrder.specialInstructions}"
                    </p>
                  </div>
                )}
            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4">
              <OrderSummaryBreakdown
                order={selectedOrder}
                onOpenCancelModal={() => setIsCancelModalOpen(true)}
                onOpenRescheduleModal={() => setIsRescheduleModalOpen(true)}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        orderNumber={selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}
        isSubmitting={isCancelling}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      {/* Reschedule Order Modal */}
      <RescheduleOrderModal
        isOpen={isRescheduleModalOpen}
        orderNumber={selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}
        isSubmitting={isRescheduling}
        onClose={() => setIsRescheduleModalOpen(false)}
        onConfirm={handleConfirmReschedule}
      />
    </>
  );
}

export default OrderDetailPage;
