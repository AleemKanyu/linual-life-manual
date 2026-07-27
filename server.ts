import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK client singleton
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY environment variable is missing.");
}
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Linual LifeOS Server", time: new Date().toISOString() });
});

// AI Chat Assistant endpoint - searches entire life context
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, lifeContext } = req.body;
    const systemInstruction = `You are "Linual AI", the intelligent personal companion built inside Linual (Your Personal Life Manual).
Your mission is to help the user organize their physical, mental, spiritual, academic, financial, and personal growth.

Here is the user's CURRENT LIVE LINUAL DATA CONTEXT:
${JSON.stringify(lifeContext || {}, null, 2)}

Instructions:
1. Provide highly accurate, personalized, empathetic, concise, and structured answers.
2. Directly reference specific details in the user's Linual context (e.g. current habits, Salah status, goals, budget spending, GPA, courses, workouts, journal entries, documents).
3. If asked questions like "How much did I spend this month?" or "Which habits are declining?" or "Summarize last week", compute the precise answer based on the provided context!
4. Award encouragement and actionable tips for consistency. Keep response well formatted using Markdown.`;

    const model = "gemini-3.6-flash";
    const promptMessage = `User Question: "${message}"\n\nPlease answer based on my life context above.`;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Send history if provided
    if (history && Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.user && item.bot) {
          await chat.sendMessage({ message: item.user });
        }
      }
    }

    const response = await chat.sendMessage({ message: promptMessage });
    res.json({ response: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error?.message || String(error),
    });
  }
});

// AI Daily Summary & Timeblocking Endpoint
app.post("/api/ai/daily-summary", async (req, res) => {
  try {
    const { lifeContext } = req.body;

    const systemInstruction = `You are Linual AI, producing an executive Daily Life Briefing & Schedule Optimizer.
Given the user's profile, habits, Salah tracker, tasks, goals, budget, and health status, generate a concise Markdown briefing containing:
1. ☀️ Morning Focus & Mindset Statement
2. 📊 Daily Balanced Life Score breakdown (Productivity, Spiritual, Health, Study, Finance)
3. ⚡ Top 3 Critical Action Items for Today
4. ⏰ Suggested Timeblocked Schedule (Morning, Afternoon, Evening)
5. 💡 One high-impact life recommendation based on their current data trends.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Please generate my Daily Linual Life Briefing based on my context: ${JSON.stringify(lifeContext || {})}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Daily Summary Error:", error);
    res.status(500).json({ error: "Failed to generate daily summary", details: error?.message });
  }
});

// AI Goal & Habit Recommendation Endpoint
app.post("/api/ai/suggestions", async (req, res) => {
  try {
    const { area, lifeContext } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Suggest 3 SMART goals and 3 daily habits for area: "${area || "General Growth"}". User Context: ${JSON.stringify(lifeContext || {})}`,
      config: {
        systemInstruction: "You are Linual AI Growth Strategist. Return structured JSON with array of 'goals' (title, category, priority, description, milestones) and 'habits' (name, frequency, target, unit).",
        responseMimeType: "application/json",
      },
    });

    res.json({ data: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    console.error("Suggestions Error:", error);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Linual Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
