import { AlertTriangle, ArrowRight } from "lucide-react";
import Button from "../../../components/common/Button";
import type { CartItem } from "../types";

interface CartSummaryProps {
  items: CartItem[];
  totalAmount: number;
  onProceedToCheckout?: () => void;
}

export function CartSummary({
  items,
  totalAmount,
  onProceedToCheckout,
}: CartSummaryProps) {
  const hasUnavailableItems = items.some((it) => it.isAvailable === false);
  const totalItemCount = items.reduce((sum, it) => sum + it.quantity, 0);

  const handleProceedToCheckout = () => {
    if (hasUnavailableItems || items.length === 0) return;
    onProceedToCheckout?.();
  };

  return (
    <aside
      className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm flex flex-col gap-5 sticky top-24"
      style={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        className="text-lg sm:text-xl font-bold text-neutral-900 m-0 pb-3 border-b border-neutral-100"
        style={{ fontFamily: "'Rubik', sans-serif" }}
      >
        Order Summary
      </h3>

      {/* Breakdown */}
      <div className="flex flex-col gap-3 text-sm text-neutral-600">
        <div className="flex items-center justify-between">
          <span>Items ({totalItemCount})</span>
          <span className="font-medium text-neutral-800">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Total (Using totals directly from backend without inventing taxes/fees) */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-base sm:text-lg font-bold text-neutral-900">
          <span>Total</span>
          <span
            className="text-xl sm:text-2xl text-[#f5a623]"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Unavailable Items Warning Banner */}
      {hasUnavailableItems && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold m-0">Action Required</p>
            <p className="m-0 mt-0.5 opacity-90">
              Some items in your cart are currently unavailable. Please remove
              them before proceeding to checkout.
            </p>
          </div>
        </div>
      )}

      {/* Proceed to Checkout Button */}
      <div className="w-full mt-2">
        <Button
          type="button"
          onClick={handleProceedToCheckout}
          className={`w-full text-center rounded-2xl py-3.5 flex items-center justify-center gap-2 text-base font-semibold shadow-md transition-all ${
            hasUnavailableItems || items.length === 0
              ? "!bg-neutral-300 !text-neutral-500 !cursor-not-allowed pointer-events-none shadow-none"
              : "hover:shadow-lg"
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </Button>
      </div>

      <p className="text-[11px] text-center text-neutral-400 m-0">
        Safe & secure contactless ordering
      </p>
    </aside>
  );
}

export default CartSummary;
