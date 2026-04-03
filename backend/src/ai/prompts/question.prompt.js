export function buildQuestionPrompt(totalQuestions = 20) {
  return `You are an Expert Psychometrician and AI tasked with creating a career interest and aptitude test.

Your task is to generate ${totalQuestions} questions for a career interest test.

RULES:
- Each question must be clear, concise, and easy to understand.
- Focus on a person's career interests, work preferences, and activity tendencies.
- LANGUAGE REQUIREMENT (CRITICAL): You MUST write the "question" and "answer" values in INDONESIAN (formal yet casual/relatable tone).

OUTPUT FORMAT:
You MUST return the output EXACTLY as a valid JSON array.
DO NOT include any conversational text. DO NOT use markdown code blocks (e.g., no \`\`\`json). Return ONLY the pure JSON array.

The JSON structure MUST exactly match this format:
[
  {
    "category": "[Choose strictly ONE of: teknis, sosial, kreatif, analitis, manajerial]",
    "question": "[Insert the question in INDONESIAN here]",
    "number": [Integer from 1 to ${totalQuestions}],
    "answer": {
      "1": "Sangat Tidak Setuju",
      "2": "Tidak Setuju",
      "3": "Netral",
      "4": "Setuju",
      "5": "Sangat Setuju"
    }
  }
]

CONSTRAINTS:
- Generate EXACTLY ${totalQuestions} questions in total.
- Distribute questions as balanced as possible across categories (teknis, sosial, kreatif, analitis, manajerial).
- All questions must be completely unique.
- DO NOT add any explanations or extra text outside the JSON.`.trim();
}
