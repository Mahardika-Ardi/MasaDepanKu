import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = "gemini-2.5-flash";
let aiClient = null;

function getAiClient() {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API is not set yet!");
  }

  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

export async function generateText(prompt, options = {}) {
  if (!prompt) {
    throw new Error("Prompt is not set yet");
  }

  const { model = DEFAULT_MODEL, temperature, maxOutputTokens } = options;
  const respons = await getAiClient().models.generateContent({
    model,
    contents: prompt,
    config: {
      ...(temperature !== undefined && { temperature }),
      ...(maxOutputTokens !== undefined && { maxOutputTokens }),
    },
  });

  return respons.text;
}
