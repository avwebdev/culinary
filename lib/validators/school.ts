import { z } from "zod";

// Base schema for common validation
const schoolBaseSchema = {
  name: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  slug: z
    .string()
    .min(3, {
      message: "Slug must be at least 3 characters.",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().default(true),
};

export const createSchoolSchema = z.object({
  ...schoolBaseSchema,
});

export const updateSchoolSchema = z.object({
  id: z.string().uuid(),
  ...schoolBaseSchema,
});

export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;