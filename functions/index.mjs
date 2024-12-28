import express from "express";
import cors from "cors";
import { https } from "firebase-functions/v2";
import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Create Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Firebase Functions!");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: "Prompt is required" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Load the API key from .env
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in /chat route:", error.message);
    res.status(500).send({ error: error.message || "Internal server error" });
  }
});

// Firebase Function export
export const api = https.onRequest(
    {
      timeoutSeconds: 120, // Allow sufficient time for processing
      memory: "1GiB", // Allocate sufficient memory
    },
    app,
);
