import "dotenv/config";
import fs from "fs";
import { chunkText } from "./chunker.js";

const knowledge = fs.readFileSync(
  "./documents/company_knowledge.md",
  "utf8"
);

const chunks = chunkText(knowledge);

console.log("\nDOCUMENT CHUNKS:\n");

chunks.forEach((chunk) => {
  console.log(`\n--- CHUNK ${chunk.id} ---`);
  console.log(chunk.text);
});