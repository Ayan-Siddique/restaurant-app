import { useState, useEffect } from "react";
import { CalendarClock, X, Clock, Calendar } from "lucide-react";
import Button from "../../../components/common/Button";

interface RescheduleOrderModalProps {
  isOpen: boolean;
  orderNumber: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (requestedTimeIso: string, reason: string) => void;
}

const COMMON_REASONS = [
  "Running late",
  "Not available right now",
  "Need delivery this evening",
  "Unexpected meeting",
  "Please deliver at dinner time",
];

function getInitialDateTime(): { date: string; time: string } {
  // UI convenience default: 30 minutes in the future, rounded up to next 5 minutes
  const target = new Date(Date.now() + 30 * 60 * 1000);
  const minutes = Math.ceil(target.getMinutes() / 5) * 5;
  target.setMinutes(minutes);
  target.setSeconds(0);
  target.setMilliseconds(0);

  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  const hours = String(target.getHours()).padStart(2, "0");
  const mins = String(target.getMinutes()).padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${mins}`,
  };
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface RescheduleDialogContentProps {
  orderNumber: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (requestedTimeIso: string, reason: string) => void;
}

function RescheduleDialogContent({
  orderNumber,
  isSubmitting,
  onClose,
  onConfirm,
}: RescheduleDialogContentProps) {
  const [initial] = useState(() => getInitialDateTime());
  const [todayStr] = useState(() => getTodayString());

  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  // Preview date string
  const previewDate = date && time ? new Date(`${date}T${time}`) : null;
  const isPreviewValid = previewDate && !isNaN(previewDate.getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      setError("Please select both a delivery date and time.");
      return;
    }

    const selectedDate = new Date(`${date}T${time}`);
    if (isNaN(selectedDate.getTime())) {
      setError("Please select a valid date and time.");
      return;
    }

    // Critical check: strictly validate future instant immediately before submission
    if (selectedDate.getTime() <= Date.now()) {
      setError("The requested delivery time must be strictly in the future.");
      return;
    }

    const trimmedReason = reason.trim();
    if (trimmedReason.length < 1) {
      setError("Please provide a reason for rescheduling.");
      return;
    }
    if (trimmedReason.length > 500) {
      setError("Reason cannot exceed 500 characters.");
      return;
    }

    setError("");
    // Convert to ISO-8601 instant string with timezone/UTC representation
    onConfirm(selectedDate.toISOString(), trimmedReason);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-order-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-neutral-100 flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Close reschedule modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <CalendarClock size={20} strokeWidth={2} />
          </div>
          <div>
            <h3
              id="reschedule-order-modal-title"
              className="text-lg font-bold text-neutral-900 m-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Reschedule Order #{orderNumber}
            </h3>
            <p className="text-xs text-neutral-500 m-0 mt-0.5">
              Select your preferred new delivery time for this order.
            </p>
          </div>
        </div>

        {/* Informative Note */}
        <div className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200 rounded-2xl p-3">
          Reschedule requests require restaurant confirmation. Your current schedule remains active until accepted.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Date & Time Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="reschedule-date"
                className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5"
              >
                <Calendar size={14} className="text-neutral-500" />
                <span>Delivery Date</span>
              </label>
              <input
                id="reschedule-date"
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                required
                className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
              />
            </div>

            <div>
              <label
                htmlFor="reschedule-time"
                className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5"
              >
                <Clock size={14} className="text-neutral-500" />
                <span>Delivery Time</span>
              </label>
              <input
                id="reschedule-time"
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                required
                className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
              />
            </div>
          </div>

          {/* Formatted Preview */}
          <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Requested Time:</span>
            {isPreviewValid ? (
              <span className="font-semibold text-neutral-900">
                {previewDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {previewDate.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            ) : (
              <span className="text-neutral-400 italic">Select date & time</span>
            )}
          </div>

          {/* Reason Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="reschedule-reason"
                className="block text-xs font-semibold text-neutral-700 m-0"
              >
                Reason for Rescheduling
              </label>
              <span className="text-[11px] text-neutral-400">
                {reason.length}/500
              </span>
            </div>

            {/* Quick Reason Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {COMMON_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setReason(preset);
                    setError("");
                  }}
                  disabled={isSubmitting}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-neutral-200 text-neutral-600 hover:border-[#f5a623] hover:text-[#f5a623] hover:bg-[#f5a623]/5 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              id="reschedule-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              disabled={isSubmitting}
              maxLength={500}
              placeholder="Please let the kitchen know why you need to reschedule..."
              className="w-full rounded-2xl border border-neutral-200 p-3 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="ghost"
              size="sm"
              className="rounded-full text-xs font-medium"
            >
              Keep Current Time
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !date || !time}
              loading={isSubmitting}
              id="confirm-reschedule-button"
              variant="primary"
              size="sm"
              className="rounded-full text-xs font-semibold"
            >
              Submit Reschedule Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RescheduleOrderModal({
  isOpen,
  orderNumber,
  isSubmitting = false,
  onClose,
  onConfirm,
}: RescheduleOrderModalProps) {
  if (!isOpen) return null;

  return (
    <RescheduleDialogContent
      orderNumber={orderNumber}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default RescheduleOrderModal;
