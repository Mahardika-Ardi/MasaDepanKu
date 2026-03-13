import { z } from "zod";

const AuthDto = z.object({
  email: z.email().nonempty(),
  password: z.string().min(6).nonempty(),
});

export default AuthDto;
