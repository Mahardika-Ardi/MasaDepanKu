import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().min(1).optional(),
);

export const ProfileUpdateDto = z.object({
  first_name: optionalText,
  last_name: optionalText,
  motto: optionalText,
  country: optionalText,
  city: optionalText,
  scores: z
    .object({
      bahasa_indonesia: z.union([z.string(), z.number()]).optional(),
      bahasa_inggris: z.union([z.string(), z.number()]).optional(),
      matematika: z.union([z.string(), z.number()]).optional(),
      konsentrasi_keahlian: z.union([z.string(), z.number()]).optional(),
    })
    .optional(),
});
