import { useEffect } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import type { Address } from "../../../types/address";
import Button from "../../../components/common/Button";

interface DeleteAddressConfirmModalProps {
  isOpen: boolean;
  address: Address | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteAddressConfirmModal({
  isOpen,
  address,
  isSubmitting = false,
  onClose,
  onConfirm,
}: DeleteAddressConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !address) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-address-modal-title"
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
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close delete address modal"
        >
          <X size={18} />
        </button>

        {/* Warning Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 size={20} strokeWidth={2} />
          </div>
          <div>
            <h3
              id="delete-address-modal-title"
              className="text-lg font-bold text-neutral-900 m-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Delete Saved Address
            </h3>
            <p className="text-xs text-neutral-500 m-0 mt-0.5">
              Are you sure you want to remove this address?
            </p>
          </div>
        </div>

        {/* Target Address Details */}
        <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 text-xs text-neutral-700 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-neutral-900">
              {address.label || "Delivery Address"}
            </span>
            {address.isDefault && (
              <span className="badge badge-xs bg-amber-100 text-amber-800 border-none font-semibold">
                Default
              </span>
            )}
          </div>
          <p className="m-0 font-medium">{address.street}</p>
          <p className="m-0 text-neutral-500">
            {[address.building, address.area, address.city]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        {/* Default warning if applicable */}
        {address.isDefault && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <span>
              This is currently your default delivery address. If deleted, you will need to select or designate a new default for future orders.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
          <Button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            variant="ghost"
            size="sm"
            className="rounded-full text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(address.id)}
            disabled={isSubmitting}
            loading={isSubmitting}
            id="confirm-delete-address-button"
            variant="danger"
            size="sm"
            className="rounded-full text-xs font-semibold"
          >
            Delete Address
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAddressConfirmModal;
