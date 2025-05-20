import { z } from 'zod';

export const createDataSchema = z.object({
   content: z
      .string()
      .trim()
      .min(1, 'Content must be at least 1 character.')
      .max(32768, 'Content must be a maximum 32768 characters long.'),
   title: z
      .string()
      .trim()
      .min(1, 'Title must be at least 1 character.')
      .max(100, 'Title must be a maximum 100 characters long.')
      .optional()
      .or(z.literal('')),
   description: z
      .string()
      .trim()
      .min(1, 'Description must be at least 1 character.')
      .max(500, 'Description must be a maximum 500 characters long.')
      .optional()
      .or(z.literal('')),
   isOwnerHidden: z.boolean().optional(),
   password: z.string().min(5, 'Password must be at least 5 characters.').optional().or(z.literal('')),
   ttl: z.coerce
      .number()
      .int()
      .gte(-1)
      .refine(x => x !== 0, 'ttl cannot be 0')
      .optional()
      .or(z.literal(-1))
});
