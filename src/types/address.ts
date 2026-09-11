/**
 * Customer Address Types
 * Backend endpoints: /api/v1/users/addresses/*
 */

export interface Address {
  id: string;
  label: string | null;
  street: string;
  building: string | null;
  area: string;
  city: string;
  landmark: string | null;
  instructions: string | null;
  isDefault: boolean;
  createdAt?: string | Date | null;
}

export interface CreateAddressInput {
  street: string;
  area: string;
  city: string;
  label?: string;
  building?: string;
  landmark?: string;
  instructions?: string;
}

export interface UpdateAddressInput {
  street?: string;
  area?: string;
  city?: string;
  label?: string | null;
  building?: string | null;
  landmark?: string | null;
  instructions?: string | null;
}

export interface AddressesResponse {
  addresses: Address[];
}

export interface SingleAddressResponse {
  address: Address;
}

export interface DeleteAddressResponse {
  message: string;
}
