import { z } from "zod";

export const UserUpdateDto = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
});
