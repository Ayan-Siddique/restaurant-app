import { useState } from "react";
import { Plus, Minus, Trash2, AlertCircle } from "lucide-react";
import type { CartItem } from "../types";
import { useAppDispatch } from "../../../store/hooks";
import {
  updateCartItemThunk,
  removeCartItemThunk,
} from "../../../store/slices/cartSlice";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const dispatch = useAppDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const isAvailable = item.isAvailable !== false;
  const unitPrice = item.price;
  const lineTotal = item.subtotal ?? unitPrice * item.quantity;
  const imageSource = item.imageUrl || item.image;

  const handleIncrease = async () => {
    if (!isAvailable || isUpdating) return;
    setIsUpdating(true);
    try {
      await dispatch(
        updateCartItemThunk({ id: item.id, quantity: item.quantity + 1 })
      ).unwrap();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      if (item.quantity > 1) {
        await dispatch(
          updateCartItemThunk({ id: item.id, quantity: item.quantity - 1 })
        ).unwrap();
      } else {
        await dispatch(removeCartItemThunk(item.id)).unwrap();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await dispatch(removeCartItemThunk(item.id)).unwrap();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article
      className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        !isAvailable
          ? "bg-neutral-100/90 border-neutral-300 opacity-75"
          : "bg-white border-neutral-200 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Left: Image & Info */}
      <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto min-w-0">
        {/* Media Thumbnail */}
        <div
          className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl bg-neutral-200 ${
            !isAvailable ? "grayscale contrast-75" : ""
          }`}
        >
          {imageSource ? (
            <img
              src={imageSource}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-medium">
              No Image
            </div>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-error px-1.5 py-0.5 rounded">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Title, Unit Price & Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-base sm:text-lg font-medium truncate ${
                !isAvailable
                  ? "text-neutral-500 line-through"
                  : "text-neutral-900"
              }`}
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              {item.name}
            </h4>
            {!isAvailable && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-error bg-error/10 px-2 py-0.5 rounded-full">
                <AlertCircle size={12} />
                Unavailable
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Unit Price:{" "}
            <span className="font-semibold text-neutral-700">
              ₹{unitPrice.toLocaleString("en-IN")}
            </span>
          </p>

          {!isAvailable && (
            <p className="text-xs text-error/90 font-medium mt-1">
              Out of stock. Please remove before checkout.
            </p>
          )}
        </div>
      </div>

      {/* Right: Quantity Controls, Subtotal & Remove Button */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        {/* Quantity Controls */}
        <div
          className={`flex items-center gap-1.5 border rounded-full px-2 py-1 ${
            !isAvailable
              ? "bg-neutral-200/60 border-neutral-300"
              : "border-neutral-300 bg-neutral-50"
          }`}
        >
          <button
            type="button"
            onClick={handleDecrease}
            disabled={isUpdating}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-700 transition-colors disabled:opacity-40 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>

          <span
            className="w-8 text-center text-sm font-semibold text-neutral-800"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={!isAvailable || isUpdating}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Subtotal */}
        <div className="text-right min-w-[70px]">
          <span className="text-xs text-neutral-400 block">Total</span>
          <span
            className={`text-base sm:text-lg font-bold ${
              !isAvailable
                ? "text-neutral-400"
                : "text-neutral-900"
            }`}
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            ₹{lineTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isUpdating}
          className="p-2 text-neutral-400 hover:text-error transition-colors rounded-lg hover:bg-error/10 cursor-pointer"
          aria-label={`Remove ${item.name} from cart`}
          title="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}

export default CartItemCard;
