import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Gemini API is not set yet!");
}

const DEFAULT_MODEL = "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey });

export async function generateText(prompt, options = {}) {
  if (!prompt) {
    throw new Error({
      message: "Prompt is not set yet",
      error: error.message,
    });
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.4,
    maxOutputTokens = 500,
  } = options;
  const respons = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      ...(temperature !== undefined && { temperature }),
      ...(maxOutputTokens !== undefined && { maxOutputTokens }),
    },
  });

  return respons.text;
}
