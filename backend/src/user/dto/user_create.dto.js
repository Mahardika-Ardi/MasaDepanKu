import { z } from "zod";

export const UserCreateDto = z.object({
  name: z.string().min(3).nonempty(),
  email: z.email().nonempty(),
  password: z.string().min(6).nonempty(),
});
