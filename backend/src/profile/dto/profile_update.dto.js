import { z } from "zod";

const raport = z.object({
  BI: z.number(),
  MTK: z.number(),
  Bing: z.number(),
});

export const ProfileUpdateDto = z.object({
  file: z.string().nonempty(),
  jurusan: z.string().nonempty(),
  raport,
});
