import api from "./api";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt: string | null;
  address?: {
    label: string | null;
    street: string;
    building: string | null;
    area: string;
    city: string;
    landmark: string | null;
    instructions: string | null;
  } | null;
}

export interface UpdateProfileInput {
  firstName: string;
  lastName?: string;
}

export const profileService = {
  /**
   * Fetch current authenticated user's profile details
   * GET /api/v1/users/profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/users/profile");
    return response.data;
  },

  /**
   * Update user's first and last name
   * PUT /api/v1/users/profile
   */
  async updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
    const payload: UpdateProfileInput = {
      firstName: data.firstName.trim(),
    };
    if (data.lastName !== undefined) {
      payload.lastName = data.lastName.trim();
    }

    const response = await api.put<UserProfile>("/users/profile", payload);
    return response.data;
  },
};

/**
 * Format profile API error responses into user-friendly messages
 */
export function getProfileErrorMessage(
  error: unknown,
  defaultMsg = "Failed to update profile. Please check your inputs and try again."
): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          error?: string;
          message?: string;
          details?: {
            fieldErrors?: Record<string, string[]>;
          };
        };
      };
    };

    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    if (data) {
      if (data.details?.fieldErrors) {
        const fields = Object.entries(data.details.fieldErrors);
        if (fields.length > 0) {
          const [field, messages] = fields[0];
          const readableField =
            field === "firstName"
              ? "First name"
              : field === "lastName"
              ? "Last name"
              : field;
          return `${readableField}: ${messages.join(", ")}`;
        }
      }

      if (data.message) {
        return data.message;
      }
    }

    if (status === 401) {
      return "Your session has expired. Please sign in again to manage your profile.";
    }

    if (status === 404) {
      return "User profile not found.";
    }

    if (status === 429) {
      return "Too many requests. Please wait a few moments before trying again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMsg;
}

export default profileService;
