"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  categoriesApi,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "@/lib/api/categories";

// Schema for category management
export const categorySchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      return response || [];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await categoriesApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria creata con successo!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Creazione della categoria non riuscita"
      );
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryRequest;
    }) => {
      const response = await categoriesApi.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria aggiornata con successo!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Aggiornamento della categoria non riuscito"
      );
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await categoriesApi.delete(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria eliminata con successo!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Eliminazione della categoria non riuscita"
      );
    },
  });
}
