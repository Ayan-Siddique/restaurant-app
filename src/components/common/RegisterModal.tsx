import { useState, useEffect, useCallback } from "react";
import { authService, getAuthErrorMessage } from "../../services/authService";
import type { RegisterRequest } from "../../types/auth";
import Button from "./Button";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: (email?: string) => void;
};

type Step = "register" | "otp";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const [step, setStep] = useState<Step>("register");

  // Registration Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Address Form State
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Kolkata");

  // OTP Form State
  const [otp, setOtp] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* Reset form on open/close */
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setStep("register");
      setOtp("");
      setOtpSuccess(false);
      setErrorMessage(null);
      setIsLoading(false);
    }
  }

  /* Close on Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic frontend validation
    if (!firstName.trim() || !email.trim() || !phone.trim() || !password || !street.trim() || !area.trim() || !city.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const payload: RegisterRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      email: email.trim(),
      phone: phone.trim(),
      password,
      address: {
        street: street.trim(),
        area: area.trim(),
        city: city.trim(),
      },
    };

    setIsLoading(true);
    try {
      await authService.register(payload);
      // Backend sent OTP, transition to OTP step
      setStep("otp");
      setErrorMessage(null);
    } catch (err: unknown) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Submit
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp.trim()) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
        purpose: "register",
      });
      setOtpSuccess(true);
      setErrorMessage(null);
    } catch (err: unknown) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35 backdrop-blur-sm p-3 sm:p-4"
        style={{ animation: "modalFadeIn 0.25s ease-out" }}
        id="register-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Card */}
        <div
          className="relative w-full max-w-[460px] max-h-[92vh] flex flex-col px-5 sm:px-6 md:px-8 pt-7 sm:pt-9 pb-6 sm:pb-8 rounded-2xl sm:rounded-3xl overflow-y-auto"
          style={{
            background: "linear-gradient(180deg, #e8f4fc 0%, #ddf0fb 18%, #f0f6fb 45%, #ffffff 100%)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            animation: "modalSlideUp 0.3s ease-out",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-title"
        >
          {/* Subtle top shine */}
          <div
            className="absolute -top-15 left-1/2 -translate-x-1/2 w-[300px] h-[120px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(186,225,255,0.55) 0%, transparent 70%)",
            }}
          />

          {/* Close button */}
          <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 border border-gray-200 text-gray-500 cursor-pointer transition-colors hover:bg-white/90 hover:text-gray-900 z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* STEP 1: REGISTRATION */}
          {step === "register" && (
            <>
              {/* Icon circle — user-plus icon */}
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-800/85 shadow-lg shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>

              {/* Heading */}
              <h2
                className="text-center text-lg sm:text-xl font-bold mb-1 text-gray-900"
                id="register-title"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Create your account
              </h2>
              <p
                className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 max-w-[320px] mx-auto"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Join us to order delicious meals and track deliveries in real time.
              </p>

              {/* Error Message Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[0.72rem] font-medium text-gray-600 mb-1 ml-1" htmlFor="register-first-name">
                      First Name *
                    </label>
                    <input
                      id="register-first-name"
                      type="text"
                      placeholder="e.g. Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full py-2.5 px-3.5 text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-medium text-gray-600 mb-1 ml-1" htmlFor="register-last-name">
                      Last Name
                    </label>
                    <input
                      id="register-last-name"
                      type="text"
                      placeholder="e.g. Verma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label className="block text-[0.72rem] font-medium text-gray-600 mb-1 ml-1" htmlFor="register-email">
                    Email Address *
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full py-2.5 px-3.5 text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                  />
                </div>

                {/* Phone & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[0.72rem] font-medium text-gray-600 mb-1 ml-1" htmlFor="register-phone">
                      Phone Number *
                    </label>
                    <input
                      id="register-phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full py-2.5 px-3.5 text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-medium text-gray-600 mb-1 ml-1" htmlFor="register-password">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full py-2.5 pl-3.5 pr-9 text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0.5"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery Address section */}
                <div className="pt-1">
                  <span className="block text-[0.72rem] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 ml-1">
                    Delivery Address
                  </span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Street Address * (e.g. 45 MG Road)"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      className="w-full py-2 px-3 text-xs sm:text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Area * (e.g. Salt Lake)"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required
                        className="w-full py-2 px-3 text-xs sm:text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="City * (e.g. Kolkata)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full py-2 px-3 text-xs sm:text-sm text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  id="register-submit"
                  className="w-full !py-3 sm:!py-3.5 mt-4 !rounded-xl sm:!rounded-2xl"
                >
                  Register & Get Verification Code
                </Button>
              </form>

              {/* Switch to Login link */}
              <p
                className="text-center text-xs sm:text-sm text-gray-500 mt-4 mb-0"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-gray-900 bg-transparent border-none cursor-pointer underline underline-offset-2 transition-colors hover:text-gray-600"
                  onClick={() => onSwitchToLogin?.(email)}
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <>
              {/* Icon circle — key/lock icon */}
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-blue-600 shadow-lg shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>

              {/* Heading */}
              <h2
                className="text-center text-lg sm:text-xl font-bold mb-1 text-gray-900"
                id="register-otp-title"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Verify your email
              </h2>
              <p
                className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 max-w-[320px] mx-auto"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                We've sent a 6-digit verification code to <span className="font-semibold text-gray-800">{email}</span>. Please enter it below.
              </p>

              {/* Success Feedback */}
              {otpSuccess ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Email Verified Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-6">
                    Your customer account is ready. Please sign in to continue.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    type="button"
                    id="otp-proceed-to-login"
                    onClick={() => onSwitchToLogin?.(email)}
                    className="w-full !rounded-xl"
                  >
                    Proceed to Sign In
                  </Button>
                </div>
              ) : (
                <>
                  {/* Error Message Banner */}
                  {errorMessage && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* OTP Form */}
                  <form onSubmit={handleOtpSubmit} autoComplete="off">
                    <div className="mb-5">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 text-center" htmlFor="register-otp-input">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        id="register-otp-input"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        className="w-full py-3 px-4 text-center text-xl tracking-[0.4em] font-semibold text-gray-900 bg-white/80 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400"
                        style={{ fontFamily: "'Rubik', monospace" }}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      variant="primary"
                      size="md"
                      type="submit"
                      disabled={isLoading}
                      loading={isLoading}
                      id="register-verify-otp-submit"
                      className="w-full !py-3 sm:!py-3.5 !rounded-xl sm:!rounded-2xl"
                    >
                      Verify OTP
                    </Button>
                  </form>

                  {/* Back to register options */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-5 pt-3 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStep("register");
                        setErrorMessage(null);
                      }}
                    >
                      ← Back to form
                    </Button>
                    <button
                      type="button"
                      className="font-semibold text-gray-800 bg-transparent border-none cursor-pointer hover:underline"
                      onClick={() => onSwitchToLogin?.(email)}
                    >
                      Already verified? Sign in
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterModal;
