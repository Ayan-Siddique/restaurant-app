import { CalendarClock } from "lucide-react";
import { PaymentStatusBadge } from "./OrderStatusBadge";
import type { CustomerOrderDetail } from "../types";
import { formatCurrency } from "../utils";
import Button from "../../../components/common/Button";

interface OrderSummaryBreakdownProps {
  order: CustomerOrderDetail;
  onOpenCancelModal?: () => void;
  onOpenRescheduleModal?: () => void;
}

export function OrderSummaryBreakdown({
  order,
  onOpenCancelModal,
  onOpenRescheduleModal,
}: OrderSummaryBreakdownProps) {
  // Allowed cancellation and reschedule statuses: pending, accepted, preparing
  const isMutable =
    order.status === "pending" ||
    order.status === "accepted" ||
    order.status === "preparing";

  const isCancellable = isMutable;

  // Backend allows rescheduling only when mutable and NO reschedule request is currently pending
  const hasPendingReschedule = order.rescheduleRequests?.some(
    (r) => r.status === "pending"
  );
  const isReschedulable = isMutable && !hasPendingReschedule;

  return (
    <aside
      className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs flex flex-col gap-5 sticky top-24"
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h3
          className="text-base sm:text-lg font-bold text-neutral-900 m-0"
          style={{ fontFamily: "'Rubik', sans-serif" }}
        >
          Bill Summary
        </h3>

        {/* Payment Status Badge */}
        <PaymentStatusBadge status={order.paymentStatus} size="md" />
      </div>

      {/* Numerical breakdown */}
      <div className="flex flex-col gap-3 text-xs sm:text-sm text-neutral-600">
        <div className="flex items-center justify-between">
          <span>Item Subtotal</span>
          <span className="font-medium text-neutral-900">
            {formatCurrency(order.subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>GST & Restaurant Charges</span>
          <span className="font-medium text-neutral-900">
            {formatCurrency(order.gst)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Delivery Charge</span>
          <span className="font-medium text-neutral-900">
            {order.deliveryCharge === 0 ? (
              <span className="text-emerald-600 font-semibold uppercase text-xs">
                Free
              </span>
            ) : (
              formatCurrency(order.deliveryCharge)
            )}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-sm sm:text-base font-bold text-neutral-900">
          <span>Total Amount</span>
          <span
            className="text-lg sm:text-xl text-[#f5a623]"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {(isReschedulable || isCancellable || hasPendingReschedule) && (
        <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
          {/* Reschedule Delivery Button */}
          {isReschedulable && onOpenRescheduleModal && (
            <Button
              type="button"
              onClick={onOpenRescheduleModal}
              variant="outline"
              size="sm"
              className="w-full rounded-full font-medium border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900"
              id="order-detail-reschedule-button"
            >
              <CalendarClock size={15} />
              <span>Reschedule Delivery</span>
            </Button>
          )}

          {/* Pending Reschedule Badge note */}
          {hasPendingReschedule && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-xl border border-amber-200 text-center font-medium">
              Reschedule request awaiting restaurant confirmation
            </div>
          )}

          {/* Cancel Order Button */}
          {isCancellable && onOpenCancelModal && (
            <div>
              <Button
                type="button"
                onClick={onOpenCancelModal}
                variant="outline"
                size="sm"
                className="w-full !border-rose-400 !text-rose-600 hover:!bg-rose-50 rounded-full font-medium"
                id="order-detail-cancel-button"
              >
                Cancel Order
              </Button>
              <p className="text-[11px] text-neutral-400 text-center mt-1.5 m-0">
                Orders can only be cancelled before delivery.
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default OrderSummaryBreakdown;
