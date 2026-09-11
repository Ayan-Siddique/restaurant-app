import api from "../../../services/api";
import { store } from "../../../store";
import { logout } from "../../../store/slices/authSlice";
import type {
  RestaurantStaffLoginRequest,
  RestaurantAdminLoginRequest,
  RestaurantVerifyOtpRequest,
  RestaurantLoginSuccessResponse,
  RestaurantAdminLoginResponse,
  RestaurantLogoutResponse,
  ApiErrorResponse,
} from "../../../types/auth";

export const restaurantAuthService = {
  /**
   * Restaurant Staff login (password only, no OTP)
   * POST /api/v1/restaurant/auth/login
   */
  async staffLogin(
    data: RestaurantStaffLoginRequest
  ): Promise<RestaurantLoginSuccessResponse> {
    const response = await api.post<RestaurantLoginSuccessResponse>(
      "/restaurant/auth/login",
      {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }
    );
    return response.data;
  },

  /**
   * Restaurant Admin login (triggers email OTP delivery)
   * POST /api/v1/restaurant/auth/admin-login
   */
  async adminLogin(
    data: RestaurantAdminLoginRequest
  ): Promise<RestaurantAdminLoginResponse> {
    const response = await api.post<RestaurantAdminLoginResponse>(
      "/restaurant/auth/admin-login",
      {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }
    );
    return response.data;
  },

  /**
   * Verify numeric OTP for Admin login
   * POST /api/v1/restaurant/auth/verify-otp
   */
  async adminVerifyOtp(
    data: RestaurantVerifyOtpRequest
  ): Promise<RestaurantLoginSuccessResponse> {
    const response = await api.post<RestaurantLoginSuccessResponse>(
      "/restaurant/auth/verify-otp",
      {
        email: data.email.trim().toLowerCase(),
        otp: data.otp.trim(),
      }
    );
    return response.data;
  },

  /**
   * Blacklist active restaurant staff/admin token and revoke Redis session
   * POST /api/v1/restaurant/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await api.post<RestaurantLogoutResponse>("/restaurant/auth/logout");
    } catch {
      // Ignore network / token expiration errors on logout to guarantee clean local state
    } finally {
      store.dispatch(logout());
    }
  },
};

/**
 * Format restaurant authentication errors into user-facing messages
 */
export function getRestaurantAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: ApiErrorResponse;
        status?: number;
      };
      message?: string;
    };

    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    if (data) {
      if (data.error === "ADMIN_LOGIN_REQUIRED") {
        return "This account is registered as an Admin. Please switch to Admin Login to continue.";
      }

      if (data.error === "NOT_AN_ADMIN") {
        return "This account does not have Admin privileges. Please use Staff Login.";
      }

      if (data.error === "INVALID_CREDENTIALS") {
        return "Invalid email address or password. Please check your credentials.";
      }

      if (data.error === "OTP_EXPIRED") {
        return (
          data.message ||
          "The verification code is invalid or has expired. Please request a new code."
        );
      }

      if (data.details?.fieldErrors) {
        const fields = Object.entries(data.details.fieldErrors);
        if (fields.length > 0) {
          const [field, messages] = fields[0];
          return `${field}: ${messages.join(", ")}`;
        }
      }

      if (data.message) {
        return data.message;
      }
    }

    if (status === 401) {
      return "Invalid email or password. Please try again.";
    }

    if (status === 403) {
      return "Access denied. Your account may be deactivated or lacks the required role.";
    }

    if (status === 429) {
      return "Too many login attempts. Please wait a few moments before trying again.";
    }

    if (status === 500) {
      return "Server error occurred during authentication. Please try again later.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please check your network connection.";
}

export default restaurantAuthService;
