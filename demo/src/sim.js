import "dotenv/config";
import fs from "fs";

import { GoogleGenAI } from "@google/genai";
import { chunkText } from "./chunker.js";
import { createEmbedding } from "./embeddings.js";
import { cosineSimilarity } from "./similarity.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const knowledge = fs.readFileSync(
  "./documents/company_knowledge.md",
  "utf8"
);

const chunks = chunkText(knowledge);

async function main() {
  console.log("Creating document embeddings...\n");

  const documents = [];

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk.text);

    documents.push({
      ...chunk,
      embedding
    });
  }

  const question = "How much money can I send every day?";

  console.log("USER QUESTION:");
  console.log(question);

  const questionEmbedding = await createEmbedding(question);

  const results = documents.map((document) => ({
    id: document.id,
    text: document.text,
    score: cosineSimilarity(
      questionEmbedding,
      document.embedding
    )
  }));

  results.sort((a, b) => b.score - a.score);

  console.log("\nSIMILARITY RESULTS:\n");

  results.forEach((result) => {
    console.log(`Chunk ${result.id}`);
    console.log(`Score: ${result.score.toFixed(4)}`);
    console.log(result.text);
    console.log("-------------------------");
  });

  const bestMatch = results[0];

  console.log("\nBEST MATCH:\n");
  console.log(bestMatch.text);
  console.log(`Similarity: ${bestMatch.score.toFixed(4)}`);
}

main();