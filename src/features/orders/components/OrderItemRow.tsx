import { Utensils } from "lucide-react";
import type { OrderItem } from "../types";
import { formatCurrency } from "../utils";

interface OrderItemRowProps {
  item: OrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  const unitPrice = item.unitPrice ?? item.price ?? 0;
  const lineTotal = item.totalPrice ?? item.lineTotal ?? unitPrice * item.quantity;

  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-neutral-100 last:border-b-0">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Item Image or fallback thumbnail */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center text-neutral-400">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Utensils size={20} />
          )}
        </div>

        {/* Item Info */}
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-neutral-900 truncate m-0">
            {item.name}
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5 m-0">
            {formatCurrency(unitPrice)} × {item.quantity}
          </p>
        </div>
      </div>

      {/* Line Total */}
      <div className="text-right shrink-0">
        <span
          className="text-sm sm:text-base font-bold text-neutral-900"
          style={{ fontFamily: "'Rubik', sans-serif" }}
        >
          {formatCurrency(lineTotal)}
        </span>
      </div>
    </div>
  );
}

export default OrderItemRow;
