import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "../../../components/common/Button";

interface CancelOrderModalProps {
  isOpen: boolean;
  orderNumber: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const COMMON_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Delivery time is too long",
  "Need to modify delivery address",
  "Need to change items ordered",
];

export function CancelOrderModal({
  isOpen,
  orderNumber,
  isSubmitting = false,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  // Clear state when modal opens
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setReason("");
      setError("");
    }
  }

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 1) {
      setError("Please provide a reason for cancellation.");
      return;
    }
    if (trimmed.length > 500) {
      setError("Cancellation reason cannot exceed 500 characters.");
      return;
    }

    setError("");
    // Dispatches to parent component (which triggers Redux thunk/service)
    onConfirm(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-order-modal-title"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-neutral-100 flex flex-col gap-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Close cancellation modal"
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle size={20} strokeWidth={2} />
          </div>
          <div>
            <h3
              id="cancel-order-modal-title"
              className="text-lg font-bold text-neutral-900 m-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Cancel Order #{orderNumber}
            </h3>
            <p className="text-xs text-neutral-500 m-0 mt-0.5">
              Please tell us why you wish to cancel this order.
            </p>
          </div>
        </div>

        {/* Notice */}
        <p className="text-xs text-neutral-600 bg-amber-50 border border-amber-200 rounded-2xl p-3 m-0">
          Cancellation is only permitted while the order is pending or before food preparation begins.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Preset Reason Chips */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
              Quick select:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REASONS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => {
                    setReason(preset);
                    setError("");
                  }}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    reason === preset
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="cancel-reason"
                className="text-xs font-semibold text-neutral-700"
              >
                Cancellation Reason <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-neutral-400">
                {reason.length}/500
              </span>
            </div>
            <textarea
              id="cancel-reason"
              rows={3}
              maxLength={500}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Provide details about your cancellation request (1-500 characters)..."
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-neutral-300 p-3 text-xs sm:text-sm text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 resize-none transition-all"
            />
            {error && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="ghost"
              size="sm"
              className="rounded-full font-medium"
            >
              Keep Order
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="danger"
              size="sm"
              className="rounded-full font-semibold"
              id="confirm-cancellation-button"
            >
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CancelOrderModal;
