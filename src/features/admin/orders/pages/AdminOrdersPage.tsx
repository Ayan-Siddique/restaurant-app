import { useState, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Search,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader";
import Button from "../../../../components/common/Button";
import OrderTable from "../components/OrderTable";
import AdminOrderDetailModal from "../components/AdminOrderDetailModal";
import type { RestaurantOrderStatus, RestaurantOrderSummary } from "../../types";
import { ORDER_STATUS_LABELS } from "../../metadata";
import {
  restaurantOrderService,
  getRestaurantOrderErrorMessage,
} from "../../services/restaurantOrderService";

type FilterStatus = "all" | RestaurantOrderStatus;

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Preparing", value: "preparing" },
  { label: "Delivered", value: "delivered" },
  { label: "Declined", value: "declined" },
  { label: "Cancelled", value: "cancelled" },
];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<RestaurantOrderSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Modal State
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Reason Modal State (for Decline / Cancel initiated from Table)
  const [reasonDialog, setReasonDialog] = useState<{
    isOpen: boolean;
    orderId: string;
    action: "decline" | "cancel";
    reason: string;
  }>({
    isOpen: false,
    orderId: "",
    action: "decline",
    reason: "",
  });

  const [prevStatusFilter, setPrevStatusFilter] = useState<FilterStatus>(statusFilter);

  if (statusFilter !== prevStatusFilter) {
    setPrevStatusFilter(statusFilter);
    setIsLoading(true);
    setErrorMessage(null);
  }

  /**
   * Fetch orders list directly from live backend (for manual refresh and post-mutation sync)
   */
  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await restaurantOrderService.listOrders(
        statusFilter !== "all" ? { status: statusFilter } : undefined
      );
      setOrders(data);
    } catch (err) {
      setErrorMessage(getRestaurantOrderErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    let isMounted = true;

    restaurantOrderService
      .listOrders(statusFilter !== "all" ? { status: statusFilter } : undefined)
      .then((data) => {
        if (isMounted) {
          setOrders(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(getRestaurantOrderErrorMessage(err));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  /**
   * Quick Actions (Accept / Advance status)
   * NO optimistic UI: wait for backend, then refetch list
   */
  const handleAcceptOrder = async (orderId: string) => {
    setActiveActionId(orderId);
    setErrorMessage(null);
    setSuccessBanner(null);
    try {
      await restaurantOrderService.acceptOrder(orderId);
      setSuccessBanner("Order accepted successfully.");
      await loadOrders();
    } catch (err) {
      setErrorMessage(getRestaurantOrderErrorMessage(err));
    } finally {
      setActiveActionId(null);
    }
  };

  const handleAdvanceStatus = async (
    orderId: string,
    nextStatus: "preparing" | "delivered"
  ) => {
    setActiveActionId(orderId);
    setErrorMessage(null);
    setSuccessBanner(null);
    try {
      await restaurantOrderService.updateStatus(orderId, nextStatus);
      setSuccessBanner(
        nextStatus === "preparing"
          ? "Kitchen marked as preparing dish."
          : "Order successfully marked as delivered."
      );
      await loadOrders();
    } catch (err) {
      setErrorMessage(getRestaurantOrderErrorMessage(err));
    } finally {
      setActiveActionId(null);
    }
  };

  /**
   * Prompt reason dialog for Decline
   */
  const handleOpenDeclineDialog = (orderId: string) => {
    setReasonDialog({
      isOpen: true,
      orderId,
      action: "decline",
      reason: "",
    });
  };

  /**
   * Submit Decline or Cancel with reason
   */
  const handleConfirmReasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { orderId, action, reason } = reasonDialog;
    const trimmedReason = reason.trim();
    if (!trimmedReason || !orderId) return;

    setActiveActionId(orderId);
    setErrorMessage(null);
    setSuccessBanner(null);

    try {
      if (action === "decline") {
        const res = await restaurantOrderService.declineOrder(orderId, trimmedReason);
        setSuccessBanner(
          res.refunded
            ? "Order declined. Customer payment has been refunded."
            : "Order declined."
        );
      } else {
        const res = await restaurantOrderService.cancelOrder(orderId, trimmedReason);
        setSuccessBanner(
          res.refunded
            ? "Order cancelled. Customer payment has been refunded."
            : "Order cancelled."
        );
      }
      setReasonDialog({ isOpen: false, orderId: "", action: "decline", reason: "" });
      await loadOrders();
    } catch (err) {
      setErrorMessage(getRestaurantOrderErrorMessage(err));
    } finally {
      setActiveActionId(null);
    }
  };

  // Client-side search matching against fetched orders
  const filteredOrders = orders.filter((order) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const matchesId = order.id.toLowerCase().includes(q);
    const matchesOrderNumber = (order.orderNumber || "").toLowerCase().includes(q);
    const matchesCustomer = order.customer.name.toLowerCase().includes(q);
    const matchesPhone = order.customer.phone.includes(q);

    return matchesId || matchesOrderNumber || matchesCustomer || matchesPhone;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <AdminPageHeader
          title="Order Management"
          description="Live restaurant kitchen and delivery order operations."
        />
        <Button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="rounded-xl"
          title="Refresh orders list"
        >
          <RotateCcw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 font-bold ml-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by order #, customer, or phone..."
            className="input input-sm sm:input-md input-bordered w-full rounded-2xl pl-9 pr-3 text-xs sm:text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
            Filter Status:
          </span>
          <select
            className="select select-sm select-bordered rounded-xl text-xs font-semibold min-w-[140px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table with Loading & Empty States */}
      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading && orders.length === 0}
        onViewOrder={(id) => setSelectedOrderId(id)}
        onAcceptOrder={handleAcceptOrder}
        onDeclineOrder={handleOpenDeclineDialog}
        onAdvanceStatus={handleAdvanceStatus}
        activeActionId={activeActionId}
      />

      {/* Full Order Detail Modal */}
      <AdminOrderDetailModal
        orderId={selectedOrderId}
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
        onOrderUpdated={loadOrders}
      />

      {/* Reason Dialog for Decline / Cancel initiated from table */}
      {reasonDialog.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-100 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle size={18} />
              <span>
                {reasonDialog.action === "decline"
                  ? "Decline Order (Triggers Refund)"
                  : "Cancel Order (Triggers Refund)"}
              </span>
            </div>

            <p className="text-xs text-neutral-600 m-0">
              Please enter an explanation. The order will move to{" "}
              <span className="font-semibold text-neutral-800">
                {ORDER_STATUS_LABELS[reasonDialog.action === "decline" ? "declined" : "cancelled"]}
              </span>{" "}
              and the customer payment will be refunded.
            </p>

            <form onSubmit={handleConfirmReasonSubmit} className="flex flex-col gap-3 pt-1">
              <textarea
                required
                rows={3}
                value={reasonDialog.reason}
                onChange={(e) =>
                  setReasonDialog((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="e.g. Out of stock / Kitchen unavailable..."
                className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  onClick={() =>
                    setReasonDialog({ isOpen: false, orderId: "", action: "decline", reason: "" })
                  }
                  variant="ghost"
                  size="xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={Boolean(activeActionId) || !reasonDialog.reason.trim()}
                  loading={Boolean(activeActionId)}
                  variant="danger"
                  size="xs"
                  className="font-semibold"
                >
                  <span>Confirm & Refund</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
