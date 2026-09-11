import { useState, useEffect, useCallback } from "react";
import {
  X,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Truck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import type { RestaurantOrderDetail } from "../../types";
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from "../../metadata";
import {
  restaurantOrderService,
  getRestaurantOrderErrorMessage,
} from "../../services/restaurantOrderService";
import Button from "../../../../components/common/Button";

interface AdminOrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
}

export function AdminOrderDetailModal({
  orderId,
  isOpen,
  onClose,
  onOrderUpdated,
}: AdminOrderDetailModalProps) {
  const [order, setOrder] = useState<RestaurantOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Reason Modal for Decline or Cancel
  const [reasonModal, setReasonModal] = useState<{
    isOpen: boolean;
    action: "decline" | "cancel";
    reason: string;
  }>({
    isOpen: false,
    action: "decline",
    reason: "",
  });

  // Reschedule Form State
  const [rescheduleAction, setRescheduleAction] = useState<{
    mode: "accept" | "reject" | null;
    confirmedTime: string;
    reason: string;
  }>({
    mode: null,
    confirmedTime: "",
    reason: "",
  });

  const [prevOrderId, setPrevOrderId] = useState<string | null>(orderId);
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);

  if (orderId !== prevOrderId || isOpen !== prevIsOpen) {
    setPrevOrderId(orderId);
    setPrevIsOpen(isOpen);
    if (isOpen && orderId) {
      setIsLoading(true);
      setError(null);
      setActionError(null);
      setActionSuccess(null);
      setReasonModal({ isOpen: false, action: "decline", reason: "" });
      setRescheduleAction({ mode: null, confirmedTime: "", reason: "" });
    } else {
      setOrder(null);
    }
  }

  const fetchOrderDetail = useCallback((id: string) => {
    setIsLoading(true);
    setError(null);
    restaurantOrderService
      .getOrder(id)
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        setError(getRestaurantOrderErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isOpen || !orderId) return;
    let isMounted = true;

    restaurantOrderService
      .getOrder(orderId)
      .then((data) => {
        if (isMounted) {
          setOrder(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getRestaurantOrderErrorMessage(err));
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
  }, [isOpen, orderId]);

  if (!isOpen || !orderId) return null;

  /**
   * Status mutation handlers (NO optimistic updates: wait for backend, then refetch)
   */
  const handleAcceptOrder = async () => {
    if (isProcessingAction || !order) return;
    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await restaurantOrderService.acceptOrder(order.id);
      setActionSuccess("Order accepted successfully.");
      await fetchOrderDetail(order.id);
      onOrderUpdated();
    } catch (err) {
      setActionError(getRestaurantOrderErrorMessage(err));
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleUpdateStatus = async (status: "preparing" | "delivered") => {
    if (isProcessingAction || !order) return;
    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await restaurantOrderService.updateStatus(order.id, status);
      setActionSuccess(
        status === "preparing"
          ? "Kitchen marked as preparing."
          : "Order successfully marked as delivered."
      );
      await fetchOrderDetail(order.id);
      onOrderUpdated();
    } catch (err) {
      setActionError(getRestaurantOrderErrorMessage(err));
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmReasonAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingAction || !order) return;

    const trimmedReason = reasonModal.reason.trim();
    if (!trimmedReason) {
      setActionError("A reason is required to proceed.");
      return;
    }

    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      if (reasonModal.action === "decline") {
        const res = await restaurantOrderService.declineOrder(order.id, trimmedReason);
        setActionSuccess(
          res.refunded
            ? "Order declined. Payment has been refunded to customer."
            : "Order declined."
        );
      } else {
        const res = await restaurantOrderService.cancelOrder(order.id, trimmedReason);
        setActionSuccess(
          res.refunded
            ? "Order cancelled. Payment has been refunded to customer."
            : "Order cancelled."
        );
      }

      setReasonModal({ isOpen: false, action: "decline", reason: "" });
      await fetchOrderDetail(order.id);
      onOrderUpdated();
    } catch (err) {
      setActionError(getRestaurantOrderErrorMessage(err));
    } finally {
      setIsProcessingAction(false);
    }
  };

  /**
   * Reschedule response handlers
   */
  const handleAcceptReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingAction || !order) return;

    if (!rescheduleAction.confirmedTime) {
      setActionError("Please select a future confirmed delivery time.");
      return;
    }

    const futureIso = new Date(rescheduleAction.confirmedTime).toISOString();

    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await restaurantOrderService.acceptReschedule(order.id, futureIso);
      setActionSuccess("Reschedule accepted. Delivery commitment updated.");
      setRescheduleAction({ mode: null, confirmedTime: "", reason: "" });
      await fetchOrderDetail(order.id);
      onOrderUpdated();
    } catch (err) {
      setActionError(getRestaurantOrderErrorMessage(err));
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRejectReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingAction || !order) return;

    const trimmedReason = rescheduleAction.reason.trim();
    if (!trimmedReason) {
      setActionError("A reason is required to reject the reschedule request.");
      return;
    }

    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await restaurantOrderService.rejectReschedule(order.id, trimmedReason);
      setActionSuccess("Reschedule request rejected.");
      setRescheduleAction({ mode: null, confirmedTime: "", reason: "" });
      await fetchOrderDetail(order.id);
      onOrderUpdated();
    } catch (err) {
      setActionError(getRestaurantOrderErrorMessage(err));
    } finally {
      setIsProcessingAction(false);
    }
  };

  const pendingReschedule = order?.rescheduleRequests?.find(
    (r) => r.status === "pending"
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-order-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-neutral-100 flex flex-col gap-4 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="admin-order-modal-title"
                  className="text-lg font-bold text-neutral-900 m-0"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  {order?.orderNumber || `Order ${orderId.slice(0, 8)}`}
                </h3>
                {order && (
                  <span
                    className={`badge badge-sm ${
                      ORDER_STATUS_BADGE_CLASSES[order.status] || "badge-ghost"
                    } font-semibold capitalize`}
                  >
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                )}
                {order?.paymentStatus && (
                  <span
                    className={`badge badge-sm ${
                      order.paymentStatus === "success"
                        ? "badge-success text-white"
                        : "badge-ghost"
                    } font-medium`}
                  >
                    {order.paymentStatus === "success" ? "Paid" : order.paymentStatus}
                  </span>
                )}
              </div>
              {order?.createdAt && (
                <p className="text-xs text-neutral-400 m-0 mt-0.5 flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close order details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Banners */}
        {actionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-xs flex items-center gap-2">
            <XCircle size={16} className="shrink-0 text-rose-600" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-500">
            <Loader2 size={24} className="animate-spin text-[#f5a623]" />
            <span className="text-xs font-medium">Loading live order details...</span>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-center flex flex-col items-center gap-2 my-6">
            <p className="text-xs font-semibold m-0">{error}</p>
            <Button
              type="button"
              onClick={() => fetchOrderDetail(orderId)}
              variant="outline"
              size="xs"
              className="border-rose-400 text-rose-800 hover:bg-rose-100"
            >
              Try Again
            </Button>
          </div>
        ) : order ? (
          <div className="flex flex-col gap-5">
            {/* Customer & Delivery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Customer Box */}
              <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Customer Information
                </span>
                <p className="font-semibold text-neutral-800 text-sm m-0">
                  {order.customer.name}
                </p>
                <p className="text-neutral-600 m-0 flex items-center gap-1">
                  <Phone size={12} /> {order.customer.phone}
                </p>
                <p className="text-neutral-600 m-0 flex items-center gap-1">
                  <Mail size={12} /> {order.customer.email}
                </p>
              </div>

              {/* Address Box */}
              <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} /> Delivery Destination
                </span>
                {order.address ? (
                  <>
                    <p className="font-semibold text-neutral-800 m-0">
                      {order.address.building ? `${order.address.building}, ` : ""}
                      {order.address.street}
                    </p>
                    <p className="text-neutral-600 m-0">
                      {order.address.area}, {order.address.city}
                    </p>
                    {order.address.landmark && (
                      <p className="text-neutral-400 text-[11px] m-0 italic">
                        Landmark: {order.address.landmark}
                      </p>
                    )}
                    {order.address.instructions && (
                      <p className="text-amber-800 bg-amber-100/60 rounded px-1.5 py-0.5 text-[10px] m-0 mt-0.5">
                        Note: {order.address.instructions}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-neutral-400 italic m-0">No address details</p>
                )}
              </div>
            </div>

            {/* Special Instructions (Optional) */}
            {order.specialInstructions && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900">
                <span className="font-semibold flex items-center gap-1 text-amber-800 mb-0.5">
                  <FileText size={13} /> Kitchen Instructions:
                </span>
                <p className="m-0">{order.specialInstructions}</p>
              </div>
            )}

            {/* Ordered Items Table */}
            <div>
              <span className="text-xs font-bold text-neutral-700 block mb-2">
                Order Items ({order.items.reduce((s, it) => s + it.quantity, 0)})
              </span>
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <table className="table table-xs sm:table-sm w-full">
                  <thead className="bg-neutral-50 text-neutral-500">
                    <tr>
                      <th>Dish</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it) => (
                      <tr key={it.id}>
                        <td className="font-medium text-neutral-800">{it.name}</td>
                        <td className="text-center">{it.quantity}</td>
                        <td className="text-right">₹{it.unitPrice.toFixed(2)}</td>
                        <td className="text-right font-semibold">
                          ₹{it.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 flex flex-col gap-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>5% GST</span>
                <span>₹{order.gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery Charge</span>
                <span>₹{order.deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-neutral-200 font-bold text-sm text-neutral-900">
                <span>Total Amount</span>
                <span className="text-[#f5a623]">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Reschedule Requests Alert & Actions */}
            {pendingReschedule && (
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-bold text-indigo-800">
                  <Clock size={15} />
                  <span>Customer Requested Delivery Reschedule</span>
                </div>
                <p className="m-0">
                  Requested Time:{" "}
                  <span className="font-semibold">
                    {new Date(pendingReschedule.requestedTime).toLocaleString()}
                  </span>
                </p>
                {pendingReschedule.reason && (
                  <p className="m-0 text-indigo-700 italic">
                    Reason: "{pendingReschedule.reason}"
                  </p>
                )}

                {/* Sub-form to accept/reject reschedule */}
                {rescheduleAction.mode === "accept" ? (
                  <form onSubmit={handleAcceptReschedule} className="flex flex-col gap-2 pt-2">
                    <label className="text-[11px] font-semibold text-indigo-900">
                      Confirmed Future Time (ISO-8601):
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={rescheduleAction.confirmedTime}
                      onChange={(e) =>
                        setRescheduleAction((prev) => ({
                          ...prev,
                          confirmedTime: e.target.value,
                        }))
                      }
                      className="input input-xs sm:input-sm border-indigo-300 bg-white"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={() =>
                          setRescheduleAction({ mode: null, confirmedTime: "", reason: "" })
                        }
                        variant="ghost"
                        size="xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isProcessingAction}
                        loading={isProcessingAction}
                        variant="secondary"
                        size="xs"
                      >
                        Confirm Slot
                      </Button>
                    </div>
                  </form>
                ) : rescheduleAction.mode === "reject" ? (
                  <form onSubmit={handleRejectReschedule} className="flex flex-col gap-2 pt-2">
                    <label className="text-[11px] font-semibold text-indigo-900">
                      Rejection Reason:
                    </label>
                    <input
                      type="text"
                      required
                      value={rescheduleAction.reason}
                      onChange={(e) =>
                        setRescheduleAction((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      placeholder="e.g. Kitchen fully booked for this time slot"
                      className="input input-xs sm:input-sm border-indigo-300 bg-white"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={() =>
                          setRescheduleAction({ mode: null, confirmedTime: "", reason: "" })
                        }
                        variant="ghost"
                        size="xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isProcessingAction}
                        loading={isProcessingAction}
                        variant="danger"
                        size="xs"
                      >
                        Reject Request
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="button"
                      onClick={() =>
                        setRescheduleAction({
                          mode: "accept",
                          confirmedTime: new Date(
                            Date.now() + 60 * 60 * 1000
                          )
                            .toISOString()
                            .slice(0, 16),
                          reason: "",
                        })
                      }
                      variant="secondary"
                      size="xs"
                      className="font-semibold"
                    >
                      Accept Reschedule
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        setRescheduleAction({
                          mode: "reject",
                          confirmedTime: "",
                          reason: "",
                        })
                      }
                      variant="outline"
                      size="xs"
                    >
                      Reject Reschedule
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Status History Timeline */}
            <div>
              <span className="text-xs font-bold text-neutral-700 block mb-2">
                Order Activity History
              </span>
              <div className="border border-neutral-200 rounded-2xl p-3 flex flex-col gap-2 max-h-36 overflow-y-auto">
                {order.statusHistory.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between text-[11px] pb-1.5 border-b border-neutral-100 last:border-none last:pb-0"
                  >
                    <div>
                      <span className="font-semibold text-neutral-800 capitalize">
                        {h.status}
                      </span>
                      {h.notes && (
                        <p className="text-neutral-500 m-0 italic">"{h.notes}"</p>
                      )}
                      <span className="text-[10px] text-neutral-400">
                        By {h.byName} ({h.by})
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                      {h.at ? new Date(h.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason Prompt Sub-modal for Decline / Cancel */}
            {reasonModal.isOpen && (
              <form
                onSubmit={handleConfirmReasonAction}
                className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <AlertTriangle size={15} className="text-rose-600" />
                  <span>
                    {reasonModal.action === "decline"
                      ? "Decline Order (Triggers Refund)"
                      : "Cancel Order (Triggers Refund)"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 m-0">
                  Please specify a reason. This explanation will be logged and the
                  customer payment will be refunded.
                </p>
                <textarea
                  required
                  rows={2}
                  value={reasonModal.reason}
                  onChange={(e) =>
                    setReasonModal((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="e.g. Ingredients out of stock for this dish..."
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 resize-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() =>
                      setReasonModal({ isOpen: false, action: "decline", reason: "" })
                    }
                    variant="ghost"
                    size="xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessingAction}
                    loading={isProcessingAction}
                    variant="danger"
                    size="xs"
                    className="font-semibold"
                  >
                    Confirm & Process Refund
                  </Button>
                </div>
              </form>
            )}

            {/* Main Bottom Contextual Actions */}
            {!reasonModal.isOpen && (
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  {/* Status: pending */}
                  {order.status === "pending" && (
                    <>
                      <Button
                        type="button"
                        onClick={() =>
                          setReasonModal({
                            isOpen: true,
                            action: "decline",
                            reason: "",
                          })
                        }
                        disabled={isProcessingAction}
                        variant="outline"
                        size="sm"
                        className="border-rose-300 text-rose-700 hover:bg-rose-50"
                      >
                        Decline Order
                      </Button>
                      <Button
                        type="button"
                        onClick={handleAcceptOrder}
                        disabled={isProcessingAction}
                        loading={isProcessingAction}
                        variant="success"
                        size="sm"
                        className="font-semibold"
                      >
                        {!isProcessingAction && <CheckCircle2 size={15} />}
                        <span>Accept Order</span>
                      </Button>
                    </>
                  )}

                  {/* Status: accepted */}
                  {order.status === "accepted" && (
                    <>
                      <Button
                        type="button"
                        onClick={() =>
                          setReasonModal({
                            isOpen: true,
                            action: "cancel",
                            reason: "",
                          })
                        }
                        disabled={isProcessingAction}
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                      >
                        Cancel Order
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus("preparing")}
                        disabled={isProcessingAction}
                        loading={isProcessingAction}
                        variant="primary"
                        size="sm"
                        className="font-semibold"
                      >
                        {!isProcessingAction && <ChefHat size={15} />}
                        <span>Start Preparing</span>
                      </Button>
                    </>
                  )}

                  {/* Status: preparing */}
                  {order.status === "preparing" && (
                    <>
                      <Button
                        type="button"
                        onClick={() =>
                          setReasonModal({
                            isOpen: true,
                            action: "cancel",
                            reason: "",
                          })
                        }
                        disabled={isProcessingAction}
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                      >
                        Cancel Order
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus("delivered")}
                        disabled={isProcessingAction}
                        loading={isProcessingAction}
                        variant="success"
                        size="sm"
                        className="font-semibold"
                      >
                        {!isProcessingAction && <Truck size={15} />}
                        <span>Mark Delivered</span>
                      </Button>
                    </>
                  )}

                  {/* Terminal states */}
                  {(order.status === "delivered" ||
                    order.status === "declined" ||
                    order.status === "cancelled") && (
                    <span className="text-xs text-neutral-400 font-medium italic">
                      Order is in terminal state ({order.status})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminOrderDetailModal;
