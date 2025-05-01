import { z } from 'zod';

export const patchUserSchema = z
   .object({
      username: z
         .string()
         .min(4, 'Username must be at least 4 characters.')
         .max(20, 'Username must be a maximum 20 characters long.')
         .optional()
         .or(z.literal('')),
      password: z.string().min(8, 'Password is weak').optional().or(z.literal('')),
      repeatedPassword: z.string().min(8, 'Password is weak').optional().or(z.literal(''))
   })
   .refine(data => data.password === data.repeatedPassword, {
      message: "Passwords don't match",
      path: ['repeatedPassword']
   });
