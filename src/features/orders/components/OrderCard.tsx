import { Link } from "react-router-dom";
import { ChevronRight, ShoppingBag } from "lucide-react";
import type { CustomerOrder } from "../types";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatOrderDate } from "../utils";

interface OrderCardProps {
  order: CustomerOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <article
      className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-5"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Top Header: Order number, date, and Total */}
      <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] shrink-0">
            <ShoppingBag size={20} strokeWidth={2} />
          </div>
          <div>
            <h3
              className="text-base sm:text-lg font-bold text-neutral-900 m-0 leading-tight"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              {order.orderNumber ? `Order #${order.orderNumber}` : `Order #${order.id.slice(0, 8)}`}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 m-0">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <span className="text-[11px] font-medium text-neutral-400 block uppercase tracking-wider">
            Total
          </span>
          <span
            className="text-lg sm:text-xl font-bold text-neutral-900"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* Middle: Badges & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-neutral-600">
        <div className="flex flex-wrap items-center gap-2">
          {/* Order Status Badge */}
          <OrderStatusBadge status={order.status} size="md" />

          {/* Payment Status Badge */}
          <PaymentStatusBadge status={order.paymentStatus} size="md" />
        </div>

        {order.itemCount !== undefined && order.itemCount !== null && (
          <span className="text-xs font-medium text-neutral-500">
            {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {/* Footer CTA: View Details */}
      <div className="pt-2 flex justify-end">
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#f5a623] transition-colors py-1 px-3 rounded-full hover:bg-neutral-50 cursor-pointer"
        >
          <span>View Details</span>
          <ChevronRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </article>
  );
}

export default OrderCard;
