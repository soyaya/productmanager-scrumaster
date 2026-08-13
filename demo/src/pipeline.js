import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function validateInput(question) {
  if (!question || question.trim().length === 0) {
    throw new Error("Question cannot be empty");
  }

  return question.trim();
}

function retrieveContext(question) {
  // For now, we simulate retrieval.
  // Later, this will come from PostgreSQL + pgvector.

  return `
DemoPay Knowledge:

- Daily transfer limit: ₦500,000.
- Failed transfers are automatically reversed within 24 hours.
- KYC requires a government-issued identification document and BVN.
- Customers receive a virtual account after completing KYC.
- International transfer processing time depends on the destination country and payment partner.
`;
}

async function generateAnswer(question, context) {
  const prompt = `
You are the DemoPay customer support assistant.

Use ONLY the company information provided below.

COMPANY INFORMATION:
${context}

CUSTOMER QUESTION:
${question}

Instructions:
1. Answer directly.
2. Do not invent company policies.
3. Keep the response concise.
4. If the information is unavailable, say that the customer should contact support.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt
  });

  return response.text;
}

function validateOutput(answer) {
  if (!answer || answer.trim().length === 0) {
    throw new Error("AI returned an empty response");
  }

  return answer.trim();
}

async function runPipeline(question) {
  console.log("\nSTEP 1: INPUT VALIDATION");

  const validatedQuestion = validateInput(question);

  console.log("Question:", validatedQuestion);

  console.log("\nSTEP 2: RETRIEVAL");

  const context = retrieveContext(validatedQuestion);

  console.log("Relevant company information retrieved.");

  console.log("\nSTEP 3: MODEL GENERATION");

  const answer = await generateAnswer(
    validatedQuestion,
    context
  );

  console.log("Gemini response generated.");

  console.log("\nSTEP 4: OUTPUT VALIDATION");

  const validatedAnswer = validateOutput(answer);

  console.log("Response validated.");

  return validatedAnswer;
}

const question = "How much can I transfer every day?";

const answer = await runPipeline(question);

console.log("\nFINAL ANSWER:");
console.log(answer);