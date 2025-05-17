import { z } from 'zod';

export const resetPasswordSchema = z
   .object({
      token: z.string().uuid('Invalid reset token'),
      password: z.string().min(8, 'Password must be at least 8 characters.'),
      repeatedPassword: z.string().min(8, 'Confirm password must be at least 8 characters.')
   })
   .refine(data => data.password === data.repeatedPassword, {
      message: "Passwords don't match",
      path: ['repeatedPassword']
   });
