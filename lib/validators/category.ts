import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional().default(true),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
