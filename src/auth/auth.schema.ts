import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userSchema = z.object({
  id: z.number().optional(),
  email: z.string().email(),
  name: z.string(),
  isActive: z.boolean(),
  userRoleId: z.number(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof userSchema>;
