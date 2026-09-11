import api from "./api";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  AddressesResponse,
  SingleAddressResponse,
  DeleteAddressResponse,
} from "../types/address";
import type { ApiErrorResponse } from "../types/auth";

export const MAX_ADDRESSES_PER_USER = 3;

export const addressService = {
  /**
   * Fetch all saved addresses for the authenticated user
   * GET /api/v1/users/addresses
   */
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<AddressesResponse>("/users/addresses");
    return response.data.addresses;
  },

  /**
   * Save a new delivery address (max 3 allowed)
   * POST /api/v1/users/addresses
   */
  async createAddress(data: CreateAddressInput): Promise<Address> {
    const response = await api.post<SingleAddressResponse>(
      "/users/addresses",
      data
    );
    return response.data.address;
  },

  /**
   * Update an existing delivery address
   * PUT /api/v1/users/addresses/:id
   */
  async updateAddress(
    id: string,
    data: UpdateAddressInput
  ): Promise<Address> {
    const response = await api.put<SingleAddressResponse>(
      `/users/addresses/${id}`,
      data
    );
    return response.data.address;
  },

  /**
   * Delete an existing delivery address
   * DELETE /api/v1/users/addresses/:id
   */
  async deleteAddress(id: string): Promise<string> {
    const response = await api.delete<DeleteAddressResponse>(
      `/users/addresses/${id}`
    );
    return response.data.message;
  },

  /**
   * Mark an address as the user's default address
   * PUT /api/v1/users/addresses/:id/default
   */
  async setDefaultAddress(id: string): Promise<Address> {
    const response = await api.put<SingleAddressResponse>(
      `/users/addresses/${id}/default`
    );
    return response.data.address;
  },
};

/**
 * Format address API error responses into user-friendly messages
 */
export function getAddressErrorMessage(error: unknown): string {
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
      if (data.error === "ADDRESS_LIMIT_REACHED") {
        return (
          data.message ||
          `You can save at most ${MAX_ADDRESSES_PER_USER} addresses. Please delete an address to add a new one.`
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
      return "Your session has expired. Please sign in again to view your addresses.";
    }

    if (status === 404) {
      return "The requested address was not found or has been deleted.";
    }

    if (status === 429) {
      return "Too many requests. Please wait a moment before trying again.";
    }

    if (status === 500) {
      return "Server error while managing addresses. Please try again later.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred while processing your address.";
}

export default addressService;
