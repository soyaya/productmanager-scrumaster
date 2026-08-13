import "dotenv/config";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const knowledge = fs.readFileSync(
  "./documents/company_knowledge.md",
  "utf8"
);

async function main() {
  console.log("Company knowledge loaded:");
  console.log(knowledge);

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: `
You are a customer support assistant.

Answer the user's question using the company knowledge below.

COMPANY KNOWLEDGE:
${knowledge}

USER QUESTION:
What is the maximum daily transfer limit?
`
  });

  console.log("\nAI RESPONSE:\n");
  console.log(response.text);
}

main();