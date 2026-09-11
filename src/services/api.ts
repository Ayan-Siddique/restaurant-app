import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { store } from "../store";
import { updateAccessToken, logout } from "../store/slices/authSlice";
import { showToast } from "../store/slices/toastSlice";
import { formatRetryAfter } from "../utils/formatRetryAfter";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token if available
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore localStorage access issues if in restrictive environment
  }
  return config;
});

// ── Rate limit (HTTP 429) deduplication & notification ──
let last429ToastTime = 0;
const DEDUPLICATION_WINDOW_MS = 4000;

function handleRateLimit429(response?: AxiosResponse) {
  const now = Date.now();
  if (now - last429ToastTime < DEDUPLICATION_WINDOW_MS) {
    return;
  }
  last429ToastTime = now;

  let seconds: number | undefined;
  const rawSeconds = response?.data?.details?.retryAfterSeconds;
  if (typeof rawSeconds === "number" && rawSeconds > 0) {
    seconds = rawSeconds;
  } else if (response?.headers) {
    const headers = response.headers as Record<string, unknown> & {
      get?: (key: string) => string | null;
    };
    const retryHeader =
      typeof headers.get === "function"
        ? headers.get("retry-after")
        : (headers["retry-after"] || headers["Retry-After"]);
    if (retryHeader) {
      const parsed = parseInt(String(retryHeader), 10);
      if (!isNaN(parsed) && parsed > 0) {
        seconds = parsed;
      }
    }
  }

  const message = formatRetryAfter(seconds);

  store.dispatch(
    showToast({
      id: "global-rate-limit-429",
      type: "warning",
      title: "Too Many Requests",
      message,
      duration: 6000,
    })
  );
}

// State to manage single in-flight refresh and concurrent requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

/**
 * Clear persisted authentication data and reset Redux state
 */
function handleAuthFailure() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
  } catch {
    // Ignore storage errors
  }
  store.dispatch(logout());
}

// Response interceptor to handle 429 rate limit and token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Centralized 429 Too Many Requests toast handler
    if (error.response?.status === 429) {
      handleRateLimit429(error.response);
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If no response or not 401, reject immediately
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Never attempt refresh for auth endpoints to prevent loops
    const requestUrl = originalRequest.url || "";
    if (
      requestUrl.includes("/auth/refresh-token") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/restaurant/auth")
    ) {
      if (requestUrl.includes("/auth/refresh-token")) {
        handleAuthFailure();
      }
      return Promise.reject(error);
    }

    // Backend does not support customer refresh tokens for restaurant staff/admins.
    // Restaurant requests and sessions must never enter the customer token-refresh flow.
    const currentRole = store.getState().auth.user?.role;
    const isRestaurantUser = currentRole === "staff" || currentRole === "admin";
    const isRestaurantEndpoint = requestUrl.includes("/restaurant");

    if (isRestaurantUser || isRestaurantEndpoint) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    // If request has already been retried, do not retry again
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      const baseURL = api.defaults.baseURL || "http://localhost:4000/api/v1";

      // Use a bare axios instance without interceptors to call POST /auth/refresh-token
      axios
        .post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          const rawData = res.data as {
            accessToken?: string;
            token?: string;
            refreshToken?: string;
            data?: { accessToken?: string; token?: string; refreshToken?: string };
          };

          const newAccessToken =
            rawData.accessToken ||
            rawData.token ||
            rawData.data?.accessToken ||
            rawData.data?.token;

          const newRefreshToken =
            rawData.refreshToken || rawData.data?.refreshToken;

          if (!newAccessToken) {
            throw new Error("No access token returned from refresh endpoint");
          }

          // Persist new access token and optional new refresh token
          try {
            localStorage.setItem("accessToken", newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
          } catch {
            // Ignore storage errors
          }

          // Update Redux state
          store.dispatch(
            updateAccessToken({
              token: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );

          // Update default authorization header for future requests
          if (api.defaults.headers) {
            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          }

          // Update header for the current failed request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Process queued concurrent requests with the new token
          processQueue(null, newAccessToken);

          // Retry the original failed request
          resolve(api(originalRequest));
        })
        .catch((refreshError) => {
          processQueue(refreshError, null);
          handleAuthFailure();
          reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);

export default api;
