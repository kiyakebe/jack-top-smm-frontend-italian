import type { ApiResponse, Category } from "@/types/api";
import api from "../axios";

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  create: async (
    data: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await api.post(`/categories`, data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
