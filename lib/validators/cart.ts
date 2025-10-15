import { z } from "zod";

export const addToCartSchema = z.object({
  menuItemId: z.string().uuid("Invalid menu item"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  specialInstructions: z.string().max(500).optional(),
  customizations: z.record(z.string(), z.unknown()).optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  specialInstructions: z.string().max(500).optional(),
  customizations: z.record(z.string(), z.unknown()).optional(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
