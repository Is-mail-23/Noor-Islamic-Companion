import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI API Route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
      }

      const { message, history } = req.body;

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Basic Islam Companion system instructions
      const systemInstruction = `You are Noor, a friendly, respectful, and highly knowledgeable AI companion for Muslims. 
Your purpose is to answer basic Islamic questions, provide motivation from the Quran and Sunnah, and help users with their Deen.
Keep your answers relatively concise, warm, and structured. 
Do not issue fatwas. If a question is too complex or requires a scholar, advise the user to seek knowledge from a qualified local Imam.`;

      const chat = ai.chats.create({
        model: "gemini-3.8-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      // We apply the history (Optional if we want continuous chat)
      // For simplicity we can just rely on the model for basic single-turn Q&A, or manually manage it.
      // If we want chat history, genai allows passing a history array, but the SDK docs recommend
      // chat.sendMessage() for stateful chats, or we can just use generateContent with concatenated history.
      
      // Let's use generateContent for simplicity and stateless backend scaling.
      let contents = [];
      if (history && Array.isArray(history)) {
        contents = history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] }));
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate AI response." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
