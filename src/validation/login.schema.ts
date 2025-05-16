import { z } from 'zod';

export const loginSchema = z.object({
   login: z.string().min(4, 'Login must be at least 4 characters.'),
   password: z.string().min(8, 'Password must be at least 8 characters')
});

export const emailSchema = z.object({
   email: z.string().trim().email('Invalid email')
});
