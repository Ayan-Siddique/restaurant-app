import { Eye, Check, XCircle, ChefHat, Truck } from "lucide-react";
import type { RestaurantOrderSummary } from "../../types";
import {
  ORDER_STATUS_BADGE_CLASSES,
  ORDER_STATUS_LABELS,
} from "../../metadata";
import AdminTableRowSkeleton from "../../../../components/common/skeletons/AdminTableRowSkeleton";
import Button from "../../../../components/common/Button";

interface OrderTableProps {
  orders: RestaurantOrderSummary[];
  isLoading?: boolean;
  onViewOrder: (id: string) => void;
  onAcceptOrder: (id: string) => Promise<void>;
  onDeclineOrder: (id: string) => void;
  onAdvanceStatus: (id: string, nextStatus: "preparing" | "delivered") => Promise<void>;
  activeActionId: string | null;
}

export function OrderTable({
  orders,
  isLoading = false,
  onViewOrder,
  onAcceptOrder,
  onDeclineOrder,
  onAdvanceStatus,
  activeActionId,
}: OrderTableProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-sm sm:table-md w-full min-w-[760px]">
          <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 text-xs uppercase tracking-wider">
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
            {isLoading ? (
              <AdminTableRowSkeleton columns={7} rows={5} />
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-neutral-400">
                  No orders found matching your criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isActionInProgress = activeActionId === order.id;

                return (
                  <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Order Identifier */}
                    <td className="font-semibold text-neutral-900 whitespace-nowrap">
                      <span>{order.orderNumber || `#${order.id.slice(0, 8)}`}</span>
                    </td>

                    {/* Customer */}
                    <td className="whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">
                          {order.customer.name}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {order.customer.phone}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap font-bold text-neutral-900">
                      ₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Payment Status */}
                    <td className="whitespace-nowrap">
                      <span
                        className={`badge badge-xs sm:badge-sm font-semibold capitalize ${
                          order.paymentStatus === "success"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : order.paymentStatus === "refunded"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-neutral-100 text-neutral-600 border-neutral-200"
                        }`}
                      >
                        {order.paymentStatus === "success"
                          ? "Paid"
                          : order.paymentStatus || "Pending"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap">
                      <span
                        className={`badge badge-xs sm:badge-sm font-bold capitalize ${
                          ORDER_STATUS_BADGE_CLASSES[order.status] || "badge-ghost"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap text-neutral-500 text-xs">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap text-right pr-4">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Status-specific Quick Actions */}
                        {order.status === "pending" && (
                          <>
                            <Button
                              type="button"
                              onClick={() => onAcceptOrder(order.id)}
                              disabled={isActionInProgress}
                              loading={isActionInProgress}
                              variant="success"
                              size="xs"
                              className="rounded-lg font-semibold"
                              title="Accept Order"
                            >
                              {!isActionInProgress && <Check size={12} strokeWidth={2.5} />}
                              <span>Accept</span>
                            </Button>
                            <Button
                              type="button"
                              onClick={() => onDeclineOrder(order.id)}
                              disabled={isActionInProgress}
                              variant="outline"
                              size="xs"
                              className="border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg"
                              title="Decline Order"
                            >
                              <XCircle size={12} />
                              <span>Decline</span>
                            </Button>
                          </>
                        )}

                        {order.status === "accepted" && (
                          <Button
                            type="button"
                            onClick={() => onAdvanceStatus(order.id, "preparing")}
                            disabled={isActionInProgress}
                            loading={isActionInProgress}
                            variant="primary"
                            size="xs"
                            className="rounded-lg font-semibold"
                            title="Start Preparing Dish"
                          >
                            {!isActionInProgress && <ChefHat size={12} />}
                            <span>Start Prep</span>
                          </Button>
                        )}

                        {order.status === "preparing" && (
                          <Button
                            type="button"
                            onClick={() => onAdvanceStatus(order.id, "delivered")}
                            disabled={isActionInProgress}
                            loading={isActionInProgress}
                            variant="success"
                            size="xs"
                            className="rounded-lg font-semibold"
                            title="Mark Order as Delivered"
                          >
                            {!isActionInProgress && <Truck size={12} />}
                            <span>Deliver</span>
                          </Button>
                        )}

                        {/* View Full Details Button */}
                        <Button
                          type="button"
                          onClick={() => onViewOrder(order.id)}
                          variant="ghost"
                          size="xs"
                          className="text-neutral-600 hover:text-neutral-900 rounded-lg"
                          title="View Order Details"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OrderTable;
