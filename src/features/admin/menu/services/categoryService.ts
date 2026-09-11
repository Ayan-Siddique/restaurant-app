import api from "../../../../services/api";
import type { Category, CategoriesApiResponse } from "../../types";

export type { CategoriesApiResponse, ApiCategoryItem } from "../../types";

export const getCategories = async (): Promise<CategoriesApiResponse> => {
  const response = await api.get<CategoriesApiResponse>("/menu/categories");
  return response.data;
};

export const transformCategoriesResponse = (
  data: CategoriesApiResponse
): Category[] => {
  const list =
    data.categories || [
      ...(data.veg || []),
      ...(data.non_veg || []),
    ];

  return list.map((item) => ({
    id: item.id,
    name: item.name,
    description:
      item.itemCount !== undefined
        ? `${item.itemCount} ${item.itemCount === 1 ? "item" : "items"}`
        : undefined,
    imageUrl: item.imageUrl || undefined,
    itemCount: item.itemCount ?? 0,
    isActive: true,
  }));
};
