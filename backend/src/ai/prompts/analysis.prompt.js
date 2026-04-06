export function analysisPrompt(score, question, answer, jurusan) {
  const scoreText = JSON.stringify(score);
  const questionText = JSON.stringify(question);
  const answerText = JSON.stringify(answer);
  const jurusanText =
    typeof jurusan === "string" ? jurusan : JSON.stringify(jurusan);

  return `You are an Expert Career Consultant and Industrial Psychologist. Your task is to analyze a candidate's academic scores, their major (field of study), and their responses to provide strategic career recommendations.

<CANDIDATE_DATA>
  <MAJOR>${jurusanText}</MAJOR>
  <ACADEMIC_SCORES>${scoreText}</ACADEMIC_SCORES>
  <ASSESSMENT_QUESTIONS>${questionText}</ASSESSMENT_QUESTIONS>
  <CANDIDATE_ANSWERS>${answerText}</CANDIDATE_ANSWERS>
</CANDIDATE_DATA>

ANALYSIS GUIDELINES:
1. Consider the candidate's <MAJOR> as the foundational background.
2. Identify technical proficiencies from <ACADEMIC_SCORES>.
3. Evaluate personality traits and soft skills from the alignment between <ASSESSMENT_QUESTIONS> and <CANDIDATE_ANSWERS>.
4. Synthesize the data to find the optimal career path.
5. For each recommended job, provide a valid, established external URL for a learning roadmap (e.g., from https://roadmap.sh/ or another reputable source). DO NOT generate the step-by-step roadmap yourself; simply provide the reference link to the closest matching role.

LANGUAGE REQUIREMENT (CRITICAL):
- Although these instructions are in English, you MUST write all the values in the JSON output in INDONESIAN.
- The input data provided above is in Indonesian, and your analysis result must also be in INDONESIAN (except for external URLs).

OUTPUT REQUIREMENTS:
- Return a STRICT valid JSON object.
- NO introductory/concluding text.
- NO markdown code blocks (\`\`\`json).

JSON STRUCTURE:
{
  "summary": "[Write a 1-paragraph summary in INDONESIAN integrating their major, scores, and personality]",
  "competency_analysis": {
    "strengths": ["[Strength 1 in INDONESIAN]", "[Strength 2 in INDONESIAN]"],
    "areas_of_improvement": ["[Improvement 1 in INDONESIAN]", "[Improvement 2 in INDONESIAN]"]
  },
  "recommended_jobs": [
    {
      "title": "[Job Title in INDONESIAN]",
      "reason": "[Specific reason in INDONESIAN tying back to their major/skills]",
      "roadmap_reference_url": "[Valid URL to external roadmap, e.g., https://roadmap.sh/frontend. If a direct link doesn't exist, provide a highly relevant alternative link]"
    }
  ],
  "actionable_advice": [
    "[Advice 1 in INDONESIAN]",
    "[Advice 2 in INDONESIAN]"
  ]
}`;
}
