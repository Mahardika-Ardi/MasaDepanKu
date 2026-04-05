import z from "zod";

export const careerAnalysisSchemas = z.object({
  summary: z.string().min(10, "Summary too short"),

  competency_analysis: z.object({
    strengths: z
      .array(z.string())
      .min(1, "Add minimum, there has to be at least 1 strength"),
    areas_of_improvement: z
      .array(z.string())
      .min(1, "Add minimum, there has to be at least 1 area of improvement"),
  }),

  recommended_jobs: z
    .array(
      z.object({
        title: z.string().min(1, "Job title is required"),
        reason: z.string().min(1, "Reason is required"),
        roadmap_reference_url: z.string(),
      }),
    )
    .min(1, "Add minimum, there has to be at least 1 Recommended job"),

  actionable_advice: z
    .array(z.string())
    .min(1, "Add minimum, there has to be at least 1 Actionable advice"),
});
