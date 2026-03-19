import { z } from "zod";

const UpdateUsersDto = z.object({
  name: z.string().min(3).nonempty(),
  email: z.email().nonempty(),
  password: z.string().min(6).nonempty(),
});

export default UpdateUsersDto;