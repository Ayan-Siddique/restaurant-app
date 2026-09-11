import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../types/auth";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

/**
 * Safely parse a JWT payload to extract user info if not explicitly returned
 */
function parseJwtPayload(token: string): AuthUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      id: parsed.id || "",
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

/**
 * Hydrate initial auth state from localStorage
 */
function loadInitialState(): AuthState {
  try {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("authUser");
    const user: AuthUser | null = storedUser
      ? JSON.parse(storedUser)
      : token
      ? parseJwtPayload(token)
      : null;

    return {
      token: token || null,
      refreshToken: refreshToken || null,
      user,
      isAuthenticated: Boolean(token),
    };
  } catch {
    return {
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    };
  }
}

const initialState: AuthState = loadInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        user?: AuthUser;
      }>
    ) => {
      const { token, refreshToken, user } = action.payload;
      const resolvedUser = user || parseJwtPayload(token) || state.user;

      state.token = token;
      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
      }
      state.user = resolvedUser;
      state.isAuthenticated = true;

      try {
        localStorage.setItem("accessToken", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        if (resolvedUser) {
          localStorage.setItem("authUser", JSON.stringify(resolvedUser));
        }
      } catch {
        // Ignore localStorage write failures
      }
    },
    updateAccessToken: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
      }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      try {
        localStorage.setItem("accessToken", action.payload.token);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      } catch {
        // Ignore localStorage write failures
      }
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      try {
        localStorage.setItem("authUser", JSON.stringify(action.payload));
      } catch {
        // Ignore localStorage write failures
      }
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
      } catch {
        // Ignore localStorage removal failures
      }
    },
  },
});

export const { setCredentials, updateAccessToken, setUser, logout } =
  authSlice.actions;

export default authSlice.reducer;
