import api from "./api";
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiErrorResponse,
} from "../types/auth";

export const authService = {
  /**
   * Register a new customer
   * POST /auth/register
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Verify OTP for registration or login
   * POST /auth/verify-otp
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", data);
    return response.data;
  },

  /**
   * Login customer
   * POST /auth/login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>("/auth/refresh-token", data);
    return response.data;
  },
};

/**
 * Format backend API errors into human-readable messages
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: ApiErrorResponse;
        status?: number;
      };
      message?: string;
    };

    const data = axiosError.response?.data;

    if (data) {
      if (data.details?.fieldErrors) {
        const fields = Object.entries(data.details.fieldErrors);
        if (fields.length > 0) {
          const [field, messages] = fields[0];
          return `${field}: ${messages.join(", ")}`;
        }
      }

      if (data.details?.attemptsRemaining !== undefined) {
        return `${data.message} (${data.details.attemptsRemaining} attempt${data.details.attemptsRemaining === 1 ? "" : "s"} remaining)`;
      }

      if (data.details?.retryAfterSeconds !== undefined) {
        return `${data.message} (Try again in ${data.details.retryAfterSeconds}s)`;
      }

      if (data.message) {
        return data.message;
      }
    }

    if (axiosError.response?.status === 429) {
      return "Too many requests. Please try again in a few moments.";
    }

    if (axiosError.response?.status === 500) {
      return "Server error occurred. Please verify your details or try again later.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please check your network connection.";
}

export default authService;
