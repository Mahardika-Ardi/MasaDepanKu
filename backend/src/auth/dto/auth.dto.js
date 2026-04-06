import { z } from "zod";

export const AuthDto = z.object({
  email: z.email().nonempty(),
  password: z.string().min(6).nonempty(),
});
