import "dotenv/config";
import fs from "fs";

import { chunkText } from "./chunker.js";
import { createEmbedding } from "./embeddings.js";

const knowledge = fs.readFileSync(
  "./documents/company_knowledge.md",
  "utf8"
);

const chunks = chunkText(knowledge);

async function main() {
  for (const chunk of chunks) {
    const vector = await createEmbedding(chunk.text);

    console.log(`\n--- CHUNK ${chunk.id} ---`);
    console.log(chunk.text);

    console.log("\nEmbedding:");
    console.log(vector);

    console.log("\nVector dimensions:");
    console.log(vector.length);
  }
}

main();