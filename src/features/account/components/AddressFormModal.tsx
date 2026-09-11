import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import type { Address, CreateAddressInput } from "../../../types/address";
import Button from "../../../components/common/Button";

interface AddressFormModalProps {
  isOpen: boolean;
  addressToEdit?: Address | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressInput) => void;
}

const PRESET_LABELS = ["Home", "Work", "Other"];

interface FormDialogContentProps {
  addressToEdit?: Address | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressInput) => void;
}

function FormDialogContent({
  addressToEdit,
  isSubmitting,
  onClose,
  onSubmit,
}: FormDialogContentProps) {
  const [street, setStreet] = useState(addressToEdit?.street || "");
  const [area, setArea] = useState(addressToEdit?.area || "");
  const [city, setCity] = useState(addressToEdit?.city || "");
  const [label, setLabel] = useState(addressToEdit?.label || "Home");
  const [building, setBuilding] = useState(addressToEdit?.building || "");
  const [landmark, setLandmark] = useState(addressToEdit?.landmark || "");
  const [instructions, setInstructions] = useState(
    addressToEdit?.instructions || ""
  );
  const [error, setError] = useState("");

  const isEditing = Boolean(addressToEdit);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedStreet = street.trim();
    const trimmedArea = area.trim();
    const trimmedCity = city.trim();

    if (!trimmedStreet) {
      setError("Street address is required.");
      return;
    }
    if (!trimmedArea) {
      setError("Area or neighborhood is required.");
      return;
    }
    if (!trimmedCity) {
      setError("City is required.");
      return;
    }

    setError("");
    onSubmit({
      street: trimmedStreet,
      area: trimmedArea,
      city: trimmedCity,
      label: label.trim() || undefined,
      building: building.trim() || undefined,
      landmark: landmark.trim() || undefined,
      instructions: instructions.trim() || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-form-modal-title"
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
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close address form modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] shrink-0">
            <MapPin size={20} strokeWidth={2} />
          </div>
          <div>
            <h3
              id="address-form-modal-title"
              className="text-lg font-bold text-neutral-900 m-0"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              {isEditing ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h3>
            <p className="text-xs text-neutral-500 m-0 mt-0.5">
              {isEditing
                ? "Update your saved delivery address details."
                : "Save an address for fast and easy checkout."}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
          {/* Label selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Address Label
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_LABELS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLabel(preset)}
                  disabled={isSubmitting}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors cursor-pointer ${
                    label.toLowerCase() === preset.toLowerCase()
                      ? "border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623]"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Street (Required) */}
          <div>
            <label
              htmlFor="address-street"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Street Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="address-street"
              type="text"
              required
              maxLength={255}
              placeholder="e.g. 123 Main Street, Apt 4B"
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
                setError("");
              }}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
            />
          </div>

          {/* Area & City (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="address-area"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                Area / Neighborhood <span className="text-rose-500">*</span>
              </label>
              <input
                id="address-area"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Downtown"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
              />
            </div>

            <div>
              <label
                htmlFor="address-city"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                City <span className="text-rose-500">*</span>
              </label>
              <input
                id="address-city"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Springfield"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
              />
            </div>
          </div>

          {/* Building / Suite & Landmark (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="address-building"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                Building / Floor <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                id="address-building"
                type="text"
                maxLength={100}
                placeholder="e.g. Tower B, Floor 4"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
              />
            </div>

            <div>
              <label
                htmlFor="address-landmark"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                Landmark <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                id="address-landmark"
                type="text"
                maxLength={255}
                placeholder="e.g. Near City Park"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
              />
            </div>
          </div>

          {/* Delivery Instructions (Optional) */}
          <div>
            <label
              htmlFor="address-instructions"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Delivery Notes <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              id="address-instructions"
              type="text"
              placeholder="e.g. Leave at front door or ring bell twice"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
            />
          </div>

          {/* Client-side Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
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
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              id="submit-address-button"
              variant="primary"
              size="sm"
              className="rounded-full text-xs font-semibold"
            >
              {isEditing ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddressFormModal({
  isOpen,
  addressToEdit,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AddressFormModalProps) {
  if (!isOpen) return null;

  return (
    <FormDialogContent
      addressToEdit={addressToEdit}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

export default AddressFormModal;
