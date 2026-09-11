import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  FileText,
  CreditCard,
  MapPin,
  Plus,
  Check,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Home,
  Briefcase,
  Navigation,
} from "lucide-react";
import { paymentService } from "../services/paymentService";
import {
  addressService,
  getAddressErrorMessage,
  MAX_ADDRESSES_PER_USER,
} from "../../../services/addressService";
import type { Address, CreateAddressInput } from "../../../types/address";
import {
  getPaymentFailureDetails,
  getHttpPaymentError,
  type ParsedPaymentError,
} from "../utils/paymentErrors";
import Button from "../../../components/common/Button";
import type { CheckoutStep, PaymentFailureReason } from "../types";
import { useAppDispatch } from "../../../store/hooks";
import { getCartThunk } from "../../../store/slices/cartSlice";
import { setCreatedOrder } from "../../orders/store/orderSlice";
import { formatCurrency } from "../../orders/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  itemCount: number;
}

const PRESET_LABELS = ["Home", "Work", "Other"];

export function CheckoutModal({
  isOpen,
  onClose,
  cartTotal,
  itemCount,
}: CheckoutModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Address Management State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressFetchError, setAddressFetchError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // Add Address Sub-view State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState("Home");
  const [newStreet, setNewStreet] = useState("");
  const [newBuilding, setNewBuilding] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newLandmark, setNewLandmark] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addAddressError, setAddAddressError] = useState<string | null>(null);

  // Order & Payment state
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [step, setStep] = useState<CheckoutStep>("form");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [serverQuotedAmount, setServerQuotedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedPaymentError | null>(null);
  const [addressValidationError, setAddressValidationError] = useState<string | null>(null);

  // Reset or initialize state on modal open/close
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsLoadingAddresses(true);
      setAddressFetchError(null);
      if (!paymentId) {
        setStep("form");
        setErrorDetails(null);
        setAddressValidationError(null);
        setIsAddingAddress(false);
      }
    } else {
      if (step === "failed" && errorDetails?.requiresNewPayment) {
        setStep("form");
        setPaymentId(null);
        setServerQuotedAmount(null);
        setErrorDetails(null);
      }
    }
  }

  // Fetch saved addresses from backend when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    addressService
      .getAddresses()
      .then((list) => {
        if (!isMounted) return;
        setAddresses(list);

        const defaultAddr = list.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (list.length > 0) {
          setSelectedAddressId((prev) => {
            const exists = list.some((a) => a.id === prev);
            return exists ? prev : list[0].id;
          });
        } else {
          setSelectedAddressId("");
          setIsAddingAddress(true);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const msg = getAddressErrorMessage(err);
        setAddressFetchError(msg);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingAddresses(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleRetryAddresses = () => {
    setIsLoadingAddresses(true);
    setAddressFetchError(null);

    addressService
      .getAddresses()
      .then((list) => {
        setAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (list.length > 0) {
          setSelectedAddressId((prev) => {
            const exists = list.some((a) => a.id === prev);
            return exists ? prev : list[0].id;
          });
        } else {
          setSelectedAddressId("");
          setIsAddingAddress(true);
        }
      })
      .catch((err) => {
        const msg = getAddressErrorMessage(err);
        setAddressFetchError(msg);
      })
      .finally(() => {
        setIsLoadingAddresses(false);
      });
  };

  if (!isOpen) return null;

  /**
   * Set an address as default via backend API
   */
  const handleSetDefaultAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (settingDefaultId) return;

    setSettingDefaultId(id);
    try {
      const updated = await addressService.setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === updated.id,
        }))
      );
      setSelectedAddressId(updated.id);
    } catch (err) {
      setAddressValidationError(getAddressErrorMessage(err));
    } finally {
      setSettingDefaultId(null);
    }
  };

  /**
   * Save new address and auto-select it
   */
  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingAddress) return;

    const trimmedStreet = newStreet.trim();
    const trimmedArea = newArea.trim();
    const trimmedCity = newCity.trim();

    if (!trimmedStreet || !trimmedArea || !trimmedCity) {
      setAddAddressError("Street address, area, and city are required.");
      return;
    }

    setIsSavingAddress(true);
    setAddAddressError(null);

    const payload: CreateAddressInput = {
      street: trimmedStreet,
      area: trimmedArea,
      city: trimmedCity,
      label: newLabel.trim() || undefined,
      building: newBuilding.trim() || undefined,
      landmark: newLandmark.trim() || undefined,
      instructions: newInstructions.trim() || undefined,
    };

    try {
      const created = await addressService.createAddress(payload);
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created.id);
      setIsAddingAddress(false);

      // Reset form fields
      setNewStreet("");
      setNewBuilding("");
      setNewArea("");
      setNewCity("");
      setNewLandmark("");
      setNewInstructions("");
      setNewLabel("Home");
      setAddressValidationError(null);
    } catch (err) {
      setAddAddressError(getAddressErrorMessage(err));
    } finally {
      setIsSavingAddress(false);
    }
  };

  /**
   * Step 1: Create Payment (POST /payments/create)
   */
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (!selectedAddressId) {
      setAddressValidationError("Please select or add a delivery address to proceed.");
      return;
    }

    setAddressValidationError(null);
    setErrorDetails(null);
    setIsProcessing(true);
    setStep("creating_payment");

    try {
      const response = await paymentService.createPayment({
        addressId: selectedAddressId,
        specialInstructions: specialInstructions.trim() || undefined,
      });

      setPaymentId(response.paymentId);
      setServerQuotedAmount(response.amount);
      setStep("ready_to_pay");
    } catch (err: unknown) {
      const parsed = getHttpPaymentError(err);
      setErrorDetails(parsed);

      if (parsed.existingPaymentId) {
        setPaymentId(parsed.existingPaymentId);
        if (parsed.existingAmount !== undefined) {
          setServerQuotedAmount(parsed.existingAmount);
        }
        setStep("ready_to_pay");
      } else {
        setStep("failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Step 2: Confirm Payment (POST /payments/:id/confirm)
   */
  const handleConfirmPayment = async () => {
    if (isProcessing || !paymentId) return;

    setIsProcessing(true);
    setStep("confirming_payment");
    setErrorDetails(null);

    try {
      const response = await paymentService.confirmPayment(paymentId);

      if (response.status === "success") {
        dispatch(getCartThunk());

        if (response.order) {
          dispatch(setCreatedOrder(response.order));
        }

        onClose();
        navigate(`/orders/${response.order.id}`);
        return;
      }

      const failDetails = getPaymentFailureDetails(
        response.reason as PaymentFailureReason,
        response.itemName
      );
      setErrorDetails(failDetails);
      setStep("failed");

      if (failDetails.requiresCartRefresh) {
        dispatch(getCartThunk());
      }
    } catch (err: unknown) {
      const parsed = getHttpPaymentError(err);
      setErrorDetails(parsed);
      setStep("failed");

      if (parsed.requiresCartRefresh) {
        dispatch(getCartThunk());
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Restart checkout with fresh payment
   */
  const handleStartFreshPayment = () => {
    setPaymentId(null);
    setServerQuotedAmount(null);
    setErrorDetails(null);
    setStep("form");
  };

  const getLabelIcon = (label?: string | null) => {
    const l = (label || "").toLowerCase();
    if (l.includes("home")) return <Home size={13} className="shrink-0" />;
    if (l.includes("work") || l.includes("office"))
      return <Briefcase size={13} className="shrink-0" />;
    return <Navigation size={13} className="shrink-0" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-neutral-100 flex flex-col gap-4 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] shrink-0">
              <CreditCard size={20} strokeWidth={2} />
            </div>
            <div>
              <h3
                id="checkout-modal-title"
                className="text-lg font-bold text-neutral-900 m-0"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Checkout & Payment
              </h3>
              <p className="text-xs text-neutral-500 m-0 mt-0.5">
                {itemCount} {itemCount === 1 ? "item" : "items"} · Current cart:{" "}
                {formatCurrency(cartTotal)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step: Form / Address Selection & Instructions */}
        {step === "form" && (
          <div className="flex flex-col gap-4">
            {/* SUB-VIEW: Add New Address Form */}
            {isAddingAddress ? (
              <form onSubmit={handleSaveNewAddress} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAddress(false);
                          setAddAddressError(null);
                        }}
                        className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors cursor-pointer"
                        aria-label="Back to saved addresses"
                      >
                        <ChevronLeft size={18} />
                      </button>
                    )}
                    <h4 className="text-sm font-bold text-neutral-900 m-0">
                      Add New Delivery Address
                    </h4>
                  </div>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setAddAddressError(null);
                      }}
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {addAddressError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-2.5 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-600" />
                    <span>{addAddressError}</span>
                  </div>
                )}

                {/* Address Label Chips */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Address Label
                  </label>
                  <div className="flex items-center gap-2">
                    {PRESET_LABELS.map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setNewLabel(lbl)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          newLabel === lbl
                            ? "bg-[#f5a623] text-white border-[#f5a623] shadow-xs"
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="e.g. 45 MG Road, Near Central Mall"
                    required
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20"
                  />
                </div>

                {/* Building / Flat (Optional) */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Building / Flat / Suite <span className="text-neutral-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    placeholder="e.g. Flat 4B, Sunrise Towers"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20"
                  />
                </div>

                {/* Area & City (Grid) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Area / Locality <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      placeholder="e.g. Salt Lake Sector V"
                      required
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Kolkata"
                      required
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20"
                    />
                  </div>
                </div>

                {/* Landmark (Optional) */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Nearby Landmark <span className="text-neutral-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="e.g. Opposite Metro Station Gate 2"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20"
                  />
                </div>

                {/* Delivery Instructions (Optional) */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Address Delivery Note <span className="text-neutral-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newInstructions}
                    onChange={(e) => setNewInstructions(e.target.value)}
                    placeholder="e.g. Call security upon arrival"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                  {addresses.length > 0 && (
                    <Button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      disabled={isSavingAddress}
                      variant="ghost"
                      size="xs"
                      className="rounded-full font-medium"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSavingAddress}
                    loading={isSavingAddress}
                    variant="primary"
                    size="sm"
                    className="rounded-full px-5 font-semibold"
                  >
                    {!isSavingAddress && <Check size={14} />}
                    <span>Save & Use Address</span>
                  </Button>
                </div>
              </form>
            ) : (
              /* SUB-VIEW: Saved Address Selection List */
              <form onSubmit={handleCreatePayment} className="flex flex-col gap-4">
                {/* Address Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-[#f5a623]" />
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                      Select Delivery Address
                    </span>
                  </div>

                  {addresses.length < MAX_ADDRESSES_PER_USER ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(true);
                        setAddAddressError(null);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#f5a623] hover:text-[#d48810] cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add New</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Max {MAX_ADDRESSES_PER_USER} addresses reached
                    </span>
                  )}
                </div>

                {/* Loading Addresses State */}
                {isLoadingAddresses ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2 text-neutral-500">
                    <Loader2 size={20} className="animate-spin text-[#f5a623]" />
                    <span className="text-xs font-medium">Loading saved addresses...</span>
                  </div>
                ) : addressFetchError ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-xs flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertCircle size={14} className="text-rose-600 shrink-0" />
                      <span>Could not load addresses</span>
                    </div>
                    <p className="m-0 text-rose-700">{addressFetchError}</p>
                    <button
                      type="button"
                      onClick={handleRetryAddresses}
                      className="self-start text-[11px] font-semibold text-rose-900 underline hover:no-underline cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                ) : addresses.length === 0 ? (
                  /* Zero saved addresses state */
                  <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-center flex flex-col items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 m-0">
                        No delivery address found
                      </h4>
                      <p className="text-[11px] text-neutral-500 m-0 mt-0.5">
                        Please add a delivery address to complete your order.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="xs"
                      onClick={() => setIsAddingAddress(true)}
                      className="rounded-full px-4 font-semibold"
                    >
                      + Add Address Now
                    </Button>
                  </div>
                ) : (
                  /* Saved Addresses Cards List */
                  <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            if (addressValidationError) setAddressValidationError(null);
                          }}
                          className={`relative rounded-2xl p-3 border transition-all cursor-pointer flex items-start gap-3 text-left ${
                            isSelected
                              ? "bg-amber-50/50 border-[#f5a623] ring-2 ring-[#f5a623]/20 shadow-xs"
                              : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/40"
                          }`}
                        >
                          {/* Radio Selector */}
                          <div
                            className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                              isSelected
                                ? "border-[#f5a623] bg-[#f5a623]"
                                : "border-neutral-300 bg-white"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>

                          {/* Address Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 flex-wrap mb-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                                  {getLabelIcon(addr.label)}
                                  <span>{addr.label || "Address"}</span>
                                </span>
                                {addr.isDefault && (
                                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 size={10} />
                                    <span>Default</span>
                                  </span>
                                )}
                              </div>

                              {/* Set as Default Action */}
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={(e) => handleSetDefaultAddress(addr.id, e)}
                                  disabled={settingDefaultId === addr.id}
                                  className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                                >
                                  {settingDefaultId === addr.id
                                    ? "Setting..."
                                    : "Set as default"}
                                </button>
                              )}
                            </div>

                            <p className="text-xs font-semibold text-neutral-800 m-0 leading-snug">
                              {addr.building ? `${addr.building}, ` : ""}
                              {addr.street}
                            </p>
                            <p className="text-[11px] text-neutral-500 m-0 mt-0.5">
                              {addr.area}, {addr.city}
                            </p>
                            {addr.landmark && (
                              <p className="text-[10px] text-neutral-400 m-0 mt-0.5 italic">
                                Landmark: {addr.landmark}
                              </p>
                            )}
                            {addr.instructions && (
                              <p className="text-[10px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 inline-block m-0 mt-1">
                                Note: {addr.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {addressValidationError && (
                  <p className="text-xs text-rose-600 font-medium m-0">
                    {addressValidationError}
                  </p>
                )}

                {/* Special Instructions (Optional) */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="checkout-special-instructions"
                      className="text-xs font-semibold text-neutral-700 flex items-center gap-1"
                    >
                      <FileText size={13} className="text-neutral-400" />
                      <span>Special Delivery Instructions (Optional)</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      {specialInstructions.length}/1000
                    </span>
                  </div>
                  <textarea
                    id="checkout-special-instructions"
                    rows={2}
                    maxLength={1000}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Please do not ring the doorbell, leave package by the door."
                    disabled={isProcessing}
                    className="w-full rounded-2xl border border-neutral-300 p-3 text-xs sm:text-sm text-neutral-800 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 resize-none transition-all disabled:bg-neutral-100"
                  />
                </div>

                {/* Submit / Proceed */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={onClose}
                    disabled={isProcessing}
                    variant="ghost"
                    size="sm"
                    className="rounded-full font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing || !selectedAddressId || addresses.length === 0}
                    loading={isProcessing}
                    variant="primary"
                    size="sm"
                    className="rounded-full px-5 font-semibold"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Step: Creating Payment Spinner */}
        {step === "creating_payment" && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <span className="loading loading-spinner loading-lg text-[#f5a623]" />
            <p className="text-sm font-semibold text-neutral-800 m-0">
              Initializing secure payment...
            </p>
            <p className="text-xs text-neutral-500 max-w-xs m-0">
              Computing server-verified cart pricing, taxes, and delivery charges.
            </p>
          </div>
        )}

        {/* Step: Ready to Pay (Confirmed Amount from Backend) */}
        {step === "ready_to_pay" && (
          <div className="flex flex-col gap-5 py-2">
            {/* Payment Summary Banner */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Payment Session ID</span>
                <span className="font-mono text-[11px] text-neutral-700">
                  {paymentId ? `${paymentId.slice(0, 13)}...` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                <span className="text-sm font-semibold text-neutral-800">
                  Total Amount to Pay
                </span>
                <span
                  className="text-2xl font-bold text-[#f5a623]"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  {serverQuotedAmount !== null
                    ? formatCurrency(serverQuotedAmount)
                    : formatCurrency(cartTotal)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 m-0 mt-1">
                Includes items subtotal, 5% GST, and standard delivery charge.
              </p>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-neutral-600 bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>
                Backend simulated checkout. No method selection required.
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                loading={isProcessing}
                variant="primary"
                size="lg"
                className="w-full !rounded-2xl py-3.5 text-base font-bold shadow-md hover:shadow-lg"
              >
                <span>
                  Pay{" "}
                  {serverQuotedAmount !== null
                    ? formatCurrency(serverQuotedAmount)
                    : formatCurrency(cartTotal)}
                </span>
              </Button>

              <Button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                variant="ghost"
                size="sm"
                className="text-neutral-500 hover:text-neutral-700 rounded-full font-medium"
              >
                Pay Later & Keep Cart
              </Button>
            </div>
          </div>
        )}

        {/* Step: Confirming Payment Spinner */}
        {step === "confirming_payment" && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <span className="loading loading-spinner loading-lg text-[#f5a623]" />
            <p className="text-base font-bold text-neutral-900 m-0">
              Processing Payment...
            </p>
            <p className="text-xs text-neutral-500 max-w-sm m-0">
              Verifying availability, reserving items, and placing your order
              with the restaurant.
            </p>
          </div>
        )}

        {/* Step: Failure / Decline State */}
        {step === "failed" && errorDetails && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
              <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-rose-900 m-0">
                  {errorDetails.title}
                </h4>
                <p className="text-xs text-rose-800 m-0 leading-relaxed">
                  {errorDetails.message}
                </p>
              </div>
            </div>

            {/* Actions based on retryability */}
            <div className="flex flex-col gap-2 pt-2">
              {errorDetails.isRetryable && paymentId && (
                <Button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  loading={isProcessing}
                  variant="secondary"
                  size="md"
                  className="w-full !rounded-2xl py-3 font-semibold text-sm"
                >
                  <RotateCcw size={15} />
                  <span>Try Payment Again</span>
                </Button>
              )}

              {errorDetails.requiresNewPayment && (
                <Button
                  type="button"
                  onClick={handleStartFreshPayment}
                  variant="outline"
                  size="md"
                  className="w-full !rounded-2xl py-3 font-semibold text-sm"
                >
                  Start Fresh Checkout
                </Button>
              )}

              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-neutral-500 hover:text-neutral-700 rounded-full font-medium"
              >
                Return to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
