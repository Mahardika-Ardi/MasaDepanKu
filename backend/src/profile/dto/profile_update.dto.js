import { z } from "zod";

const raport = z.object({
  BI: z.number(),
  MTK: z.number(),
  Bing: z.number(),
});

export const ProfileUpdateDto = z.object({
  file: z.object({
    path: z.string().min(1),
    filename: z.string().min(1),
  }),
  jurusan: z.string().nonempty(),
  raport,
});
