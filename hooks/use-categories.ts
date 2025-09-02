"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { z } from "zod"
import { categoriesApi, type CreateCategoryRequest, type UpdateCategoryRequest } from "@/lib/api/categories"

// Schema for category management
export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response || []
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await categoriesApi.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category created successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category")
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryRequest }) => {
      const response = await categoriesApi.update(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category updated successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category")
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await categoriesApi.delete(categoryId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category deleted successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category")
    },
  })
} 