import { z } from "zod";

export const ProfileUpdateDto = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  motto: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  scores: z
    .object({
      bahasa_indonesia: z.union([z.string(), z.number()]).optional(),
      bahasa_inggris: z.union([z.string(), z.number()]).optional(),
      matematika: z.union([z.string(), z.number()]).optional(),
      konsentrasi_keahlian: z.union([z.string(), z.number()]).optional(),
    })
    .optional(),
});
