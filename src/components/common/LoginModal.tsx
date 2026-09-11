import { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { authService, getAuthErrorMessage } from "../../services/authService";
import type { OtpPurpose, ApiErrorResponse, AuthUser } from "../../types/auth";
import Button from "./Button";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  initialEmail?: string;
};

const LoginModal = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  initialEmail = "",
}: LoginModalProps) => {
  const dispatch = useAppDispatch();

  // Mode: "credentials" (email + password) or "otp" (6-digit OTP verification)
  const [mode, setMode] = useState<"credentials" | "otp">("credentials");
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>("login");

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [targetEmail, setTargetEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  /* Sync initialEmail when opened */
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialEmail, setPrevInitialEmail] = useState(initialEmail);

  if (isOpen !== prevIsOpen || initialEmail !== prevInitialEmail) {
    setPrevIsOpen(isOpen);
    setPrevInitialEmail(initialEmail);
    if (isOpen) {
      if (initialEmail) {
        setEmail(initialEmail);
        setTargetEmail(initialEmail);
      }
      setMode("credentials");
      setOtpPurpose("login");
      setPassword("");
      setOtp("");
      setErrorMessage(null);
      setInfoMessage(null);
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

  // Step 1: Submit Credentials -> Backend sends OTP
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const identifier = email.trim();
    if (!identifier || !password) {
      setErrorMessage("Please enter both email/phone and password.");
      return;
    }

    const isPhoneLogin = !identifier.includes("@");

    setIsLoading(true);
    try {
      const response = await authService.login({
        identifier,
        password,
      });

      // Customer Login is a two-step flow:
      // POST /auth/login sends an OTP to the user's registered email.
      // Transition LoginModal into Login OTP verification state.
      const resolvedEmail =
        response.email ||
        (response as unknown as { user?: { email?: string } }).user?.email ||
        (!isPhoneLogin ? identifier : "");

      if (!resolvedEmail) {
        setErrorMessage(
          "Unable to determine your registered email address. Please log in using your email."
        );
        return;
      }

      setTargetEmail(resolvedEmail);
      setOtpPurpose("login");
      setOtp("");
      setMode("otp");
      setInfoMessage(
        isPhoneLogin
          ? `A 6-digit verification code has been sent to your registered email (${resolvedEmail}).`
          : response.message ||
            `A 6-digit verification code has been sent to ${resolvedEmail}.`
      );
      setErrorMessage(null);
    } catch (err: unknown) {
      // Check if error is ACCOUNT_NOT_VERIFIED (403)
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: ApiErrorResponse; status?: number };
        };
        const errorData = axiosError.response?.data;

        if (
          errorData?.error === "ACCOUNT_NOT_VERIFIED" ||
          axiosError.response?.status === 403
        ) {
          const unverifiedEmail =
            errorData?.details?.email ||
            (!isPhoneLogin ? identifier : "");

          if (!unverifiedEmail) {
            setErrorMessage(
              errorData?.message ||
                "Account is not verified. Please log in using your registered email to receive the verification code."
            );
            return;
          }

          setOtpPurpose("register");
          setTargetEmail(unverifiedEmail);
          setOtp("");
          setMode("otp");
          setInfoMessage(
            isPhoneLogin
              ? `Account is not verified. A registration code has been sent to your registered email (${unverifiedEmail}).`
              : errorData?.message ||
                `Account is not verified. A registration OTP has been sent to ${unverifiedEmail}.`
          );
          setErrorMessage(null);
          return;
        }
      }

      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit OTP -> Verify with purpose "login" (or "register" for unverified account)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp.trim()) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    const verifyEmail =
      targetEmail || (email.trim().includes("@") ? email.trim() : "");

    if (!verifyEmail) {
      setErrorMessage(
        "A valid registered email address is required to verify OTP."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({
        email: verifyEmail,
        otp: otp.trim(),
        purpose: otpPurpose,
      });

      // Only after successful login OTP verification:
      // Mark the user as authenticated and store the access token/session
      const rawData = response as unknown as {
        accessToken?: string;
        token?: string;
        refreshToken?: string;
        data?: {
          accessToken?: string;
          token?: string;
          refreshToken?: string;
          user?: AuthUser;
        };
        user?: AuthUser;
      };

      const token =
        rawData.accessToken ||
        rawData.token ||
        rawData.data?.accessToken ||
        rawData.data?.token;

      const refreshToken =
        rawData.refreshToken || rawData.data?.refreshToken;

      if (token) {
        const user = rawData.user || rawData.data?.user;
        dispatch(setCredentials({ token, refreshToken, user }));
        onClose();
        return;
      }

      // If verifying an unverified registration OTP without immediate token:
      if (otpPurpose === "register") {
        setMode("credentials");
        setOtp("");
        setInfoMessage("Email verified successfully! Please enter your password to sign in.");
      } else {
        setInfoMessage(response.message || "Verified successfully.");
      }
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
        id="login-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Card */}
        <div
          className="relative w-[96vw] sm:w-[92vw] max-w-[420px] px-5 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-7 sm:pb-9 rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #e8f4fc 0%, #ddf0fb 18%, #f0f6fb 45%, #ffffff 100%)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            animation: "modalSlideUp 0.3s ease-out",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={mode === "credentials" ? "login-title" : "login-otp-title"}
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

          {/* STEP 1: CREDENTIALS MODE */}
          {mode === "credentials" && (
            <>
              {/* Icon circle */}
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 rounded-full bg-gray-800/85 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </div>

              {/* Heading */}
              <h2
                className="text-center text-lg sm:text-xl font-bold mb-1.5 text-gray-900"
                id="login-title"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Sign in with email
              </h2>
              <p
                className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 sm:mb-6 max-w-[300px] mx-auto"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Welcome back! Sign in to access your orders and account.
              </p>

              {/* Info banner */}
              {infoMessage && (
                <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-700 flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{infoMessage}</span>
                </div>
              )}

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
              <form onSubmit={handleLoginSubmit} autoComplete="off">
                {/* Email / Identifier input */}
                <div className="relative mb-3 sm:mb-3.5">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input
                    id="login-email"
                    type="text"
                    placeholder="Email or Phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm sm:text-[0.9rem] text-gray-900 bg-white/75 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  />
                </div>

                {/* Password input */}
                <div className="relative mb-3 sm:mb-3.5">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full py-3 sm:py-3.5 pl-10 sm:pl-11 pr-11 text-sm sm:text-[0.9rem] text-gray-900 bg-white/75 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex items-center transition-colors hover:text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Forgot password */}
                <a
                  className="block text-right text-xs sm:text-[0.8rem] text-gray-500 no-underline mb-5 sm:mb-6 cursor-pointer transition-colors hover:text-gray-900"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Forgot password?
                </a>

                {/* Submit */}
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  id="login-submit"
                  className="w-full !py-3 sm:!py-3.5 !rounded-xl sm:!rounded-2xl"
                >
                  Sign In
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5 sm:my-6">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-xs sm:text-[0.78rem] text-gray-400 whitespace-nowrap" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Or sign in with
                </span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social buttons */}
              <div className="flex justify-center gap-3 sm:gap-4">
                {/* Google */}
                <button
                  className="flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl border-[1.5px] border-gray-200 bg-white/70 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
                  aria-label="Sign in with Google"
                  id="login-google"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-[22px] sm:h-[22px]">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  className="flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl border-[1.5px] border-gray-200 bg-white/70 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
                  aria-label="Sign in with Facebook"
                  id="login-facebook"
                >
                  <svg viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5 sm:w-[22px] sm:h-[22px]">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* Apple */}
                <button
                  className="flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl border-[1.5px] border-gray-200 bg-white/70 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
                  aria-label="Sign in with Apple"
                  id="login-apple"
                >
                  <svg viewBox="0 0 24 24" fill="#000000" className="w-5 h-5 sm:w-[22px] sm:h-[22px]">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </button>
              </div>

              {/* Switch to Register link */}
              <p
                className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6 mb-0"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-gray-900 bg-transparent border-none cursor-pointer underline underline-offset-2 transition-colors hover:text-gray-600"
                  onClick={onSwitchToRegister}
                >
                  Sign up
                </button>
              </p>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION MODE */}
          {mode === "otp" && (
            <>
              {/* Icon circle — key/lock icon */}
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 rounded-full bg-blue-600 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>

              {/* Heading */}
              <h2
                className="text-center text-lg sm:text-xl font-bold mb-1.5 text-gray-900"
                id="login-otp-title"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                {otpPurpose === "register" ? "Account Verification" : "Enter Verification Code"}
              </h2>
              <p
                className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 max-w-[300px] mx-auto"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Please enter the 6-digit verification code sent to{" "}
                <span className="font-semibold text-gray-800">
                  {targetEmail || (email.includes("@") ? email : "your registered email")}
                </span>.
              </p>

              {/* Info banner */}
              {infoMessage && (
                <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-700 flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{infoMessage}</span>
                </div>
              )}

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
                  <input
                    id="login-otp-input"
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

                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  id="login-verify-otp-submit"
                  className="w-full !py-3 sm:!py-3.5 !rounded-xl sm:!rounded-2xl"
                >
                  Verify OTP
                </Button>
              </form>

              {/* Back to credentials button */}
              <div className="text-center mt-5 pt-3 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMode("credentials");
                    setOtp("");
                    setErrorMessage(null);
                    setInfoMessage(null);
                  }}
                  id="login-otp-back"
                >
                  ← Back to login
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;
