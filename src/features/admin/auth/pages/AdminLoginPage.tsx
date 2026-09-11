import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Shield,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setCredentials } from "../../../../store/slices/authSlice";
import {
  restaurantAuthService,
  getRestaurantAuthErrorMessage,
} from "../../services/restaurantAuthService";
import Button from "../../../../components/common/Button";

type LoginMode = "staff" | "admin";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Form State
  const [mode, setMode] = useState<LoginMode>("staff");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Admin OTP verification step
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  // Status & Error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Return destination after login
  const fromPath =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ||
    "/admin/dashboard";

  // Redirect if already authenticated as restaurant staff or admin
  useEffect(() => {
    if (isAuthenticated && (user?.role === "staff" || user?.role === "admin")) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, user?.role, navigate, fromPath]);

  const handleModeChange = (newMode: LoginMode) => {
    setMode(newMode);
    setIsOtpStep(false);
    setOtp("");
    setErrorMessage(null);
  };

  /**
   * Submit credentials for Staff Login or Admin Login step 1
   */
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === "staff") {
        // Staff Login (POST /restaurant/auth/login)
        const response = await restaurantAuthService.staffLogin({
          email: trimmedEmail,
          password,
        });

        dispatch(
          setCredentials({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            user: {
              id: "",
              role: response.role,
              email: trimmedEmail,
            },
          })
        );

        navigate(fromPath, { replace: true });
      } else {
        // Admin Login Step 1 (POST /restaurant/auth/admin-login)
        await restaurantAuthService.adminLogin({
          email: trimmedEmail,
          password,
        });

        setIsOtpStep(true);
      }
    } catch (err) {
      const msg = getRestaurantAuthErrorMessage(err);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit OTP for Admin Login step 2
   */
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedOtp = otp.trim();
    if (!trimmedOtp || !/^\d{4,10}$/.test(trimmedOtp)) {
      setErrorMessage("Please enter a valid numeric verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await restaurantAuthService.adminVerifyOtp({
        email: email.trim().toLowerCase(),
        otp: trimmedOtp,
      });

      dispatch(
        setCredentials({
          token: response.accessToken,
          refreshToken: response.refreshToken,
          user: {
            id: "",
            role: response.role,
            email: email.trim().toLowerCase(),
          },
        })
      );

      navigate(fromPath, { replace: true });
    } catch (err) {
      const msg = getRestaurantAuthErrorMessage(err);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-neutral-900 hover:opacity-80 transition-opacity"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#f5a623] flex items-center justify-center text-white shadow-md">
            <UtensilsCrossed size={22} strokeWidth={2.5} />
          </div>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            Restaurant Portal
          </span>
        </Link>
        <p className="text-xs text-neutral-500 mt-1">
          Authorized staff & administrator management dashboard
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-100 flex flex-col gap-5">
        {/* Role Selection Tabs */}
        {!isOtpStep && (
          <div className="flex rounded-2xl bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => handleModeChange("staff")}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === "staff"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <UserCheck size={16} />
              <span>Staff Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("admin")}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === "admin"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Shield size={16} />
              <span>Admin Login</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle size={17} className="shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              {errorMessage.includes("Switch to Admin Login") && (
                <button
                  type="button"
                  onClick={() => handleModeChange("admin")}
                  className="block mt-1 font-bold text-rose-900 underline hover:no-underline cursor-pointer"
                >
                  Switch to Admin Login &rarr;
                </button>
              )}
              {errorMessage.includes("Please use Staff Login") && (
                <button
                  type="button"
                  onClick={() => handleModeChange("staff")}
                  className="block mt-1 font-bold text-rose-900 underline hover:no-underline cursor-pointer"
                >
                  Switch to Staff Login &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: Credentials Form */}
        {!isOtpStep ? (
          <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="restaurant-email"
                  className="text-xs font-semibold text-neutral-700"
                >
                  Email Address
                </label>
                <span className="text-[10px] text-neutral-400">
                  {mode === "admin" ? "Admin Account" : "Staff Account"}
                </span>
              </div>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
                <input
                  id="restaurant-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    mode === "admin"
                      ? "admin@restaurant.com"
                      : "staff@restaurant.com"
                  }
                  required
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-neutral-300 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 transition-all disabled:bg-neutral-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="restaurant-password"
                className="text-xs font-semibold text-neutral-700 block mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
                <input
                  id="restaurant-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-neutral-300 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 transition-all disabled:bg-neutral-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "admin" && (
              <p className="text-[11px] text-neutral-500 m-0 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
                🔒 Admin accounts require two-factor verification. A security
                code will be sent to your registered email upon submitting.
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              size="md"
              className="w-full !rounded-2xl py-3 text-sm font-bold shadow-md hover:shadow-lg mt-2"
            >
              <span>
                {mode === "staff"
                  ? "Sign In to Dashboard"
                  : "Send Admin Verification Code"}
              </span>
              <ArrowRight size={16} />
            </Button>
          </form>
        ) : (
          /* STEP 2: Admin OTP Verification Form */
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setErrorMessage(null);
                }}
                className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Back to login credentials"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 m-0">
                  Two-Factor Authentication
                </h4>
                <p className="text-xs text-neutral-500 m-0 mt-0.5">
                  Code sent to <span className="font-semibold text-neutral-800">{email}</span>
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-otp-input"
                className="text-xs font-semibold text-neutral-700 block mb-1.5"
              >
                Enter Verification Code (OTP)
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
                <input
                  id="admin-otp-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 123456"
                  required
                  autoFocus
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-neutral-300 py-2.5 pl-10 pr-3 text-sm font-mono tracking-widest text-neutral-900 placeholder:text-neutral-400 focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 transition-all disabled:bg-neutral-100"
                />
              </div>
              <p className="text-[11px] text-neutral-400 m-0 mt-1">
                Please enter the numeric code received in your email inbox.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                disabled={isLoading || !otp.trim()}
                loading={isLoading}
                variant="primary"
                size="md"
                className="w-full !rounded-2xl py-3 text-sm font-bold shadow-md hover:shadow-lg"
              >
                <span>Verify & Enter Dashboard</span>
                <ArrowRight size={16} />
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setOtp("");
                  setErrorMessage(null);
                }}
                disabled={isLoading}
                variant="ghost"
                size="sm"
                className="text-neutral-500 hover:text-neutral-800 rounded-full font-medium"
              >
                Re-enter Email / Password
              </Button>
            </div>
          </form>
        )}

        {/* Customer Return Link */}
        <div className="pt-3 border-t border-neutral-100 text-center">
          <Link
            to="/"
            className="text-xs text-neutral-500 hover:text-[#f5a623] transition-colors"
          >
            &larr; Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
