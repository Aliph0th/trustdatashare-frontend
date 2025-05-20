import { z } from 'zod';

export const editDataSchema = z.object({
   content: z
      .string()
      .trim()
      .min(1, 'Content cannot be empty.')
      .max(32768, 'Content must be a maximum of 32768 characters long.'),
   title: z
      .union([z.literal(null), z.string().trim().max(100, 'Title must be a maximum of 100 characters long.')])
      .optional(),
   description: z
      .union([z.literal(null), z.string().trim().max(500, 'Description must be a maximum of 500 characters long.')])
      .optional(),
   isOwnerHidden: z.boolean().optional(),
   password: z
      .union([
         z.literal(null),
         z.string().refine(val => val === '' || val.length >= 5, {
            message: 'Password must be at least 5 characters if provided, or empty to signify no change or removal.'
         })
      ])
      .optional(),
   ttl: z.coerce
      .number()
      .int()
      .gte(-1, 'TTL must be -1 (no expiration) or a positive integer.')
      .refine(val => val !== 0, 'TTL cannot be 0.')
      .optional()
});
