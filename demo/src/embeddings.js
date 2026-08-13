import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function createEmbedding(text) {
  const response = await ai.models.embedContent({
    model: process.env.GEMINI_EMBEDDING_MODEL,
    contents: text
  });

  return response.embeddings[0].values;
}