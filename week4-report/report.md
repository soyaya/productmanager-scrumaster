# theBuild AI Week 4 — Gemini API Grounding Demo Report

**Author:** Nifemi Adetiba
**Repo:** productmanager-scrumaster (forked from soyaya)
**Assignment:** Clone repo and demonstrate the items on the repo — Week 4

## 1. What Was Built

The `demo/` folder in this repo contains four small Node.js scripts that each demonstrate a different level of grounding an AI response, building from a raw model call up to a full RAG (Retrieval-Augmented Generation) pipeline. All four call Google's Gemini API via the `@google/genai` SDK, authenticated with an API key stored locally in a `.env` file (`GEMINI_API_KEY`).

## 2. Gemini API Integration

Every script authenticates the same way:

```js
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

and calls the model via `ai.models.generateContent({ model, contents })`. The key must be a real, valid key generated from Google AI Studio, an invalid key returns a 400 `API_KEY_INVALID` error (a real failure mode encountered and fixed during testing, see Section 6).

## 3. Walkthrough: Four Levels of Grounding

### Level 1 — `app.js`: Raw model, no grounding
Asks Gemini to explain RAG in 3 sentences with zero external context. Real output:

> "Retrieval-Augmented Generation (RAG) connects an AI model to your company's private data, allowing it to search your internal documents before answering a user's prompt. Think of it like giving the AI an 'open-book test,' ensuring its responses are accurate, up-to-date, and based on your specific business context. This allows you to launch trustworthy, personalized AI features quickly without the massive cost and effort of retraining the core model."

This works because the question is general knowledge the model already has. It would fail for anything specific to a real company's actual, private data.

### Level 2 — `app2.js`: Context stuffing
Loads an entire company knowledge base (`company_knowledge.md`, covering Virtual Accounts, Transfer Limits, Failed Transfers, KYC Requirements, and International Transfers for a fictional "DemoPay" product) and pastes the whole document into the prompt alongside the question "What is the maximum daily transfer limit?"

Real output: **"The maximum daily transfer limit is ₦500,000."**, correctly pulled from the stuffed document.

This works, but doesn't scale: every question pays the token cost of sending the *entire* document, even for a one-line answer. At real document sizes this gets expensive fast, and eventually exceeds the model's context window entirely.

### Level 3 — `app3.js`: Chunking
Splits the same knowledge base into 6 chunks, one per markdown header section, using a `chunkText()` function:

| Chunk | Content |
|---|---|
| 1 | Title only ("# DemoPay Company Knowledge Base") |
| 2 | Virtual Accounts |
| 3 | Transfer Limits |
| 4 | Failed Transfers |
| 5 | KYC Requirements |
| 6 | International Transfers |

This is the prep step for real retrieval: instead of one giant document, the knowledge base becomes a set of independently retrievable pieces. Worth noting: Chunk 1 is just the bare title with no body content, a low-value chunk that would waste a retrieval slot at real scale.

### Level 4 — `sim.js`: Real RAG (embeddings + retrieval)
The full pipeline. For each of the 6 chunks, it calls `createEmbedding()` to turn the text into a vector, then does the same for the user's question, "How much money can I send every day?", deliberately phrased differently from `app2.js`'s version, testing whether semantic search finds the right answer without exact keyword overlap. It scores every chunk against the question using `cosineSimilarity()`, sorts by score, and returns the single best-matching chunk instead of the whole document.

This is the real answer to "how does grounding scale": instead of sending every token of every document on every question (Level 2's approach), only the most relevant chunk gets retrieved and sent, cutting the token cost per query while keeping the answer grounded in real data.

*(This section is written from reading the source directly. Replace with the actual run output, the real similarity scores and best-match result, before submitting.)*

## 4. API Cost Consideration

The exact model is set via `GEMINI_MODEL` in `.env`, confirm which tier this points to before finalizing cost figures, since pricing differs meaningfully between them.

As a rough illustration: a single `app2.js`-style call sends the entire ~150-word knowledge base on every question. At real scale (say, 10,000 questions/month), that's 10,000x the full-document token cost, every time. The `sim.js` RAG approach instead sends only the ~25-word best-matching chunk per question, roughly an 80-90% reduction in input tokens at this document size, and the saving compounds further as the knowledge base grows, since Level 2's cost scales with document size while Level 4's stays roughly constant.

*(Replace this estimate with real numbers from `token-economics.js` if you've run it, it exists in the same folder and is built specifically to compute this.)*

## 5. What Would Change at Scale

- **Level 2 (stuffing)** breaks down entirely once the knowledge base exceeds the model's context window, not just expensive, it stops working.
- **Level 4 (RAG)** is the pattern that scales, but introduces a new failure mode: retrieval can return the *wrong* chunk, a confidently-wrong answer, the same class of failure as the Air Canada case study. A real system needs a "low confidence, don't guess" fallback, not just always returning the top-ranked chunk regardless of score.

## 6. A Real Failure Encountered

While testing, `app.js` initially failed with a `400 API_KEY_INVALID` error. The cloned repo's `.env` file contained the original author's key, not a working one for this machine. Worth flagging as its own lesson: a `.env` file with a live key had been committed to a public GitHub repo, exactly the kind of cost/security exposure this module's case studies warn about. Fixed by generating a personal API key from Google AI Studio and replacing the value locally, never committed back to the repo.