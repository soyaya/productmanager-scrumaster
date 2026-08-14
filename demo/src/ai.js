import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(question) {
  const response = await openai.responses.create({
    model: "gpt-5",
    input: question
  });

  return response.output_text;
}