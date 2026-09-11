export interface RegisterAddress {
  street: string;
  area: string;
  city: string;
  label?: string;
  building?: string;
  landmark?: string;
  instructions?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  password: string;
  address: RegisterAddress;
}

export interface RegisterResponse {
  userId: string;
  message: string;
}

export type OtpPurpose = "register" | "login" | "profile_update";

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface AuthUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}

export interface VerifyOtpResponse {
  message: string;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: AuthUser;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  otpRequired?: boolean;
  message?: string;
  email?: string;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: AuthUser;
  requireOtp?: boolean;
  purpose?: OtpPurpose;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  token?: string;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[]>;
    attemptsRemaining?: number;
    retryAfterSeconds?: number;
    purpose?: OtpPurpose;
    email?: string;
    role?: string;
    [key: string]: unknown;
  };
}

/**
 * Restaurant & Admin Authentication Types
 * Backend: /api/v1/restaurant/auth/*
 */
export interface RestaurantStaffLoginRequest {
  email: string;
  password: string;
}

export interface RestaurantAdminLoginRequest {
  email: string;
  password: string;
}

export interface RestaurantVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface RestaurantLoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  role: "staff" | "admin";
}

export interface RestaurantAdminLoginResponse {
  otpRequired: true;
  message: string;
}

export interface RestaurantLogoutResponse {
  message: string;
}

