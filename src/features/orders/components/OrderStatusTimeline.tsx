import { CheckCircle2, Clock, XCircle, AlertCircle, CalendarClock } from "lucide-react";
import type { OrderStatus, OrderStatusHistoryItem } from "../types";
import { formatOrderDate } from "../utils";

interface OrderStatusTimelineProps {
  status: OrderStatus;
  statusHistory?: OrderStatusHistoryItem[];
  estimatedReadyAt?: string;
}

interface Step {
  key: OrderStatus;
  label: string;
  description: string;
}

const STEPS: Step[] = [
  {
    key: "pending",
    label: "Order Placed",
    description: "Waiting for restaurant acceptance",
  },
  {
    key: "accepted",
    label: "Accepted",
    description: "Restaurant has confirmed your order",
  },
  {
    key: "preparing",
    label: "Preparing",
    description: "Chef is preparing your fresh meal",
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Order delivered. Enjoy your meal!",
  },
];

const STEP_ORDER: Record<string, number> = {
  pending: 0,
  accepted: 1,
  preparing: 2,
  delivered: 3,
};

export function OrderStatusTimeline({
  status,
  statusHistory = [],
  estimatedReadyAt,
}: OrderStatusTimelineProps) {
  // Helper to find timestamp from live statusHistory
  const getStepTimestamp = (stepKey: OrderStatus): string | null => {
    const entry = statusHistory.find((h) => h.status === stepKey);
    return entry?.at ? formatOrderDate(entry.at) : null;
  };

  // Terminal State: Cancelled
  if (status === "cancelled") {
    const cancelledEntry = statusHistory.find((h) => h.status === "cancelled");
    return (
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 sm:p-6 text-neutral-800">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
            <XCircle size={22} strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-neutral-900 m-0">
              Order Cancelled
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 m-0">
              This order has been cancelled and is no longer being processed.
            </p>
            {cancelledEntry?.at && (
              <p className="text-xs text-neutral-400 mt-2 m-0">
                Cancelled on {formatOrderDate(cancelledEntry.at)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Terminal State: Declined
  if (status === "declined") {
    const declinedEntry = statusHistory.find((h) => h.status === "declined");
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 sm:p-6 text-rose-900">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertCircle size={22} strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-rose-900 m-0">
              Order Declined
            </h4>
            <p className="text-xs sm:text-sm text-rose-700 mt-1 m-0">
              The restaurant was unable to accept this order. Any charge made has been refunded.
            </p>
            {declinedEntry?.at && (
              <p className="text-xs text-rose-500 mt-2 m-0">
                Declined on {formatOrderDate(declinedEntry.at)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal Progressive Flow: pending -> accepted -> preparing -> delivered
  const currentStepIndex = STEP_ORDER[status] ?? 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <h3
          className="text-base sm:text-lg font-bold text-neutral-900 m-0"
          style={{ fontFamily: "'Rubik', sans-serif" }}
        >
          Order Status Progress
        </h3>

        {/* Estimated Ready Banner if provided by /track */}
        {estimatedReadyAt && (
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 text-xs px-3 py-1 rounded-full border border-amber-200 font-medium">
            <CalendarClock size={14} className="text-amber-600" />
            <span>Estimated ready: {formatOrderDate(estimatedReadyAt)}</span>
          </div>
        )}
      </div>

      {/* Responsive timeline */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-2">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const timestamp = getStepTimestamp(step.key);

          return (
            <div
              key={step.key}
              className="flex sm:flex-col items-center sm:text-center w-full sm:flex-1 relative gap-3 sm:gap-2"
            >
              {/* Connector line for desktop */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors ${
                    idx < currentStepIndex ? "bg-emerald-500" : "bg-neutral-200"
                  }`}
                  style={{ transform: "translateY(-50%)" }}
                  aria-hidden="true"
                />
              )}

              {/* Step indicator circle */}
              <div
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-sm"
                    : isCurrent
                    ? "bg-[#f5a623] text-white ring-4 ring-[#f5a623]/25 shadow-md"
                    : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                ) : isCurrent ? (
                  <Clock size={18} className="animate-pulse" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Step texts */}
              <div className="flex-1 sm:mt-2 text-left sm:text-center">
                <p
                  className={`text-xs sm:text-sm font-semibold m-0 transition-colors ${
                    isCurrent
                      ? "text-[#f5a623]"
                      : isCompleted
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 m-0 max-w-[140px] sm:mx-auto">
                  {step.description}
                </p>
                {timestamp && (
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    {timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatusTimeline;
