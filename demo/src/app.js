console.log("APP STARTED");

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

console.log("Gemini package loaded");
console.log("API key exists:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  console.log("Calling Gemini...");

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: "Explain RAG to a Product Manager in 3 simple sentences."
    });

    console.log("\nGemini response:\n");
    console.log(response.text);
  } catch (error) {
    console.error("\nGemini API error:");
    console.error(error);
  }
}

main();