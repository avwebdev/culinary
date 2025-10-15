import { z } from "zod";

export const menuItemInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Price must be positive"),
  categoryId: z.string().uuid("Please select a category"),
  schoolId: z.string().uuid("Please select a school"),
  image: z
    .string()
    .url("Please provide a valid image URL")
    .or(z.literal(""))
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  isAvailable: z.boolean().optional().default(true),
  isCustomizable: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  allergens: z.array(z.string()).optional().default([]),
  nutritionInfo: z
    .record(z.string(), z.coerce.number())
    .optional()
    .default({}),
  preparationTime: z.coerce
    .number()
    .int("Preparation time must be an integer")
    .positive("Preparation time must be positive")
    .optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export type MenuItemInput = z.infer<typeof menuItemInputSchema>;
