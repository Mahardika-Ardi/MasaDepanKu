import { z } from "zod";

export const LoginDto = z.object({
  email: z.email().nonempty(),
  password: z.string().min(6).nonempty(),
});

export const RegisterDto = z.object({
  name: z.string().min(1).nonempty(),
  email: z.email().nonempty(),
  password: z.string().min(6).nonempty(),
});
