import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

// Initialize the OpenAI client using Firebase config
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key, // Fetch API key from Firebase config
});

// Create an Express app
const app = express();
app.use(cors({ origin: true })); // Allow CORS for all origins
app.use(express.json()); // Parse incoming JSON requests

// Define the /api/chat route
app.post("/api/chat", async (req, res) => {
  console.log("Request received at /api/chat:", req.body);

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt received:", prompt);
      return res.status(400).send("Invalid prompt");
    }

    // Make a request to the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = response.choices[0].message.content;

    console.log("OpenAI response:", reply);

    res.json({ response: reply });
  } catch (error) {
    console.error("Error in /api/chat:", error.message || error);
    res.status(500).send("Error communicating with OpenAI");
  }
});

// Export the Express app as a Firebase HTTPS Function
export const api = functions.https.onRequest(app);

