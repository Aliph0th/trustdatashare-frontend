import { z } from 'zod';

export const signupSchema = z
   .object({
      username: z
         .string()
         .min(4, 'Username must be at least 4 characters.')
         .max(20, 'Username must be a maximum 20 characters long.'),
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Password is weak'),
      repeatedPassword: z.string().min(8, 'Password is weak')
   })
   .refine(data => data.password === data.repeatedPassword, {
      message: "Passwords don't match",
      path: ['repeatedPassword']
   });
