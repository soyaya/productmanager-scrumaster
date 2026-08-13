import "dotenv/config";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Log start
console.log("starting.......");

// Create AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Read local image file
const imagePath = path.resolve("./sample.png");
const imageBytes = fs.readFileSync(imagePath);
const imageB64 = imageBytes.toString("base64");

(async () => {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: [
        { type: "text", text: "Compare this local image and this remote audio file." },
        {
          type: "image",
          data: imageB64,
          mime_type: "image/png" // Correct MIME type for PNG
        },
        {
          type: "audio",
          uri: "https://storage.googleapis.com/generativeai-downloads/data/sample.mp3",
          mime_type: "audio/mp3"
        }
      ],
    });

    console.log(interaction.output_text);
  } catch (err) {
    console.error("Error:", err);
  }
})();