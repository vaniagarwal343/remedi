import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

// Initialize the OpenAI client using Firebase config
const openai = new OpenAI({
  apiKey: functions.config().openai.key, // Fetch API key from Firebase config
});

// Create an Express app
const app = express();
app.use(cors({ origin: true })); // Allow CORS for all origins
app.use(express.json()); // Parse incoming JSON requests

// Health check route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Define the /chat route
app.post("/chat", async (req, res) => {
  console.log("Request received at /chat:", req.body);

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt received:", prompt);
      return res.status(400).send({ error: "Invalid prompt" });
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
    console.error("Error in /chat:", error.stack || error);
    res.status(500).send({
      error: error.message || "Error communicating with OpenAI",
    });
  }
});

// Export the Express app as a Firebase HTTPS Function
export const api = functions.https.onRequest(app);
