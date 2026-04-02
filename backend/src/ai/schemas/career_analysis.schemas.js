import z from "zod";

export const careerAnalysisSchemas = z.object({
  sumarry: z.string().min(10, "Sumarry too short"),
  competency_analysis: z.object({
    strengths: z
      .array(z.string())
      .min(1, "Add minimum, there has to be at least 1 strength"),
    areas_of_improvment: z
      .array(z.string())
      .min(1, "Add minimum, there has to be at least 1 Areas of Improvment"),
  }),

  recommended_jobs: z
    .array(
      z.object({
        title: z.string(),
        reason: z.string(),
      }),
    )
    .min(1, "Add minimum, there has to be at least 1 Recommended jobs"),

  actionable_advice: z
    .array(z.string())
    .min(1, "Add minimum, there has to be at least 1 Actionable advice"),
});
