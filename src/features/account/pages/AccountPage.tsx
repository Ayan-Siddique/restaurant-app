import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  User,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Lock,
  Calendar,
  Phone,
  Mail,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import Container from "../../../components/layout/Container";
import SectionHeading from "../../../components/common/SectionHeading";
import Button from "../../../components/common/Button";
import LoginModal from "../../../components/common/LoginModal";
import RegisterModal from "../../../components/common/RegisterModal";
import AddressFormModal from "../components/AddressFormModal";
import DeleteAddressConfirmModal from "../components/DeleteAddressConfirmModal";
import ProfileFormSkeleton from "../../../components/common/skeletons/ProfileFormSkeleton";
import AddressCardSkeleton from "../../../components/common/skeletons/AddressCardSkeleton";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUser } from "../../../store/slices/authSlice";
import {
  profileService,
  type UserProfile,
  getProfileErrorMessage,
} from "../../../services/profileService";
import {
  addressService,
  MAX_ADDRESSES_PER_USER,
  getAddressErrorMessage,
} from "../../../services/addressService";
import type { Address, CreateAddressInput } from "../../../types/address";

export function AccountPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "addresses" ? "addresses" : "profile";

  const { isAuthenticated, user: authUser } = useAppSelector(
    (state) => state.auth
  );

  // Profile State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(Boolean(isAuthenticated));
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Profile Edit Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFormError, setProfileFormError] = useState<string | null>(null);

  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressesLoading, setIsAddressesLoading] = useState(Boolean(isAuthenticated));
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressSuccessMsg, setAddressSuccessMsg] = useState<string | null>(null);

  // Address Modals
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // Unauthenticated Modals
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Load Profile from GET /api/v1/users/profile (for user actions)
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsProfileLoading(true);
    setProfileError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
    } catch (err) {
      setProfileError(
        getProfileErrorMessage(err, "Failed to load profile details.")
      );
    } finally {
      setIsProfileLoading(false);
    }
  }, [isAuthenticated]);

  // Load Addresses from GET /api/v1/users/addresses (for user actions)
  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsAddressesLoading(true);
    setAddressError(null);
    try {
      const list = await addressService.getAddresses();
      setAddresses(list);
    } catch (err) {
      setAddressError(
        getAddressErrorMessage(err) || "Failed to load saved addresses."
      );
    } finally {
      setIsAddressesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    profileService
      .getProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfile(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
      })
      .catch((err) => {
        if (!isMounted) return;
        setProfileError(
          getProfileErrorMessage(err, "Failed to load profile details.")
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setIsProfileLoading(false);
      });

    addressService
      .getAddresses()
      .then((list) => {
        if (!isMounted) return;
        setAddresses(list);
      })
      .catch((err) => {
        if (!isMounted) return;
        setAddressError(
          getAddressErrorMessage(err) || "Failed to load saved addresses."
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setIsAddressesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Handle Profile Update (PUT /api/v1/users/profile)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst) {
      setProfileFormError("First name is required.");
      return;
    }

    setIsSavingProfile(true);
    setProfileFormError(null);
    setProfileSuccessMsg(null);

    try {
      const updated = await profileService.updateProfile({
        firstName: trimmedFirst,
        lastName: trimmedLast || undefined,
      });

      // Update local state and auth store directly from server response
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      setProfileSuccessMsg("Profile updated successfully!");

      if (authUser) {
        dispatch(
          setUser({
            ...authUser,
            firstName: updated.firstName,
            lastName: updated.lastName || undefined,
          })
        );
      }
    } catch (err) {
      setProfileFormError(getProfileErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Address Create / Update
  const handleAddressFormSubmit = async (data: CreateAddressInput) => {
    setIsSubmittingAddress(true);
    setAddressError(null);
    setAddressSuccessMsg(null);

    try {
      if (editingAddress) {
        // Edit address: PUT /users/addresses/:id
        await addressService.updateAddress(editingAddress.id, data);
        setAddressSuccessMsg("Address updated successfully.");
      } else {
        // Create address: POST /users/addresses
        await addressService.createAddress(data);
        setAddressSuccessMsg("Address added successfully.");
      }

      setIsAddressFormOpen(false);
      setEditingAddress(null);
      // Refetch authoritative address list from server
      await loadAddresses();
    } catch (err) {
      setAddressError(getAddressErrorMessage(err));
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // Handle Set Default Address (PUT /users/addresses/:id/default)
  const handleSetDefaultAddress = async (id: string) => {
    setSettingDefaultId(id);
    setAddressError(null);
    setAddressSuccessMsg(null);

    try {
      await addressService.setDefaultAddress(id);
      setAddressSuccessMsg("Default delivery address updated.");
      // Refetch authoritative address list from server
      await loadAddresses();
    } catch (err) {
      setAddressError(getAddressErrorMessage(err));
    } finally {
      setSettingDefaultId(null);
    }
  };

  // Handle Delete Address (DELETE /users/addresses/:id)
  const handleDeleteAddressConfirm = async (id: string) => {
    setIsDeletingAddress(true);
    setAddressError(null);
    setAddressSuccessMsg(null);

    try {
      await addressService.deleteAddress(id);
      setAddressSuccessMsg("Address deleted successfully.");
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
      // Refetch authoritative address list from server
      await loadAddresses();
    } catch (err) {
      setAddressError(getAddressErrorMessage(err));
    } finally {
      setIsDeletingAddress(false);
    }
  };

  const handleTabChange = (tab: "profile" | "addresses") => {
    setSearchParams({ tab });
    setProfileSuccessMsg(null);
    setProfileFormError(null);
    setAddressSuccessMsg(null);
    setAddressError(null);
  };

  // Switch between auth modals
  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  // ── Unauthenticated State ──
  if (!isAuthenticated) {
    return (
      <>
        <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
          <Container>
            <div className="mb-6 sm:mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mb-4 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-6 shadow-xs">
                <LogIn size={48} strokeWidth={1.5} />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Sign in to view your account
              </h3>

              <p className="text-sm sm:text-base text-neutral-500 max-w-md mb-8">
                Please sign in to view and edit your profile information and manage your saved delivery addresses.
              </p>

              <Button
                type="button"
                onClick={() => setShowLogin(true)}
                className="rounded-full !px-8 !py-3 font-semibold shadow-md hover:shadow-lg transition-transform"
              >
                Sign In
              </Button>
            </div>
          </Container>
        </section>

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

  const isAddressLimitReached = addresses.length >= MAX_ADDRESSES_PER_USER;

  return (
    <>
      <section className="w-full min-h-screen bg-[#f9f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <Container>
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Menu</span>
            </Link>

            <SectionHeading colorHeading="Account">My</SectionHeading>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 m-0">
              Manage your personal details and saved delivery address book.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-6">
            <button
              type="button"
              onClick={() => handleTabChange("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#f5a623] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
              id="account-tab-profile"
            >
              <User size={16} />
              <span>Profile Details</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("addresses")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-[#f5a623] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
              id="account-tab-addresses"
            >
              <MapPin size={16} />
              <span>Saved Addresses</span>
              <span
                className={`badge badge-xs font-bold ${
                  activeTab === "addresses"
                    ? "bg-white text-[#f5a623]"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {addresses.length}/{MAX_ADDRESSES_PER_USER}
              </span>
            </button>
          </div>

          {/* ════════════════ TAB 1: PROFILE DETAILS ════════════════ */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Profile Card & Read-only Security Info (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* User Identity Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-4 text-2xl font-bold shadow-xs">
                    {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : "U"}
                  </div>

                  <h3
                    className="text-lg sm:text-xl font-bold text-neutral-900 m-0"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    {[profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Customer"}
                  </h3>

                  <p className="text-xs text-neutral-500 mt-0.5 m-0">
                    {profile?.email || authUser?.email || ""}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                    <span className="badge badge-sm bg-emerald-100 text-emerald-800 border-none font-medium flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      Verified Customer
                    </span>
                  </div>

                  {profile?.createdAt && (
                    <p className="text-[11px] text-neutral-400 mt-4 m-0 flex items-center gap-1">
                      <Calendar size={13} />
                      Member since{" "}
                      {new Date(profile.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Read-Only Account Security Notice */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-5 text-xs text-neutral-600 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 font-semibold text-neutral-800">
                    <Lock size={15} className="text-[#f5a623]" />
                    <span>Account Security & Verification</span>
                  </div>
                  <p className="m-0 leading-relaxed text-neutral-500">
                    Your registered email address and phone number are verified identity credentials. Name changes can be updated directly, while contact changes require security verification.
                  </p>
                </div>
              </div>

              {/* Right Column: Edit Profile Form (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
                <h3
                  className="text-base sm:text-lg font-bold text-neutral-900 pb-3 mb-4 border-b border-neutral-100"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  Edit Profile Information
                </h3>

                {/* Success Banner */}
                {profileSuccessMsg && (
                  <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {/* Error Banner */}
                {(profileFormError || profileError) && (
                  <div className="mb-5 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col items-start gap-2 text-xs sm:text-sm text-rose-800">
                    <p className="m-0">{profileFormError || profileError}</p>
                    {profileError && !profile && (
                      <button
                        type="button"
                        onClick={() => loadProfile()}
                        className="btn btn-xs btn-outline border-rose-300 text-rose-800 hover:bg-rose-100 mt-1 cursor-pointer"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}

                {isProfileLoading && !profile ? (
                  <ProfileFormSkeleton />
                ) : (
                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                    {/* Name Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="profile-first-name"
                          className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                          First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="profile-first-name"
                          type="text"
                          required
                          maxLength={100}
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            setProfileFormError(null);
                          }}
                          disabled={isSavingProfile}
                          placeholder="Your first name"
                          className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="profile-last-name"
                          className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                          Last Name <span className="text-neutral-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="profile-last-name"
                          type="text"
                          maxLength={100}
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            setProfileFormError(null);
                          }}
                          disabled={isSavingProfile}
                          placeholder="Your last name"
                          className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-800 bg-white focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
                        />
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label
                        htmlFor="profile-email"
                        className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1">
                          <Mail size={13} className="text-neutral-500" />
                          Registered Email
                        </span>
                        <span className="text-[11px] text-neutral-400 font-normal">
                          Read-only
                        </span>
                      </label>
                      <input
                        id="profile-email"
                        type="email"
                        readOnly
                        disabled
                        value={profile?.email || ""}
                        className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-500 bg-neutral-100/70 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone (Read-only) */}
                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1">
                          <Phone size={13} className="text-neutral-500" />
                          Registered Phone
                        </span>
                        <span className="text-[11px] text-neutral-400 font-normal">
                          Read-only
                        </span>
                      </label>
                      <input
                        id="profile-phone"
                        type="text"
                        readOnly
                        disabled
                        value={profile?.phone || ""}
                        className="w-full rounded-2xl border border-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-500 bg-neutral-100/70 cursor-not-allowed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-3 border-t border-neutral-100">
                      <Button
                        type="submit"
                        disabled={isSavingProfile}
                        loading={isSavingProfile}
                        id="save-profile-button"
                        variant="primary"
                        size="sm"
                        className="rounded-full font-semibold !px-6"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ════════════════ TAB 2: SAVED ADDRESSES ════════════════ */}
          {activeTab === "addresses" && (
            <div className="flex flex-col gap-6">
              {/* Address Header Bar & Limit Badge */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3
                    className="text-base sm:text-lg font-bold text-neutral-900 m-0"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    Delivery Address Book
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 m-0">
                    You can save up to {MAX_ADDRESSES_PER_USER} addresses ({addresses.length}/{MAX_ADDRESSES_PER_USER} saved).
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressFormOpen(true);
                    }}
                    disabled={isAddressLimitReached}
                    id="add-address-button"
                    variant="primary"
                    size="sm"
                    className="rounded-full font-semibold"
                    title={
                      isAddressLimitReached
                        ? `Maximum limit of ${MAX_ADDRESSES_PER_USER} addresses reached`
                        : "Add a new address"
                    }
                  >
                    <Plus size={16} />
                    <span>Add New Address</span>
                  </Button>
                </div>
              </div>

              {/* Address Limit Explanatory Banner if reached */}
              {isAddressLimitReached && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-center gap-2">
                  <span className="font-semibold">Address limit reached:</span>
                  <span>
                    You have saved the maximum of {MAX_ADDRESSES_PER_USER} addresses. To add a different delivery location, please edit or delete an existing one.
                  </span>
                </div>
              )}

              {/* Feedback Banners */}
              {addressSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{addressSuccessMsg}</span>
                </div>
              )}

              {addressError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs sm:text-sm text-rose-800">
                  {addressError}
                </div>
              )}

              {/* Address List State */}
              {isAddressesLoading && addresses.length === 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  aria-busy="true"
                  aria-label="Loading saved addresses"
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <AddressCardSkeleton key={i} />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                /* Empty Address Book */
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-neutral-200 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-4">
                    <MapPin size={32} />
                  </div>
                  <h4
                    className="text-base sm:text-lg font-bold text-neutral-900 mb-1"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    No saved addresses yet
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-5">
                    Save your home, office, or frequently used delivery locations for seamless 1-click checkout.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressFormOpen(true);
                    }}
                    variant="primary"
                    size="sm"
                    className="rounded-full font-semibold !px-5"
                  >
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                /* Address Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {addresses.map((addr) => {
                    const isDefault = addr.isDefault;
                    const isSettingThisDefault = settingDefaultId === addr.id;

                    return (
                      <article
                        key={addr.id}
                        className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between gap-4 relative ${
                          isDefault
                            ? "border-amber-300 shadow-sm ring-1 ring-amber-300/50"
                            : "border-neutral-200 shadow-xs hover:border-neutral-300"
                        }`}
                      >
                        {/* Card Header: Label & Default Badge */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-100">
                            <span className="font-bold text-xs sm:text-sm text-neutral-900">
                              {addr.label || "Delivery Location"}
                            </span>

                            {isDefault ? (
                              <span className="badge badge-sm bg-amber-100 text-amber-800 border-none font-semibold text-[11px] flex items-center gap-1">
                                <Star size={11} className="fill-amber-600 text-amber-600" />
                                Default
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                disabled={isSettingThisDefault}
                                className="text-[11px] font-medium text-neutral-500 hover:text-[#f5a623] transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {isSettingThisDefault ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  <>
                                    <Star size={12} />
                                    <span>Set as Default</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Address Details */}
                          <div className="text-xs text-neutral-600 leading-relaxed flex flex-col gap-0.5">
                            {addr.building && (
                              <p className="font-semibold text-neutral-900 m-0">
                                {addr.building}
                              </p>
                            )}
                            <p className="m-0 text-neutral-800 font-medium">
                              {addr.street}
                            </p>
                            <p className="m-0">
                              {[addr.area, addr.city].filter(Boolean).join(", ")}
                            </p>
                            {addr.landmark && (
                              <p className="text-neutral-400 mt-1 m-0">
                                Landmark: {addr.landmark}
                              </p>
                            )}
                            {addr.instructions && (
                              <p className="text-neutral-500 italic mt-1 m-0 text-[11px] bg-neutral-50 p-2 rounded-xl">
                                "{addr.instructions}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Actions: Edit & Delete */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              setEditingAddress(addr);
                              setIsAddressFormOpen(true);
                            }}
                            className="text-neutral-600 hover:text-[#f5a623]"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              setAddressToDelete(addr);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Address Form Modal (Add & Edit) */}
      <AddressFormModal
        isOpen={isAddressFormOpen}
        addressToEdit={editingAddress}
        isSubmitting={isSubmittingAddress}
        onClose={() => {
          setIsAddressFormOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={handleAddressFormSubmit}
      />

      {/* Delete Address Confirmation Modal */}
      <DeleteAddressConfirmModal
        isOpen={isDeleteModalOpen}
        address={addressToDelete}
        isSubmitting={isDeletingAddress}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleDeleteAddressConfirm}
      />
    </>
  );
}

export default AccountPage;
