import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
