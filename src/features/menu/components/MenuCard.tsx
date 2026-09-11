import { useState } from "react";
import { Plus, Minus, ShoppingCart, Heart, Clock, Utensils } from "lucide-react";
import type { MenuItem } from "../types";
import LoginModal from "../../../components/common/LoginModal";
import RegisterModal from "../../../components/common/RegisterModal";
import Button from "../../../components/common/Button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  addToCartThunk,
  updateCartItemThunk,
  removeCartItemThunk,
} from "../../../store/slices/cartSlice";

interface MenuCardProps {
  item: MenuItem;
}

function MenuCard({ item }: MenuCardProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Derive cart presence and quantity from Redux — the single source of truth.
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((ci) => ci.menuItemId === item.id)
  );
  const isInCart = Boolean(cartItem);
  const cartQuantity = cartItem?.quantity ?? 0;
  const cartItemId = cartItem?.id; // cart row ID for update/remove API calls

  const [isBusy, setIsBusy] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const isAvailable = item.isAvailable !== false;
  const rawImage = item.imageUrl || item.image;
  const hasImage = Boolean(rawImage) && !imgError;

  // Extract category metadata from real backend response
  const categoryName =
    typeof item.category === "object" && item.category
      ? item.category.name
      : typeof item.category === "string"
      ? item.category
      : "";

  const categoryType =
    typeof item.category === "object" && item.category
      ? item.category.type
      : undefined;

  /* ── Add to Cart (first time) ── */
  const handleAddToCart = async () => {
    if (!isAvailable || isBusy) return;

    // If not authenticated, open LoginModal instead of calling the API
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    setIsBusy(true);
    try {
      await dispatch(
        addToCartThunk({ menuItemId: item.id, quantity: 1 })
      ).unwrap();
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    } finally {
      setIsBusy(false);
    }
  };

  /* ── Increase quantity ── */
  const handleIncrease = async () => {
    if (!isAvailable || isBusy || !cartItemId) return;
    setIsBusy(true);
    try {
      await dispatch(
        updateCartItemThunk({ id: cartItemId, quantity: cartQuantity + 1 })
      ).unwrap();
    } catch (err) {
      console.error("Failed to increase quantity:", err);
    } finally {
      setIsBusy(false);
    }
  };

  /* ── Decrease quantity (remove when quantity = 1) ── */
  const handleDecrease = async () => {
    if (isBusy || !cartItemId) return;
    setIsBusy(true);
    try {
      if (cartQuantity > 1) {
        await dispatch(
          updateCartItemThunk({ id: cartItemId, quantity: cartQuantity - 1 })
        ).unwrap();
      } else {
        await dispatch(removeCartItemThunk(cartItemId)).unwrap();
      }
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
    } finally {
      setIsBusy(false);
    }
  };

  /* Switch between modals */
  const openLogin = (email?: string) => {
    void email;
    setShowRegister(false);
    setShowLogin(true);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const formattedPrice = `₹${item.price.toLocaleString("en-IN")}`;

  return (
    <>
      <article
        className={`group relative flex flex-row lg:flex-col bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.09)] hover:border-neutral-300 transition-all duration-300 overflow-hidden w-full ${
          !isAvailable ? "opacity-80" : ""
        }`}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        {/* ── Image Area: Compact thumbnail on mobile/tablet, full-width hero on desktop ── */}
        <div className="relative w-28 h-28 sm:w-28 sm:h-28 lg:w-full lg:h-52 shrink-0 overflow-hidden m-2.5 lg:m-0 rounded-2xl lg:rounded-none lg:rounded-t-2xl bg-neutral-100 flex items-center justify-center">
          {hasImage ? (
            <img
              src={rawImage}
              alt={item.name}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                !isAvailable ? "grayscale-[35%]" : ""
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-50">
              <Utensils size={28} strokeWidth={1.5} />
            </div>
          )}

          {/* Desktop Gradient Overlay */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

          {/* Desktop Overlay: Price Pill (Bottom-Left) */}
          <div
            className="hidden lg:flex absolute bottom-3 left-3 z-10 bg-black/65 backdrop-blur-md text-white text-sm font-bold px-3 py-1 rounded-full shadow-xs items-center gap-0.5"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            {formattedPrice}
          </div>

          {/* Desktop Overlay: Prep Time (Bottom-Right, only if available) */}
          {Boolean(item.prepTimeMinutes && item.prepTimeMinutes > 0) && (
            <div className="hidden lg:flex absolute bottom-3 right-3 z-10 bg-black/65 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-xs items-center gap-1.5">
              <Clock size={12} className="shrink-0" />
              <span>{item.prepTimeMinutes} mins</span>
            </div>
          )}

          {/* Desktop Overlay: Favorite Heart (Top-Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label={
              isFavorite
                ? `Remove ${item.name} from favorites`
                : `Add ${item.name} to favorites`
            }
            className="hidden lg:flex absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-rose-500 shadow-sm items-center justify-center transition-all cursor-pointer"
          >
            <Heart
              size={16}
              className={
                isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-neutral-500 hover:text-rose-500"
              }
            />
          </button>

          {/* Unavailable Backdrop Badge */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-black/80 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* ── Content Section ── */}
        <div className="flex-1 min-w-0 p-2.5 sm:p-3 lg:p-4 pl-0 lg:pl-4 flex flex-col justify-between">
          {/* Top: Title, Favorite (Mobile), and Category/Dietary */}
          <div>
            <div className="flex items-start justify-between gap-1.5">
              <h3
                className={`m-0 text-sm sm:text-base lg:text-lg font-bold leading-snug line-clamp-2 lg:line-clamp-1 ${
                  !isAvailable ? "text-neutral-500" : "text-neutral-900"
                }`}
                style={{ fontFamily: "'Rubik', sans-serif" }}
                title={item.name}
              >
                {item.name}
              </h3>

              {/* Mobile Favorite Heart Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                aria-label={
                  isFavorite
                    ? `Remove ${item.name} from favorites`
                    : `Add ${item.name} to favorites`
                }
                className="lg:hidden shrink-0 p-1 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <Heart
                  size={17}
                  className={
                    isFavorite
                      ? "fill-rose-500 text-rose-500"
                      : "text-neutral-400"
                  }
                />
              </button>
            </div>

            {/* Category / Dietary Badge (uses real data) */}
            {categoryName && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1 truncate">
                {categoryType === "veg" ? (
                  <span
                    className="w-3.5 h-3.5 border border-emerald-600 rounded-[3px] flex items-center justify-center shrink-0"
                    title="Vegetarian"
                    aria-label="Vegetarian"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                ) : categoryType === "non_veg" ? (
                  <span
                    className="w-3.5 h-3.5 border border-rose-700 rounded-[3px] flex items-center justify-center shrink-0"
                    title="Non-Vegetarian"
                    aria-label="Non-Vegetarian"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-700" />
                  </span>
                ) : null}
                <span className="truncate font-medium">{categoryName}</span>
              </div>
            )}

            {/* Optional Description (only rendered if returned by backend) */}
            {item.description && (
              <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed m-0">
                {item.description}
              </p>
            )}
          </div>

          {/* ── Mobile/Tablet Bottom Action Row (< 1024px) ── */}
          <div className="flex lg:hidden items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-100">
            {/* Price */}
            <span
              className="text-base sm:text-lg font-bold text-neutral-900 shrink-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              {formattedPrice}
            </span>

            {/* Action: Stepper or Add button */}
            <div className="flex items-center">
              {isInCart && isAuthenticated ? (
                /* Mobile Stepper */
                <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 px-1 py-0.5 shadow-xs shrink-0">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={isBusy}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-200/70 text-neutral-700 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={13} strokeWidth={2.5} />
                  </button>

                  <span
                    className="w-6 text-center text-xs sm:text-sm font-bold text-neutral-900 select-none"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    {isBusy ? (
                      <span className="loading loading-spinner w-3 h-3" />
                    ) : (
                      cartQuantity
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={!isAvailable || isBusy}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-200/70 text-neutral-700 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                /* Mobile Add Button */
                <Button
                  type="button"
                  onClick={isAvailable && !isBusy ? handleAddToCart : undefined}
                  disabled={!isAvailable || isBusy}
                  loading={isBusy}
                  variant="primary"
                  size="xs"
                  className="rounded-xl font-semibold shadow-xs shrink-0"
                >
                  {!isBusy && (!isAvailable ? (
                    <span>Unavailable</span>
                  ) : (
                    <>
                      <ShoppingCart size={13} className="shrink-0" />
                      <span>Add</span>
                    </>
                  ))}
                </Button>
              )}
            </div>
          </div>

          {/* ── Desktop Bottom Action Row (>= 1024px) ── */}
          <div className="hidden lg:flex items-center justify-between gap-2 mt-3 pt-2 border-t border-neutral-100">
            {isInCart && isAuthenticated ? (
              /* Desktop Stepper */
              <div className="w-full flex items-center justify-between border border-neutral-200 rounded-xl bg-neutral-50 px-2 py-1 shadow-xs">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={isBusy}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200/70 text-neutral-700 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>

                <span
                  className="text-sm font-bold text-neutral-900 select-none px-2"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  {isBusy ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    cartQuantity
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={!isAvailable || isBusy}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200/70 text-neutral-700 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              /* Desktop Add to Cart Button */
              <Button
                type="button"
                onClick={isAvailable && !isBusy ? handleAddToCart : undefined}
                disabled={!isAvailable || isBusy}
                loading={isBusy}
                variant="primary"
                size="sm"
                className="w-full rounded-xl font-semibold shadow-xs"
              >
                {!isBusy && (!isAvailable ? (
                  <span>Unavailable</span>
                ) : (
                  <>
                    <ShoppingCart size={15} className="shrink-0" />
                    <span>Add to Cart</span>
                  </>
                ))}
              </Button>
            )}
          </div>
        </div>
      </article>

      {/* Login / Register modals for unauthenticated "Add to Cart" */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}

export default MenuCard;