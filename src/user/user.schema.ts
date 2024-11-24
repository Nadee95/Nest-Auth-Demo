import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  email: z.string().email(),
  name: z.string(),
  userRoleId: z.number().optional().nullable(),
});

export type GetAllUsers = z.infer<typeof userSchema>;