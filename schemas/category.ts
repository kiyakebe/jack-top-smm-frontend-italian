import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Il nome della categoria è obbligatorio").trim(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Il nome della categoria è obbligatorio").trim(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
