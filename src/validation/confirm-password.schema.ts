import { z } from 'zod';

export const confirmPasswordSchema = z.object({
   password: z.string().min(5, 'Password must be at least 5 characters.')
});
