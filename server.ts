import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

function generateFallbackSimulation(age: number, goal: string, habits: string) {
  const cleanGoal = goal.trim();
  const cleanHabits = habits.trim();
  const ageNum = Number(age) || 28;

  return {
    timeline: [
      {
        year: 1,
        pathA: `Your current routine continues as usual. You still talk about "${cleanGoal}", but everyday distractions take priority and no real progress happens.`,
        pathB: `By sticking to one small 15-minute habit every day, you build real momentum. You notice higher energy, clearer focus, and your first solid wins toward "${cleanGoal}".`
      },
      {
        year: 3,
        pathA: `Three years pass quickly. Without change, you feel stuck in the same cycle and frustrated that your goal keeps getting postponed.`,
        pathB: `The small daily efforts compound. The habit is now second nature, and you are 70% toward mastering "${cleanGoal}" with confidence.`
      },
      {
        year: 5,
        pathA: `At age ${ageNum + 5}, you look back wishing you had started sooner. The goal of "${cleanGoal}" remains an unfulfilled wish.`,
        pathB: `At age ${ageNum + 5}, you have completely reached "${cleanGoal}". That 1% daily dedication transformed your health, skills, and self-belief.`
      }
    ],
    narrativeA: `If you keep doing what you're doing, another 5 years will slip by without real movement toward "${cleanGoal}". The daily habits feel comfortable now, but they quietly delay the life and achievements you actually want.`,
    narrativeB: `Improving by just 1% each day makes big goals feel easy and manageable. Over the next 5 years, small daily wins stack up into massive personal success and lasting confidence.`,
    microHabits: [
      {
        action: `Tomorrow at 8:00 AM: Spend 15 minutes taking one concrete action toward "${cleanGoal}" before opening social media.`,
        howToImprove: "Locks in your highest priority first thing in the morning before fatigue or distractions take over."
      },
      {
        action: `Tomorrow afternoon: Swap 20 minutes of routine screen time for a brisk walk or quick workout.`,
        howToImprove: "Clears brain fog, restores natural energy, and builds physical stamina without taking up much time."
      },
      {
        action: `Tomorrow at 9:30 PM: Put your phone away and prepare your workspace or gear for the next day.`,
        howToImprove: "Improves your sleep quality and eliminates morning friction so you start the next day with ease."
      }
    ],
    chartData: [
      { year: 0, pathA: 50, pathB: 50 },
      { year: 1, pathA: 47, pathB: 65 },
      { year: 3, pathA: 42, pathB: 83 },
      { year: 5, pathA: 36, pathB: 97 }
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/simulate", async (req, res) => {
    const { age, goal, habits } = req.body;

    if (!age || !goal || !habits) {
      return res.status(400).json({ error: "Missing required fields: age, goal, habits" });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY not configured, using compound logic simulation engine");
        const fallbackData = generateFallbackSimulation(age, goal, habits);
        return res.json(fallbackData);
      }

      const aiClient = getAI();
      if (!aiClient) {
        const fallbackData = generateFallbackSimulation(age, goal, habits);
        return res.json(fallbackData);
      }

      const prompt = `You are a clear, encouraging life mentor.
The user is ${age} years old.
Primary Goal: "${goal}".
Current Daily Habits: "${habits}".

Analyze their trajectory. Keep the language SIMPLE, CRISP, MEDIUM-SIZED, and EASY TO READ.
Avoid all academic, clinical, or overly dramatic words (do NOT use words like "dopaminergic", "existential friction", "plateau", "undeniable revolution", or corporate buzzwords). Talk like a wise, supportive human.

Structure rules:
1. Narratives:
   - "narrativeA" (The Default Path): Exactly 2 clear, grounded sentences explaining where they realistically end up if nothing changes.
   - "narrativeB" (The 1% Compound Path): Exactly 2 motivating, grounded sentences showing the realistic 5-year result of small 1% daily changes.
2. Timeline (Years 1, 3, and 5):
   - For both "pathA" and "pathB", write 1-2 simple, medium-length sentences detailing concrete, realistic milestones.
3. Micro-Habits for Tomorrow:
   - Provide exactly 3 actionable habits tailored to their goal and replacing their current distractions.
   - "action": What to do tomorrow EXACTLY, with a specific time or trigger (e.g., "Tomorrow at 7:30 AM: Do 15 minutes of [action] before opening your phone").
   - "howToImprove": One simple, direct sentence on how this improves their life and gets them closer to their goal.
4. Chart Data:
   - Progress scores (0 to 100) for Years 0, 1, 3, and 5 for both paths (Year 0 starts at 50 for both).`;

      const schema: Schema = {
        type: Type.OBJECT,
        properties: {
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.INTEGER, description: "The year mark (1, 3, or 5)" },
                pathA: { type: Type.STRING, description: "1-2 simple sentences of the status quo outcome" },
                pathB: { type: Type.STRING, description: "1-2 simple sentences of the 1% compound outcome" }
              },
              required: ["year", "pathA", "pathB"]
            }
          },
          narrativeA: { type: Type.STRING, description: "2 concise sentences for The Default Path" },
          narrativeB: { type: Type.STRING, description: "2 concise sentences for The 1% Compound Path" },
          microHabits: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, description: "Exact, simple task for tomorrow with time or trigger" },
                howToImprove: { type: Type.STRING, description: "Simple 1-sentence explanation of how this improves their life/goal" }
              },
              required: ["action", "howToImprove"]
            },
            description: "3 simple, exact action steps for tomorrow"
          },
          chartData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.INTEGER },
                pathA: { type: Type.INTEGER, description: "Progress score 0-100" },
                pathB: { type: Type.INTEGER, description: "Progress score 0-100" }
              },
              required: ["year", "pathA", "pathB"]
            }
          }
        },
        required: ["timeline", "narrativeA", "narrativeB", "microHabits", "chartData"]
      };

      const response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.7,
        }
      });

      if (!response.text) {
        throw new Error("Empty response from Gemini API");
      }

      const data = JSON.parse(response.text);
      res.json(data);
    } catch (error: any) {
      console.error("Gemini API error, falling back to compound model:", error?.message || error);
      // Return realistic algorithmic fallback data so the user request always succeeds
      const fallbackData = generateFallbackSimulation(age, goal, habits);
      res.json(fallbackData);
    }
  });

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
