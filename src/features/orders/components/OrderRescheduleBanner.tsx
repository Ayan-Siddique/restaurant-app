import { Clock, CheckCircle2, AlertCircle, CalendarClock } from "lucide-react";
import type { CustomerRescheduleRequest, OrderStatus } from "../types";
import { formatOrderDate } from "../utils";
import Button from "../../../components/common/Button";

interface OrderRescheduleBannerProps {
  requests?: CustomerRescheduleRequest[];
  orderStatus: OrderStatus;
  onOpenRescheduleModal?: () => void;
}

function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return `${d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  } catch {
    return isoString;
  }
}

export function OrderRescheduleBanner({
  requests,
  orderStatus,
  onOpenRescheduleModal,
}: OrderRescheduleBannerProps) {
  if (!requests || requests.length === 0) return null;

  // The backend orders requests by createdAt: 'desc', so the first item is the most recent
  const latest = requests[0];
  if (!latest) return null;

  const isOrderMutable =
    orderStatus === "pending" ||
    orderStatus === "accepted" ||
    orderStatus === "preparing";

  // ── 1. Pending Approval ──
  if (latest.status === "pending") {
    return (
      <div
        className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-3"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Clock size={18} strokeWidth={2} />
            </div>
            <h4
              className="text-sm sm:text-base font-bold text-amber-950 m-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Delivery Reschedule Requested
            </h4>
          </div>

          <span className="badge badge-sm bg-amber-200/80 text-amber-900 border-none font-semibold uppercase text-[10px] tracking-wide">
            Pending Restaurant Approval
          </span>
        </div>

        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          <p className="m-0 font-medium">
            Requested new time:{" "}
            <span className="font-bold underline decoration-amber-300 underline-offset-2">
              {formatDateTime(latest.requestedTime)}
            </span>
          </p>
          {latest.reason && (
            <p className="mt-1 text-xs text-amber-800/90 italic m-0">
              Reason provided: "{latest.reason}"
            </p>
          )}
        </div>

        <p className="text-[11px] text-amber-700/80 m-0 pt-2 border-t border-amber-200/50">
          The kitchen is reviewing your requested delivery slot. Your current schedule remains active until accepted.
        </p>
      </div>
    );
  }

  // ── 2. Accepted ──
  if (latest.status === "accepted") {
    const effectiveTime = latest.confirmedTime || latest.requestedTime;
    return (
      <div
        className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-3"
        role="status"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 size={18} strokeWidth={2} />
            </div>
            <h4
              className="text-sm sm:text-base font-bold text-emerald-950 m-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Reschedule Confirmed
            </h4>
          </div>

          <span className="badge badge-sm bg-emerald-200/80 text-emerald-900 border-none font-semibold uppercase text-[10px] tracking-wide">
            Approved by Restaurant
          </span>
        </div>

        <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
          <p className="m-0 font-medium">
            Updated delivery time:{" "}
            <span className="font-bold text-emerald-950">
              {formatDateTime(effectiveTime)}
            </span>
          </p>
          {latest.respondedAt && (
            <p className="text-[11px] text-emerald-700 mt-0.5 m-0">
              Confirmed on {formatOrderDate(latest.respondedAt)}
            </p>
          )}
        </div>

        <p className="text-[11px] text-emerald-700/80 m-0 pt-2 border-t border-emerald-200/50">
          The kitchen has updated your delivery window. Your food will be prepared accordingly.
        </p>
      </div>
    );
  }

  // ── 3. Rejected ──
  if (latest.status === "rejected") {
    return (
      <div
        className="bg-rose-50 border border-rose-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-3"
        role="status"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
              <AlertCircle size={18} strokeWidth={2} />
            </div>
            <h4
              className="text-sm sm:text-base font-bold text-rose-950 m-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Reschedule Request Declined
            </h4>
          </div>

          <span className="badge badge-sm bg-rose-200/80 text-rose-900 border-none font-semibold uppercase text-[10px] tracking-wide">
            Declined by Restaurant
          </span>
        </div>

        <div className="text-xs sm:text-sm text-rose-900 leading-relaxed">
          <p className="m-0 font-medium">
            The restaurant was unable to accommodate your requested time (
            {formatDateTime(latest.requestedTime)}).
          </p>
          {latest.rejectionReason && (
            <p className="mt-1 text-xs text-rose-800 italic m-0">
              Note from restaurant: "{latest.rejectionReason}"
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-rose-200/50">
          <p className="text-[11px] text-rose-700/80 m-0">
            Your original delivery schedule remains active.
          </p>

          {isOrderMutable && onOpenRescheduleModal && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onOpenRescheduleModal}
              className="text-rose-800 hover:text-rose-950 hover:bg-rose-100/60 font-semibold underline underline-offset-2"
            >
              <CalendarClock size={13} />
              <span>Request Another Time</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default OrderRescheduleBanner;
