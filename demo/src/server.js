import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateAnswer(question) {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: `
You are the DemoPay customer support assistant.

Answer this customer question clearly and briefly.

Customer question:
${question}
`
  });

  return response.text;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    const answer = await generateAnswer(question);

    res.json({
      question,
      answer
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI service failed"
    });
  }
});
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>DemoPay AI Support</title>
    </head>

    <body>
      <h1>DemoPay AI Support</h1>

      <input
        id="question"
        type="text"
        placeholder="Ask a question..."
        style="width: 400px; padding: 10px;"
      />

      <button onclick="askAI()">
        Ask AI
      </button>

      <h3>AI Response</h3>

      <div id="response">
        Waiting for question...
      </div>

      <script>
        async function askAI() {
          const question =
            document.getElementById("question").value;

          const responseBox =
            document.getElementById("response");

          responseBox.innerText = "Thinking...";

          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                question
              })
            });

            const data = await response.json();

            if (data.error) {
              responseBox.innerText = data.error;
              return;
            }

            responseBox.innerText = data.answer;

          } catch (error) {
            responseBox.innerText =
              "Unable to connect to the AI server.";
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("AI server running on http://localhost:3000");
});